const functions = require('firebase-functions');
const fetch = require("node-fetch");
const req = require('request');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

var ratings = require('./ratings');

//this function is for testing
//PARAMETERS: none
exports.test = functions.https.onRequest((request, response) => {
  response.send("Heyo!");
});

// returns the best dining court for a user
// PARAMETERS: userHandle, date, meal
exports.getBestDiningCourtUser = functions.https.onRequest(async (request, response)=>{
  var userHandle = request.body.userHandle;
  var date = request.body.date;
  var meal = request.body.meal;
  if(userHandle == null || date == null || meal == null)
    throw new Error("incorrect parameters!");

  var userDishRatings = [];

  var userRef = db.collection("User").doc(userHandle);
  await userRef.get().then(async function(doc) {
    if (doc.exists) {
      await userRef.collection("ItemRatings").get().then(function(querySnapshot) {
        querySnapshot.forEach(async function(itemRatingDoc) {
          await userDishRatings.push(itemRatingDoc.data());
        });
        console.log("all dish ratings: " +userDishRatings);
      })
      .catch(function(error) {
        throw new Error(error);
      });
    }
    else {
      throw new Error("user does not exist");
    }
  })
  .catch(function(error) {
    throw new Error(error);
  });

  var ratedDishOfferings = [];
  for(var i=0; i<userDishRatings.length; i++){
    var ratingObj = userDishRatings[i];
    console.log(i+"th rating: "+ratingObj['dish']);
    var dishRef = db.collection("Dish").doc(ratingObj['dish']);
    await dishRef.get().then(function(doc){
      var dishOffering = [];
      try{
        var dishOffering = doc.data().offered;
      } catch(error){
        console.log("no offered array for this!");
      }
      ratedDishOfferings.push({dish: ratingObj['dish'], offered: dishOffering, rating: ratingObj['rating']});
    })
  }

  var matches = [];
  for(var i = 0; i<ratedDishOfferings.length; i++){
    var currDish = ratedDishOfferings[i];
    for(var j = 0; j<currDish['offered'].length; j++){
      var offeredObj = currDish['offered'][j];
      if(offeredObj['date'] == date && offeredObj['meal'] == meal){
        matches.push({dish: currDish['dish'], location: offeredObj['location'], rating: currDish['rating']});
      }
    }
  }
  var courts = {
    "Hillenbrand" : {
      dishes: [],
      aggregate: 0,
      total: 0
    },
    "Earhart" : {
      dishes: [],
      aggregate: 0,
      total: 0
    },
    "Wiley" : {
      dishes: [],
      aggregate: 0,
      total: 0
    },
    "Windsor" : {
      dishes: [],
      aggregate: 0,
      total: 0
    },
    "Ford" : {
      dishes: [],
      aggregate: 0,
      total: 0
    }
  }
  var courtNames = ["Hillenbrand", "Wiley", "Windsor", "Ford", "Earhart"];
  for(var i=0; i<matches.length; i++){
    var currLoc = matches[i]['location'];
    courts[currLoc]['dishes'].push(matches[i]);
    courts[currLoc]['aggregate'] += matches[i]['rating'];
    courts[currLoc]['total']++;
  }

  var best = {};
  var maxRating = 0;
  for(var i=0; i<courtNames.length; i++){
    if(courts[courtNames[i]]['total']>0){
      var currRating = courts[courtNames[i]]['aggregate'] / courts[courtNames[i]]['total'];
    }else{
      currRating = -1;
    }
    if(currRating>maxRating){
      maxRating = currRating;
      best['location'] = courtNames[i];
      best['dishes'] = courts[courtNames[i]]['dishes'];
      best['rating'] = currRating;
    }
  }
  //response.send(courts);
  response.send(best);
})

