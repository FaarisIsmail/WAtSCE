import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';
import EventList from '../components/Events/EventList';

export default function Home1() {
  
  const [events, setEvents] = useState([]); // List of all events
  const [registrations, setRegistrations] = useState([]); //List of registrations for current user
  const ref = firestore.collection("events").orderBy("start");
  const registrationRef = firestore.collection("registrations").where("user_id", "==", auth.currentUser.uid);
  const allEvents = [];

  // Put event entries from database in the "events" local state
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

  // Put registration entries for the current user in the "registrations" local state
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

  useEffect(() => {
    getEvents();
    getRegistrations();
  }, []);

  // Returns a list of all events
  // if the user is not registered for an event or is not the host, the "register" button will be shown
  // if the user is registered for the event, the "cancel registration" button will be shown
  // TODO: if the user is the host, the "cancel event" button will be shown
  return (
    <div>
      <h1>Scheduled Events</h1>
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

        allEvents.push(curEvent);
      })}
      <EventList events={allEvents} registrations={registrations}/>
    </div>
  )
}