import React from 'react';
import {auth, db, firestore} from '../../firebase.js';
import { Button } from '../Button'

export default function Event({ id, host_id, name, location, description, date, 
  startTime, endTime, registrations }) {

  // Create a new registration entry for the given event id and current user id
  // the id for this new registration entry is <eventId>_<userId>, and it contains
  // the event and user id's as data fields
  function registerForEvent(event_id) {
    db.collection("registrations").doc(id + "_" + auth.currentUser.uid).set({
      user_id: auth.currentUser.uid,
      event_id: id
    })
  }

  // Return true if the user is currently registered for the given event, and false if otherwise
  function registrationExists(event_id) {
    let registration = registrations.find(r => r.id === event_id + "_" + auth.currentUser.uid);
    if (registration == undefined) {
      return false;
    } else {
      return true;
    }
  }

  //delete the given registration entry
  function cancelRegistration(event_id) {
    db.collection("registrations").doc(event_id + "_" + auth.currentUser.uid).delete();
  }

  return (
    <>
      <br/>
      <div>Event name:  {name}</div><br></br>
      <div>Location:    {location}</div> <br></br>
      <div>Description:   {description}</div> <br></br>
      <div>Date:  {date}</div> <br></br>
      <div>Time:  {startTime} - {endTime}</div> <br></br>

      {!registrationExists(id) && auth.currentUser.uid != host_id &&
        <Button onClick={() => registerForEvent(id)}>Register</Button>  
      }
      {registrationExists(id) &&
        <Button onClick={() => cancelRegistration(id)}>Cancel Registration</Button>
      }
      <br/><br/>
    </>     
  )
}
