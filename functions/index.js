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

//add dietary restrictions to a user
//Parameters: userHandle, dietaryRestriction
exports.addDietaryRestriction = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var dietaryRestriction = request.body.dietaryRestriction;

  //ensure proper parameters
  if (userHandle == null || dietaryRestriction == null) {
    console.log("need to pass 'userHandle' and 'dietaryRestriction' in body");
    response.send("error");
  }
  else {
    db.collection("User").doc(userHandle).update({
      dietaryRestrictions: admin.firestore.FieldValue.arrayUnion(dietaryRestriction)
    })
    .then(function() {
      response.send("success");
    })
    .catch(function(error) {
      response.send("error");
    });
  }
});

//get dietary restrictions of a user
//Parameters: userHandle
exports.getDietaryRestrictions = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  //ensure proper parameters
  if (userHandle == null) {
    response.send("error: incorrect parameters");
  }
  else {
    db.collection("User").doc(userHandle).get().then(doc => {
      response.send(doc.data().dietaryRestrictions);
    })
    .catch(err => {
      console.log(err);
      response.send("error");
    })
  }
});

//remove dietary restrictions from a user
//Parameters: userHandle, dietaryRestriction
exports.removeDietaryRestriction = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var dietaryRestriction = request.body.dietaryRestriction;

  //ensure proper parameters
  if (userHandle == null || dietaryRestriction == null) {
    console.log("need to pass 'userHandle' and 'dietaryRestriction' in body");
    response.send("error");
  }
  else {
    db.collection("User").doc(userHandle).update({
      dietaryRestrictions: admin.firestore.FieldValue.arrayRemove(dietaryRestriction)
    })
    .then(function() {
      response.send("success");
    })
    .catch(function(error) {
      response.send("error");
    });
  }
});

//get a user handle from a uid
//PARAMETERS: uid
exports.getUserHandle = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);

  if (uid == null) {
    response.send({
      "error":"uid not passed in"
    });
  }
  else {
    var userRef = db.collection("User");
    var query = userRef.where("uid", "==", uid).limit(1)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.empty) {
        response.send({
          "error":"user does not exist in database"
        });
      }
      else {
        querySnapshot.forEach(function(doc) {
          response.send({
            "userHandle":doc.data().userHandle
          });
        });
      }
    })
    .catch(function(error) {
      console.log(error);
      response.send({
        "error":error
      });
    });
  }
});

//add user to database
//PARAMETERS: uid, userHandle, userName
exports.addUserToDatabase = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  var userHandle = request.body.userHandle;
  var userName = request.body.userName;
  console.log(uid);
  console.log(userHandle);
  console.log(userName);
  if (uid == null) {
    response.send("Must pass uid in body of request");
  }
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (userName == null) {
    response.send("Must pass userName in body of request");
  }

  admin.auth().getUser(uid)
  .then(function(userRecord) {
    console.log("Successfully fetched user data:", userRecord.toJSON());
    checkUserExists(userHandle);
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
    response.send("uid is incorrect");
  });

  function checkUserExists(userHandle) {
    db.collection("User").doc(userHandle).get().then(doc => {
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
      userName: userName,
      userHandle: userHandle,
      initials: "",
      image: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      groups: [],
      preferences: [],
      dietaryRestrictions: [],
      friends: [],
      blockedUsers: [],
      outgoingFriendReq: [],
      incomingFriendReq: [],
      incomingGroupInvites: [],
      ratings: [],
      notifications: []
    }
    db.collection("User").doc(userHandle).set(updatedUser).then(function() {
      console.log("User successfully added!");
      response.send("success");
    }).catch(function(error) {
      console.error("Error adding user: ", error);
      response.send("error");
    });
  }
});

