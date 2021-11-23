import React, { useEffect, useState, Component } from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';
import { Button } from '../components/Button';
import ImageWrapper from '../components/ImageWrapper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { toast } from 'react-toastify/dist/components';
import CreateEventForm  from '../components/Events/CreateEventForm';
import EventList from '../components/Events/EventList';

export default function CreateEvent() {
  const history = useHistory();

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [userRole, setUserRole] = useState();  // Local user role state
  const [requests, setRequests] = useState([]); // List of requests
  const [events, setEvents] = useState([]); //List of events that the user is hosting

  const ref = firestore.collection("requests");
  const eventRef = firestore.collection("events").where("host_id", "==", auth.currentUser.uid);

  const createdEvents = [];

  //const notify = () => toast("Event has been created!");

  const notify = () => {
    toast.success("Hello!",
    {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 5000,
    });
  }

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
  function declineRequest(uid) {
    db.collection("requests").doc(uid).delete();
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
        {events.forEach(event => {

          const curEvent = {
            id: event.id,
            host_id: event.data().host_id,
            name: event.data().name,
            location: event.data().location,
            description: event.data().description,
            date: event.data().date_string,
            startTime: event.data().start_string,
            endTime: event.data().end_string
          }

          createdEvents.push(curEvent);
        })}

        <CreateEventForm />
        <EventList events={createdEvents} registrations={[]} hostEvents={true} />

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