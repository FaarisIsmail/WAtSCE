import React from "react";
import {auth, db} from '../firebase.js'
import {useHistory} from "react-router-dom";

export function RequestForm() {
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
  
      return (
        <div>
           <form onSubmit={RequestAccess}>
              <div>Enter your name:</div> <br></br>
                <input type="text" id="rname" name="rname"></input> <br></br>
                <div>Why do you want to be able to create events?</div> <br></br>
                <input type="text" id="reason" name="reason"></input> <br></br>
                <button>Submit</button>
            </form>
        </div>
        )
  }
  
