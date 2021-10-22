import React, { useEffect, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import StyledFirebaseAuth from 'react-firebaseui/dist/StyledFirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getModularInstance } from '@firebase/util';
import { doc, getDoc } from 'firebase/firestore';
import { withRouter } from "react-router-dom";
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import Route from "react-router-dom/Route";
import Navbar from "./components/Navbar/Navbar";
import {auth, db, firestore} from './firebase.js'

import About from './Pages/About';
import CreateEvent from './Pages/CreateEvent';
import Home from './Pages/Home';



const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function App() {
  const [user] = useAuthState(auth);
  return (

    <header>
      {user ? <Main /> : <SignInScreen />}
    </header>

  );
}


function Main() {
  const [user] = useAuthState(auth);
  const history = useHistory();


  return (

    <Router>

    <Navbar />

    <div className="default">
      <Route path="/request_form" exact strict render={ //form to gather data for a host role request
        () => {
          return (
            <div>
              <form onSubmit={CreateEvent}>
                <div>Enter your name:</div> <br></br>
                <input type="text" id="rname" name="rname"></input> <br></br>
                <div>Why do you want to be able to create events?</div> <br></br>
                <input type="text" id="reason" name="reason"></input> <br></br>
                <button>Submit</button>
              </form>
            </div>
          );
        }
      }/>
      
    </div>

    <Route path="/about" component={About} />
    <Route path="/create-event" component={CreateEvent} />
    <Route path="/" exact component={Home} />

    </Router>
    
  );
}

function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  if (!isSignedIn) {
    return (
      <div className="App">
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
}



export default App;