//gets the public profile of a user
//PARAMETERS: userHandle
exports.getPublicProfile = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if(userHandle == null){
    response.send("Must pass userHandle in request");
    return;
  }

  db.collection("User").doc(userHandle).get().then(doc => {
    var qualities = doc.data();
    var profile = {userName: qualities.userName, userHandle: userHandle, ratings: qualities.ratings, image: qualities.image};
    response.send(profile);
  }).catch(function(){
    response.send("error");
  });
})

//get friends of a user
//PARAMETERS: userHandle
exports.getFriends = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if(userHandle == null){
    response.send("Must pass userHandle in request");
    return;
  }

  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().friends);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

//remove a friend from a user
//PARAMETERS: userHandle, friendHandle
exports.removeFriend = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  var friendHandle = request.body.friendHandle;
  console.log(friendHandle);

  if(userHandle == null){
    response.send("Must pass userHandle in request");
    return;
  }
  if(friendHandle == null){
    response.send("Must pass friendHandle in request");
    return;
  }

  var friendDoc = db.collection("User").doc(friendHandle);
  var userDoc = db.collection("User").doc(userHandle);

  //get the user's name
  var userName;
  await userDoc.get().then(async doc => {
    userName = await doc.data().userName;
  });

  //get the friend's name
  var friendName;
  await friendDoc.get().then(async doc => {
    friendName = await doc.data().userName;
  });

  var userObj = {friendHandle: userHandle, friendName: userName};
  var friendObj = {friendHandle: friendHandle, friendName: friendName};
  var notification = {type: "unfriended", id: userObj}

  userDoc.update({
    friends: admin.firestore.FieldValue.arrayRemove(friendObj)
  }).catch(function(error){
    console.error("Error removing friend from user")
    response.send("error");
  });

  friendDoc.update({
    friends: admin.firestore.FieldValue.arrayRemove(userObj),
    notifications: admin.firestore.FieldValue.arrayUnion(notification)
  }).then(function(){
    response.send("success");
  }).catch(function(error){
    console.error("Error removing user from friend")
    response.send("error");
  });
});

//remove a user from all Friends
//PARAMETERS: userHandle
exports.removeFromAllFriends = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);

  if(userHandle == null){
    response.send("Must pass userHandle in request");
    return;
  }

  var userDoc = db.collection("User").doc(userHandle);

  //get the user's name
  await userDoc.get().then(async doc => {
    var userName = await doc.data().userName;
    var userObj = {friendHandle: userHandle, friendName: userName};
    var friends = doc.data().friends;

    console.log(userObj);

    var notification = {type: "unfriended", id: userObj};

    for(var i = 0; i < friends.length; i++){
      await db.collection("User").doc(friends[i].friendHandle).update({
        friends: admin.firestore.FieldValue.arrayRemove(userObj),
        notifications: admin.firestore.FieldValue.arrayUnion(notification)
      });
      /*if(i == friends.length - 1){
        response.send("success");
      }*/
    }
  }).catch(function(error){
    console.error(error.message);
    response.send("error");
  });
  response.send("success");
});

//remove user from database
//PARAMETERS: userHandle
exports.removeUserFromDatabase = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
    return;
  }

  db.collection("User").doc(userHandle).delete().then(function() {
    console.log("User successfully deleted!");
    response.send("success");
  }).catch(function(error) {
    console.error("Error deleting user: ", error);
    response.send("error");
  });
});

//get user profile information
//PARAMETERS: userHandle
exports.getUserProfile = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  else {
    getProfile(userHandle, response);
  }
});

//function to get user profile information
function getProfile(userHandle, response) {
  var userRef = db.collection("User").doc(userHandle);
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
//PARAMETERS: userHandle, updates (a JSON of updates to profile)
exports.updateUserProfile = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var updates = JSON.parse(request.body.updates);
  console.log(userHandle);
  console.log(updates);

  var userRef = db.collection("User").doc(userHandle);
  userRef.update(updates).then(function() {
    var updatedUser = db.collection("User").doc(userHandle)
    getProfile(userHandle, response);
  });
});

