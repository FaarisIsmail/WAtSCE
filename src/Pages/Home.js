import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';
import { Button } from '../components/Button'

export default function Home1() {
  const history = useHistory();
  const [events, setEvents] = useState([]); // List of all events
  const [registrations, setRegistrations] = useState([]); //List of registrations for current user
  const ref = firestore.collection("events").orderBy("start");
  const registrationRef = firestore.collection("registrations").where("user_id", "==", auth.currentUser.uid);

  //put event entries from database in the "events" local state
  function getEvents() {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
       // items.push(doc.data());
        items.push(doc);
      });
      setEvents(items);
    })
  }

  //put registration entries for the current user in the "registrations" local state
  function getRegistrations() {
    registrationRef.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
       // items.push(doc.data());
        items.push(doc);
      });
      setRegistrations(items);
    })
  }

  //create a new registration entry for the given event id and current user id
  //the id for this new registration entry is <eventId>_<userId>, and it contains
  //the event and user id's as data fields
  function registerForEvent(id)
  {
    db.collection("registrations").doc(id + "_" + auth.currentUser.uid).set({
      user_id: auth.currentUser.uid,
      event_id: id
    })
  }

  //return true if the user is currently registered for the given event, and false if otherwise
  function registrationExists(event_id)
  {
    let registration = registrations.find(r => r.id === event_id + "_" + auth.currentUser.uid);
    if (registration == undefined)
    {
      return false;
    }
    else
    {
      return true;
    }

  }

  //delete the given registration entry
  function cancelRegistration(event_id)
  {
    db.collection("registrations").doc(event_id + "_" + auth.currentUser.uid).delete();
  }

  useEffect(() => {
    getEvents();
    getRegistrations();
  }, []);

  //returns a list of all events
  //if the user is not registered for an event or is not the host, the "register" button will be shown
  //if the user is registered for the event, the "cancel registration" button will be shown
  //TODO: if the user is the host, the "cancel event" button will be shown
  return (
    <div>
      <h1>Events</h1>
      {events.map((event) => (
        <div key = {event.id}>
          <div>{event.data().name}</div><br></br>
          <div>{event.data().location}</div> <br></br>
          <div>{event.data().description}</div> <br></br>
          <div>{event.data().date_string}</div> <br></br>
          <div>{event.data().start_string} - {event.data().end_string}</div> <br></br>

          {!registrationExists(event.id) && auth.currentUser.uid != event.data().host_id &&
            <button onClick={() => registerForEvent(event.id)}>Register</button>
          }
          {registrationExists(event.id) &&
            <button onClick={() => cancelRegistration(event.id)}>Cancel Registration</button>
          }
          <br></br><br></br><br></br><br></br>
        </div>
      ))}

      <h1>My Schedule</h1>
      {events.map((event) => (
        <div key = {event.id}>
          {registrationExists(event.id) &&
          <>
          <div>{event.data().name}</div><br></br>
          <div>{event.data().location}</div> <br></br>
          <div>{event.data().description}</div> <br></br>
          <div>{event.data().date_string}</div> <br></br>
          <div>{event.data().start_string} - {event.data().end_string}</div> <br></br>
          <button onClick={() => cancelRegistration(event.id)}>Cancel Registration</button><br></br><br></br><br></br><br></br></>}
        </div>
      ))}
    </div>
  )
}