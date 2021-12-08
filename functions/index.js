const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = '+18449052176'

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendHostMessage = functions.https.onCall((data, context) => {
    const message = data.message;
   // console.log(message);
    const eventid = data.eventid;

    let user_ids = [];
    let phone_numbers = [];

    let user_id = context.auth.uid;
    console.log("user_id: " + user_id);
    var db = admin.firestore();

    db.collection("events").doc(eventid).get().then((curr_event) => {
        if (curr_event.data().host_id === user_id)
        {
            db.collection("registrations").where("event_id", "==", eventid).get().then(snapshot => {
                snapshot.forEach((doc) => {
                    //user_ids.push(doc.data().user_id);
                    console.log("id: " + doc.data().user_id);
                    db.collection("users").doc(doc.data().user_id).get().then((doc2) => {
                        //phone_numbers.push(doc2.data().phone)
                        //console.log("phone: " + doc2.data().phone);
                        let textMessage = {
                            body: message,
                            to: doc2.data().phone,
                            from: twilioNumber
                        }
        
                        client.messages.create(textMessage);
                    })
                });
            });
        }
        else
            return "Insufficient Permissions";
    });

    

    /*db.collection("users").doc("bWynuLXYu2hxuwaTpug6_bmUXn7dhGlg1J9XmWLyOWtlB8C93").get().then((doc2) => {
        //phone_numbers.push(doc2.data().phone)
        console.log("phone: " + doc2.data());
    })*/

    /*user_ids.forEach((user_id) => {
        db.collection("users").doc(user_id).get().then((doc) => {
            phone_numbers.push(doc.data().phone)
            console.log("phone: " + doc.data().phone);
        })
        console.log("hello!" + user_id);
    });*/

    /*const textMessage = {
        body: message,
        to: '+14129960764',
        from: twilioNumber
    }

    client.messages.create(textMessage);*/

    return "Completed!";
});

exports.sendReminders = functions.pubsub.schedule('55 17 * * *')
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
                            const message = "Reminder that "+doc.getData().name+" is scheduled for "+doc.getData().start_string;
                            let textMessage = {
                                body: message,
                                to: doc3.data().phone,
                                from: twilioNumber
                            }

                            client.messages.create(textMessage);
                            console.log("Sent text to " + doc3.data().phone);
                        })
                    });
                });
            }
        });
    });





  return null;
});
