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
	var docRef = await db.collection("DateDishes").doc(date);
	var getDishes = await docRef.get().then(
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

// this function returns all the times that a dish is offered and where
// PARAMETERS: name: name of dish
exports.fetchAllOffered = functions.https.onRequest(async (request, response) => {
  var name = request.body.name;

  if(name == null){
    // sets as default for testing
    name = "Bacon";
  }

  console.log("Querying for dish: "+name);

  var docRef = await db.collection("Dish").doc(name);
  var getOfferings = await docRef.get().then(
    doc => {
      if(!doc.exists){
        response.send({error: "no such dish"});
      }else{
        response.send(doc.data());
      }
    }
  )
})

// this function adds all the offerings to the dishes for a particular date
// PARAMETERS: date (as a string)
exports.individualItemPopulate = functions.https.onRequest(async (request, response)=>{
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
    for(var m = 0; m< data.length; m++){
      var menuJSON = data[m];
      console.log(JSON.stringify(menuJSON));

      // sets basic info for hall for now such as menu items for particular meal
      // ideally we would pass in the meal (lunch or dinner, etc), and this would then fill in the database
      for(var k = 0; k<menuJSON['Meals'].length; k++){
        var mealInfo = menuJSON['Meals'][k];
        // add every item for every station for particular meal
        // also adds every meal to meal Collection if it exists
        for(var i=0; i < mealInfo['Stations'].length; i++){
          var currStation = mealInfo['Stations'][i];
          for(var j=0; j<currStation['Items'].length; j++){
            console.log("at: "+currStation['Items'][j]['Name']);
            var item = {
              offered: [{
                date: date,
                location: menuJSON['Location'],
                meal: mealInfo['Name'],
                station: currStation['Name'],
                id: currStation['Items'][j]['ID']
              }]
            };
            if(currStation['Items'][j]['Name'] == "Deli w/Fresh Baked Breads"){
              console.log("skipping");
              continue;
            }
            var itemRef = db.collection('Dish').doc(String(currStation['Items'][j]['Name']));
            var getItem = await itemRef.get().then(async doc => {
              if (!doc.exists) {
                itemRef.set(item);   
                console.log("SET new item: " + currStation['Items'][j]['Name']);     
              } else {
                console.log("Modify: " + currStation['Items'][j]['Name']);
                var getItem = await doc.data();
                await console.log(getItem);
                var containsItem = false;
                for(var e = 0; e<getItem['offered'].length; e++){
                  if(getItem['offered'][e] == item)
                    containsItem = true;
                }
                if(!containsItem)
                  var arrayUnion = await itemRef.update({ offered: admin.firestore.FieldValue.arrayUnion(item['offered'][0])});
              }
            }).catch(err => {
              console.log('Error getting document', err);
            });
          } // for all items
        } // for all stations
      } // for all meals
    }
    console.log(date);
  }
  
  var data = []
  for(var i = 0; i< locations.length; i++){
    data.push(await getData(url, locations[i]));
  }
  var updated = await updateDatabase(data);
  console.log("done");
  response.send("Finished Population of dishes for "+date);
})

// this function populates the database with the API infor for a particular date
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
    response.send("success");
  })
  .catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
    response.send("error");
  });
});

//check if a user exists
//PARAMETERS: uid
exports.userExists = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);

  db.collection("User").doc(uid).get().then(doc => {
    if(!doc.exists){
      response.send("Does Not Exist");
    }
    else{
      response.send("User Exists");
    }
  });
});