//block a user
//PARAMETERS: userHandle, blockedHandle
exports.blockUser = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var blockedHandle = request.body.blockedHandle;
  console.log(userHandle);
  console.log(blockedHandle);

  //get the blocked user's name
  var blockedName;
  await db.collection("User").doc(blockedHandle).get().then(async doc => {
    if (!doc.exists) {
      console.log("blockedHandle does not exist in database");
      response.send("error");
    }
    else {
      blockedName = doc.data().userName;
    }
  });

  //get the current user's name
  var userName;
  await db.collection("User").doc(userHandle).get().then(async doc => {
    if (!doc.exists) {
      console.log("userHandle does not exist in database");
      response.send("error");
    }
    else {
      userName = doc.data().userName;
    }
  });

  if (blockedName != null && userName != null) {
    var blockedObject = {
      blockedHandle: blockedHandle,
      blockedName: blockedName
    };

    var blockedFriend = {
      friendHandle: blockedHandle,
      friendName: blockedName
    }

    var userObject = {
      userHandle: userHandle,
      userName: userName
    };

    var userFriend = {
      friendHandle: userHandle,
      friendName: userName
    }

    var userRef = db.collection("User").doc(userHandle);
    userRef.update({
      blockedUsers: admin.firestore.FieldValue.arrayUnion(blockedObject)
    })
    .then(function() {
      db.collection("User").doc(userHandle).update({
        friends: admin.firestore.FieldValue.arrayRemove(blockedFriend),
        incomingFriendReq: admin.firestore.FieldValue.arrayRemove(blockedFriend),
        outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(blockedFriend)
      }).catch(function(error){
        console.error("Error removing friend from user")
        response.send("error");
      });

      var notification = {type: "blocked", id: userObject};

      db.collection("User").doc(blockedHandle).update({
        friends: admin.firestore.FieldValue.arrayRemove(userFriend),
        outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(userFriend),
        incomingFriendReq: admin.firestore.FieldValue.arrayRemove(userFriend),
        notifications: admin.firestore.FieldValue.arrayUnion(notification)
      }).then(function(){
        response.send("success");
      }).catch(function(error){
        console.error("Error removing user from friend")
        response.send("error");
      });
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      response.send("error");
    });
  }
});

exports.unblockUser = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var blockedHandle = request.body.blockedHandle;
  console.log(userHandle);
  console.log(blockedHandle);

  //get the blocked user's name
  var blockedName;
  await db.collection("User").doc(blockedHandle).get().then(async doc => {
    if (!doc.exists) {
      console.log("blockedHandle does not exist in database");
      response.send("error");
    }
    else {
      blockedName = doc.data().userName;
    }
  });

  //get the current user's name
  var userName;
  await db.collection("User").doc(userHandle).get().then(async doc => {
    if (!doc.exists) {
      console.log("userHandle does not exist in database");
      response.send("error");
    }
    else {
      userName = doc.data().userName;
    }
  });

  if (blockedName != null && userName != null) {
    var blockedObject = {
      blockedHandle: blockedHandle,
      blockedName: blockedName
    };

    var userRef = db.collection("User").doc(userHandle);
    userRef.update({
      blockedUsers: admin.firestore.FieldValue.arrayRemove(blockedObject)
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
  }
});

//get blocked users
//PARAMETERS: userHandle
exports.getBlockedUsers = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null){
    console.log("Must pass userHandle into body of request")
    response.send("error");
  }

  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().blockedUsers);
  }).catch(function(error){
    console.log(error);
    response.send("error");
  });
});

//check if a user exists
//PARAMETERS: userHandle
exports.userExists = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);

  db.collection("User").doc(userHandle).get().then(doc => {
    if(!doc.exists){
      response.send("Does Not Exist");
    }
    else{
      response.send("User Exists");
    }
  });
});

