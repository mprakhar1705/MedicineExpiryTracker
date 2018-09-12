'use strict'
const functions = require('firebase-functions');
const {dialogflow,SimpleResponse} = require('actions-on-google');
const admin = require('firebase-admin');
const uuidv4 = require('uuid/v4');
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const app = dialogflow({debug: true});

 const db = admin.firestore();
 app.intent('Default Welcome Intent',(conv) =>{
     conv.ask(new SimpleResponse({
        speech: 'Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?',
        text: 'Welcome to Medicine Expiry Tracker. I can help you to track Medicines and their Expiry Date. Following commands are available: Add medicine , Delete Medicine, Get expiry Date for the Medicine, List all medicine. What would you like me to do?',
      }));    
});
app.intent('addMedicine',(conv,{medName,date}) =>{
    
    let userId;
if ("userId" in conv.user.storage) {
  userId = conv.user.storage.userId;
} else {
  userId = uuidv4();
  conv.user.storage.userId = userId;
}   

          
    return db.collection(userId).doc(medName).set({expiryDate: date})
    .then(function() {
        console.log("Medicine Added!");
        conv.ask(new SimpleResponse({
            speech: `Medicine ${medName} added!`,
            text: `Medicine ${medName} added!`,
          }));
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
});

app.intent('getExpiryDate',(conv,{medName}) =>{

    let userId = conv.user.storage.userId;
    const collectionRef = db.collection(userId);
    const docRef = collectionRef.doc(`${medName}`);

    return docRef.get()
    .then((snapshot) => {
        const timestamp = snapshot.get('expiryDate');
        const edate = new Date(timestamp);
        conv.ask(`Expiry date of ${medName} is ${edate}`);
    }).catch((error) => {
        console.log('error:',error);
        conv.close('Medicine not found!');
    });

});

app.intent('deleteMedicine',(conv,{medName}) =>{

    let userId = conv.user.storage.userId;
    var docRef = db.collection(userId).doc(`${medName}`);

    return docRef.get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
            conv.ask('Medicine not found!');
        } else {
            return docRef.delete().then(function() {
                console.log("Document successfully deleted!");
                conv.ask('Medicine deleted!');
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });          
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
    
    
});

 exports.medicineExpiryTracker= functions.https.onRequest(app);