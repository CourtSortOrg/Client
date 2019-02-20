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

// this function returns a JSON of all dishes given a location and date
// PARAMETERS: date (as a string)
exports.fetchDishes = functions.https.onRequest(async (request, response)=> {
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    date = "2019-02-18";
	}

	console.log("Querying data");
	var collectionRef = await db.collection("DateDishes").doc(date);
	var getDishes = await collectionRef.get().then(
		doc => {
			if(!doc.exists){
				response.send({error: "no matches"});
			}else{
				response.send(doc.data());
			}
		}
	).catch(err => {
    console.log('Error getting documents', err);
  });
});

// this function populates the database with new dishes
// PARAMETERS: date (as a string)
exports.populateDishes = functions.https.onRequest(async (request, response)=>{
  var locations = ["hillenbrand", "ford", "wiley", "windsor", "earhart"]
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    date = "2019-02-18";
  }


  const url = "https://api.hfs.purdue.edu/menus/v2/locations/"; // + location + "/" + date;
  const getData = async (url, location) => {
    try {
      const response = await fetch(url + "" + location + "/" + date);
      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  async function updateDatabase(data) {
    var allCourts = {Courts: []};
    for(var m = 0; m< data.length; m++){
      var menuJSON = data[m];
      console.log(JSON.stringify(menuJSON));

      var meals = [];
      // sets basic info for hall for now such as menu items for particular meal
      // ideally we would pass in the meal (lunch or dinner, etc), and this would then fill in the database
      for(var k = 0; k<menuJSON['Meals'].length; k++){
        var mealInfo = menuJSON['Meals'][k];
        var stations = [];
        // add every item for every station for particular meal
        // also adds every meal to meal Collection if it exists
        for(var i=0; i < mealInfo['Stations'].length; i++){
          var currStation = mealInfo['Stations'][i];
          var items = [];
          for(var j=0; j<currStation['Items'].length; j++){
            var item = {
              ID: currStation['Items'][j]['ID'],
              Name: currStation['Items'][j]['Name']
            };
            items.push(item);
            /*
            var itemRef = db.collection('Dish').doc(item['name']);
            var getItem = await itemRef.get().then(async doc => {
              if (!doc.exists) {
                itemRef.set(item);
                console.log("SET new item: "+item['name']);
              } else {
                console.log("Modify: "+item['name']);
                var arrayUnion = await itemRef.update({ dates: admin.firestore.FieldValue.arrayUnion(date)});
                console.log("modified");
              }
            }).catch(err => {
              console.log('Error getting document', err);
            });
            */
          } // for all items
          stations.push({Items: items, Name: currStation['Name']});
        } // for all stations
        meals.push({Stations: stations, Name: mealInfo['Name'], Order: mealInfo['Order']});
      } // for all meals
      allCourts['Courts'].push({Name: menuJSON['Location'], Meals: meals});
    }
    console.log(date);
    db.collection("DateDishes").doc(date).set(allCourts);
  }

  var data = []
  for(var i = 0; i< locations.length; i++){
    data.push(await getData(url, locations[i]));
  }
  var updated = await updateDatabase(data);
  console.log("done");
  response.send("Finished Population for "+date);
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
  var name = request.body.name;
  console.log(uid);
  console.log(name);
  if (uid == null) {
    response.send("Must pass uid in body of request");
    return;
  }
  if (name == null) {
    response.send("Must pass name in body of request");
    return;
  }

  var updatedUser = {
    uid: uid,
    name: name,
    preferences: "",
    dietaryRestrictions: "",
    friends: [],
    blockedUsers: [],
    outgoingFriendReq: [],
    incomingFriendReq: []
  }
  db.collection("User").doc(name).set(updatedUser).then(function() {
    console.log("User successfully added!");
    response.send("success");
  }).catch(function(error) {
    console.error("Error adding user: ", error);
    response.send("error");
  });
});

/*//PARAMETERS: uid, friendID
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
});*/

//get friends of a user
//PARAMETERS: name
exports.getFriends = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);
  if(name == null){
    response.send("Must pass name in request");
    return;
  }

  db.collection("User").doc(name).get().then(doc => {
    response.send(doc.data().friends);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

//remove a friend from a user
//PARAMETERS: uid, friendID
exports.removeFriend = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);
  var friendName = request.body.friendName;
  console.log(friendName);

  if(name == null){
    response.send("Must pass name in request");
    return;
  }
  if(friendName == null){
    response.send("Must pass friendName in request");
    return;
  }

  db.collection("User").doc(name).update({
    friends: admin.firestore.FieldValue.arrayRemove(friendName)
  }).catch(function(error){
    console.error("Error removing friend from user")
    response.send("error");
  });

  db.collection("User").doc(friendName).update({
    friends: admin.firestore.FieldValue.arrayRemove(name)
  }).then(function(){
    response.send("success");
  }).catch(function(error){
    console.error("Error removing user from friend")
    response.send("error");
  });
});

//remove a user from all Friends
//PARAMETERS: uid
exports.removeFromAllFriends = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);

  if(name == null){
    response.send("Must pass name in request");
    return;
  }

  db.collection("User").doc(name).get().then(doc => {
    var friends = doc.data().friends;
    for(var i = 0; i < friends.length; i++){
      db.collection("User").doc(friends[i]).update({
        friends: admin.firestore.FieldValue.arrayRemove(name)
      })
      if(i == friends.length - 1){
        response.send("success");
      }
    }
  }).catch(function(error){
    console.error(error.message);
    response.send(error);
  });
});

