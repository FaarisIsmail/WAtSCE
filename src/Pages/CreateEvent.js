import React, { useEffect, useState} from 'react';
import './CreateEvent.css';
import 'react-toastify/dist/ReactToastify.css';
import CreateEventForm  from '../components/Events/CreateEventForm';
import {auth, db, firestore} from '../firebase.js';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";

export default function CreateEvent() {

  const [userRole, setUserRole] = useState("loading");
  const userRef = firestore.collection("users").doc(auth.currentUser.uid);

  function getUserRole()
  {
    userRef.onSnapshot((user) => {
      setUserRole(user.data().role);
    })
  }

  useEffect(() => {
    getUserRole();
  }, []);

  if (userRole === "loading")
  {
    return null;
  }
  else if (userRole === "student")
  {
    return (
      <Redirect to="/"></Redirect>
    );
  }
  else 
  {
    return (
      <div>
        <CreateEventForm />
      </div>
    );
  }
}