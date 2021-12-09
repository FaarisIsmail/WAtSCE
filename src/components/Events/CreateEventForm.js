import React from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import {auth, db, firestore} from '../../firebase.js'
import { Button } from '../Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyEvent.css';
import './EventForm.css';

const notify = () => {
  toast.success("Hello!",
  {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
  });
}
const currDate = new Date().toISOString().split('T')[0]

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
  
    if (name === "" || description === "" || location === "" || e.target.date.value === "" || e.target.start.value === "" || e.target.end.value === "") {
      toast.error("Failed to create event.  Please fill out all fields.",
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } else if (e.target.start.value >= e.target.end.value) {
      toast.error("Failed to create event.  Please enter a valid date range.",
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
        start_string: s_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        end_string: e_date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        date_string: s_date.toDateString(),
        exists: true
      })
      .then(() => {
        // Reset input form to default of empty
        document.getElementById("event_name").value = "";
        document.getElementById("location").value = "";
        document.getElementById("description").value = "";
        document.getElementById("date").value = "";
        document.getElementById("start").value = "";
        document.getElementById("end").value = "";

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
    <form onSubmit={CreateEvent} class="eventForm">
      <h1>Create an Event</h1>
      <div>Enter the event name:</div> <br></br>
      <input type="text" id="event_name" name="event_name"></input> <br></br><br></br>
      <div>Enter the location of the event:</div> <br></br>
      <input type="text" id="location" name="location"></input> <br></br><br></br>
      <div>Enter a description for the event:</div> <br></br>
      <textarea id="description" class="description_text"></textarea> <br></br><br></br>
      <div>Enter the event date:</div> <br></br>
      <input type="date" min={currDate} id="date" name="date"></input><br></br><br></br>
      <div>Start Time:</div> <br></br>
      <input type="time" id="start" name="start"></input><br></br><br></br>
      <div>End Time:</div> <br></br>
      <input type="time" id="end" name="end"></input><br></br><br></br>
      <Button>Submit</Button>
      <br></br><br></br>
    </form>
  )
}
