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

// this function fetches the timings for dining courts on a particular day
// PARAMETERS: date (as a string "YYYY-MM-DD")
exports.fetchDiningTimes = functions.https.onRequest(async (request, response)=>{
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    var error = {error: "No date provided!"};
    response.send(error);
    return;
  }

  console.log("Querying data");
	var docRef = await db.collection("DateTimes").doc(date);
	var getDishes = await docRef.get().then(
		doc => {
			if(!doc.exists){
				response.send({error: "No such data in Database. Please populate with given date."});
			}else{
				response.send(doc.data());
			}
		}
	).catch(err => {
    console.log('Error getting documents', err);
  });

})

// this function populates the timings for dining courts on a particular day
// PARAMETERS: date (as a string "YYYY-MM-DD")
exports.populateDiningTimes = functions.https.onRequest(async (request, response)=>{
  var date = request.body.date;
  var locations = ["hillenbrand", "ford", "wiley", "windsor", "earhart"]

  if(date == null){
    // sets as default for testing
    var error = {error: "No date provided!"};
    response.send(error);
    return;
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
      response.send({error: "invalid date!"});
      return;
    }
  };

  async function updateDatabase(data) {
    var toPush = {locations: []};
    for(var currLoc = 0; currLoc < data.length; currLoc++){
      var menuJSON = data[currLoc];
      var location = {name: menuJSON['Location'], meals: []}

      for(var currMeal = 0; currMeal < menuJSON['Meals'].length; currMeal++){
        var mealInfo = {name: menuJSON['Meals'][currMeal]["Name"], hours: menuJSON['Meals'][currMeal]["Hours"]};
        location['meals'].push(mealInfo);
      }
      toPush['locations'].push(location);
    }

    await db.collection("DateTimes").doc(date).set(toPush);
  }

  var data = []
  for(var i = 0; i< locations.length; i++){
    data.push(await getData(url, locations[i]));
  }
  var updated = await updateDatabase(data);
  console.log("done");
  response.send("Finished Population of timings for "+date);
})

