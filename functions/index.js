'use strict'
const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const admin = require('firebase-admin');

const app = dialogflow({debug: true});
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
var data = [];

app.intent('Default Welcome Intent',(conv) =>{

    conv.ask(new SimpleResponse({
        speech: 'Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?',
        text: 'Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?',
      }));    
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

exports.medicineExpiryTracker= functions.https.onRequest(app);
