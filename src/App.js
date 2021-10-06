import React, { useEffect, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import StyledFirebaseAuth from 'react-firebaseui/dist/StyledFirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



firebase.initializeApp({
  apiKey: "AIzaSyDny8PAsKPiFPsdp8ml7M4xlu-XLwsNjgM",
  authDomain: "cs1980.firebaseapp.com",
  projectId: "cs1980",
  storageBucket: "cs1980.appspot.com",
  messagingSenderId: "725657314446",
  appId: "1:725657314446:web:46e71dc4e4ddcccc0515df",
  measurementId: "G-L36F0RL44J"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

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
    <div className="App">
      <header className="App-header">
        <SignInScreen />
      </header>
    </div>
  );
}


function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
      <button className="sign-out" onClick={() => firebase.auth().signOut()}>Sign-out</button>
    </div>
  );
}

export default App;