const functions = require('firebase-functions');

const admin = require('firebase-admin');
    
var db = admin.firestore();
// A collection of methods to implement the rating system. Hopefully, a path to cleaner code

// PARAMETERS: (name of dish, rating, userHandle of user)

module.exports = {
    // PARAMETERS: (dish name, rating, userHandle)
    // adds a new rating
    setRating: async function(dish, rating, userHandle){
        var ratingObj = {
            rating: rating,
            userHandle: userHandle
        };

        var itemRef = db.collection('Dish').doc(dish);
    
        var getItem = await itemRef.get().then(async doc => {
            if (!doc.exists) {
                console.log("No such dish exists mate!");
            } else {
                console.log("Adding rating to: " + dish);
                var itemJSON = await doc.data();
                await console.log(itemJSON);
                if("ratings" in itemJSON){
                    await itemRef.update({ ratings: admin.firestore.FieldValue.arrayUnion(ratingObj)});

                    var currScore = itemJSON['totalScore'];
                    if(currScore == undefined)
                        currScore = 0;
                    await itemRef.update({ totalScore: Number(currScore) + Number(ratingObj['rating'])});

                    var currVotes = itemJSON['totalVotes'];
                    if(currVotes == undefined)
                        currScore = 0;
                    await itemRef.update({ totalVotes: currVotes + 1});
                }
                else{
                    itemRef.update({ratings: [ratingObj]});
                    itemRef.update({totalScore: ratingObj['rating']});
                    itemRef.update({totalVotes: 1});
                }
            }
        }).catch(err => {
            console.log('Error getting document', err);
        });
    }
}