import userEvent from '@testing-library/user-event';
import React, {useState, useEffect } from 'react';
import {auth, db, firestore} from '../firebase.js';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function Checkin(){
    const history = useHistory();
    console.log(auth.currentUser.uid)
    useEffect(() => {
        checkEvent()
        history.push("/")
    },[])
    return (
        <p> test</p>
    )

}
function checkEvent(eventid) {
    var eventid = window.location.href.toString().split("/").pop();
    var docRef = db.collection("events").doc(eventid).collection("checkedin").doc(auth.currentUser.uid)
    docRef.get().then((doc) => {
        if (doc.exists) {
            checkIn(docRef)
        } else {
            toast.error("You are not registered for this event!",
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 5000,
            })
        }
    }).catch((error) => {
        toast.error("There was an error retrieving the event",
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 5000,
            })
        console.log(error)
    })
}

function checkIn(docRef) {
        docRef.set({
            checkedin: true
        })
        .then(() => {
        console.log("Document successfully written!");
        toast.success("You have been checked in!", 
        {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
         })
        })
        .catch((error) => {
            toast.error("There was an error checking you in!!", 
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
             })
          console.error("Error writing document: ", error);
        });

}