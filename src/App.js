import React from "react";
import Button from "react-bootstrap/Button"
import './App.css';
import firebase from "firebase/app";
import 'firebase/firestore';
import Jumbotron from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner"
import InfoButton from "./components/InfoDisplay.js";
import DropdownQuestion from "./components/Questions/Dropdown/Dropdown.js"
import FillInBlank from "./components/Questions/FillTheBlank/FillTheBlank.js";
import MultChoice from "./components/Questions/MultChoice/MultChoice.js";
import TrueFalse from "./components/Questions/TrueFalse/TrueFalse.js"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetched: false,
      submitted: false,
      multChoices1: null,
      multQuestion1: null,
      multChoiceState1: null,
      multChoiceCorrect1: 0,
      multChoices2: null,
      multQuestion2: null,
      multChoiceState2: null,
      multChoiceCorrect2: 0,
      dropdownChoices: null,
      dropdownQuestion: null,
      dropdownText: 'Choose',
      dropdownState: null,
      dropdownCorrect: 0,
      fillBlankQuestion: null,
      fillBlankText: '',
      fillBlankCorrect: 0,
      fillBlankAnswerState: null,
      fillBlankError: false,
      trueFalseQuestion: null,
      trueFalseText: 'True/False',
      trueFalseCorrect: 0,
      submissionState: null,
    }
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
    this.handleTrueFalseSelect = this.handleTrueFalseSelect.bind(this)
    this.handleFillBlank = this.handleFillBlank.bind(this)
    this.handleMultChoiceSelect = this.handleMultChoiceSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTake = this.handleTake.bind(this)
    this.firebaseApp = firebase.apps[0];
    this.db = this.firebaseApp.firestore();
    this.multChosen = Math.floor(Math.random() * 20);
    this.multRef = this.db.collection("MultipleChoice").doc("" + this.multChosen);
    this.multChosen2 = Math.floor(Math.random() * 20);
    while (this.multChosen2 === this.multChosen){
      this.multChosen2 = Math.floor(Math.random() * 20)
    }
    this.multRef2 = this.db.collection("MultipleChoice").doc("" + this.multChosen2);
    this.dropdownRef = this.db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)));
    this.trueFalseRef = this.db.collection("TrueFalse").doc( "" + Math.floor((Math.random() * 10)));
    this.fillBlankRef = this.db.collection("FillInTheBlank").doc("" + Math.floor((Math.random() * 10)))
    this.getData();
  }
  async getData() {
    this.setState({
      fetched: false
    })
    await this.multRef.get().then(async (doc) => {
      if (doc.exists) {
        this.multData = doc.data()
        this.setState({
          multChoices1: doc.data().Choices,
          multQuestion1: doc.data().Question,
        }) 
        await this.multRef2.get().then(async (doc) => {
          if (doc.exists) {
            this.multData2 = doc.data()
            this.setState({
              multChoices2: doc.data().Choices,
              multQuestion2: doc.data().Question,
            })
            await this.dropdownRef.get().then(async (doc) => {
              if (doc.exists) {
                this.dropdownData = doc.data()
                this.setState({
                  dropdownChoices: doc.data().Choices,
                  dropdownQuestion: doc.data().Question,
                })
                await this.trueFalseRef.get().then(async (doc) => {
                  if (doc.exists) {
                    this.truefalseData = doc.data()
                    this.setState({
                      trueFalseQuestion: doc.data().Question
                    })
                    await this.fillBlankRef.get().then(async (doc) => {
                      if (doc.exists) {
                        this.fillBlankData = doc.data()
                        this.setState({
                          fetched: true,
                          fillBlankQuestion: doc.data().Question
                        })
                      }
                    }).catch(function(error){
                      console.log("Error getting document:", error)
                    })
                  }
                }).catch(function(error) {
                  console.log("Error getting document:", error)
                })
              }
            }).catch(function(error) {
              console.log("Error getting document:", error);
            });
          }
        }).catch(function(error) {
          console.log("Error getting document:", error)
        })
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
    console.log(this.state.fetched)
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
    if (!(e.target.value.match(/^[A-Za-z]+$/)) && 
    (e.target.value != '')){
      this.setState({
        fillBlankError: true,
        fillBlankAnswerState: 'Your answer should only include letters (a-z, A-Z).'
      })
    } else{
      this.setState({
        fillBlankError: false,
        fillBlankAnswerState: null,
        fillBlankText: e.target.value
      })
    }
  }

  handleMultChoiceSelect(i, q, e){
    console.log(i)
    if (q === 1){
      this.setState({
        multChoiceState1: i
      })
    }
    if (q === 2){
      this.setState({
        multChoiceState2: i
      })
    }
  }
  async handleSubmit() {
    if (this.state.multChoiceState1 === null 
      || this.state.multChoiceState2 === null
      || this.state.dropdownState === null
      || this.state.trueFalseText === 'True/False'
      || this.state.fillBlankText === ''
      || this.state.fillBlankError) {
        this.setState({
          submissionState: 'Please attempt all questions and fix any errors.'
        })
    } else{
      this.setState({
        multChoiceCorrect1: (this.state.multChoiceState1 === await this.multData.Answer ? 1 : 0)
      }, async () => {
        this.setState({
          multChoiceCorrect2: (this.state.multChoiceState2 === await this.multData2.Answer ? 1 : 0)
        }, async () => {
          this.setState({
            dropdownCorrect: (this.state.dropdownState === await this.dropdownData.Answer ? 1: 0)
          }, async () => {
            this.setState({
              trueFalseCorrect: (Boolean(this.state.trueFalseText.toLowerCase()) === await this.truefalseData.Answer ? 1: 0),
            }, async() => {
              this.setState({
                fillBlankCorrect: (this.state.fillBlankText.toLowerCase() === await this.fillBlankData.Answer ? 1 : 0),
                submissionState: 'Processing your submission...', 
                submitted: true
              })
            })
          })
        })
      })
    }
    
}
  async handleTake() {
    this.multRef = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    this.multRef2 = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    while (this.multRef === this.multRef2){
      this.multRef2 = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    }
    this.dropdownRef = this.db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)))
    this.trueFalseRef = this.db.collection("TrueFalse").doc("" + Math.floor((Math.random() * 10)))
    this.fillBlankRef = this.db.collection("FillInTheBlank").doc("" + Math.floor(Math.random() * 10))
    this.getData()
    if (this.state.fetched === true){
      this.setState({
        multChoiceState1: null,
        multChoiceCorrect1: 0,
        multChoiceState2: null,
        multChoiceCorrect2: 0,
        dropdownText: 'Choose',
        dropdownState: null,
        dropdownCorrect: 0,
        fillBlankCorrect: 0,
        fillBlankText: '',
        trueFalseText: 'True/False',
        trueFalseCorrect: 0,
        submissionState: null,
        submitted: false,
        fillBlankError: false,
        fillBlankAnswerState: null
        
      })
    }
  }

  render() {
    if (this.state.fetched === true){
      if (this.state.submitted === false){
        return (
          <div className="App">
            <header>
              <Jumbotron className = "jumbo">
                <h1>Trivia Time!</h1>
                <h4>Test your knowledge about FBLA!</h4>
              </Jumbotron>
              {/* <InfoButton/> */}
            </header>
            <div className = "question dropdown">
              <h5>1. {this.state.dropdownQuestion}</h5>
              <DropdownQuestion onSelect = {this.handleDropdownSelect} value = {this.state.dropdownText}
                answerChoices = {this.state.dropdownChoices} disabled = 'false'
              />
            </div>
            <div id = "fill-blank" className = "question">
              <h5>2. {this.state.fillBlankQuestion}</h5>
              <FillInBlank onChange = {this.handleFillBlank} disabled = 'false'/>
              <div className = 'fillBlankError'>
                <h6>{this.state.fillBlankAnswerState}</h6>
              </div>
            </div>
            <div id = "mult-choice" className = "question">
              <h5>3. {this.state.multQuestion1}</h5>
              <MultChoice onSelect = {(i, q) => this.handleMultChoiceSelect(i, q)} disabled = 'false' 
              answerChoices = {this.state.multChoices1} question = '1'/>
            </div>
            <div id = "mult-choice" className = "question">
              <h5>4. {this.state.multQuestion2}</h5>
              <MultChoice onSelect = {(i, q) => this.handleMultChoiceSelect(i, q)} disabled = 'false' 
              answerChoices = {this.state.multChoices2} question = '2'/>
            </div>
            <div className = "question dropdown">
              <h5>5. {this.state.trueFalseQuestion}</h5>
              <TrueFalse onSelect = {this.handleTrueFalseSelect} value = {this.state.trueFalseText}
                disabled = 'false'
              />
            </div>
            <div className = 'submissionError'>
              <h5>{this.state.submissionState}</h5>
            </div>
            <div className = "submit">
              <Button variant = "success" type = "submit" onClick = {this.handleSubmit}>Submit Answers</Button>
            </div>
          </div>
        );
      } else {
        return(
          <div className = "App">
            <Jumbotron className = 'jumbo App'>
              <h1>Results</h1>
            </Jumbotron>
            <div className = 'question dropdown'>
              <h5><strong>{this.state.dropdownCorrect === 1 ? "Correct Answer (1/1)" : "Incorrect Answer (0/1)"}</strong></h5>
              <h6>1. {this.state.dropdownQuestion}</h6>
              <DropdownQuestion answerChoices = {this.state.dropdownChoices} disabled = 'true'
              selected = {this.state.dropdownState} answer = {this.dropdownData.Answer}/>
            </div>
            <div className = 'question fill-blank'>
              <h5><strong>{this.state.fillBlankCorrect === 1 ? "Correct Answer (1/1)" : "Incorrect Answer (0/1)"}</strong></h5>
              <h6>2. {this.state.fillBlankQuestion}</h6>
              <FillInBlank disabled = 'true' text = {this.state.fillBlankText} correct = {this.state.fillBlankCorrect}
                answer = {this.fillBlankData.Answer}
              />
            </div>
            <div className = 'question mult-choice'>
              <h5><strong>{this.state.multChoiceCorrect1 === 1 ? "Correct Answer (1/1)" : "Incorrect Answer (0/1)"}</strong> </h5>
              <h6>3. {this.state.multQuestion1} </h6>
              <MultChoice answerChoices = {this.state.multChoices1} disabled = 'true' 
              selected = {this.state.multChoiceState1}  answer = {this.multData.Answer}
              />
            </div>
            <div className = 'question mult-choice'>
              <h5><strong>{this.state.multChoiceCorrect2 === 1 ? "Correct Answer (1/1)" : "Incorrect Answer (0/1)"}</strong> </h5>
              <h6>4. {this.state.multQuestion2} </h6>
              <MultChoice answerChoices = {this.state.multChoices2} disabled = 'true' 
              selected = {this.state.multChoiceState2}  answer = {this.multData2.Answer}/>
            </div>  
            <div className = 'question trueFalse'>
              <h5><strong>{this.state.trueFalseCorrect === 1 ? "Correct Answer (1/1)" : "Incorrect Answer (0/1)"}</strong></h5>
              <h6>5. {this.state.trueFalseQuestion}</h6>
              <TrueFalse disabled = 'true' answer = {this.truefalseData.Answer}/>
            </div>
            <br></br>
            <div className = "retake">
            <Button variant = "secondary" onClick = {this.handleTake}>Take Another Quiz</Button>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div>
          <h1>Loading...</h1>
          <Spinner animation="border" variant="dark" />
        </div>
      );
    }
  }
}

export default App;