//sends a friend request
//PARAMETERS: userHandle, friendHandle
exports.sendFriendRequest = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  var friendHandle = request.body.friendHandle;
  console.log(friendHandle);

  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }

  var friendDoc = await db.collection("User").doc(friendHandle);
  var userDoc = await db.collection("User").doc(userHandle);

  //get the user's name
  var userName;
  await userDoc.get().then(async doc => {
    userName = await doc.data().userName;
  });
  var userObj = {friendHandle: userHandle, friendName: userName};

  //check if the friend's id exists
  friendDoc.get().then(async doc => {
    if(!doc.exists){
      console.log("Friend handle is not valid");
      response.send("Bad friendHandle");
    }
    else{
      //get the friend's name
      var friendName;
      await friendDoc.get().then(async doc => {
        friendName = await doc.data().userName;
      });

      var friendObj = {friendHandle: friendHandle, friendName: friendName};
      //check if the sender is blocked
      console.log(userObj);
      console.log(friendObj);
      var blockedUsers = doc.data().blockedUsers;
      for(var i = 0; i < blockedUsers.length; i++){
        if(blockedUsers[i].blockedHandle==userHandle){
          response.send("You cannot add a user who has blocked you.");
          return;
        }
      }
      var oFR = doc.data().outgoingFriendReq;
      for(var i = 0; i < oFR.length; i++){
        if(oFR[i].friendHandle==userHandle){
          response.send("You cannot send a friend request to someone who has sent you a friend request.");
          return;
        }
      }
      userDoc.get().then(async uDoc => {
        //check if they are already friends
        var friends = uDoc.data().friends;
        for(var i = 0; i < friends.length; i++){
          if(friends[i].friendHandle==friendHandle){
            response.send("Already friends.");
            return;
          }
        }
        //add an outgoingFriendReq to the user
        userDoc.update({
          outgoingFriendReq: admin.firestore.FieldValue.arrayUnion(friendObj)
        }).catch(function(error){
          response.send("error");
        });
        var notification = {type: "new friend request", id: {userObj}};
        friendDoc.update({
          incomingFriendReq: admin.firestore.FieldValue.arrayUnion(userObj),
          notifications: admin.firestore.FieldValue.arrayUnion(notification)
        }).then(function() {
          response.send("success");
        }).catch(function(error) {
          response.send("error");
        });
      });
    }
  });
});

//accepts a friend request
//PARAMETERS: userHandle, friendHandle
exports.acceptFriendRequest = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  var friendHandle = request.body.friendHandle;
  console.log(friendHandle);

  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }

  var friendDoc = db.collection("User").doc(friendHandle);
  var userDoc = db.collection("User").doc(userHandle);

  //get the user's name
  var userName;
  await userDoc.get().then(async doc => {
    userName = await doc.data().userName;
  });

  //get the friend's name
  var friendName;
  await friendDoc.get().then(async doc => {
    friendName = await doc.data().userName;
  });

  var userObj = {friendHandle: userHandle, friendName: userName};
  var friendObj = {friendHandle: friendHandle, friendName: friendName};

  userDoc.update({
    incomingFriendReq: admin.firestore.FieldValue.arrayRemove(friendObj),
    friends: admin.firestore.FieldValue.arrayUnion(friendObj)
  });

  //remove the user from the friend's blockUser list
  var blockObj = {blockedHandle: userHandle, blockedName: userName};
  var notification = {type: "new friend", id: {userObj}}

  friendDoc.update({
    outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(userObj),
    friends: admin.firestore.FieldValue.arrayUnion(userObj),
    blockedUsers: admin.firestore.FieldValue.arrayRemove(blockObj),
    notifications: admin.firestore.FieldValue.arrayUnion(notification)
  }).then(function(){
    response.send("success");
  }).catch(function(error){
    console.log(error.message);
    response.send(error.message);
  });
});

