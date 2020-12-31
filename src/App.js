import React from "react";
import './App.css';
import firebase from "firebase";
import Jumbotron from "react-bootstrap/Jumbotron";
import InfoButton from "./components/InfoDisplay";
import DropdownQuestion from "./components/Questions/Dropdown"

class App extends React.Component {
  // const db = firebaseApp.firestore();
  // var docRef = db.collection("testCollection").doc("testDoc");
  // var data;

  // docRef.get().then(function(doc) {
  //     if (doc.exists) {
  //         data = doc.data(); 
  //     } else {
  //         // doc.data() will be undefined in this case
  //         data = "Not a document!";
  //     }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  // });
  constructor(props){
    super(props)
    this.state = {
      dropdown_state: 'Choose',
      dropdown_correct: 0
    }
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
  }
  handleDropdownSelect(e){
    console.log(e)

    this.setState({
      dropdown_state: e,
      dropdown_correct: (e === "Correct Ans" ? 1 : 0)
    }, function() {
      console.log(this.state.dropdown_correct)
    })
  }
  render() {
    const firebaseApp = firebase.apps[0];
    return (
      <div className="App">
        <header>
          <Jumbotron className = "jumbo">
            <h1>Welcome</h1>
            <h4>Enjoy this great quiz about FBLA!</h4>
          </Jumbotron>
          <InfoButton/>
        </header>
        <div className = "config-details">
          <h6>CONFIG DETAILS</h6>
          <code>
            <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
          </code>
        </div>
        <div>
          <h4>1. What is the correct answer?</h4>
          <DropdownQuestion onSelect = {this.handleDropdownSelect} value = {this.state.dropdown_state}/>
        </div>
      </div>
    );
  }
}

export default App;
