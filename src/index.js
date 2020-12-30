import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase";
import reportWebVitals from './reportWebVitals';


firebase.initializeApp({
  apiKey: "AIzaSyD_dxaZ75fz-C96Lq1MoziqerFGTJbQC6k",
  authDomain: "cap-project-86c79.firebaseapp.com",
  projectId: "cap-project-86c79",
  storageBucket: "cap-project-86c79.appspot.com",
  messagingSenderId: "308193142608",
  appId: "1:308193142608:web:f35982c86c92ea8296ae55",
  measurementId: "G-1RW0FRKMTR"
})




ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
