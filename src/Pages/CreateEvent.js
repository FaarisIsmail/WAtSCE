import React, { useEffect, useState, Component } from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';
import { Button } from '../components/Button';
import QRCode from 'react-qr-code';
import ImageWrapper from '../components/ImageWrapper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { toast } from 'react-toastify/dist/components';

const saveSvgAsPng = require('save-svg-as-png');

const notify = () => {
  toast.success("Hello!",
  {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
  });
}

const imageOptions = {
  scale: 5,
  encoderOptions: 1,
  backgroundColor: 'white',
};

//const notify = () => toast("Event has been created!");

export default function CreateEvent() {
  const history = useHistory();

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [userRole, setUserRole] = useState();  // Local user role state
  const [requests, setRequests] = useState([]); // List of requests
  const [events, setEvents] = useState([]); //List of events that the user is hosting


  const ref = firestore.collection("requests");
  const eventRef = firestore.collection("events").where("host_id", "==", auth.currentUser.uid);

  //put request entries from database in the "requests" local state
  function getRequests() {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setRequests(items);
    })
  }

  //put event entries that the user is hosting into the "events" local state
  function getEvents() {
    eventRef.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc);
      });
      setEvents(items);
    })
  }

  //checks to see if given user is in the database, if not, adds them as a student
  const checkForNewUser = async (uid) =>
  {
    //get document from database for the currently logged in user
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    //user not in database yet, so create a new document
    if (!docSnap.exists())
    {
      db.collection("users").doc(uid).set({
        role: "student" //can be student, admin, or host
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

      setUserRole("student");
    }
    else
    {
      // get the current user's role
      let r = docSnap.get("role");
      setUserRole(r);
    }
  }

  //called when admin accepts a host role request
  //deletes the request and sets the requesting user's role to host
  function acceptRequest(uid)
  {
    db.collection("users").doc(uid).set({
      role: "host"
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

    db.collection("requests").doc(uid).delete();
  }

  //called when admin declines a host role request
  //deletes the request without changing the user's role
  function declineRequest(uid)
  {
    db.collection("requests").doc(uid).delete();
  }

  //called when host clicks the "create event" button,
  //creates an event with the given data
  const CreateEvent = async (e) =>
    {
      
      e.preventDefault();
      let name = e.target.event_name.value;
      let description = e.target.description.value;
      let location = e.target.location.value;
      let start_date = e.target.date.value + " " + e.target.start.value;
      let end_date = e.target.date.value + " " + e.target.end.value;
      let date = e.target.date.value;
      let start_time = e.target.start.value;
      let end_time = e.target.end.value;
    
      let s_date = new Date(start_date);
      let e_date = new Date(end_date);
  
      //get the user id of the currently logged in user 
      let user = auth.currentUser;
      let uid = user.uid;
  
      //create the event document in firestore
      db.collection("events").doc().set({
        name: name,
        description: description,
        host_id: uid,
        location: location,
        start: Timestamp.fromDate(s_date),
        end: Timestamp.fromDate(e_date),
        start_string: s_date.toLocaleTimeString("en-US"),
        end_string: e_date.toLocaleTimeString("en-US"),
        date_string: s_date.toDateString()
      })
      .then(() => {
        console.log("Document successfully written!");
        toast.success("Event \"" + name + "\" has been created",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

      //notify();
      
      //go back to the homepage when finished
      //history.push("/")
      //window.location.reload();
    }

    //deletes the event and all associated user registrations
    function deleteEvent(event_id)
    {
      db.collection("events").doc(event_id).delete();
      
      //TODO: delete all registrations where event_id = the event_id for the event which we are deleting

      //apparantly it is better to delete subcollections using the Firebase CLI, but our number of users
      //might be small enough for it to not matter
    }

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      
      if (user)
      {
        let uid = user.uid;

        //check if the user is in the database when they log in
        checkForNewUser(uid);
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    getRequests();
    getEvents();
  }, []);

  //student homepage
  if (userRole === "student")
  {
    return (
      <div class='center'>
        <h1 class='test'>Please request access to create events<br/></h1>
        <div>
          <Button onClick={event =>  window.location.href='/request_form'}>Request Access</Button>
        </div>
      </div>
    );
  }
  //host homepage
  else if (userRole === "host")
  {
    return (
      <div>
        <h1>Host Homepage</h1>
          <form onSubmit={CreateEvent}>
            <div>Enter the event name:</div> <br></br>
            <input type="text" id="event_name" name="event_name"></input> <br></br><br></br>
            <div>Enter the location of the event:</div> <br></br>
            <input type="text" id="location" name="location"></input> <br></br><br></br>
            <div>Enter a description for the event:</div> <br></br>
            <input type="text" id="description" name="description"></input> <br></br><br></br>
            <div>Enter the event date:</div> <br></br>
            <input type="date" id="date" name="date"></input><br></br><br></br>
            <div>Start Time:</div> <br></br>
            <input type="time" id="start" name="start"></input><br></br><br></br>
            <div>End Time:</div> <br></br>
            <input type="time" id="end" name="end"></input><br></br><br></br>
            <Button>Submit</Button>
          </form>
          <br></br><br></br><br></br><br></br>
          <h1>Your Events</h1>
          {events.map((event) => (
          <div key = {event.name}>
            <div>{event.data().name}</div><br></br>
            <div>{event.data().location}</div> <br></br>
            <div>{event.data().description}</div> <br></br>
            <div>{event.data().date_string}</div> <br></br>
            <div>{event.data().start_string} - {event.data().end_string}</div> <br></br>
            <h1>Registration QR Code:</h1>
            <QRCode id="123456" value={"https://watsce.tech/checkin/"+event.id} onClick={() => {saveSvgAsPng.saveSvgAsPng(document.getElementById('123456'), 'qr-code-'+event.id+'.png', imageOptions);}}></QRCode><br/><br/>
            <Button onClick={() => {saveSvgAsPng.saveSvgAsPng(document.getElementById('123456'), 'qr-code-'+event.id+'.png', imageOptions);}} >Download QR Code</Button>
            <br/><br/>
            <Button onClick={() => deleteEvent(event.id)}>Cancel Event</Button>
            <Button onClick={() => window.location.href='/details/'+event.id}>Details</Button>
            <br></br><br></br><br></br><br></br>
          </div>
        ))}
      </div>
    );
  }
  //admin homepage
  else if (userRole === "admin")
  {
    return (
      <div>
        <h1>Admin Homepage</h1>
        {requests.map((request) => (
          <div key = {request.user_id}>
            <div>{request.name}</div> <br></br>
            <div>{request.reason}</div> <br></br>
            <Button onClick={() => acceptRequest(request.user_id)}>Accept</Button>
            <Button onClick={() => declineRequest(request.user_id)}>Decline</Button>
            <br></br><br></br><br></br><br></br>
          </div>
        ))}
      </div>
    );
  }
  else {
    return (
      null
    )
  }
  
}