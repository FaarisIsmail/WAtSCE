import userEvent from '@testing-library/user-event';
import React, {useState, useEffect } from 'react';
import {auth, db, firestore} from '../firebase.js';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";


export function Details(){

    var eventid = window.location.href.toString().split("/").pop();
    const [event, setEvent] = useState([]); 
    const [registrations, setRegistrations] = useState([]);
    const history = useHistory();
    const registrationRef = firestore.collection("registrations").where("event_id", "==", eventid);
    const docRef = db.collection("events").doc(eventid);

    function getEvent() {
        
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setEvent(doc.data().name)
            } else {
                console.log("No such document!");
                setEvent(undefined);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    }

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
      getEvent();
      getRegistrations();
    }, []);

    
    if (event !== undefined)
        return (
            <div>
                <h1>Event Details</h1>
                <div>Event Name: {event}</div>
                <h2>Registered Users:</h2>
                {registrations.map((registration) => (
                    <div key = {registration.id}>
                        <div>{registration.data().user_id}</div><br></br>
                    </div>
                ))}
            </div>
        );
    else
        return (
            null
        );
        


}