// adds current location
// requires userHandle and Location
exports.checkInLocation = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var location = request.body.location;

  if(userHandle == null || location == null) {
    throw new Error("Input data not valid!");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(async doc =>{
      if(!doc.exists) {
        throw new Error("no such user");
      }
      else {
        var currTime = new Date();
        userRef.update({
          location: location,
          "checkInTime": currTime.getTime(),
        }).then(async function() {
          var userObj = {
            "friendHandle":doc.data().userHandle,
            "friendName":doc.data().userName
          };
          var notification = {
            "type":"joinedDiningCourt",
            "id":userObj
          }
          var friendsArr = doc.data().friends;
          console.log("friendsArr: " + friendsArr);
          var buddiesArr = [];
          for(var i = 0; i < friendsArr.length; i++) {
            var friendObj = friendsArr[i]
            console.log("friendObj: " + friendObj)
            var friendHandle = friendObj.friendHandle;
            var friendRef = db.collection("User").doc(friendHandle);
            await friendRef.get().then(async function(doc) {
              var friendLocation = doc.data().location;
              console.log("friendHandle: " + friendHandle + " friendLocation: " + friendLocation);
              if (friendLocation == location) {
                console.log("MATCH");
                buddiesArr.push(friendObj);
                await friendRef.update({
                  "notifications": admin.firestore.FieldValue.arrayUnion(notification)
                })
                .catch(function(error) {
                  throw new Error(error);
                });
              }
            })
            .catch(function(error) {
              throw new Error(error);
            });
          }
          response.send(buddiesArr);
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

// removes location
//PARAMETERS: userHandle
exports.removeLocation = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null) {
    throw new Error("Input data not valid!");
  }
  else {
    var userRef = db.collection("User").doc(userHandle)
    userRef.get().then(doc => {
      if(!doc.exists) {
        throw new Error("No such user");
      }
      else if (doc.data().location == null) {
        throw new Error("User not checked in");
      }
      else {
        var diningCourtTimes = doc.data().diningCourtTimes;
        var location = doc.data().location;
        var checkInTime = doc.data().checkInTime;
        var currTime = new Date();
        var diff = Math.abs(currTime.getTime() - checkInTime);
        var locationAvg;
        var locationNum;
        if (checkInTime == null) {
          diff = 0;
        }
        if (diningCourtTimes == null) {
          diningCourtTimes = {
            "Earhart": {
              "avgTime":0,
              "num":0
            },
            "Ford": {
              "avgTime":0,
              "num":0
            },
            "Hillenbrand": {
              "avgTime":0,
              "num":0
            },
            "Wiley": {
              "avgTime":0,
              "num":0
            },
            "Windsor": {
              "avgTime":0,
              "num":0
            }
          }
        }

        locationAvg = diningCourtTimes[location].avgTime;
        locationNum = diningCourtTimes[location].num;
        console.log("locationAvg: " + locationAvg + ", locationNum: " + locationNum);
        locationAvg = (locationAvg * locationNum + diff) / (++locationNum);
        diningCourtTimes[location].avgTime = locationAvg;
        diningCourtTimes[location].num = locationNum;

        userRef.update({
          "location": null,
          "checkInTime":-1,
          "diningCourtTimes":diningCourtTimes
        }).then(function() {
          response.send({
            "elapsedTime": diff
          })
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
})

//get the average times a user spends in each dining court
//PARAMETERS: userHandle
exports.getDiningCourtTimes = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if (userHandle == null) {
    throw new Error("Must pass 'userHandle' in body of request");
  }
  else {
    db.collection("User").doc(userHandle).get().then(function(doc) {
      var diningCourtTimes = doc.data().diningCourtTimes;
      if (diningCourtTimes == null) {
        diningCourtTimes = {
          "Earhart": {
            "avgTime":0,
            "num":0
          },
          "Ford": {
            "avgTime":0,
            "num":0
          },
          "Hillenbrand": {
            "avgTime":0,
            "num":0
          },
          "Wiley": {
            "avgTime":0,
            "num":0
          },
          "Windsor": {
            "avgTime":0,
            "num":0
          }
        }
        db.collection("User").doc(userHandle).update({
          "diningCourtTimes":diningCourtTimes
        })
        .then(function() {
          response.send(diningCourtTimes);
        });
      }
      else {
        response.send(diningCourtTimes);
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

// gets location
exports.getLocation = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null)
    throw new Error("Input data not valid!");

  var userRef = await db.collection("User").doc(userHandle).get().then(doc =>{
    if(!doc.exists)
      throw new Error("no such user");
    var userJSON = doc.data();
    response.send({location: userJSON['location']});
  });
})

// need name of dish, rating and userHandle
exports.addRating = functions.https.onRequest(async (request, response) => {
  var dish = request.body.dish;
  var rating = request.body.rating;
  var userHandle = request.body.userHandle;

  var error = "Input data not provided correctly!";
  if(dish == null || rating == null || userHandle ==  null)
    throw new Error(error);

  await ratings.setRating(dish, rating, userHandle);
  response.send("Set rating for: " + dish);
})

// needs name of dish
exports.getRating = functions.https.onRequest(async (request, resopnse) => {
  var dish = request.body.dish;

  var error = "Input data not provided correctly!";
  if(dish == null)
    throw new Error(error);

  var itemRef = db.collection('Dish').doc(dish);

  var getItem = await itemRef.get().then(async doc => {
      if (!doc.exists) {
          console.log("No such dish exists mate!");
      } else {
          console.log("Getting rating of: " + dish);
          var itemJSON = await doc.data();
          var totalScore = itemJSON['totalScore'];
          var totalVotes = itemJSON['totalVotes'];
          console.log("Total score, Total votes: "+totalScore+", "+totalVotes);
          var itemRating = Number(Number(totalScore) / Number(totalVotes));
          console.log("Thus avg score is: "+itemRating);
          resopnse.send({rating: itemRating});
      }
  }).catch(err => {
      throw new Error(err);
  });

})

//get the list of dish court ratings from a user
//PARAMETERS: userHandle
exports.getUserDishRatings = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if (userHandle == null) {
    throw new Error("incorrect parameters");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        userRef.collection("ItemRatings").get().then(function(querySnapshot) {
          var ItemRatingsArray = [];
          querySnapshot.forEach(function(itemRatingDoc) {
            ItemRatingsArray.push(itemRatingDoc.data());
          });
          console.log("inf func: "+ItemRatingsArray);
          response.send(ItemRatingsArray);
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
      else {
        throw new Error("user does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

// this function fetches the timings for dining courts on a particular day
// PARAMETERS: date (as a string "YYYY-MM-DD")
exports.fetchDiningTimes = functions.https.onRequest(async (request, response)=>{
  var date = request.body.date;

  if(date == null){
    // sets as default for testing
    var error = "No date provided!";
    throw new Error(error);
    return;
  }

  console.log("Querying data");
	var docRef = await db.collection("DateTimes").doc(date);
	var getDishes = await docRef.get().then(
		doc => {
			if(!doc.exists){
				//response.send({error: "No such data in Database. Please populate with given date."});
        throw new Error("No such data in Database. Please populate with given data.");
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
    var today = new Date();
    today.setDate(today.getDate() + 7);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = yyyy+"-"+mm+"-"+dd;
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
    var error = "No date provided!";
    throw new Error(error);
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
    var error = "No meal name provided!";
    throw new Error(error);
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
    var today = new Date();
    today.setDate(today.getDate() + 7);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = yyyy+"-"+mm+"-"+dd;
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
    var today = new Date();
    today.setDate(today.getDate() + 7);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = yyyy+"-"+mm+"-"+dd;
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
    await db.collection("DateDishes").doc(date).set(allCourts);
  }

  var data = []
  for(var i = 0; i< locations.length; i++){
    data.push(await getData(url, locations[i]));
  }
  var updated = await updateDatabase(data);
  console.log("done");
  response.send("Finished Population for "+date);
});

//function to report a malfunction
//PARAMETERS: diningCourt, malfunction
exports.reportMalfunction = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var diningCourt = request.body.diningCourt;
  var malfunction = request.body.malfunction;

  if (userHandle == null || diningCourt == null || malfunction == null) {
    throw new Error("must pass 'userHandle' and 'diningCourt' and 'malfunction' in body of request");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
          var userMalfunctionReportsRef = userRef.collection("malfunctionReports").doc(diningCourt);
          userMalfunctionReportsRef.get().then(function(doc) {
            if (doc.exists) {
              var reportsArr = doc.data().reports;
              for(var i = 0; i < reportsArr.length; i++) {
                if (reportsArr[i] == malfunction) {
                  throw new Error("user already reported that malfunction");
                }
              }

              userMalfunctionReportsRef.update({
                "reports": admin.firestore.FieldValue.arrayUnion(malfunction)
              })
              .then(function() {
                var diningCourtRef = db.collection("DiningCourt").doc(diningCourt).collection("malfunctionReports").doc(malfunction);
                diningCourtRef.get().then(function(doc) {
                  if (doc.exists) {
                    var newNumOfReports = ++(doc.data().numOfReports);
                    diningCourtRef.update({
                      "reportedBy": admin.firestore.FieldValue.arrayUnion(userHandle),
                      "numOfReports": newNumOfReports
                    })
                    .then(function() {
                      response.send({
                        "success":true
                      })
                    })
                    .catch(function(error) {
                      throw new Error(error);
                    });
                  }
                  else {
                    var newNumOfReports = 1;
                    diningCourtRef.set({
                      "malfunction": malfunction,
                      "reportedBy": admin.firestore.FieldValue.arrayUnion(userHandle),
                      "numOfReports": newNumOfReports
                    })
                    .then(function() {
                      response.send({
                        "success":true
                      })
                    })
                    .catch(function(error) {
                      throw new Error(error);
                    });
                  }
                })
                .catch(function(error) {
                  throw new Error(error);
                });
              })
              .catch(function(error) {
                throw new Error(error);
              });
            }
            else {
              userMalfunctionReportsRef.set({
                "diningCourt":diningCourt,
                "reports":[malfunction]
              })
              .then(function() {
                var diningCourtRef = db.collection("DiningCourt").doc(diningCourt).collection("malfunctionReports").doc(malfunction);
                diningCourtRef.get().then(function(doc) {
                  if (doc.exists) {
                    var newNumOfReports = ++(doc.data().numOfReports);
                    diningCourtRef.update({
                      "reportedBy": admin.firestore.FieldValue.arrayUnion(userHandle),
                      "numOfReports": newNumOfReports
                    })
                    .then(function() {
                      response.send({
                        "success":true
                      })
                    })
                    .catch(function(error) {
                      throw new Error(error);
                    });
                  }
                  else {
                    var newNumOfReports = 1;
                    diningCourtRef.set({
                      "malfunction": malfunction,
                      "reportedBy": admin.firestore.FieldValue.arrayUnion(userHandle),
                      "numOfReports": newNumOfReports
                    })
                    .then(function() {
                      response.send({
                        "success":true
                      })
                    })
                    .catch(function(error) {
                      throw new Error(error);
                    });
                  }
                })
                .catch(function(error) {
                  throw new Error(error);
                });
              })
              .catch(function(error) {
                throw new Error(error);
              });
            }
          })
          .catch(function(error) {
            throw new Error(error);
          });
      }
      else {
          throw new Error("user does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//remove all malfunction reports, used to reset everything each day
//PARAMETERS: N/A
exports.clearMalfunctionReports = functions.https.onRequest(async (request, response) => {
  var diningRef = db.collection("DiningCourt");
  await diningRef.get().then(async function(querySnapshot) {
    await querySnapshot.forEach(async function(diningCourtdoc) {
      var diningCourt = diningCourtdoc.data().diningCourt;
      console.log(diningCourt);
      var diningCourtRef = diningRef.doc(diningCourt).collection("malfunctionReports");
      await diningCourtRef.get().then(async function(querySnapshot) {
        await querySnapshot.forEach(async function(malfunctionReportdoc) {
          var reportedByArr = malfunctionReportdoc.data().reportedBy;
          for(var i = 0; i < reportedByArr.length; i++) {
            console.log(reportedByArr[i]);
            var userRef = db.collection("User").doc(reportedByArr[i]).collection("malfunctionReports")
            await userRef.get().then(async function(querySnapshot) {
              await querySnapshot.forEach(async function(userMalfunctionReportsdoc) {
                var diningCourtName = userMalfunctionReportsdoc.data().diningCourt;
                await userRef.doc(diningCourtName).update({
                  "reports":[]
                })
                .catch(function(error) {
                  throw new Error(error);
                });
              });
            })
            .catch(function(error) {
              throw new Error(error);
            });
          }

          var malfunctionName = malfunctionReportdoc.data().malfunction;
          await diningCourtRef.doc(malfunctionName).update({
            "numOfReports":0,
            "reportedBy":[]
          })
          .catch(function(error) {
            throw new Error(error);
          });
        });
      })
      .catch(function(error) {
        throw new Error(error);
      });
    });
  })
  .catch(function(error) {
    throw new Error(error);
  });

  response.send({
    "success":true
  });
});

//get all malfunctions from a diningCourt
//PARAMETERS: diningCourt
exports.getMalfunctionReports = functions.https.onRequest((request, response) => {
  var diningCourt = request.body.diningCourt;

  if (diningCourt == null) {
    throw new Error("must pass 'diningCourt' in body of request");
  }
  else {
    db.collection("DiningCourt").doc(diningCourt).collection("malfunctionReports").get().then(function(querySnapshot) {
      var malfunctions = [];
      querySnapshot.forEach(function(doc) {
        malfunctions.push({
          "malfunction":doc.data().malfunction,
          "numOfReports":doc.data().numOfReports
        });
      });
      response.send(malfunctions);
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//add dietary restrictions to a user
//Parameters: userHandle, dietaryRestriction
exports.addDietaryRestriction = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var dietaryRestriction = request.body.dietaryRestriction;

  //ensure proper parameters
  if (userHandle == null || dietaryRestriction == null) {
    throw new Error("need to pass 'userHandle' and 'dietaryRestriction' in body");
  }
  else {
    db.collection("User").doc(userHandle).update({
      dietaryRestrictions: admin.firestore.FieldValue.arrayUnion(dietaryRestriction)
    })
    .then(function() {
      response.send("success");
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//set dietary restrictions to a user
//Parameters: userHandle, dietaryRestrictionArray
exports.setDietaryRestrictions = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var dietaryRestrictionArray = request.body.dietaryRestrictionArray;

  if (userHandle == null || dietaryRestrictionArray == null) {
    throw new Error("need to pass 'userHandle' and 'dietaryRestrictionArray' in body");
  }
  else {
    db.collection("User").doc(userHandle).update({
      dietaryRestrictions: dietaryRestrictionArray
    })
    .then(function() {
      response.send({
        "success":true
      });
    })
    .catch(function(error) {
      throw new Error(error);
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
      throw new Error(err);
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
    throw new Error("need to pass 'userHandle' and 'dietaryRestriction' in body");
  }
  else {
    db.collection("User").doc(userHandle).update({
      dietaryRestrictions: admin.firestore.FieldValue.arrayRemove(dietaryRestriction)
    })
    .then(function() {
      response.send("success");
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//get a user handle from a uid
//PARAMETERS: uid
exports.getUserHandle = functions.https.onRequest((request, response) => {
  var uid = request.body.uid;
  console.log(uid);

  if (uid == null) {
    throw new Error("uid not passed in");
  }
  else {
    var userRef = db.collection("User");
    var query = userRef.where("uid", "==", uid).limit(1)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.empty) {
        throw new Error("user does not exist in database");
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
      throw new Error(error);
    });
  }
});

//change user's location tracking preference
//PARAMETERS: userHandle
exports.toggleLocationTracking = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if (userHandle == null) {
    throw new Error("must pass 'userHandle' in body of request");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        var locationTracking = doc.data().locationTracking;
        if (locationTracking == null) {
          locationTracking = true;
        }
        else {
          locationTracking = !locationTracking;
        }
        userRef.update({"locationTracking":locationTracking}).then(function() {
          response.send({
            "success":true
          });
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
      else {
        throw new Error("user does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//get a user's location tracking preference
//PARAMETERS: userHandle
exports.getLocationTracking = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if (userHandle == null) {
    throw new Error("Must pass 'userHandle' in body of request");
  }
  else {
    db.collection("User").doc(userHandle).get().then(function(doc) {
      if (doc.exists) {
        var locationTracking = doc.data().locationTracking;
        if (locationTracking == null) {
          locationTracking = false;
        }
        response.send({
          "locationTracking":locationTracking
        });
      }
      else {
        throw new Error("user does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
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
    throw new Error("Must pass uid in body of request");
  }
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }
  if (userName == null) {
    throw new Error("Must pass userName in body of request");
  }

  admin.auth().getUser(uid)
  .then(function(userRecord) {
    console.log("Successfully fetched user data:", userRecord.toJSON());
    checkUserExists(userHandle);
  })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
    throw new Error(error);
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
    throw new Error("user already exists");
  }

  function addUser() {
    var updatedUser = {
      uid: uid,
      userName: userName,
      userHandle: userHandle,
      image: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      groups: [],
      dietaryRestrictions: [],
      friends: [],
      blockedUsers: [],
      outgoingFriendReq: [],
      incomingFriendReq: [],
      incomingGroupInvites: [],
      status: 0,
      notifications: [],
      events: [],
      diningCourtTimes: {
        "Earhart": {
          "avgTime":0,
          "num":0
        },
        "Ford": {
          "avgTime":0,
          "num":0
        },
        "Hillenbrand": {
          "avgTime":0,
          "num":0
        },
        "Wiley": {
          "avgTime":0,
          "num":0
        },
        "Windsor": {
          "avgTime":0,
          "num":0
        }
      }
    };
    db.collection("User").doc(userHandle).set(updatedUser).then(function() {
      console.log("User successfully added!");
      response.send("success");
    }).catch(function(error) {
      console.error("Error adding user: ", error);
      throw new Error(error);
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
    throw new Error("Must pass userHandle in request");
  }
  else {
    db.collection("User").doc(userHandle).get().then(doc => {
      response.send(doc.data().friends);
    }).catch(function(error){
      console.error("Error getting list");
      throw new Error(error);
    });
  }
});

//remove a friend from a user
//PARAMETERS: userHandle, friendHandle
exports.removeFriend = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  var friendHandle = request.body.friendHandle;
  console.log(friendHandle);

  if(userHandle == null || friendHandle == null) {
    throw new Error("Must pass userHandle and friendHandle in request");
  }
  else {
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
      throw new Error(error);
    });

    friendDoc.update({
      friends: admin.firestore.FieldValue.arrayRemove(userObj),
      notifications: admin.firestore.FieldValue.arrayUnion(notification)
    }).then(function(){
      response.send("success");
    }).catch(function(error){
      console.error("Error removing user from friend");
      throw new Error(error);
    });
  }
});

//remove a user from all Friends
//PARAMETERS: userHandle
exports.removeFromAllFriends = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);

  if(userHandle == null){
    throw new Error("Must pass userHandle in request");
  }
  else {
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
      throw new Error(error);
    });
    response.send("success");
  }
});

//remove user from database
//PARAMETERS: userHandle
exports.removeUserFromDatabase = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }
  else {
    db.collection("User").doc(userHandle).delete({recursive: true}).then(function() {
      console.log("User successfully deleted!");
      response.send("success");
    }).catch(function(error) {
      throw new Error(error);
    });
  }
});

//get user profile information
//PARAMETERS: userHandle
exports.getUserProfile = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
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
      throw new Error("User does not exist");
    } else {
      console.log('Document data:', doc.data());
      response.send(doc.data());
    }
  })
  .catch(err => {
    throw new Error(err);
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

//set profile picture downloadURL
//PARAMETERS: userHandle, downloadURL
exports.setProfilePic = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var downloadURL = request.body.downloadURL;

  //don't check downloadURL since it can be null
  if (userHandle == null) {
    throw new Error("Must pass 'userHandle' in body of request");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        userRef.update({
          "profilePicDownloadURL":downloadURL
        })
        .then(function() {
          response.send({
            "success":true
          });
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
      else {
        throw new Error("User does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//get profile picture downloadURL
//PARAMETERS: userHandle
exports.getProfilePic = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if (userHandle == null) {
    throw new Error("Must pass 'userHandle' in body of request");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        response.send({
          "downloadURL":doc.data().profilePicDownloadURL
        });
      }
      else {
        throw new Error("User does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    })
  }
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
      throw new Error("blockedHandle does not exist in database");
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
      throw new Error("userHandle does not exist in database");
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
        console.error("Error removing friend from user");
        throw new Error("Error removing friend from user");
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
        console.error("Error removing user from friend");
        throw new Error(error);
      });
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      throw new Error(error);
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
      throw new Error("blockedHandle does not exist in database");
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
      throw new Error("userHandle does not exist in database");
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
      throw new Error(error);
    });
  }
});

//get blocked users
//PARAMETERS: userHandle
exports.getBlockedUsers = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null){
    throw new Error("Must pass userHandle into body of request");
  }
  else {
    db.collection("User").doc(userHandle).get().then(doc => {
      response.send(doc.data().blockedUsers);
    }).catch(function(error){
      throw new Error(error);
    });
  }
});

//check if a user exists
//PARAMETERS: userHandle
exports.userExists = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);

  db.collection("User").doc(userHandle).get().then(doc => {
    if(!doc.exists){
      //not sure if this needs to throw an error
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
    throw new Error("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    throw new Error("Must pass friendHandle in body of request");
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
      throw new Error("Friend handle is not valid");
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
        if(blockedUsers[i].blockedHandle==userHandle) {
          throw new Error("You cannot add a user who has blocked you.");
        }
      }
      var oFR = doc.data().outgoingFriendReq;
      for(var i = 0; i < oFR.length; i++){
        if(oFR[i].friendHandle==userHandle){
          throw new Error("You cannot send a friend request to someone who has sent you a friend request.");
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
          throw new Error(error);
        });
        var notification = {type: "new friend request", id: userObj};
        friendDoc.update({
          incomingFriendReq: admin.firestore.FieldValue.arrayUnion(userObj),
          notifications: admin.firestore.FieldValue.arrayUnion(notification)
        }).then(function() {
          response.send("success");
        }).catch(function(error) {
          throw new Error(error);
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
    throw new Error("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    throw new Error("Must pass friendHandle in body of request");
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
  var notification = {type: "new friend", id: userObj}

  friendDoc.update({
    outgoingFriendReq: admin.firestore.FieldValue.arrayRemove(userObj),
    friends: admin.firestore.FieldValue.arrayUnion(userObj),
    blockedUsers: admin.firestore.FieldValue.arrayRemove(blockObj),
    notifications: admin.firestore.FieldValue.arrayUnion(notification)
  }).then(function(){
    response.send("success");
  }).catch(function(error){
    throw new Error(error);
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
    throw new Error("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    throw new Error("Must pass friendHandle in body of request");
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
    throw new Error("Must pass userHandle in body of request");
  }

  var userDoc = db.collection("User").doc(userHandle);

  userDoc.get().then(doc => {
    response.send(doc.data().incomingFriendReq);
  }).catch(function(error){
    console.error("Error getting list");
    throw new Error(error);
  });
});

//returns a list of friend requests the user has sent
//PARAMETERS: userHandle
exports.getOutgoingFriendRequests = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  if(userHandle == null){
    throw new Error("Must pass userHandle in body of request");
  }

  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().outgoingFriendReq);
  }).catch(function(error){
    console.error("Error getting list");
    throw new Error(error);
  });
});

//Updates the users status in the database
//Statuses:
//  0 - Available
//  1 - Eating
//  2 - Busy
//PARAMETERS: userHandle, status
exports.setUserStatus = functions.https.onRequest((request, response) =>{
  var name = request.body.userHandle;
  var status = request.body.status;

  console.log(name);
  console.log(status);

  if(name == null || status == null){
    throw new Error("incorrect parameters");
  }

  db.collection("User").doc(name).update({
    status: status
  }).then(function(){
    console.log("Status updated.");
    response.send("success");
  }).catch(function(error){
    console.error("Error updating status: ", error);
    throw new Error(error.message);
  });
});

//Retrieves the user's current status
//PARAMETERS: userHandle
exports.getUserStatus = functions.https.onRequest((request, response) => {
  var name = request.body.userHandle;

  console.log(name);

  if(name == null){
    throw new Error("incorrect parameters");
  }

  db.collection("User").doc(name).get().then(doc => {
    response.send(doc.data().status.toString());
  }).catch(function(error){
    console.error("Error getting user status: ", error);
    throw new Error(error.message);
  });
});

//PARAMETERS: userHandle, groupName
exports.createGroup = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var groupName = request.body.groupName;
  console.log(userHandle);
  console.log(groupName);
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }
  if (groupName == null) {
    throw new Error("Must pass groupName in body of request");
  }

  //get the creator's name
  db.collection("User").doc(userHandle).get().then(doc => {
    var userName = doc.data().userName;

    //add the group to the database
    db.collection("Group").add({
      memberHandles: [userHandle],
      memberObjects: [{userHandle: userHandle, userName: userName}],
      messages: [],
      groupName: groupName,
      numMessages: 0,
      events: []
    }).then(function(docRef){
      console.log("Document written with ID: ", docRef.id);

      //add the group to the user
      db.collection("User").doc(userHandle).update({
        groups: admin.firestore.FieldValue.arrayUnion(docRef.id)
      }).then(function() {
        response.send(docRef.id);
      });
    }).catch(function(error){
      throw new Error(error);
    });
  }).catch(function(error){
    throw new Error(error);
  });
});

//PARAMETERS: groupID
exports.getUsersInGroup = functions.https.onRequest((request, response) => {
  var groupID = request.body.groupID;
  console.log(groupID);
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
  }

  //return userHandles and userNames
  db.collection("Group").doc(groupID).get().then(doc => {
    response.send(doc.data().memberObjects);
  }).catch(function(error){
    throw new Error(error);
  });
});

//PARAMETERS: userHandle, friendHandle, groupID, groupName
exports.inviteToGroup = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    throw new Error("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
  }

  var friendDoc = db.collection("User").doc(friendHandle);
  var userDoc = db.collection("User").doc(userHandle);

  var groupName;
  await db.collection("Group").doc(groupID).get().then(async doc => {
    groupName = await doc.data().groupName;
  });

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
        throw new Error("Not friends");
      }
    }
    //else{
      //check if the user is already in the group
      friendDoc.get().then(fDoc => {
        if(fDoc.data().groups.indexOf(groupID) > -1){
          throw new Error("The user is already in this group");
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
            throw new Error(error);
          });
        }
      });
    //}
  });
});

//PARAMETERS: userHandle, groupID, friendHandle
exports.acceptGroupInvitation = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);

  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    throw new Error("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
  }

  var groupName;
  await db.collection("Group").doc(groupID).get().then(async doc => {
    groupName = await doc.data().groupName;
  });

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
        throw new Error(error);
      });
    }).catch(function(error){
      throw new Error(error);
    });
  }).catch(function(error) {
    throw new Error(error);
  });
});

