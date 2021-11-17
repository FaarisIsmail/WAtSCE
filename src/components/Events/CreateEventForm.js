import React from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import {auth, db, firestore} from '../../firebase.js'
import { Button } from '../Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = () => {
  toast.success("Hello!",
  {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
  });
}

export default function CreateEventForm() {

  //called when host clicks the "create event" button,
  //creates an event with the given data
  const CreateEvent = async (e) => {
      
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
  
    if (name === "" || description === "" || location === "" || start_date === " " || end_date === " ") {
      toast.error("Failed to create event.  Please fill out all fields.",
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } else {
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
        toast.error("Failed to create event.",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
    }
      //notify();
      
      //go back to the homepage when finished
      //history.push("/")
      //window.location.reload();
  }

  return (
    <form onSubmit={CreateEvent}>
      <h1>Create an Event</h1>
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
  )
}