//remove user from database
//PARAMETERS: uid
exports.removeUserFromDatabase = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);
  if (name == null) {
    response.send("Must pass name in body of request");
    return;
  }

  db.collection("User").doc(name).delete().then(function() {
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
  var name = request.body.name;
  console.log(name);
  getProfile(name, response);
});

//function to get user profile information
function getProfile(name, response) {
  if (name == null) {
    response.send("Must pass name in body of request");
  }

  var userRef = db.collection("User").doc(name);
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
  var name = request.body.name;
  var updates = JSON.parse(request.body.updates);
  console.log(name);
  console.log(updates);

  var userRef = db.collection("User").doc(name);
  userRef.update(updates).then(function() {
    var updatedUser = db.collection("User").doc(name)
    getProfile(name, response);
  });
});

//block a user
//PARAMETERS: uid, blockedUid
exports.blockUser = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  var blockedName = request.body.blockedName;
  console.log(name);
  console.log(blockedName);

  var userRef = db.collection("User").doc(name);
  userRef.update({
    blockedUsers: admin.firestore.FieldValue.arrayUnion(blockedName)
  })
  .then(function() {
    console.log("Document successfully updated!");
    response.send("success");
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
    response.send("error");
  });
});

exports.unblockUser = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  var blockedName = request.body.blockedName;
  console.log(name);
  console.log(blockedName);

  var userRef = db.collection("User").doc(name);
  userRef.update({
    blockedUsers: admin.firestore.FieldValue.arrayRemove(blockedName)
  })
  .then(function() {
    console.log("Document successfully updated!");
    response.send("success");
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
    response.send("error");
  });
});

exports.getBlockedUsers = functions.https.onRequest((request, response) => {
  var name = request.body.name;

  if(name == null){
    response.send("Must pass name in body of request");
  }

  db.collection("User").doc(name).get().then(doc => {
    response.send(doc.data().blockedUsers);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

//check if a user exists
//PARAMETERS: uid
exports.userExists = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);

  db.collection("User").doc(name).get().then(doc => {
    if(!doc.exists){
      response.send("Does Not Exist");
    }
    else{
      response.send("User Exists");
    }
  });
});

//sends a friend request
//PARAMETERS: uid, friendID
exports.sendFriendRequest = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);
  var friendName = request.body.friendName;
  console.log(friendName);

  if (name == null) {
    response.send("Must pass name in body of request");
  }
  if (friendName == null) {
    response.send("Must pass friendName in body of request");
  }

  var friendDoc = db.collection("User").doc(friendName);
  var userDoc = db.collection("User").doc(name);
  //check if the friend's id exists
  friendDoc.get().then(doc => {
    if(!doc.exists){
      console.log("Friend name is not valid");
      response.send("Bad FriendName");
    }
    else{
      //check if they are already friends
      userDoc.get().then(doc => {
        if(doc.data().friends.indexOf(friendName) > -1){
          response.send("Already friends");
        }
        else{
          //add an outgoingFriendReq to the user
          userDoc.update({
            outgoingFriendReq: admin.firestore.FieldValue.arrayUnion(friendName)
          }).catch(function(error){
            response.send("error");
          });

          friendDoc.update({
            incomingFriendReq: admin.firestore.FieldValue.arrayUnion(name)
          }).then(function() {
            response.send("success");
          }).catch(function(error) {
            response.send("error");
          });
        }
      });
    }
  });
});

//accepts a friend request
//PARAMETERS: uid, friendID
exports.acceptFriendRequest = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);
  var friendName = request.body.friendName;
  console.log(friendName);

  if (name == null) {
    response.send("Must pass name in body of request");
  }
  if (friendName == null) {
    response.send("Must pass friendName in body of request");
  }

  db.collection("User").doc(name).update({
    incomingFriendReq: admin.firestore.FieldValue.arrayRemove(friendName),
    friends: admin.firestore.FieldValue.arrayUnion(friendName)
  });

  db.collection("User").doc(friendName).update({
    outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(name),
    friends: admin.firestore.FieldValue.arrayUnion(name)
  }).then(function(){
    response.send("success");
  });
});

//Denies a friend request (Removes the friend request from both users)
//PARAMETERS: uid, friendID
exports.denyFriendRequest = functions.https.onRequest((request, response) => {
  var name = request.body.name;
  console.log(name);
  var friendName = request.body.friendName;
  console.log(friendName);

  if (name == null) {
    response.send("Must pass name in body of request");
  }
  if (friendName == null) {
    response.send("Must pass friendName in body of request");
  }

  db.collection("User").doc(name).update({
    incomingFriendReq: admin.firestore.FieldValue.arrayRemove(friendName)
  });

  db.collection("User").doc(friendName).update({
    outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(name)
  }).then(function(){
    response.send("success");
  });
})

//returns a list of friend requests for the user to accept or deny
//PARAMETERS: uid
exports.getIncomingFriendRequests = functions.https.onRequest((request, response) => {
  var name = request.body.name;

  if(name == null){
    response.send("Must pass name in body of request");
  }

  db.collection("User").doc(name).get().then(doc => {
    response.send(doc.data().incomingFriendReq);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

//returns a list of friend requests the user has sent
//PARAMETERS: uid
exports.getOutgoingFriendRequests = functions.https.onRequest((request, response) => {
  var name = request.body.name;

  if(name == null){
    response.send("Must pass name in body of request");
  }

  db.collection("User").doc(name).get().then(doc => {
    response.send(doc.data().outgoingFriendReq);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});
