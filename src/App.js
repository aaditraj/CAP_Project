import React from "react";
import Button from "react-bootstrap/Button"
import './App.css';
import firebase from "firebase/app";
import Jumbotron from "react-bootstrap/Jumbotron";
import InfoButton from "./components/InfoDisplay";
import DropdownQuestion from "./components/Questions/Dropdown"
import FillInBlank from "./components/Questions/FillTheBlank";
import MultChoice from "./components/Questions/MultChoice";
import TrueFalse from "./components/Questions/TrueFalse"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetched: false,
      submitted: false,
      multChoices: null,
      multQuestion: null,
      multChoiceState: null,
      multChoiceCorrect: 0,
      dropdownChoices: null,
      dropdownQuestion: null,
      dropdownText: 'Choose',
      dropdownState: null,
      dropdownCorrect: 0,
      fillBlankText: null,
      fillBlankCorrect: 0,
      trueFalseQuestion: null,
      trueFalseText: 'Choose',
      trueFalseCorrect: 0
    }
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleTrueFalseSelect = this.handleTrueFalseSelect.bind(this)
    this.handleFillBlank = this.handleFillBlank.bind(this)
    this.handleMultChoiceSelect = this.handleMultChoiceSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTake = this.handleTake.bind(this)
    this.firebaseApp = firebase.apps[0];
    this.db = this.firebaseApp.firestore();
    this.multRef = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    this.dropdownRef = this.db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)));
    this.trueFalseRef = this.db.collection("TrueFalse").doc( "" + Math.floor((Math.random() * 10)));
    this.getData();
  }

  componentDidMount() {
    this.getData = this.getData.bind(this)
  }
  async getData() {
    await this.multRef.get().then((doc) => {
      if (doc.exists) {
          this.multData = doc.data()
          this.setState({
            multChoices: doc.data().Choices,
            multQuestion: doc.data().Question,
          })
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
    await this.dropdownRef.get().then((doc) => {
      if (doc.exists) {
        this.dropdownData = doc.data()
        this.setState({
          dropdownChoices: doc.data().Choices,
          dropdownQuestion: doc.data().Question
        })
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
    await this.trueFalseRef.get().then((doc) => {
      if (doc.exists) {
        this.truefalseData = doc.data()
        this.setState({
          fetched: true,
          trueFalseQuestion: doc.data().Question
        })
      }
    })
  }
  
  handleDropdownSelect(i, e) {
    this.setState({
      dropdownText: e,
      dropdownState: i
    })
  }

  handleTrueFalseSelect(e) {
    this.setState({
      trueFalseText: e,
    })
  }

  handleFillBlank(e){
    this.setState({
      fillBlankText: e.target.value,
     })
  }

  handleMultChoiceSelect(i, e){
    console.log(i)
    this.setState({
      multChoiceState: i
    })
  }
  async handleSubmit() {
    var fetched = false;
    if (this.state.multChoiceState === await this.multData.Answer){
      this.setState({
        multChoiceCorrect: 1
      })
    } else {
      this.setState({
        multChoiceCorrect: 0
      })
    }
    if (this.state.dropdownState === await this.dropdownData.Answer){
      this.setState({
        dropdownCorrect: 1
      })
    } else {
      this.setState({
        dropdownCorrect: 0
      })
    }
    if (this.state.trueFalseText === await this.truefalseData.Answer){
      this.setState({
        trueFalseCorrect: 1
      })
      fetched = true;
    } else {
      this.setState({
        trueFalseCorrect: 0
      })
      fetched = true;
    }
    if (fetched) {
      this.setState({
        submitted: true
      })
    }
  }

  handleTake() {
    this.multRef = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    this.dropdownRef = this.db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)))
    this.trueFalseRef = this.db.collection("TrueFalse").doc("" + Math.floor((Math.random() * 10)))
    this.getData();

    this.setState({
      submitted: false
    })
  }

  render() {
    if (this.state.fetched === true){
      if (this.state.submitted === false){
        return (
          <div className="App">
            <header>
              <Jumbotron className = "jumbo">
                <h1>Welcome</h1>
                <h4>Enjoy this great quiz about FBLA!</h4>
              </Jumbotron>
              <InfoButton/>
            </header>
            <div className = "question dropdown">
              <h5>1. {this.state.dropdownQuestion}</h5>
              <DropdownQuestion onSelect = {this.handleDropdownSelect} value = {this.state.dropdownText}
                answerChoices = {this.state.dropdownChoices} disabled = 'false'
              />
            </div>
            <div id = "fill-blank" className = "question">
              <h5>2. A _____ answer will increase your score.</h5>
              <FillInBlank onChange = {this.handleFillBlank}/>
            </div>
            <div id = "mult-choice" className = "question">
              <h5>3. {this.state.multQuestion}</h5>
              <MultChoice onSelect = {(e) => this.handleMultChoiceSelect(e)} disabled = 'false' 
              answerChoices = {this.state.multChoices}/>
            </div>
            <div className = "question dropdown">
              <h5>4. {this.props.trueFalseQuestion}</h5>
              <TrueFalse onSelect = {this.handleTrueFalseSelect} value = {this.state.trueFalseText}/>
            </div>
            <div className = "submit">
              <Button variant = "success" type = "submit" onClick = {this.handleSubmit}>Submit Answers</Button>
            </div>
          </div>
        );
      } else {
        return(
          <div>
            <h1>You are viewing your results</h1>
            <div className = 'question dropdown'>
              <h5><strong>{this.state.dropdownCorrect === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
              <h6>1. {this.state.dropdownQuestion}</h6>
              <DropdownQuestion answerChoices = {this.state.dropdownChoices} disabled = 'true'
              selected = {this.state.dropdownState} answer = {this.dropdownData.Answer}/>
            </div>
            <h5>Question 2.</h5>
            <div className = 'question'>
              <h5><strong>{this.state.multChoiceCorrect === 1 ? "Correct Answer" : "Incorrect Answer"}</strong> </h5>
              <h6>3. {this.state.multQuestion} </h6>
              <MultChoice answerChoices = {this.state.multChoices} disabled = 'true' 
              selected = {this.state.multChoiceState}  answer = {this.multData.Answer}/>
            </div>
            <br></br>
            <Button variant = "secondary" onClick = {this.handleTake}>Take Another Quiz</Button>
          </div>
        )
      }
    } else {
      return (
        <h1>Loading...</h1>
      );
    }
  }
}

export default App;