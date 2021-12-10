const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = '+14125153406'

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendHostMessage = functions.region("us-east4").https.onCall((data, context) => {
    const message = data.message;
    const eventid = data.eventid;

    let user_id = context.auth.uid;
    var db = admin.firestore();

    db.collection("events").doc(eventid).get().then((curr_event) => {
        if (curr_event.data().host_id === user_id)
        {
            db.collection("registrations").where("event_id", "==", eventid).get().then(snapshot => {
                snapshot.forEach((doc) => {
                    db.collection("users").doc(doc.data().user_id).get().then((doc2) => {
                        let textMessage = {
                            body: message,
                            to: doc2.data().phone,
                            from: twilioNumber
                        }
        
                        client.messages.create(textMessage).then(console.log("Text sent to "+doc2.data().phone));
                    })
                });
            });
        }
        else
            return "Insufficient Permissions";
    });


    return "Completed!";
})

exports.sendReminders = functions.region("us-east4").pubsub.schedule('55 17 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    var db = admin.firestore();
    var date = new Date();

    db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var diff = doc.data().start.toMillis()-date.getTime();
            if ((diff <= 108000000) && diff >= 21600000) {
                db.collection("registrations").where("event_id", "==", doc.id).get().then(snapshot => {
                    snapshot.forEach((doc2) => {
                        db.collection("users").doc(doc2.data().user_id).get().then((doc3) => {
                            const message = "Reminder that "+doc.data().name+" is scheduled for "+doc.data().date_string+" at "+doc.data().start_string;
                            let textMessage = {
                                body: message,
                                to: doc3.data().phone,
                                from: twilioNumber
                            }

                            client.messages.create(textMessage).then(console.log("Text sent to "+doc3.data().phone));
                        })
                    });
                });
            }
        });
    });





  return null;
})