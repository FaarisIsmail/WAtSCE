import React from 'react';
import {auth, db, firestore} from '../../firebase.js';
import { Button } from '../Button'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'react-qr-code';

const saveSvgAsPng = require('save-svg-as-png');

const imageOptions = {
  scale: 5,
  encoderOptions: 1,
  backgroundColor: 'white',
};

export default function Event({ id, host_id, name, location, description, date, 
  startTime, endTime, registrations, hostEvents }) {

  // Create a new registration entry for the given event id and current user id
  // the id for this new registration entry is <eventId>_<userId>, and it contains
  // the event and user id's as data fields
  function registerForEvent(event_id) {
    db.collection("registrations").doc(id + "_" + auth.currentUser.uid).set({
      user_id: auth.currentUser.uid,
      event_id: id
    })

    //db.collection(eventid).collection()

    toast.success("You have been registered for " + name,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });

    db.collection("events").doc(event_id).collection("checkedin").doc(auth.currentUser.uid).set({
      checkedin: false
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
    db.collection("events").doc(event_id).collection("checkedin").doc(auth.currentUser.uid).delete()

    toast.success("Your registration for " + name + " has been cancelled",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
  }

  //deletes the event and all associated user registrations
  function deleteEvent(event_id) {
      db.collection("events").doc(event_id).delete();
      
      //TODO: delete all registrations where event_id = the event_id for the event which we are deleting

      //apparantly it is better to delete subcollections using the Firebase CLI, but our number of users
      //might be small enough for it to not matter
  }

  function renderQRCode() {
    if (hostEvents) {
      return (
        <div>
          <QRCode id="123456" value={"https://watsce.tech/checkin/"+id} onClick={() => {
            saveSvgAsPng.saveSvgAsPng(document.getElementById('123456'), 'qr-code-'+id+'.png', imageOptions);
          }}></QRCode><br/><br/>
          <Button onClick={() => {
            saveSvgAsPng.saveSvgAsPng(document.getElementById('123456'), 'qr-code-'+id+'.png', imageOptions);
          }} >Download QR Code</Button>
          <Button onClick={() => deleteEvent(id)}>Cancel Event</Button>
          <Button onClick={() => window.location.href='/details/'+id}>Details</Button>
        </div>
      )
    } else {
      return null;
    }
  }

  return (
    <>
      <br/><br/><br/>
      <div>Event name:  {name}</div><br/>
      <div>Location:    {location}</div> <br/>
      <div>Description:   {description}</div> <br/>
      <div>Date:  {date}</div> <br/>
      <div>Time:  {startTime} - {endTime}</div> <br/>

      {!registrationExists(id) && auth.currentUser.uid != host_id &&
        <Button onClick={() => registerForEvent(id)}>Register</Button>
      }
      {registrationExists(id) &&
        <Button onClick={() => cancelRegistration(id)}>Cancel Registration</Button>
      }
      {renderQRCode()}
      <br/><br/>
    </>     
  )
}
