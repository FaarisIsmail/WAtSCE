import React, { useState } from 'react';
import {auth, db, firestore} from '../../firebase.js';
import { Button } from '../Button'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'react-qr-code';
import './Event.css';
import './MyEvent.css';
import Collapsible from 'react-collapsible';

const saveSvgAsPng = require('save-svg-as-png');

const imageOptions = {
  scale: 1,
  encoderOptions: 1,
  backgroundColor: 'white',
};

const imageSize = {
  height: 'auto',
  maxWidth: '100%',
};

export default function Event({ id, host_id, name, location, description, date, 
  startTime, endTime, registrations, hostEvents }) {

    const [open, setOpen] = useState(false);

    const handleTriggerClick = () => {
      setOpen(!open);
    }

  // Create a new registration entry for the given event id and current user id
  // the id for this new registration entry is <eventId>_<userId>, and it contains
  // the event and user id's as data fields
  function registerForEvent(event_id) {
    db.collection("registrations").doc(id + "_" + auth.currentUser.uid).set({
      user_id: auth.currentUser.uid,
      event_id: id,
      user_name: auth.currentUser.displayName
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
      db.collection("events").doc(event_id).update({
        exists: false
      }).then(() => {
        console.log("Event successfully deleted");
        toast.success("The event has been successfully cancelled",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
         /* const sendHostMessage = functions.httpsCallable('sendHostMessage');
          sendHostMessage({ message: "Event <event_name> has been cancelled", eventid: event_id });*/
      })
      .catch((error) => {
        console.error("Error deleting event: ", error);
        toast.error("Error cancelling event",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
      });
      
      //TODO: delete all registrations where event_id = the event_id for the event which we are deleting

      //apparantly it is better to delete subcollections using the Firebase CLI, but our number of users
      //might be small enough for it to not matter
  }

  function renderQRCode() {
    if (hostEvents) {
      return (
        <div>
          <QRCode id="123456" style={imageSize} value={"https://watsce.tech/checkin/"+id} onClick={() => {
            saveSvgAsPng.saveSvgAsPng(document.getElementById('123456'), 'qr-code-'+id+'.png', imageOptions);
          }}></QRCode><br/><br/>
          <Button onClick={() => {
            saveSvgAsPng.saveSvgAsPng(document.getElementById('123456'), 'qr-code-'+id+'.png', imageOptions);
          }} >Download QR Code</Button> <br/> <br/>
          <Button onClick={() => deleteEvent(id)}>Cancel Event</Button> &nbsp;
          <Button onClick={() => window.location.href='/details/'+id}>Details</Button>
        </div>
      )
    } else {
      return null;
    }
  }



  return (
    <>
      <div class={registrationExists(id) || (auth.currentUser.uid == host_id) ? 'myEvent' : 'eventItem'}>
        <h1>{name}</h1><br/>
        <div>{date}</div> <br/>
        <div>{startTime} - {endTime}</div> <br/>
        <div>{location}</div> <br/><br/>

        {!registrationExists(id) && auth.currentUser.uid != host_id &&
          <Button onClick={() => registerForEvent(id)}>Register</Button>
        }
        {registrationExists(id) &&
          <Button onClick={() => cancelRegistration(id)}>Cancel Registration</Button>
        }
        {renderQRCode()}
        <br/><br/>
        {open && <Collapsible trigger={<>See Less &#9650;</>}
        {...{ open, handleTriggerClick }}>
          <div>{description}</div> <br/>
        </Collapsible>}
        {!open && <Collapsible trigger={<>See More &#9660;</>}
        {...{ open, handleTriggerClick }}>
          <div>{description}</div> <br/>
        </Collapsible>}
        <br/>
        
      </div>     
    </>
  )
}
