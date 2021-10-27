import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';
import { Button } from '../components/Button'


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
      let name = e.target.event_name.value;
      let description = e.target.description.value;
  
      //get the user id of the currently logged in user 
      let user = auth.currentUser;
      let uid = user.uid;
  
      //create the event document in firestore
      db.collection("events").doc().set({
        name: name,
        description: description,
        host_id: uid
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  
      //go back to the homepage when finished
      history.push('/');
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
        <br></br>
        <Button>Sign-out</Button>
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
            <div>Enter a description for the event:</div> <br></br>
            <input type="text" id="description" name="description"></input> <br></br><br></br>
            <div>Enter the event date:</div> <br></br>
            <input type="date" id="date" name="date"></input><br></br><br></br>
            <div>Start Time:</div> <br></br>
            <input type="time" id="start" name="start"></input><br></br><br></br>
            <div>End Time:</div> <br></br>
            <input type="time" id="end" name="end"></input><br></br><br></br>
            <button>Submit</button>
          </form>
          <br></br><br></br><br></br><br></br>
          <h1>Your Events</h1>
          {events.map((event) => (
          <div key = {event.name}>
            <div>{event.data().name}</div> <br></br>
            <div>{event.data().description}</div> <br></br>
            <button onClick={() => deleteEvent(event.id)}>Cancel</button>
            <br></br><br></br><br></br><br></br>
          </div>
        ))}
        <button className="test" onClick={() => auth.signOut()}>Sign-out</button>
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
            <button onClick={() => acceptRequest(request.user_id)}>Accept</button>
            <button onClick={() => declineRequest(request.user_id)}>Decline</button>
            <br></br><br></br><br></br><br></br>
          </div>
        ))}
        <button className="test" onClick={() => auth.signOut()}>Sign-out</button>
      </div>
    );
  }
  else {
    return (
      null
    )
  }
  
}