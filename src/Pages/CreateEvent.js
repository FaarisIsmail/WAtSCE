import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import {auth, db, firestore} from '../firebase.js'
import './CreateEvent.css';




export default function CreateEvent() {
  const history = useHistory();
  //function called when request form is submitted
  //creates a new request document w/ the data from the request form
  //entry will be named after the user id (but i might change that later)
  const RequestAccess = async (e) =>
  {
    //get info from request form
    let name = e.target.rname.value;
    let reason = e.target.reason.value;

    //get the user id of the currently logged in user 
    let user = auth.currentUser;
    let uid = user.uid;

    //create the request document in firestore
    db.collection("requests").doc(uid).set({
      name: name,
      reason: reason,
      user_id: uid
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

    //go back to the homepage when finished
    history.push('/');
  }
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [userRole, setUserRole] = useState();  // Local user role state
  const [requests, setRequests] = useState([]); // List of requests

  const ref = firestore.collection("requests");

  //put request entries from database in the "requests" local state
  function getRequests() {
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setRequests(items);
    })
  }

  //checks to see if given user is in the database, if not, adds them as a student
  const checkForNewUser = async (uid) =>
  {
    //get document from database for the currently logged in user
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    //user not in database yet, so create a new document
    if (!docSnap.exists())
    {
      db.collection("users").doc(uid).set({
        role: "student" //can be student, admin, or host
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

      setUserRole("student");
    }
    else
    {
      // get the current user's role
      let r = docSnap.get("role");
      setUserRole(r);
    }
  }

  //called when admin accepts a host role request
  //deletes the request and sets the requesting user's role to host
  function acceptRequest(uid)
  {
    db.collection("users").doc(uid).set({
      role: "host"
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

    db.collection("requests").doc(uid).delete();
  }

  //called when admin declines a host role request
  //deletes the request without changing the user's role
  function declineRequest(uid)
  {
    db.collection("requests").doc(uid).delete();
  }

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      
      if (user)
      {
        let uid = user.uid;

        //check if the user is in the database when they log in
        checkForNewUser(uid);
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    getRequests();
  }, []);

  //student homepage
  if (userRole == "student")
  {
    return (
      <div>
        <h1 class='test'>Student Homepage</h1>
        <Link to="/request_form" class="test">Request Access</Link>
        <br></br>
        <button className="test" onClick={() => auth.signOut()}>Sign-out</button>
      </div>
    );
  }
  //host homepage
  else if (userRole == "host")
  {
    return (
      <div>
        <h1>Host Homepage</h1>
        <button className="test" onClick={() => auth.signOut()}>Sign-out</button>
      </div>
    );
  }
  //admin homepage
  else
  {
    return (
      <div>
        <h1>Admin Homepage</h1>
        {requests.map((request) => (
          <div key = {request.user_id}>
            <div>{request.name}</div> <br></br>
            <div>{request.reason}</div> <br></br>
            <button onClick={() => acceptRequest(request.user_id)}>Accept</button>
            <button onClick={() => declineRequest(request.user_id)}>Decline</button>
            <br></br><br></br><br></br><br></br>
          </div>
        ))}
        <button className="test" onClick={() => auth.signOut()}>Sign-out</button>
      </div>
    );
  }
}