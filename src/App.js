import React from "react";
import './App.css';
import firebase from "firebase";
import Jumbotron from "react-bootstrap/Jumbotron";
import InfoButton from "./components/InfoDisplay";
import DropdownQuestion from "./components/Questions/Dropdown"
import FillInBlank from "./components/Questions/FillTheBlank";

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      dropdown_state: 'Choose',
      dropdown_correct: 0,
      fill_blank_text: '',
      fill_blank_correct: 0
    }
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleDropdownSelect(e){
    console.log(e)

    this.setState({
      dropdown_state: e,
      dropdown_correct: (e === "New Dehli" ? 1 : 0)
    }, function() {
      console.log(this.state.dropdown_correct)
    })
  }

  handleChange(e){
    // todo
    this.setState({
      fill_blank_text: e.target.value,
      fill_blank_correct: (e.target.value.toLowerCase() === 'correct' ? 1 : 0)
     })
  }
  render() {
    const firebaseApp = firebase.apps[0];
    const db = firebaseApp.firestore();
    var docRef = db.collection("testCollection").doc("testDoc");
    var data;

    const getData = async () => {
      await docRef.get().then(function(doc) {
        if (doc.exists) {
            data = doc.data(); 
            console.log(data)
        } else {
            // doc.data() will be undefined in this case
            data = "Not a document!";
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
    getData();
    return (
      <div className="App">
        <header>
          <Jumbotron className = "jumbo">
            <h1>Welcome</h1>
            <h4>Enjoy this great quiz about FBLA!</h4>
          </Jumbotron>
          <InfoButton/>
        </header>
        {/* <div className = "config-details">
          <h6>CONFIG DETAILS</h6>
          <code>
            <pre>{JSON.stringify(firebaseApp.options, null, 2)}</pre>
          </code>
        </div> */}
        <div id = "dropdown" className = "question">
          <h5>1. What is the capital of India?</h5>
          <DropdownQuestion onSelect = {this.handleDropdownSelect} value = {this.state.dropdown_state}/>
          <h6>{this.state.dropdown_correct ? 'Correct Answer! :D' : 'Incorrect Answer :('}</h6>
        </div>
        <div id = "fill-blank" className = "question">
          <h5>2. A _____ answer will increase your score.</h5>
          <FillInBlank onChange = {this.handleChange}/>
          <h6>Your answer, {this.state.fill_blank_text}, is {this.state.fill_blank_correct === 1 ? 'correct' : 'incorrect'}</h6>
        </div>
        <pre>{JSON.stringify(data)}</pre>
      </div>
    );
  }
}

export default App;
