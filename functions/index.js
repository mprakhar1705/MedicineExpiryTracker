'use strict'
const functions = require('firebase-functions');
const {dialogflow,SimpleResponse} = require('actions-on-google');
const admin = require('firebase-admin');
const uuidv4 = require('uuid/v4');

const app = dialogflow({debug: true});
admin.initializeApp(functions.config().firebase);
 const db = admin.firestore();
 app.intent('Default Welcome Intent',(conv) =>{
     conv.ask(new SimpleResponse({
        speech: 'Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?',
        text: 'Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?',
      }));    
});
app.intent('addMedicine',(conv,{medName,date}) =>{
 
    let userId;
if (userId in conv.user.storage) {
  userId = conv.user.storage.userId;
} else {
  userId = uuidv4();
  conv.user.storage.userId = userId;
}   
    var data = {
        userID:userId,
        medicineName: medName,
        expiryDate: date
      };
      conv.close(`MedicineName is ${medName} expiry is ${date} userid is ${userId}`);
    return db.collection("medicineTable").doc("medicineDoc").set(data)
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