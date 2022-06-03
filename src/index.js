import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import firebase from "firebase/app";
import configData from "./config.json"


firebase.initializeApp({
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  projectId: configData.projectId,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
  appId: configData.appId,
  measurementId: configData.measurementId
})


ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// let firebaseApp= firebase.apps[0];
// let db = firebaseApp.firestore();
// db.collection("DropDown").doc("Dates and Times").collection("Questions").doc("3").delete().then(() => {
//   console.log("successful deletion!")
// })

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
