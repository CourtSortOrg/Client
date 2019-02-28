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
      incomingGroupInvites: [],
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
  if (name == null) {
    response.send("Must pass name in body of request");
  }
  else {
    getProfile(name, response);
  }
});

//function to get user profile information
function getProfile(name, response) {
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
    db.collection("User").doc(name).update({
      friends: admin.firestore.FieldValue.arrayRemove(blockedName),
      incomingFriendReq: admin.firestore.FieldValue.arrayRemove(blockedName),
      outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(blockedName)
    }).catch(function(error){
      console.error("Error removing friend from user")
      response.send("error");
    });

    db.collection("User").doc(blockedName).update({
      friends: admin.firestore.FieldValue.arrayRemove(name),
      outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(name),
      incomingFriendReq: admin.firestore.FieldValue.arrayRemove(name)
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
    //check if the sender is blocked
    else if(doc.data().blockedUsers.indexOf(name) > -1){
      response.send("You cannot add a user who has blocked you.");
    }
    else if(doc.data().outgoingFriendReq.indexOf(name) > -1){
      response.send("You cannot send a friend request to someone who has sent you a friend request");
    }
    else{
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

  //remove the user from the friend's blockUser list
  var friendDoc = db.collection("User").doc(friendName);

  friendDoc.update({
    outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(name),
    friends: admin.firestore.FieldValue.arrayUnion(name)
  }).then(function(){
    friendDoc.get().then(doc => {
      if(doc.data().blockedUsers.indexOf(name) > -1){
        friendDoc.update({
          blockedUsers: admin.firestore.FieldValue.arrayRemove(name)
        }).then(function(){
          response.send("success");
        }).catch(function(error){
          console.log(error.message);
          response.send(error.message);
        });
      }
      else{
        response.send("success");
      }
    });
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
    var name = doc.data().name;

    //add the group to the database
    db.collection("Group").add({
      memberHandles: [userHandle],
      memberObjects: [{userHandle: userHandle, userName: name}],
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

//PARAMETERS: userHandle, friendHandle, groupID
exports.inviteToGroup = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  var friendDoc = db.collection("User").doc(friendHandle);
  var userDoc = db.collection("User").doc(userHandle);

  //check if friends with friendHandle
  userDoc.get().then(doc => {
    if(doc.data().friends.indexOf(friendHandle) == -1){
      response.send("You are not friends with the user");
    }
    else{
      //check if the user is already in the group
      friendDoc.get().then(fDoc => {
        if(fDoc.data().groups.indexOf(groupID) > -1){
          response.send("The user is already in this group");
        }
        else{
          //update friend's incoming group invites list
          friendDoc.update({
            incomingGroupInvites: admin.firestore.FieldValue.arrayUnion({friendHandle: userHandle, groupID: groupID})
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

//PARAMETERS: userHandle, groupID, friendHandle
exports.acceptGroupInvitation = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  //add the user to the group
  var userDoc = db.collection("User").doc(userHandle);
  //update user's incomingGroupInvites list and groups list
  userDoc.update({
    incomingGroupInvites: admin.firestore.FieldValue.arrayRemove({friendHandle: friendHandle, groupID: groupID}),
    groups: admin.firestore.FieldValue.arrayUnion(groupID)
  }).then(function() {
    //add the user to the group's user list
    userDoc.get().then(doc => {
      db.collection("Group").doc(groupID).update({
        memberHandles: admin.firestore.FieldValue.arrayUnion(userHandle),
        memberObjects: admin.firestore.FieldValue.arrayUnion({userHandle: userHandle, userName: doc.data().name})
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

//PARAMETERS: userHandle, friendHandle, groupID
exports.denyGroupInvitation = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    response.send("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  //remove the group from the user's incomingGroupInvites list
  db.collection("User").doc(userHandle).update({
    incomingGroupInvites: admin.firestore.FieldValue.arrayRemove({friendHandle: friendHandle, groupID: groupID})
  }).then(function() {
    response.send("success");
  }).catch(function(error){
    response.send(error.message);
  });
});

//removes the user from the group and the group from the user
//PARAMETERS: userHandle, groupID
exports.leaveGroup = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(groupID);
  if (userHandle == null) {
    response.send("Must pass userHandle in body of request");
  }
  if (groupID == null) {
    response.send("Must pass groupID in body of request");
  }

  //assume the user is in the group

  //Take the user out of the group fields
  var userDoc = db.collection("User").doc(userHandle);
  var groupDoc = db.collection("Group").doc(groupID);
  var name;
  await userDoc.get().then(async doc => {
    name = await doc.data().name;
  })
  await groupDoc.update({
    memberHandles: admin.firestore.FieldValue.arrayRemove(userHandle),
    memberObjects: admin.firestore.FieldValue.arrayRemove({userHandle: userHandle, userName: name})
  }).catch(function(error){
    response.send(error.message);
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

exports.createObject = functions.https.onRequest((request, response) => {
  var name = request.body.name;

  var userRef = db.collection("User").doc(name);
  userRef.update({test: []}).then(function() {
    userRef.update({
      test: admin.firestore.FieldValue.arrayUnion({handle: "myHandle", name: "myName"}).then(function() {
        resopnse.send("success");
      }).then(function() {
        response.send()
      })
    });
  });
});
