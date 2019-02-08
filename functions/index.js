const functions = require('firebase-functions');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

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

//This is Carlo's first attempt at writing a function to get
//menu info from Purdue Dining API
//as of right now this only gets menu information from hillenbrand
//and idek know if it works so we need to test it
exports.getMenus = functions.https.onRequest((request, response) => {
  //Create a request var and set equal to XMLHttpRequest object
  var request = new XMLHttpRequest();

  //Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'https://api.hfs.purdue.edu/menus/v2/locations/hillenbrand/2019-02-06', true);

  request.onload = function() {
    //convert xml to javascript object
    var parseString = require('xml2js').parseString;
    var xml = this.response;
    var menu;
    parseString(xml, function (err, result) {
      menu = result;
      console.log(result);
    });

    //give the client the menu information
    response.send(JSON.stringify(menu));
  }
});
