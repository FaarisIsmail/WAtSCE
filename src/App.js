import React from 'react';
import './App.css';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyDny8PAsKPiFPsdp8ml7M4xlu-XLwsNjgM",
  authDomain: "cs1980.firebaseapp.com",
  projectId: "cs1980",
  storageBucket: "cs1980.appspot.com",
  messagingSenderId: "725657314446",
  appId: "1:725657314446:web:46e71dc4e4ddcccc0515df",
  measurementId: "G-L36F0RL44J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();




function App() {

  
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <SignIn />
        <SignOut />
      </header>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }
  return !auth.currentUser && (
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  )
}

function Main() {}

export default App;
