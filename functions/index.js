const functions = require('firebase-functions');
//var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fetch = require("node-fetch");
const req = require('request');
const algorithms = require('./algorithms.js')

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

//simple function to get menus from dining court
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
