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





function App() {
  const [user, loading] = useAuthState(auth);
  if (loading) { 
    return null
  }
  return (
    <header>
      {user ? <Main /> : <SignInScreen />}
    </header>
  );
}

function Main() {
  const history = useHistory();
  return (

    <Router>

    <Navbar />
    
    <Route path="/request_form" component={RequestForm} />
    <Route path="/about" component={About} />
    <Route path="/create-event" component={CreateEvent} />
    <Route path="/" exact component={Home} />
    <Route path="/register" component={Register} />

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



export default App;