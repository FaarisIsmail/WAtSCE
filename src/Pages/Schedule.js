import React, { useEffect, useState } from 'react';
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';
import EventList from '../components/Events/EventList';

export default function Schedule() {
  
  const [events, setEvents] = useState([]); // List of all events
  const [registrations, setRegistrations] = useState([]); //List of registrations for current user
  const ref = firestore.collection("events").orderBy("start");
  const registrationRef = firestore.collection("registrations").where("user_id", "==", auth.currentUser.uid);
  const myEvents = [];

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
      <h1>My Schedule</h1>

      {events.forEach(event => {

        if (!registrationExists(event.id)) {
          return;
        }

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

        myEvents.push(curEvent);
      })}

      <EventList events={myEvents} registrations={registrations}/>
    </div>
  )
}