//PARAMETERS: userHandle, friendHandle, groupID
exports.denyGroupInvitation = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(groupID);

  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }
  if (friendHandle == null) {
    throw new Error("Must pass friendHandle in body of request");
  }
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
  }

  var groupName;
  await db.collection("Group").doc(groupID).get().then(async doc => {
    groupName = await doc.data().groupName;
  });

  //remove the group from the user's incomingGroupInvites list
  db.collection("User").doc(userHandle).update({
    incomingGroupInvites: admin.firestore.FieldValue.arrayRemove({friendHandle: friendHandle, groupID: groupID, groupName: groupName})
  }).then(function() {
    response.send("success");
  }).catch(function(error){
    throw new Error(error);
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
    throw new Error("Must pass userHandle in body of request");
  }
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
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
        throw new Error(error);
      });
    }
    else{
      await groupDoc.update({
        memberHandles: admin.firestore.FieldValue.arrayRemove(userHandle),
        memberObjects: admin.firestore.FieldValue.arrayRemove({userHandle: userHandle, userName: userName})
      }).catch(function(error){
        throw new Error(error);
      }).then(async function(){
        var groupName = await doc.data().groupName;
        var notification = {type: "user left group", id: {userHandle: userHandle, groupName: groupName, groupID: groupID}};
        //send a notification to all members in the group
        var userCol = db.collection("User");
        var members = doc.data().memberHandles;

        for(var i = 0; i < members.length; i++){
          userCol.doc(members[i]).update({
            notifications: admin.firestore.FieldValue.arrayUnion(notification)
          }).catch(function(error){
            console.log(error.message);
            throw new Error(error);
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
    throw new Error(error);
  });
});

//returns an array of strings which is the list of groupIDs which the user has been invited to
//PARAMETERS: userHandle
exports.getGroupInvites = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }

  //return groupID's
  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().incomingGroupInvites);
  }).catch(function(error){
    throw new Error(error);
  });
});

