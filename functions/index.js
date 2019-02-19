const functions = require('firebase-functions');
const fetch = require("node-fetch");
const req = require('request');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

//this function is for testing
//PARAMETERS: none
exports.test = functions.https.onRequest((request, response) => {
  response.send("Heyo!");
});

//simple function to get menus from dining court
//PARAMETERS: none
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

//get the user data and put in the database (DOESNT WORK)
//PARAMETERS: none
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
        preferences: "",
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
//PARAMETERS: uid
exports.addUserToDatabase = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);
  if (uid == null) {
    response.send("Must pass uid in body of request");
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

//add friend to a user
//PARAMETERS: uid, friendID
exports.addFriend = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);
  var friendID = request.body.friendID;
  console.log(friendID);
  var friendName = request.body.friendName;
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

//get friends of a user
//PARAMETERS: uid
exports.getFriends = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
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

//remove a friend from a user
//PARAMETERS: uid, friendID
exports.removeFriend = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);
  var friendID = request.body.friendID;
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

//remove a user from all Friends
//PARAMETERS: uid
exports.removeFromAllFriends = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
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

//remove user from database
//PARAMETERS: uid
exports.removeUserFromDatabase = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);
  if (uid == null) {
    response.send("Must pass uid in body of request");
    return;
  }

  db.collection("User").doc(uid).delete().then(function() {
    console.log("User successfully deleted!");
    response.send("success");
  }).catch(function(error) {
    console.error("Error deleting user: ", error);
    response.send("error");
  });
});

//get user profile information
//PARAMETERS: uid
exports.getUserProfile = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);
  getProfile(uid, response);
});

//function to get user profile information
function getProfile(uid, response) {
  if (uid == null) {
    response.send("Must pass uid in body of request");
  }

  var userRef = db.collection("User").doc(uid);
  var getDoc = userRef.get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
      response.send("does not exist");
    } else {
      console.log('Document data:', doc.data());
      response.send(doc.data());
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
    response.send("error");
  });
}

//update user profile information
//PARAMETERS: uid, updates (a JSON of updates to profile)
exports.updateUserProfile = functions.https.onRequest((request, response) => {
  var uid = request.body.uid
  var updates = JSON.parse(request.body.updates);
  console.log(uid);
  console.log(updates);

  var userRef = db.collection("User").doc(uid);
  userRef.update(updates).then(function() {
    var updatedUser = db.collection("User").doc(uid)
    getProfile(uid, response);
  });
});

//block a user
//PARAMETERS: uid, blockedUid
exports.blockUser = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  var blockedUid = request.body.blockedUid;
  console.log(uid);
  console.log(blockedUid);

  var userRef = db.collection("User").doc(uid);
  userRef.update({
    blockedUsers: firebase.firestore.FieldValue.arrayUnion(blockedUid)
  })
  .then(function() {
    console.log("Document successfully updated!");
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
  });
});
