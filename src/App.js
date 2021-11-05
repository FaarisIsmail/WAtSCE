import './App.css';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import StyledFirebaseAuth from 'react-firebaseui/dist/StyledFirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter as Router, Link, useHistory, Redirect} from "react-router-dom";
import Route from "react-router-dom/Route";
import Navbar from "./components/Navbar/Navbar";
import {auth, db, firestore, uiConfig} from './firebase.js'
import About from './Pages/About';
import CreateEvent from './Pages/CreateEvent';
import Home from './Pages/Home';
import calLottie from './lottie'
import { RequestForm } from './Pages/RequestForm';
import { Register } from './Pages/Register';
import { Details } from './Pages/Details';
import { Button } from './components/Button';




function App() {
  const [user, loading] = useAuthState(auth);
  if (loading) { 
    return null
  }
  if (!user) {
    return <SignInScreen />
  }
  while (!auth.currentUser.displayName) {
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
  return (

    <Router>

    <Navbar />
    
    <Route path="/request_form" component={RequestForm} />
    <Route path="/about" component={About} />
    <Route path="/create-event" component={CreateEvent} />
    <Route path="/" exact component={Home} />
    <Route path="/register" component={Register} />
    <Route path="/details" component={Details} />

    </Router>

  );
}

function SignInScreen() {
  
    return (
      <div className="App">
        <h1>WATSCE</h1>
        {calLottie()}
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
}

function setDisplayName(event) {
  auth.currentUser.updateProfile({
    displayName: event.target.displayName.value
  }).then(() => {
    console.log("Displayname successfully updated!")
  }).catch((error) => {
    console.log("Displayname could not be updated!")
  });
}



export default App;