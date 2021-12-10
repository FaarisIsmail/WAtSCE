<p align="center">
     <img src="src/logo-white-text.png"/>
</p>
    
Capstone project for CS1980 at the University of Pittsburgh

Contributors:

* [Faaris Ismail](https://github.com/FaarisIsmail)
* [Andrew Francioni](https://github.com/ajf109)
* [John Fessler](https://github.com/Avaex)

# Overview

WAtSCE (Web Apps to Support Community Enablement) is a scheduling app created by Pitt students with the overarching goal of providing Hill District high school students with new opporunities to learn and apply digital skills. Teachers, local business owners, and community leaders are able to use WATSCE to create and post events for students to attend.

# Getting Started
Please download the current Github repository into an empty folder on your machine. This can be done by using the `git clone https://github.com/FaarisIsmail/WAtSCE.git` on your command line while inside the folder.

## Please install the following on your machine:  
Enter the following commands while **inside** the repository folder on your local machine you created in the last step. It is best to install these in the order that they are listed. 

Latest Version of npm:  
`npm install -g npm`

Firebase CLI:  
`npm install -g firebase-tools`

Dependencies:  
``npm install``

## Running the app in local development mode
Run `npm start` (you must be in the local repository folder)  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Deploying Changes to the Site
This firebase project has been set up with Github Actions. To deploy changes to the live website, simply merge or commit changes to the `main` branch. Please allow a few minutes for changes to reflected on the site.

# Hosting and Cloud Database
Our hosting and database are done using Google Firebase and Firestore. You can view hosting, user, cloud, and database information can be found on the Firebase console for our project linked below (must have project access to view)  
[Firebase Console](https://console.firebase.google.com/project/cs1980/)

# Cloud Functions
Cloud functions are are also hosted on firebase and are located in the [functions](./functions) folder. There are currently two SMS cloud functions running
- Send Message: This allows the host to send messages to registered users from the 'Details' page for the particular event on the website.
- Send Reminders: This sends a reminder every day at 6pm to everyone who has registered for an event that will start the following day.

Both of these are SMS functions implemented with Twilio.

In order to add additional cloud functions, add them to the [index.js](./functions/index.js) file located inside the 'functions' folder. Then, run the command `firebase deploy --only functions` in your command line while in the local repository folder.

# Live Deployment Site
A live version of the WAtSCE website can be viewed here:  
[https://watsce.tech/](https://watsce.tech/)
