import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import * as firebaseui from 'firebaseui'

firebase.initializeApp({
    apiKey: "AIzaSyDny8PAsKPiFPsdp8ml7M4xlu-XLwsNjgM",
    authDomain: "cs1980.firebaseapp.com",
    projectId: "cs1980",
    storageBucket: "cs1980.appspot.com",
    messagingSenderId: "725657314446",
    appId: "1:725657314446:web:46e71dc4e4ddcccc0515df",
    measurementId: "G-L36F0RL44J"
  })

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.firestore();
export const functions = firebase.functions();

export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};