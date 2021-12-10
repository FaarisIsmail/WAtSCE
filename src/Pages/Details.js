import userEvent from '@testing-library/user-event';
import React, {useState, useEffect } from 'react';
import {auth, db, firestore, functions} from '../firebase.js';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../components/Button';


export function Details(){

    var eventid = window.location.href.toString().split("/").pop();
    const [event, setEvent] = useState("loading"); 
    const [registrations, setRegistrations] = useState([]);
    const [checkins, setCheckins] = useState([]);
    const history = useHistory();
    const registrationRef = firestore.collection("registrations").where("event_id", "==", eventid);
    const docRef = db.collection("events").doc(eventid);
    const checkinRef = db.collection("events").doc(eventid).collection("checkedin");

    function getEvent() {
        
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setEvent(doc.data())
            } else {
                console.log("No such document!");
                setEvent("none");
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

      function getCheckins() {
        checkinRef.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
              //items.push(doc.data());
              items.push(doc);
            });
            setCheckins(items);
          })
      }

      function isCheckedIn (user_id)
      {
        let checkin = checkins.find(r => r.id === user_id);

        console.log("checkin: " + checkin);
        
        if (checkin !== undefined)
        {
            if (checkin.data().checkedin)
            {
                return "has been checked in";
            }
            else
            {
                return "";
            }
        }

        return "";
      }

      const SendMessage = async (e) => {
        e.preventDefault();
        let message = e.target.message_box.value;
        console.log(event.name);
        if (message === '')
        {
            toast.error("Cannot send a blank message.",
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
        }
        else
        {
            message = "Message sent from host of " + event.name + ": " + message;
            console.log(message);
            toast.success("Your message has been sent",
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            });
            document.getElementById("message_box").value = "";
            const sendHostMessage = functions.httpsCallable('sendHostMessage');
            sendHostMessage({ message: message, eventid: eventid });
        }
      }

    useEffect(() => {
      getEvent();
      getRegistrations();
      getCheckins();
    }, []);
    
    if ((event !== "none") && (event !== "loading"))
    {
        if (event.host_id === auth.currentUser.uid)
        {
            return (
                <div class="eventItem">
                    <h1>Event Details</h1>
                    <div>Event Name: {event.name}</div> <br></br>
                    <form onSubmit={SendMessage} class="messageForm">
                        <div>Send a message to participants:</div> <br></br>
                        <textarea id="message_box" name="message_box" class="message_box" style={{resize: "none"}}></textarea> <br></br> <br></br>
                        <Button>Send</Button>
                    </form>
                    <br></br>
                    <h1>Registered Users:</h1>
                    {registrations.map((registration) => (
                        <div key = {registration.id}>
                            <div>{registration.data().user_name + " " + isCheckedIn(registration.data().user_id)}</div><br></br>
                        </div>
                    ))}
                </div>
            );
        }
        else
            return (
                <Redirect to="/"></Redirect>
            )
    }
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
