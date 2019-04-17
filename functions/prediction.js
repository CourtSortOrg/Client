const functions = require('firebase-functions');

const admin = require('firebase-admin');

var db = admin.firestore();

var prediction = require('./prediction');

module.exports = {
    // PARAMETERS: (dish name, rating, userHandle)
    // adds a new rating
    getUserPrediction: async function(userHandle, date, meal, returnAll){
        var userDishRatings = [];
  
        // get the users dish ratings
        var userRef = db.collection("User").doc(userHandle);
        await userRef.get().then(async function(doc) {
          if (doc.exists) {
            await userRef.collection("ItemRatings").get().then(function(querySnapshot) {
              querySnapshot.forEach(async function(itemRatingDoc) {
                await userDishRatings.push(itemRatingDoc.data());
              });
              //console.log("all dish ratings: " +userDishRatings);
            })
            .catch(function(error) {
              throw new Error(error);
            });
          }
        })
        .catch(function(error) {
          throw new Error(error);
        });
        
        var ratedDishOfferings = [];
        for(var i=0; i<userDishRatings.length; i++){
          var ratingObj = userDishRatings[i];
          //console.log(i+"th rating: "+ratingObj['dish']);
          var dishRef = db.collection("Dish").doc(ratingObj['dish']);
          await dishRef.get().then(function(doc){
            var dishOffering = [];
            try{
              dishOffering = doc.data().offered;
            } catch(error){
              console.log("no offered array for this!");
            }
            ratedDishOfferings.push({Name: ratingObj['dish'], offered: dishOffering, rating: ratingObj['rating']});
          })
        }
      
        function addToMatches(currDish, offeredObj){
          return offeredObj['date'] == date && offeredObj['meal'] == meal;
        };
      
        // get an array of dishes the user has rated that are served for this particular meal and date
        var matches = [];
        for(var i = 0; i<ratedDishOfferings.length; i++){
          var currDish = ratedDishOfferings[i];
          for(var j = 0; j<currDish['offered'].length; j++){
            var offeredObj = currDish['offered'][j];
            if(addToMatches(currDish, offeredObj)){
              matches.push({Name: currDish['Name'], location: offeredObj['location'], rating: currDish['rating']});
            }
          }
        }
      
        var everyDishEveryCourt = [];
      
        var courts = [
          {
            court: "Hillenbrand",
            dishes: [],
            aggregate: 0,
            total: 0
          },
          {
            court: "Earhart",
            dishes: [],
            aggregate: 0,
            total: 0
          },
          {
            court: "Wiley",
            dishes: [],
            aggregate: 0,
            total: 0
          },
          {
            court: "Windsor",
            dishes: [],
            aggregate: 0,
            total: 0
          },
          {
            court: "Ford",
            dishes: [],
            aggregate: 0,
            total: 0
          }
        ];
      
        function getCourt(courtName){
          for(var i=0; i<courts.length; i++){
            if(courts[i]['court'] == courtName)
              return courts[i];
          }
          return null;
        }
      
        if(matches.length == 0){
          // all dishes is an array for every dc that contains all the dishes offered and the rating
          // everyDishEveryCourt will be used as matches array if user has not rated anything that is being served today
          var dateDishRef = db.collection("DateDishes").doc(date);
          await dateDishRef.get().then(async function(doc){
            var allCourtData = doc.data();
            //console.log(allCourtData);
            for(var i = 0; i<allCourtData['Courts'].length; i++){
              for(var j = 0; j<allCourtData.Courts[i].Meals.length; j++){
                if(allCourtData.Courts[i].Meals[j].Name == meal){
                  var currMeal = allCourtData.Courts[i].Meals[j];
                  var allDishesObj = currMeal['Stations'];
                  for(var k=0; k<allDishesObj.length; k++){
                    var currStationDishes = allDishesObj[k]['Items'];
                    for(var p=0; p<currStationDishes.length; p++){
                      var currDish = currStationDishes[p];
                      if(currDish['Name'].includes('/'))
                        continue;
                      var itemRef = db.collection('Dish').doc(currDish['Name']);
                      var getItem = await itemRef.get().then(async doc => {
                        if (!doc.exists) {
                            //console.log("No such dish exists mate!");
                        } else {
                            var itemJSON = await doc.data();
                            var totalScore = itemJSON['totalScore'];
                            var totalVotes = itemJSON['totalVotes'];
                            var itemRating = Number(Number(totalScore) / Number(totalVotes));
                            currDish['rating'] = itemRating;
                            currDish['location'] = allCourtData.Courts[i].Name;
                        }
                      }).catch(err => {
                          throw new Error(err);
                      });
                      everyDishEveryCourt.push(currDish);
                    }
                  }
                }
              }
            }
          });
        
          matches = everyDishEveryCourt;
        }
      
        var courtNames = ["Hillenbrand", "Wiley", "Windsor", "Ford", "Earhart"];
        for(var i=0; i<matches.length; i++){
          var currLoc = getCourt(matches[i]['location']);
          if(currLoc == null)
            continue;
          console.log(currLoc);
      
          currLoc['dishes'].push(matches[i]);
          console.log("Pre Aggregate: " + currLoc['aggregate']+" rating: "+Number(matches[i]['rating']));

          if(matches[i]['rating'] != null)
            currLoc['aggregate'] = Number(currLoc['aggregate']) + Number(matches[i]['rating']);
          
          console.log("Post Aggregate: " + currLoc['aggregate']);
          currLoc['total']++;
      
        }
      
        for(var i=0; i<courtNames.length; i++){
          var currLoc = getCourt(courtNames[i]);
          if(currLoc['total']>0){
            var currRating = currLoc['aggregate'] / currLoc['total'];
          }else{
            currRating = -1;
          }
          currLoc['rating'] = currRating;
        }
      
        courts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

        if(!returnAll){
            return courts[0];
        }

        /*for(var i=0; i<courts.length; i++){
          if(courts[i]['allDishes'].length == 0){
            courts.splice(i, 1);
            continue;
          }
        }*/
        
        console.log("the actual courts stuff: " +courts.toString);
        return courts;
        
    },

    getGroupPrediction: async function(groupID, date, meal, returnAll){
      
      var members;
      await db.collection("Group").doc(groupID).get().then(doc => {
        members = doc.data().memberObjects;
      }).catch(function(error){
        throw new Error(error);
      });

      var bestForUsers;


      for(var i=0; i<members.length; i++){
        var currHandle = members[i]['userHandle'];
        var currUser = await prediction.getUserPrediction(currHandle, date, meal, true);
        currUser.sort((a, b) => {
          if(a.court > b.court)
            return 1;
          if(a.court < b.court)
            return -1;
          return 0;
        });

        if(i==0){
          bestForUsers = currUser;
          continue;
        }

        for(var j=0; j<currUser.length; j++){
          bestForUsers[j]['dishes'].push(currUser[j]['dishes']);
          bestForUsers[j]['aggregate'] += currUser[j]['aggregate'];
          bestForUsers[j]['total'] += currUser[j]['total'];
        }
      }

      for(var i=0; i<bestForUsers.length; i++){
        if (bestForUsers[i]['total'] == 0){
          bestForUsers[i]['rating'] = -1;
          continue;
        }
        var currRating = ((Number) (bestForUsers[i]['aggregate'])) / ((Number) (bestForUsers[i]['total']))
        bestForUsers[i]['rating'] = currRating;
        //console.log("Rating for "+bestForUsers[i]['court']+" is: "+currRating);
      }

      bestForUsers.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

      //console.log("best court: "+bestForUsers[0]['court']);
      return bestForUsers[0]['court'];
    }
}