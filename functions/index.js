'use strict'
const functions = require('firebase-functions');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const admin = require('firebase-admin');
//const app = dialogflow({debug: true});
admin.initializeApp(functions.config().firebase);


exports.medicineExpiryTracker= functions.https.onRequest( (request,response) => {
    const  app = new DialogflowApp({request: request, response: response});
   
const db = admin.firestore();
var data = [];

app.intent('Default Welcome Intent',(conv) =>{

    conv.ask('Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?');    
});
app.intent('addMedicine',(conv,{medName,date}) =>{

    const userId = app.getUser().userId;
    data.push([medName,date]);
    return db.collection("medicineTable").doc(userId).set(data)
    .then(function() {
        console.log("Document successfully written!");
        conv.ask(new SimpleResponse({
            speech: `Medicine ${medName} added!`,
            text: `Medicine ${medName} added!`,
          }));
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
});

//exports.medicineExpiryTracker= functions.https.onRequest(app);
});