//returns an array of strings which is the list of groupIDs which the user is a part of
//PARAMETERS: userHandle
exports.getGroups = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  console.log(userHandle);
  if (userHandle == null) {
    throw new Error("Must pass userHandle in body of request");
  }

  //return groupID's
  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().groups);
  }).catch(function(error){
    throw new Error(error);
  });
});

//PARAMETERS: groupID
exports.getGroup = functions.https.onRequest((request, response) =>{
  var groupID = request.body.groupID;
  console.log(groupID);
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
  }

  var groupDoc = db.collection("Group").doc(groupID);

  groupDoc.get().then(doc => {
    response.send(doc.data());
  }).catch(function(error){
    throw new Error(error);
  });
});

//deletes the group
//PARAMETERS: groupID
exports.deleteGroup = functions.https.onRequest(async (request, response) => {
  var groupID = request.body.groupID;
  console.log(groupID);
  if (groupID == null) {
    throw new Error("Must pass groupID in body of request");
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
        throw new Error(error);
      });
    }

    //delete the document for the group
    groupDoc.delete().then(function() {
      response.send("success");
    }).catch(function(error){
      throw new Error(error);
    })
  }).catch(function(error){
    throw new Error(error);
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
      console.log(notifications);
      response.send(notifications);
    }).catch(function(error){
      response.send("error");
    });
  }).catch(function(error){
    response.send("error");
    return;
  });
});