//Denies a friend request (Removes the friend request from both users)
//PARAMETERS: userHandle, friendHandle
exports.denyFriendRequest = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  var friendHandle = request.body.friendHandle;
  console.log(friendHandle);

  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }

  var friendDoc = db.collection("User").doc(friendHandle);
  var userDoc = db.collection("User").doc(userHandle);

  //get the user's name
  var userName;
  await userDoc.get().then(async doc => {
    userName = await doc.data().userName;
  });

  //get the friend's name
  var friendName;
  await friendDoc.get().then(async doc => {
    friendName = await doc.data().userName;
  });

  var userObj = {friendHandle: userHandle, friendName: userName};
  var friendObj = {friendHandle: friendHandle, friendName: friendName};

  userDoc.update({
    incomingFriendReq: admin.firestore.FieldValue.arrayRemove(friendObj)
  });

  friendDoc.update({
    outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(userObj)
  }).then(function(){
    response.send("success");
  });
})

//returns a list of friend requests for the user to accept or deny
//PARAMETERS: userHandle
exports.getIncomingFriendRequests = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null){
    response.send("Must pass userHandle in body of request");
  }

  var userDoc = db.collection("User").doc(userHandle);

  userDoc.get().then(doc => {
    response.send(doc.data().incomingFriendReq);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

//returns a list of friend requests the user has sent
//PARAMETERS: userHandle
exports.getOutgoingFriendRequests = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null){
    response.send("Must pass userHandle in body of request");
  }

  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().outgoingFriendReq);
  }).catch(function(error){
    console.error("Error getting list");
    response.send(error.message);
  });
});

/*exports.setUserStatus = functions.https.onRequest((request, reponse) =>{
  var name = request.body.name;
  var status = request.body.name;

  console.log(name);
  console.log(status);

  db.collection("User").doc(name).set({
    status: status
  }).then(function(){
    console.log("Status updated.");
  }).catch(function(error){
    console.error("Error updating status: ", error);
  });
});

exports.getUserStatus = functions.https.onRequest((request, response) => {
  var name = request.body.name;

  console.log(name);

  db.collection("User").doc(name).get().then(doc => {
    response.send(doc.data().status);
  }).catch(function(error){
    console.error("Error getting user status: ", error);
  });
});*/

//PARAMETERS: userHandle, groupName
exports.createGroup = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var groupName = request.body.groupName;
  console.log(userHandle);
  console.log(groupName);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (groupName == null) {
    response.send("Must pass groupName in body of request");
  }

  //get the creator's name
  db.collection("User").doc(userHandle).get().then(doc => {
    var userName = doc.data().userName;

    //add the group to the database
    db.collection("Group").add({
      memberHandles: [userHandle],
      memberObjects: [{userHandle: userHandle, userName: userName}],
      messages: [],
      groupName: groupName
    }).then(function(docRef){
      console.log("Document written with ID: ", docRef.id);


      //add the group to the user
      db.collection("User").doc(userHandle).update({
        groups: admin.firestore.FieldValue.arrayUnion(docRef.id)
      }).then(function() {
        response.send(docRef.id);
      });
    }).catch(function(error){
      console.log(error.message);
      response.send(error.message);
    });
  }).catch(function(error){
    console.error("Error getting name");
    response.send(error.message);
  });
});

//PARAMETERS: groupID
exports.getUsersInGroup = functions.https.onRequest((request, response) => {
  var groupID = request.body.groupID;
  console.log(groupID);
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  //return userHandles and userNames
  db.collection("Group").doc(groupID).get().then(doc => {
    response.send(doc.data().memberObjects);
  }).catch(function(error){
    console.log(error.message);
    response.send("error");
  });
});

