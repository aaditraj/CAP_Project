import React from "react";
import './App.css';
import firebase from "firebase/app";
import Jumbotron from "react-bootstrap/Jumbotron";
import InfoButton from "./components/InfoDisplay";
import DropdownQuestion from "./components/Questions/Dropdown"
import FillInBlank from "./components/Questions/FillTheBlank";
import MultChoice from "./components/Questions/MultChoice";

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fetched: false,
      multChoices: null,
      multQuestion: null,
      multAnswer: null,
      dropdown_state: 'Choose',
      dropdown_correct: 0,
      fill_blank_text: '',
      fill_blank_correct: 0,
      multChoice_state: '',
      multChoice_correct: 0
    }
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleMultChoiceSelect = this.handleMultChoiceSelect.bind(this)

    const firebaseApp = firebase.apps[0];
    const db = firebaseApp.firestore();
    var multList = ['MultChoice1', 'MultChoice2', 'MultChoice3', 'MultChoice4', 'MultChoice5', 
    'MultChoice6', 'MultChoice7', 'MultChoice8', 'MultChoice9', 'MultChoice10'];
    var multRef = db.collection("MultipleChoice").doc(multList[Math.floor((Math.random() * 10))]);


    const getData = async () => {
      await multRef.get().then((doc) => {
        if (doc.exists) {
            this.setState({
              fetched: true,
              multChoices: doc.data().Choices,
              multAnswer: doc.data().Answer,
              multQuestion: doc.data().Question,
            })
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
    getData();
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

  handleMultChoiceSelect(e){
    console.log(e)
    this.setState({
      multChoice_state: e.target.labels[0].innerText,
      multChoice_correct: (e.target.labels[0].innerText === this.state.multAnswer ? 1 : 0)
    }, function() {
      console.log(this.state.multChoice_correct)
    })
  }
  render() {
    if (this.state.fetched === true){
      return (
        <div className="App">
          <header>
            <Jumbotron className = "jumbo">
              <h1>Welcome</h1>
              <h4>Enjoy this great quiz about FBLA!</h4>
            </Jumbotron>
            <InfoButton/>
          </header>
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
          <div id = "mult-choice" className = "question">
            <h5>3. {this.state.multQuestion}</h5>
            <MultChoice onSelect = {this.handleMultChoiceSelect} answerChoices = {this.state.multChoices}/>
            <h6>{this.state.multChoice_correct === 1 ? 'Correct Answer!' : 'Incorrect Answer :('}</h6>
          </div>
        </div>
      );
    } else {
      return (
        <h1>Loading...</h1>
      );
    }
  }
}

export default App;
