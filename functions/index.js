const functions = require('firebase-functions');
//var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fetch = require("node-fetch");
const req = require('request');
//const algorithms = require('./algorithms.js')

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//this function is for testing
exports.test = functions.https.onRequest((request, response) => {
  response.send("Heyo!");
});

//simple function to get menus from dining court
exports.getMenus = functions.https.onRequest((request, response) => {
  function requestMenu(callback, resp) {
    req('https://api.hfs.purdue.edu/menus/v2/locations/hillenbrand/2019-02-06', function (error, res, body) {
      console.log('error:', error);
      console.log('statusCode:', res && res.statusCode);
      console.log('body:', body);
      callback(body, resp);
    });
  }
  function processResult(body, resp) {
    resp.send(body);
  }
  requestMenu(processResult, response);
});

//weewoo get the user data and put in the database
exports.updateUserDatabase = functions.https.onRequest((request, response) => {
  function listAllUsers(nextPageToken, resp) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        //console.log("user", userRecord.toJSON());
        userIntoDatabase(userRecord);
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
    resp.send("done");
  }

  //insert user into database
  function userIntoDatabase(userRecord) {
    if (!checkUserExists(userRecord.uid)) {
      var updatedUser = {
        uid: userRecord.uid,
        preferences: "hi",
        dietaryRestrictions: "",
        friends: "",
        blockedUsers: ""
      }
      db.collection("User").doc(userRecord.uid).set(updatedUser);
    }
  }

  //check if the user exists already
  function checkUserExists(uid) {
    var userRef = db.collection("User").doc(uid);
    var getDoc = userRef.get().then(doc => {
      if(!doc.exists()) {
        console.log("User doesn't exist");
        return false
      }
      else {
        console.log("User exists");
        return true;
      }
    }).catch(err => {
      console.log("Error getting document: " + err);
    });
  }

  // Start listing users from the beginning, 1000 at a time.
  listAllUsers(undefined, response);
});

//add user to database
exports.addUserToDatabase = functions.https.onRequest((request, response) => {
  console.log(request);
  console.log(request.body.uid);
  var uid = request.query.uid;
  console.log(uid);
  if (uid == null) {
    response.send("Must pass uid in request");
    return;
  }

  var updatedUser = {
    uid: uid,
    preferences: "",
    dietaryRestrictions: "",
    friends: "",
    blockedUsers: ""
  }
  db.collection("User").doc(uid).set(updatedUser).then(function() {
    console.log("User successfully added!");
    response.send("success");
  }).catch(function(error) {
    console.error("Error adding user: ", error);
    response.send("error");
  });
});

exports.addFriend = functions.https.onRequest((request, response) => {
  var uid = request.query.uid;
  console.log(uid);
  var friendID = request.query.friendID;
  console.log(friendID);
  var friendName = request.query.friendName;
  console.log(friendName);

  if(uid == null){
    response.send("Must pass uid in request");
    return;
  }
  if(friendID == null){
    response.send("Must pass friendID in request");
    return;
  }
  if(friendName == null){
    response.send("Must pass friendName in request");
    return;
  }

  var friendData = {
    friendName: friendName
  }

  //check if the friend's ID exists
  db.collection("User").doc(friendID).get().then(doc => {
    if(!doc.exists){
      console.log("Friend id is not valid");
      response.send("Bad FriendID");
    }
    else{
      db.collection("User").doc(uid).collection("Friends").doc(friendID).set(friendData).then(function(){
        console.log("Friend successfully added!");
        response.send("success");
      }).catch(function(error){
        console.error("Error getting")
        response.send("error");
      });
    }
  });
});

exports.getFriends = functions.https.onRequest((request, response) => {
  var uid = request.query.uid;
  console.log(uid);
  if(uid == null){
    response.send("Must pass uid in request");
    return;
  }

  var listOfFriends = [];

  db.collection("User").doc(uid).collection("Friends").get().then(list => {
    list.forEach(doc => {
      var friendID = doc.id;
      var name = doc.data().friendName;
      var userObj = {name : name, id : friendID};
      listOfFriends.push(userObj);
    });
    response.send(listOfFriends);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

exports.removeFriend = functions.https.onRequest((request, response) => {
  var uid = request.query.uid;
  console.log(uid);
  var friendID = request.query.friendID;
  console.log(friendID);

  if(uid == null){
    response.send("Must pass uid in request");
    return;
  }
  if(friendID == null){
    response.send("Must pass friendID in request");
    return;
  }

  db.collection("User").doc(uid).collection("Friends").doc(friendID).delete().then(function(){
    console.log("Friend successfully removed!");
    response.send("success");
  }).catch(function(error){
    console.error("Error getting")
    response.send("error");
  });
});

exports.removeFromAllFriends = functions.https.onRequest((request, response) => {
  var uid = request.query.uid;
  console.log(uid);

  if(uid == null){
    response.send("Must pass uid in request");
    return;
  }

  db.collection("User").doc(uid).collection("Friends").get().then(list =>{
    list.forEach(doc => {
      var friendID = doc.id;
      db.collection("User").doc(friendID).collection("Friends").doc(uid).delete();
    });
    response.send("Success");
  }).catch(function(error){
    console.error(error.message);
    response.send(error);
  });
});