//PARAMETERS: userHandle, friendHandle, groupID, groupName
exports.inviteToGroup = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;
  var groupName = request.body.groupName;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  console.log(groupName);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }
  if(groupName == null){
    response.send("Must pass groupName in body of request");
  }

  var friendDoc = db.collection("User").doc(friendHandle);
  var userDoc = db.collection("User").doc(userHandle);

  //check if friends with friendHandle
  userDoc.get().then(doc => {
    /*if(doc.data().friends.indexOf(friendHandle) == -1){
      response.send("You are not friends with the user");
    }*/

    var friends = doc.data().friends;
    for(var i = 0; i < friends.length; i++){
      if(friends[i].friendHandle==friendHandle){
        break;
      }
      else if(i == friends.length - 1){
        response.send("error: not friends");
        return;
      }
    }
    //else{
      //check if the user is already in the group
      friendDoc.get().then(fDoc => {
        if(fDoc.data().groups.indexOf(groupID) > -1){
          response.send("The user is already in this group");
        }
        else{
          //update friend's incoming group invites list
          var notification = {type: "invited to group", id: {friendHandle: userHandle, groupName: groupName, groupID: groupID}}
          friendDoc.update({
            incomingGroupInvites: admin.firestore.FieldValue.arrayUnion({friendHandle: userHandle, groupID: groupID, groupName: groupName}),
            notifications: admin.firestore.FieldValue.arrayUnion(notification)
          }).then(function() {
            response.send("success");
          }).catch(function(error) {
            response.send("error");
          });
        }
      });
    //}
  });
});

//PARAMETERS: userHandle, groupID, friendHandle, groupName
exports.acceptGroupInvitation = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;
  var groupName = request.body.groupName;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  console.log(groupName);

  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }
  if (groupName == null) {
    response.send("Must pass groupName in body of request");
  }

  //add the user to the group
  var userDoc = db.collection("User").doc(userHandle);
  //update user's incomingGroupInvites list and groups list
  userDoc.update({
    incomingGroupInvites: admin.firestore.FieldValue.arrayRemove({friendHandle: friendHandle, groupID: groupID, groupName: groupName}),
    groups: admin.firestore.FieldValue.arrayUnion(groupID)
  }).then(function() {

    //add the user to the group's user list
    userDoc.get().then(doc => {
      var notification = {type: "user joined group", id: {userHandle: userHandle, groupName: groupName, groupID: groupID}};

      var userCol = db.collection("User");

      //notify all group members
      db.collection("Group").doc(groupID).get().then(gDoc => {
        var members = gDoc.data().memberHandles;
        for(var i = 0; i < members.length; i++){
          userCol.doc(members[i]).update({
            notifications: admin.firestore.FieldValue.arrayUnion(notification)
          });
        }
      });

      db.collection("Group").doc(groupID).update({
        memberHandles: admin.firestore.FieldValue.arrayUnion(userHandle),
        memberObjects: admin.firestore.FieldValue.arrayUnion({userHandle: userHandle, userName: doc.data().userName})
      }).then(function(){
        response.send("success");
      }).catch(function(error){
        response.send(error.message);
      });
    }).catch(function(error){
      response.send(error.message);
    });
  }).catch(function(error) {
    response.send("error");
  });
});

//PARAMETERS: userHandle, friendHandle, groupID, groupName
exports.denyGroupInvitation = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;
  var groupName = request.body.groupName;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  console.log(groupName);

  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }
  if (groupName == null){
    response.send("Must pass groupName in body of request");
  }

  //remove the group from the user's incomingGroupInvites list
  db.collection("User").doc(userHandle).update({
    incomingGroupInvites: admin.firestore.FieldValue.arrayRemove({friendHandle: friendHandle, groupID: groupID, groupName: groupName})
  }).then(function() {
    response.send("success");
  }).catch(function(error){
    response.send(error.message);
  });
});