//changes the name of a group
//PARAMETERS: groupID, groupName
exports.changeGroupName = functions.https.onRequest((request, response) => {
  var groupID = request.body.groupID;
  var groupName = request.body.groupName;

  if(groupID == null || groupName == null){
    throw new Error("incorrect parameters");
  }
  else{
    var group = db.collection("Group").doc(groupID);
    group.update({
      "groupName":groupName
    }).then(function(){
      response.send("success");
    }).catch(function(error){
      throw new Error(error.message);
    });
  }
});

//rate a dining courts
//PARAMETERS: userHandle, diningCourt, rating
exports.rateDiningCourt = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var diningCourt = request.body.diningCourt;
  var rating = request.body.rating;

  //check for errors
  if (userHandle == null || diningCourt == null || rating == null) {
    throw new Error("incorrect parameters");
  }
  else {
    //update dining court aggregate rating
    var dRef = db.collection("DiningCourt").doc(diningCourt);
    dRef.get().then(doc => {
      if(!doc.exists) {
        throw new Error("doc does not exist");
      }
      else {
        //add rating to user profile
        var userDiningRef = db.collection("User").doc(userHandle).collection("diningCourtRatings").doc(diningCourt);
        userDiningRef.get().then(ratingDoc => {
          if (!ratingDoc.exists) {
            //the rating does not already exist
            var n = doc.data().n;
            var aggregateRating = doc.data().rating;

            //update the aggregateRating
            aggregateRating = (aggregateRating * n + rating) / (++n);

            //update the dining court rating
            dRef.update({
              "n":n,
              "rating":aggregateRating
            })
            .then(function() {
              userDiningRef.set({
                "diningCourt":diningCourt,
                "rating":rating
              })
              .then(function() {
                response.send({
                  "success":true
                })
              })
              .catch(function(error) {
                throw new Error(error);
              });
            })
            .catch(function(error) {
              throw new Error(error);
            });
          }
          else {
            var r = ratingDoc.data().rating;

            //the rating exists already
            var n = doc.data().n;
            var aggregateRating = doc.data().rating;

            //update the aggregateRating
            aggregateRating = (aggregateRating * n - r + rating) / (n);

            //update the dining court rating
            dRef.update({
              "n":n,
              "rating":aggregateRating
            })
            .then(function() {
              userDiningRef.update({
                "diningCourt":diningCourt,
                "rating":rating
              })
              .then(function() {
                response.send({
                  "success":true
                })
              })
              .catch(function(error) {
                throw new Error(error);
              });
            })
            .catch(function(error) {
              throw new Error(error);
            });
          }
        });
      }
    });
  }
});

