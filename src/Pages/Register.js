import userEvent from '@testing-library/user-event';
import React, {useState, useEffect } from 'react';
import {auth, db, firestore} from '../firebase.js';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";


export function Register(){

    const [event, setEvent] = useState("loading"); 
    var eventid = window.location.href.toString().split("/").pop();
    const history = useHistory();
  
    function getEvents() {
        var docRef = db.collection("events").doc(eventid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setEvent(doc.data().name)
            } else {
                console.log("No such document!");
                setEvent("none");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    }


  
    useEffect(() => {
      getEvents();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        db.collection("events").doc(eventid).collection("checkedin").doc(auth.currentUser.uid).set({
            checkedin: true
          })
          .then(() => {
            console.log("Document successfully written!");
            alert("You have been checked in!");
            history.push("/");
           
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            alert("There was an error checking in");
          });
      }
    

    if ((event !== "none") && (event !== "loading"))
        return (
            <div>
            <p>
                This is the unique event ID appended after the URL: <br/><br/>
                {eventid}
            </p>
            <form onSubmit={handleSubmit}>
                <div>Enter your name</div> <br/>
                <input type="text" id="name" name="name" value={auth.currentUser.displayName} ></input><br/><br/>
                <div>Enter your phone number</div> <br/>
                <input type="text" id="phone" name="phone" value={auth.currentUser.phoneNumber} ></input><br/><br/>
                <div>Event Name</div> <br></br>
                <input type="text" id="event_id" name="event_id" value={event} disabled></input> <br/><br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
        )
    else if (event === "none")
    {
        return (
            <Redirect to="/"></Redirect>
        );
    }
    else if (event === "loading")
        return (
            null
        );


}