//removes the user from the group and the group from the user
//PARAMETERS: userHandle, groupID, groupName
exports.leaveGroup = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var groupID = request.body.groupID;
  var groupName = request.body.groupName;

  console.log(userHandle);
  console.log(groupID);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }
  if (groupName == null) {
    response.send("Must pass groupName in body of request");
  }

  //assume the user is in the group

  //Take the user out of the group fields
  var userDoc = db.collection("User").doc(userHandle);
  var groupDoc = db.collection("Group").doc(groupID);
  var userName;
  await userDoc.get().then(async doc => {
    userName = await doc.data().userName;
  });

  //delete the group if there is no one left
  await groupDoc.get().then(async doc => {
    if(doc.data().memberHandles.length == 1){
      await groupDoc.delete().catch(function (error){
        response.send("error");
      });
    }
    else{
      await groupDoc.update({
        memberHandles: admin.firestore.FieldValue.arrayRemove(userHandle),
        memberObjects: admin.firestore.FieldValue.arrayRemove({userHandle: userHandle, userName: userName})
      }).catch(function(error){
        response.send(error.message);
      }).then(function(){
        var notification = {type: "user left group", id: {userHandle: userHandle, groupName: groupName, groupID: groupID}};
        //send a notification to all members in the group
        var userCol = db.collection("User");
        var members = doc.data().memberHandles;

        for(var i = 0; i < members.length; i++){
          userCol.doc(members[i]).update({
            notifications: admin.firestore.FieldValue.arrayUnion(notification)
          }).catch(function(error){
            console.log(error.message);
            response.send("error");
            return;
          });
        }
      });
    }
  });

  //take the group out of the user
  userDoc.update({
    groups: admin.firestore.FieldValue.arrayRemove(groupID)
  }).then(function(){
    response.send("success");
  }).catch(function(error){
    response.send(error.message);
  });
});

//returns an array of strings which is the list of groupIDs which the user has been invited to
//PARAMETERS: userHandle
exports.getGroupInvites = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }

  //return groupID's
  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().incomingGroupInvites);
  }).catch(function(error){
    console.log(error.message);
    response.send("error");
  });
});

//returns an array of strings which is the list of groupIDs which the user is a part of
//PARAMETERS: userHandle
exports.getGroups = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }

  //return groupID's
  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().groups);
  }).catch(function(error){
    console.log(error.message);
    response.send("error");
  });
});

//PARAMETERS: groupID
exports.getGroup = functions.https.onRequest((request, response) =>{
  var groupID = request.body.groupID;
  console.log(groupID);
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  var groupDoc = db.collection("Group").doc(groupID);

  groupDoc.get().then(doc => {
    response.send(doc.data());
  }).catch(function(error){
    resonse.send("error");
  });
});

//deletes the group
//PARAMETERS: groupID
exports.deleteGroup = functions.https.onRequest(async (request, response) => {
  var groupID = request.body.groupID;
  console.log(groupID);
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  var userCol = db.collection("User");
  var groupDoc = db.collection("Group").doc(groupID);

  //remove the group from all users' accounts
  await db.collection("Group").doc(groupID).get().then(doc => {
    var handles = doc.data().memberHandles;
    for(var i = 0; i < handles.length; i++){
      userCol.doc(handles[i]).update({
        groups: admin.firestore.FieldValue.arrayRemove(groupID)
      }).catch(function(error){
        response.send(error.message);
      });
    }

    //delete the document for the group
    groupDoc.delete().then(function() {
      response.send("success");
    }).catch(function(error){
      response.send(error.message);
    })
  }).catch(function(error){
    response.send(error.message);
  });
});

//gets the notifications of a user and clears them
//PARAMETERS: userHandle
exports.getNotifications = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if(userHandle == null){
    response.send("Must pass userHandle in body of request");
  }

  userDoc = db.collection("User").doc(userHandle);

  userDoc.get().then(doc => {
    var notifications = doc.data().notifications;
    var updates = {notifications: []};
    userDoc.update(updates).then(function(){
      response.send(notifications);
    }).catch(function(error){
      response.send("error");
    });
  }).catch(function(error){
    response.send("error");
    return;
  });
});
