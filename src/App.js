import './App.css';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import StyledFirebaseAuth from 'react-firebaseui/dist/StyledFirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router} from "react-router-dom";
import Route from "react-router-dom/Route";
import Navbar from "./components/Navbar/Navbar";
import {auth, uiConfig} from './firebase.js'
import About from './Pages/About';
import CreateEvent from './Pages/CreateEvent';
import Home from './Pages/Home';
import calLottie from './lottie'
import { RequestForm } from './Pages/RequestForm';
import { Checkin } from './Pages/Checkin';
import { Details } from './Pages/Details';
import Schedule from './Pages/Schedule';
import { Button } from './components/Button';
import { useEffect, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './components/Navbar/logo7.png';

toast.configure();

function App() {  
  const [user, loading] = useAuthState(auth);

  if (loading) { 
    return null
  }
  if (!user) {
    return <SignInScreen />
  }
  if (!auth.currentUser.displayName) {
    console.log(auth.currentUser.displayName)
    return (
      <div class="bodyForm">
        <form class = "form" onSubmit={setDisplayName}>
              <h1 class="title">Welcome to WATSCE!</h1>
              <h2 class="subtitle">Please enter a display name</h2>
              <div class="input-container ic1"> 
                <input class="input" type="text" id="displayName" name="displayName"></input> <br></br>
              </div> <br></br>
                <Button>Submit</Button>
            </form>
    </div>
    )
  }
  return (
    <Main />
  )
  

}

function Main() {
  /*const [role, setRole] = useState([]); 

  function getRole() {
    var docRef = db.collection("users").doc(auth.currentUser.uid);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            setRole(doc.data().role)
        } else {
            console.log("No such document!");
            setRole("none");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    })
}

useEffect(() => {
  getRole();
}, []);*/

  return (
    <>
      <Router>
        <Navbar />
        
        <Route exact path="/request_form" component={RequestForm} />
        <Route path="/about" component={About} />
        <Route path="/create-event" component={CreateEvent} />
        <Route path="/" exact component={Home} />
        <Route path="/checkin" component={Checkin} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/details" component={Details} />

      </Router>

      <ToastContainer theme="dark" limit={3}/>
    </>

    
  );
}

function SignInScreen() {
  
    return (
      <div className="App">
        <img className="nav-icon" src={logo} alt="logo_main" width="250"/>
        {calLottie()}
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
}

function setDisplayName(event) {
  event.preventDefault();
  auth.currentUser.updateProfile({
    displayName: event.target.displayName.value
  }).then(() => {
    console.log("Displayname successfully updated!")
    window.location.reload(false)
  }).catch((error) => {
    console.log("Displayname could not be updated!")
  });
  console.log(auth.currentUser.displayName)
}




export default App;