// this function returns a JSON of all dishes given a location and date
// PARAMETERS: date (as a string "YYYY-MM-DD")
exports.fetchDishes = functions.https.onRequest(async (request, response)=> {
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    var error = {error: "No date provided!"};
    response.send(error);
    return;
	}

	console.log("Querying data");
	var docRef = await db.collection("DateDishes").doc(date);
	var getDishes = await docRef.get().then(
		doc => {
			if(!doc.exists){
				response.send({error: "No such data in Database. Please populate with given date first!"});
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
    var error = {error: "No meal name provided!"}
    response.send(error);
    return;
  }

  console.log("Querying for dish: "+name);

  var docRef = await db.collection("Dish").doc(name);
  var getOfferings = await docRef.get().then(
    doc => {
      if(!doc.exists){
        response.send({error: "No such dish in the database!"});
      }else{
        response.send(doc.data());
      }
    }
  )
})

// this function adds all the offerings to the dishes for a particular date
// PARAMETERS: date (as a string "YYYY-MM-DD")
exports.individualItemPopulate = functions.https.onRequest(async (request, response)=>{
  var locations = ["hillenbrand", "ford", "wiley", "windsor", "earhart"]
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    var error = {error: "No date provided!"};
    response.send(error);
    return;
  }

  const urlMenu = "https://api.hfs.purdue.edu/menus/v2/locations/"; // + location + "/" + date;
  const getData = async (url, location) => {
    try {
      const opts = {
        headers: {
            cookie: 'BIGipServer~WEB~pool_wpvwebasp02-05-05_api.hfs.purdue.edu_web=!93X4jSd5ZpI16MqZHhMmHff5GgkAM9WTEE8eQfC/rDij560kyhNRecoriqBmdTBn875q7WyeXQ==; path=/; domain=.api.hfs.purdue.edu; Secure; HttpOnly; Expires=Tue, 19 Jan 2038 03:14:07 GMT;'
        }
      };
      const response = await fetch(url + "" + location + "/" + date, opts);
      if(response.status != 200){
        console.log("error in reading menu!");
        response.send("Error in reading one of the menus!")
        return;
      }
      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  const urlDish = "https://api.hfs.purdue.edu/menus/v2/items/"; // + item ID
  const getDishData = async (url, itemID) => {
    try {
      const opts = {
        headers: {
            cookie: 'BIGipServer~WEB~pool_wpvwebasp02-05-05_api.hfs.purdue.edu_web=!93X4jSd5ZpI16MqZHhMmHff5GgkAM9WTEE8eQfC/rDij560kyhNRecoriqBmdTBn875q7WyeXQ==; path=/; domain=.api.hfs.purdue.edu; Secure; HttpOnly; Expires=Tue, 19 Jan 2038 03:14:07 GMT;'
        }
      };
      const response = await fetch(url + "" + itemID, opts);
      if(response.status != 200){
        console.log("error in reading dish!");
        response.send("Error in reading one of the dishes!")
        return;
      }
      const json = await response.json();
      console.log(json);
      return json;
    } catch(error){
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
                station: currStation['Name']
              }],
              id: currStation['Items'][j]['ID']
            };
            if(currStation['Items'][j]['Name'] == "Deli w/Fresh Baked Breads"){
              console.log("skipping");
              continue;
            }
            var itemRef = db.collection('Dish').doc(String(currStation['Items'][j]['Name']));
            var getItem = await itemRef.get().then(async doc => {
              if (!doc.exists) {
                var additionalInfo = await getDishData(urlDish, item['id']);
                item['allergens'] = additionalInfo['Allergens'] != undefined? additionalInfo['Allergens'] : [];
                item['isVeg'] = additionalInfo['IsVegetarian'];
                item['nutrition'] = additionalInfo['Nutrition'] != undefined? additionalInfo['Nutrition'] : [];
                item['ingredients'] = additionalInfo['Ingredients'] != undefined? additionalInfo['Ingredients'] : "";
                itemRef.set(item);
                console.log("SET new item: " + currStation['Items'][j]['Name']);
                console.log(item);
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
    data.push(await getData(urlMenu, locations[i]));
  }
  var updated = await updateDatabase(data);
  console.log("done");
  response.send("Finished Population of dishes for "+date);
})

// this function populates the database with the API infor for a particular date
// PARAMETERS: date (as a string "YYYY-MM-DD")
exports.populateDishes = functions.https.onRequest(async (request, response)=>{
  var locations = ["hillenbrand", "ford", "wiley", "windsor", "earhart"]
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    var error = {error: "No date provided!"};
    response.send(error);
    return;
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


//add user to database
//PARAMETERS: uid, name
exports.addUserToDatabase = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  var name = request.body.name;
  console.log(uid);
  console.log(name);
  if (uid == null) {
    response.send("Must pass uid in body of request");
  }
  if (name == null) {
    response.send("Must pass name in body of request");
  }

  admin.auth().getUser(uid)
  .then(function(userRecord) {
    console.log("Successfully fetched user data:", userRecord.toJSON());
    checkUserExists(name);
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
    response.send("uid is incorrect");
  });

  function checkUserExists(name) {
    db.collection("User").doc(name).get().then(doc => {
      if(!doc.exists){
        addUser();
      }
      else {
        userDoesExist();
      }
    });
  }

  function userDoesExist() {
    response.send("user already exists");
  }

  function addUser() {
    var updatedUser = {
      uid: uid,
      name: name,
      initials: "",
      image: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      groups: [],
      preferences: [],
      dietaryRestrictions: [],
      friends: [],
      blockedUsers: [],
      outgoingFriendReq: [],
      incomingFriendReq: [],
      ratings: []
    }
    db.collection("User").doc(name).set(updatedUser).then(function() {
      console.log("User successfully added!");
      response.send("success");
    }).catch(function(error) {
      console.error("Error adding user: ", error);
      response.send("error");
    });
  }
});

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
//PARAMETERS: name, friendName
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
//PARAMETERS: name
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
//PARAMETERS: name
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
//PARAMETERS: name
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
//PARAMETERS: name, updates (a JSON of updates to profile)
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
//PARAMETERS: name, blockedName
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
//PARAMETERS: name
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
//PARAMETERS: name, friendName
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
//PARAMETERS: name, friendName
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
//PARAMETERS: name, friendName
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
//PARAMETERS: name
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
//PARAMETERS: name
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
