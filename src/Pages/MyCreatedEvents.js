import React, { useEffect, useState} from 'react';
import {auth, db, firestore} from '../firebase.js';
import { toast } from 'react-toastify';
import EventList from '../components/Events/EventList';

export function MyCreatedEvents() {

  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);

  const ref = firestore.collection("requests");
  const eventRef = firestore.collection("events").where("host_id", "==", auth.currentUser.uid);
  const createdEvents = [];

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

  useEffect(() => {
    getRequests();
    getEvents();
  }, []);

  return (
    <>
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
      <EventList events={createdEvents} registrations={[]} hostEvents={true} />
    </>
  )
}