//remove a rating from a dining court
//PARAMETERS: userHandle, diningCourt
exports.removeDiningCourtRating = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;
  var diningCourt = request.body.diningCourt;

  if (userHandle == null || diningCourt == null) {
    throw new Error("incorrect parameters");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        userRef.collection("diningCourtRatings").doc(diningCourt).get().then(function(diningCourtDocument) {
          if (diningCourtDocument.exists) {
            var dRef = db.collection("DiningCourt").doc(diningCourt);
            dRef.get().then(function(dRatingDoc) {
              var aggregateRating = dRatingDoc.data().rating;
              var n = dRatingDoc.data().n;
              var r = diningCourtDocument.data().rating;

              aggregateRating = (aggregateRating * n - r) / (--n);

              if (n == 0) {
                aggregateRating = 0;
              }

              dRef.update({
                "n":n,
                "rating":aggregateRating
              })
              .then(function() {
                userRef.collection("diningCourtRatings").doc(diningCourt).delete().then(function() {
                  response.send({
                    "success":true
                  });
                })
                .catch(function(error) {
                  throw new Error(error);
                })
              })
              .catch(function(error) {
                throw new Error(error);
              });

            })
            .catch(function(error) {
              throw new Error(error);
            });
          }
          else {
            throw new Error("rating does not exist");
          }
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
      else {
        throw new Error("user does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//get the list of dining court ratings from a user
//PARAMETERS: userHandle
exports.getDiningCourtRatings = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle

  if (userHandle == null) {
    throw new Error("incorrect parameters");
  }
  else {
    var userRef = db.collection("User").doc(userHandle);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        userRef.collection("diningCourtRatings").get().then(function(querySnapshot) {
          var diningCourtRatingsArr = [];
          querySnapshot.forEach(function(diningCourtDoc) {
            diningCourtRatingsArr.push(diningCourtDoc.data());
          });
          response.send(diningCourtRatingsArr);
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
      else {
        throw new Error("user does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//get the list of aggregate dining court ratings
//PARAMETERS: diningCourt
exports.getAggregateDiningCourtRatings = functions.https.onRequest((request, response) => {
  var diningCourt = request.body.diningCourt;
  console.log(diningCourt);

  if(diningCourt == null){
    throw new Error("incorrect parameters");
    return;
  }

  dRef = db.collection("DiningCourt").doc(diningCourt);;
  dRef.get().then(doc => {
    response.send(doc.data().rating.toString());
  })
  .catch(function(error) {
    throw new Error(error);
  });
});

//add a busyness report to a dining court
//PARAMETERS: busyness, diningCourt
exports.reportBusyness = functions.https.onRequest((request, response) => {
  var busyness = request.body.busyness;
  var diningCourt = request.body.diningCourt;
  console.log(busyness);
  console.log(diningCourt);
  if(busyness == null || diningCourt == null){
    throw new Error("incorrect parameters");
    return;
  }

  var dRef = db.collection("DiningCourt").doc(diningCourt);
  dRef.get().then(doc => {
    if(!doc.exists) {
      throw new Error("doc does not exist");
    }
    else {
          var n = doc.data().numBusyReps;
          var newBusyReps = doc.data().newBusyReps;
          var aggregateRating = doc.data().busyness;
          var newBusyTotal = doc.data().newBusyTotal;

          //update the aggregateRating
          aggregateRating = aggregateRating + busyness;
          newBusyTotal = newBusyTotal + busyness;
          n++;
          newBusyReps++;

          //update the dining court rating
          dRef.update({
            "numBusyReps":n,
            "newBusyReps":newBusyReps,
            "busyness":aggregateRating,
            "newBusyTotal":newBusyTotal
          })
          .then(function() {
            response.send({
                "success":true
            });
          })
          .catch(function(error) {
            throw new Error(error);
          });
    }
  });
});

//gets the busyness reports and removes outdated ones
//PARAMETERS: diningCourt
exports.getBusyness = functions.https.onRequest(async (request, response) => {
  var diningCourt = request.body.diningCourt;
  console.log(diningCourt);
  if(diningCourt == null){
    throw new Error("incorrect parameters");
    return;
  }

  var dRef = db.collection("DiningCourt").doc(diningCourt);
  dRef.get().then(doc => {
    if(!doc.exists) {
      throw new Error("doc does not exist");
    }
    else {
          var n = doc.data().numBusyReps;
          var aggregateRating = doc.data().busyness;

          if(n == 0){
            response.send("No ratings");
          }
          else{
            //return the busyness rating
            var num = Math.floor(aggregateRating/n);
            response.send(num.toString());
          }
    }
  });
});

exports.clearBusyness = functions.https.onRequest((request, response) => {
  var courtCol = db.collection("DiningCourt");

  //Earhart
  console.log("Earhart");
  var earhart = courtCol.doc("Earhart");
  earhart.get().then(doc => {
    var len = doc.data().newBusyReps;
    var newBusyTotal = doc.data().newBusyTotal;
    earhart.update({
      "busyness": newBusyTotal,
      "newBusyTotal": 0,
      "numBusyReps": len,
      "newBusyReps": 0
    }).then(function(){
      //Ford
      console.log("Ford");
      var ford = courtCol.doc("Ford");
      ford.get().then(doc => {
        len = doc.data().newBusyReps;
        newBusyTotal = doc.data().newBusyTotal;
        ford.update({
          "busyness": newBusyTotal,
          "newBusyTotal": 0,
          "numBusyReps": len,
          "newBusyReps": 0
        }).then(function(){
          //Hillenbrand
          console.log("Hillenbrand");
          var hillenbrand = courtCol.doc("Hillenbrand");
          hillenbrand.get().then(doc => {
            len = doc.data().newBusyReps;
            newBusyTotal = doc.data().newBusyTotal;
            hillenbrand.update({
              "busyness": newBusyTotal,
              "newBusyTotal": 0,
              "numBusyReps": len,
              "newBusyReps": 0
            }).then(function(){
              //Wiley
              console.log("Wiley");
              var wiley = courtCol.doc("Wiley");
              wiley.get().then(doc => {
                len = doc.data().newBusyReps;
                newBusyTotal = doc.data().newBusyTotal;
                wiley.update({
                  "busyness": newBusyTotal,
                  "newBusyTotal": 0,
                  "numBusyReps": len,
                  "newBusyReps": 0
                }).then(function(){
                  //Windsor
                  console.log("Windsor");
                  var windsor = courtCol.doc("Windsor");
                  windsor.get().then(doc => {
                    len = doc.data().newBusyReps;
                    newBusyTotal = doc.data().newBusyTotal;
                    windsor.update({
                      "busyness": newBusyTotal,
                      "newBusyTotal": 0,
                      "numBusyReps": len,
                      "newBusyReps": 0
                    }).then(function(){
                      response.send("success");
                    }).catch(function(error){
                      console.error(error.message);
                      response.send("error");
                    });
                  }).catch(function(error){
                    console.error(error.message);
                    response.send("error");
                  });
                }).catch(function(error){
                  console.error(error.message);
                  response.send("error");
                });
              }).catch(function(error){
                console.error(error.message);
                response.send("error");
              });
            }).catch(function(error){
              console.error(error.message);
              response.send("error");
            });
          }).catch(function(error){
            console.error(error.message);
            response.send("error");
          });
        }).catch(function(error){
          console.error(error.message);
          response.send("error");
        });
      }).catch(function(error){
        console.error(error.message);
        response.send("error");
      });
    }).catch(function(error){
      console.error(error.message);
      response.send("error");
    });
  }).catch(function(error){
    console.error(error.message);
    response.send("error");
  });
});

//Creates a poll for users to vote on a time and returns the messageID
//PARAMETERS: userHandle, expirationTime, groupID, timeOptions, meal
//expirationTime is a Date object               timeOptions is an array of times
exports.createPoll = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var expirationTime = request.body.expirationTime;
  var groupID = request.body.groupID;
  var timeOptions = request.body.timeOptions;
  var meal = request.body.meal;

  console.log(userHandle);
  console.log(expirationTime);
  console.log(groupID);
  console.log(timeOptions);
  console.log(meal);

  if(userHandle == null || expirationTime == null || groupID == null || timeOptions == null || meal == null){
    throw new Error("incorrect parameters");
    return;
  }

  if(timeOptions.length == 0){
    throw new Error("No time options.");
    return;
  }

  var groupDoc = db.collection("Group").doc(groupID);

  var numMessages;

  await groupDoc.get().then(async doc => {
    var groupName = await doc.data().groupName;
    numMessages = doc.data().numMessages;
    if(numMessages == null){
      numMessages = 0;
    }
    var notification = {type: "newPoll", id: {groupName: groupName, userHandle: userHandle, groupID: groupID, messageID: numMessages+1, meal: meal}};
    var userCol = db.collection("User");
    var members = doc.data().memberHandles;

    for(var i = 0; i < members.length; i++){
      if(members[i] == userHandle){
        continue;
      }
      userCol.doc(members[i]).update({
        notifications: admin.firestore.FieldValue.arrayUnion(notification)
      }).catch(function(error){
        console.log(error.message);
        throw new Error(error);
        return;
      });
    }
  });

  var votes = [];
  for(var i = 0; i < timeOptions.length; i++){
    votes.push({time: timeOptions[i], numVotes: 0});
  }

  var id = numMessages + 1;

  var poll = {userHandle: userHandle, expirationTime: expirationTime, timeOptions: timeOptions, votes: votes, messageID: id, voters: [], meal: meal, groupID: groupID};

  groupDoc.update({
    messages: admin.firestore.FieldValue.arrayUnion(poll),
    numMessages: id
  }).then(function(){
    console.log(id);
    response.send({messageID: id});
  }).catch(function(error){
    console.log(error.message);
    throw new Error(error);
    return;
  });
});

//Sends a users vote within a poll to the database
//PARAMETERS: userHandle, choiceIndex, groupID, messageID
exports.vote = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var choiceIndex = request.body.choiceIndex;
  var messageID = request.body.messageID;
  var groupID = request.body.groupID;

  console.log(userHandle);
  console.log(choiceIndex);
  console.log(messageID);
  console.log(groupID);

  if(userHandle == null || choiceIndex == null || messageID == null || groupID == null){
    throw new Error("incorrect parameters");
    return;
  }

  var groupDoc = db.collection("Group").doc(groupID);

  await groupDoc.get().then(async doc => {
    var messages = doc.data().messages;

    for(var i = 0; i < messages.length; i++){
      var message = messages[i];
      if(message.messageID == messageID){
        var voters = message.voters;
        for(var j = 0; j < voters.length; j++){
          if(userHandle == voters[j].name){
            messages[i].votes[voters[j].choice].numVotes--;
            messages[i].voters.splice(j, 1);

            break;
          }
        }
        messages[i].votes[choiceIndex].numVotes++;

        await messages[i].voters.push({name: userHandle, choice: choiceIndex});
            console.log(messages);

            groupDoc.update({
              "messages": messages
            }).then(function(){
              response.send({success: true});
            }).catch(function(error){
              console.error(error.message);
              throw new Error("error");
            });
        break;
      }
    }

  });
});

//returns all open poles in a group
//PARAMETERS: groupID
exports.getPolls = functions.https.onRequest((request, response) => {
  var groupID = request.body.groupID;

  console.log(groupID);

  if(groupID == null){
    throw new Error("incorrect parameters");
    return;
  }

  var groupDoc = db.collection("Group").doc(groupID);
  groupDoc.get().then(doc => {
    response.send(doc.data().messages);
  }).catch(function(error){
    throw new Error(error.message);
  });
});


exports.closePolls = functions.https.onRequest((request, response) => {
  var date = new Date();
  //loop through all groups
  var groupDoc = db.collection("Group");
  groupDoc.get().then(gDoc => {
    gDoc.forEach(function(doc){
      var messages = doc.data().messages;
      for(var i = 0; i < messages.length; i++){
        var message = messages[i];
        if(date.getTime() >= new Date(message.expirationTime).getTime()){
          //send a notification to the group members and remove the message
          var data = doc.data();
          var max = message.votes[0];
          var maxIndex = 0;
          for(var j = 1; j < message.votes.length; j++){
            if(message.votes[j] > max){
              max = message.votes[j];
              maxIndex = j;
            }
          }
          var groupID = doc.id;
          var messageID = message.messageID;

          var notification = {type: "closePoll", id: {groupName: data.groupName, time: message.timeOptions[maxIndex], groupID: groupID, messageID: messageID, meal: message.meal, diningCourt: "Hillenbrand"}};
          var userCol = db.collection("User");
          var eventCreated = {groupName: data.groupName, time: message.timeOptions[maxIndex], groupID: groupID, messageID: messageID, meal: message.meal, votes: message.votes, diningCourt: "Hillenbrand"};
          for(var j = 0; j < data.memberHandles.length; j++){
            userCol.doc(data.memberHandles[j]).update({
              notifications: admin.firestore.FieldValue.arrayUnion(notification),
              events: admin.firestore.FieldValue.arrayUnion(eventCreated)
            }).catch(function(error){
              console.log(error.message);
              throw new Error(error.message);
            });
          }
          groupDoc.doc(doc.id).update({
            events: admin.firestore.FieldValue.arrayUnion(eventCreated)
          });
          db.collection("Event").add({
            groupID: groupID,
            messageID: messageID,
            time: new Date(message.timeOptions[maxIndex]),
            users: data.memberHandles,
            event: eventCreated
          });

          //remove the message from the array
          messages.splice(i, 1);
          i--;
        }
      }
      groupDoc.doc(doc.id).update({
        "messages": messages
      }).then(function(){
        //response.send("success");
      }).catch(function(error){
        throw new Error(error.message);
      });
    });
  });
});

//returns the list of events for a user
//PARAMETERS: userHandle
exports.getUserEvents = functions.https.onRequest((request, response) => {
  var userHandle = request.body.userHandle;

  console.log(userHandle);

  if(userHandle == null){
    throw new Error("incorrect parameters");
    return;
  }

  db.collection("User").doc(userHandle).get().then(doc => {
    response.send(doc.data().events);
  }).catch(function(error){
    throw new Error(error.message);
  });
});

//removes events from the database when they need to be activated
exports.activateEvents = functions.https.onRequest(async (request, response) => {
  var eventsCol = db.collection("Event");
  var groupsCol = db.collection("Group");
  var userCol = db.collection("User");
  var date = new Date();

  await eventsCol.get().then( eCol =>{
    eCol.forEach(function(doc){
      var data = doc.data();
      var seconds = data.time._seconds;
      if(date.getTime()/1000 >= seconds){
        //remove the event from the group
        var group = data.groupID;
        groupsCol.doc(group).update({
          events: admin.firestore.FieldValue.arrayRemove(data.event)
        }).catch(function(error){
          throw new Error(error.message);
        });

        //remove the event from the users
        var users = data.users;
        for(var i = 0; i < users.length; i++){
          userCol.doc(users[i]).update({
            events: admin.firestore.FieldValue.arrayRemove(data.event),
            notifications: admin.firestore.FieldValue.arrayUnion({type: "eventStart", id: data.event})
          });
        }
        eventsCol.doc(doc.id).delete();
      }
    });
  }).catch(function(error){
    throw new Error(error.message);
  });

  response.send("success");
});

//invites friends to eat with the user
//PARAMETERS: userHandle, friendHandles, diningCourt
//                        friendHandles is an array of the friends
//      Disregard what follows: If you give me time as a date object, the notification will be returned as an object with a field _seconds which contains the total number of seconds in the date object. you should be able to use this to create a new date object    ex: "time":{"_seconds":1553626800,"_nanoseconds":0}
exports.inviteToEat = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandles = request.body.friendHandles;
  var diningCourt = request.body.diningCourt;
  //var time = request.body.time;

  console.log(userHandle);
  console.log(friendHandles);
  console.log(diningCourt);
  //console.log(time);

  if(userHandle == null || friendHandles == null || diningCourt == null){// || time == null){
    throw new Error("incorrect parameters");
    return;
  }

  var userCol = db.collection("User");

  var userName;
  await userCol.doc(userHandle).get().then(async doc => {
    userName = await doc.data().userName;
  });

  var notification = {type: "inviteToEat", id: {friendHandle: userHandle, friendName: userName, diningCourt: diningCourt}};//, time: time}};

  for(var i = 0; i < friendHandles.length; i++){
    userCol.doc(friendHandles[i]).update({
      notifications: admin.firestore.FieldValue.arrayUnion(notification)
    }).catch(function(error){
      throw new Error(error.message);
    });
  }

  response.send({success: true});
});

//requests a friend for the user to  eat with them
//PARAMETERS: userHandle, friendHandle
exports.requestToEat = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;

  console.log(userHandle);
  console.log(friendHandle);

  if(userHandle == null || friendHandle == null){
    throw new Error("incorrect parameters");
    return;
  }

  var userCol = db.collection("User");

  var userName;
  await userCol.doc(userHandle).get().then(async doc => {
    userName = await doc.data().userName;
  });

  var notification = {type: "requestToEat", id: {friendHandle: userHandle, friendName: userName}};

  userCol.doc(friendHandle).update({
    notifications: admin.firestore.FieldValue.arrayUnion(notification)
  }).then(function(){
    response.send({success: true});
  }).catch(function(error){
    throw new Error(error.message);
  });
});

//sends a user's response to an invite as a notification
//PARAMETERS: userHandle, friendHandle, accepted
exports.inviteToEatResponse = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var accepted = request.body.accepted;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(accepted);

  if(userHandle == null || friendHandle == null || accepted == null){
    throw new Error("incorrect parameters");
    return;
  }

  var userCol = db.collection("User");

  var userName;
  await userCol.doc(userHandle).get().then(async doc => {
    userName = await doc.data().userName;
  });

  var notification;
  if(accepted){
    notification = {type: "acceptedInvitationToEat", id: {friendHandle: userHandle, friendName: userName}};
  }
  else{
    notification = {type: "deniedInvitationToEat", id: {friendHandle: userHandle, friendName: userName}};
  }

  userCol.doc(friendHandle).update({
    notifications: admin.firestore.FieldValue.arrayUnion(notification)
  }).then(function(){
    response.send({success: true});
  }).catch(function(error){
    throw new Error(error.message);
  });
});

//sends a user's response to an invite as a notification
//PARAMETERS: userHandle, friendHandle, accepted
exports.requestToEatResponse = functions.https.onRequest(async (request, response) => {
  var userHandle = request.body.userHandle;
  var friendHandle = request.body.friendHandle;
  var accepted = request.body.accepted;

  console.log(userHandle);
  console.log(friendHandle);
  console.log(accepted);

  if(userHandle == null || friendHandle == null || accepted == null){
    throw new Error("incorrect parameters");
    return;
  }

  var userCol = db.collection("User");

  var userName;
  await userCol.doc(userHandle).get().then(async doc => {
    userName = await doc.data().userName;
  });

  var notification;
  if(accepted){
    notification = {type: "acceptedRequestToEat", id: {friendHandle: userHandle, friendName: userName}};
  }
  else{
    notification = {type: "deniedRequestToEat", id: {friendHandle: userHandle, friendName: userName}};
  }

  userCol.doc(friendHandle).update({
    notifications: admin.firestore.FieldValue.arrayUnion(notification)
  }).then(function(){
    response.send({success: true});
  }).catch(function(error){
    throw new Error(error.message);
  });
});
