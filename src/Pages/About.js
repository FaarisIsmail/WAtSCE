import React from 'react';
import {auth} from '../firebase.js'

import './About.css';

export default function About() {
  return (
    <div className="about">
      <h2> About WATSCE</h2>
      <p>      
      Welcome to WATSCE! This is a website created by Pitt students with the overarching goal of 
      providing Hill District high school students with new opporunities to learn and apply digital skills. 
      Teachers, local business owners, and community leaders are able to use WATSCE to create and post events
      for students to attend. Once students arrive at an event, they can check in using QR scanner
      technology, providing valuable feedback and data for event hosts. To start hosting events, simply sign in using
      your mobile phone and request host access on our Create an Event page.  
      </p>
    </div>
  )
}


