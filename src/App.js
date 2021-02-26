//we are using firebase cloud firestore database
import React from "react";
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

//Login page and function for getting the question data from the database
import LoginPage from "./components/Login/Login"
import GetData from "./components/DataFetching/GetData"

//styling components from React Bootstrap
import Jumbotron from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

//Question components (e.g. radio buttons, textboxes) for the questions
import DropdownQuestion from "./components/Questions/Dropdown/Dropdown.js"
import FillInBlank from "./components/Questions/FillTheBlank/FillTheBlank.js";
import MultChoice from "./components/Questions/MultChoice/MultChoice.js";
import TrueFalse from "./components/Questions/TrueFalse/TrueFalse.js"

//features for the results page: generating report, and viewing statistics
import generatePDF from "./components/Report/GeneratePDF.js"
import ViewStatistics from "./components/Report/Statistics"

//main class that is being loaded into the HTML
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      login_error: false,
      create_error: false,
      create_error_message: null,
      take_quiz: false,
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

  }
  
  //gets called when the quiz page loads to get the user's information (e.g. name)
  //also handles logout
  componentDidMount(){
    firebase.auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        var firebaseApp = firebase.apps[0]
        this.db = firebaseApp.firestore()
        this.readUserRef = this.db.collection("UserData").where(
          "Email", "==", firebase.auth().currentUser.email)
        await this.readUserRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.userData = doc.data();
            this.writeUserRef = this.db.collection("UserData").doc(doc.id)
          })
          this.setState({
            logged_in: true,
            take_quiz: true
          })})
      } else {
        this.setState({
          logged_in : false,
          take_quiz: false,
          written: false,
          login_error: false,
          create_error: false,
          fetched: false,
          submitted: false,
          submissionState: null
        })
      }
    })
  }
  
  //called when logging in or creating new account; calls function to get question data 
  async componentDidUpdate(prevProps, prevState){
    if (!prevState.take_quiz){
      if (this.state.take_quiz) {
        this.setState({
          logged_in : true
        })
        this.db = firebase.apps[0].firestore()
        this.handleNewTake()
      }
    }
  }
 
  handleDropdownSelect = (i, e) => {
    this.setState({
      dropdownText: e,
      dropdownState: i
    })
  }

  handleTrueFalseSelect = (e) => {
    this.setState({
      trueFalseText: e,
    })
  }
 
  //below three functions use firebase auth for login
  //authenticating existing account 
  handleLogin = (email, password) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(() => {
      this.setState({login_error: false})
      this.forceUpdate()
      this.setState({login_error: true})
      this.forceUpdate()
    })
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser){
        this.setState({
          take_quiz: true
        })
      }
    })
  }

  handleLogout = () => {
    const auth = firebase.auth();
    auth.signOut();
    window.location.reload(true)
  }

  //creating new account & writing new user info into database
  handleCreate = (firstName, lastName, email, password) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch((e) =>{ 
      this.setState({create_error: false})
      this.forceUpdate()
      this.setState({
        create_error: true,
        create_error_message: e.message
      })})
      this.forceUpdate()
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.setState({
          take_quiz : true
        })
        if (!(this.state.written) && !(this.state.create_error)){
          this.writeUserRef = firebase.apps[0].firestore().collection("UserData").doc()
          this.writeUserRef.set({
            Name: firstName + " " + lastName,
            Email: email,
            Scores: [],
            Highest_Score: null,
            Lowest_Score: null,
            Average: null
          }).then(this.setState({written: true}))
        }
      }
    }) 
  }

  //checking for invalid data entry in fill-in-the-blank textbox
  //if no error, captures user's entry
  handleFillBlank = (e) => {
    if (!(e.target.value.match(/^[A-Za-z]+$/)) && 
    (e.target.value !== '')){
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

  handleMultChoiceSelect = (i, q, e) => {
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

  //checks that all questions are answered with no errors
  //if no error, compares user's answer with database and writes 
  //score and new statistics to the database
  handleSubmit = async() => {
    this.score = 0;
    if (this.state.multChoiceState1 === null 
      || this.state.multChoiceState2 === null
      || this.state.dropdownState === null
      || this.state.trueFalseText === 'True/False'
      || this.state.fillBlankText === ''
      || this.state.fillBlankError) {
        this.setState({
          submissionState: <Alert variant="danger" dismissible
          onClose = {() => this.setState({
            submissionState: null
          })}>Please attempt all questions and fix any errors.</Alert>
        })
    } else{
      this.setState({
        multChoiceCorrect1: (this.state.multChoiceState1 === await this.multData.Answer ? 1 : 0),
      }, async () => {
        this.setState({
          multChoiceCorrect2: (this.state.multChoiceState2 === await this.multData2.Answer ? 1 : 0),
        }, async () => {
          this.setState({
            dropdownCorrect: (this.state.dropdownState === await this.dropdownData.Answer ? 1: 0),
          }, async () => {
            this.setState({
              trueFalseCorrect: (this.state.trueFalseText.toLowerCase() === await this.truefalseData.Answer.toString() ? 1: 0),
            }, async() => {
              this.setState({
                fillBlankCorrect: (this.state.fillBlankText.toLowerCase() === await this.fillBlankData.Answer ? 1 : 0),
                submissionState: <Alert variant="info" >Processing your submission...</Alert>
              }, async () => {
                this.score = this.state.multChoiceCorrect1
                + this.state.multChoiceCorrect2 + this.state.dropdownCorrect + 
                this.state.trueFalseCorrect + this.state.fillBlankCorrect
                this.userData.Scores.push(this.score)
                this.writeUserRef.update({
                  Scores: this.userData.Scores,
                  Highest_Score: Math.max(...this.userData.Scores),
                  Lowest_Score: Math.min(...this.userData.Scores),
                  Average:  ((this.userData.Scores.reduce((a, b) => a + b, 0))/(this.userData.Scores.length)).toFixed(2)
                }).then(async () => {
                  this.readUserRef = this.db.collection("UserData").where(
                    "Email", "==", firebase.auth().currentUser.email)
                  await this.readUserRef.get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      this.userData = doc.data();
                    })
                    this.setState({
                      submitted: true
                    })
                  })
                })
              }) 
            })
          })
        })
      })
    }
  }

  //resets question information when user takes new quiz
  handleNewTake = async () => {
    var data = await GetData(this.state)
    var state = data[0];
    var questionData = data[1]
    this.setState({
      multChoices1: state.multChoices1,
      multQuestion1: state.multQuestion1,
      multChoices2: state.multChoices2,
      multQuestion2: state.multQuestion2,
      dropdownChoices: state.dropdownChoices,
      dropdownQuestion: state.dropdownQuestion,
      trueFalseQuestion: state.trueFalseQuestion,
      fillBlankQuestion: state.fillBlankQuestion,
      fetched: state.fetched
    })
    this.multData = questionData.get('multipleChoice');
    this.multData2 = questionData.get('multipleChoice2');
    this.dropdownData = questionData.get('dropdown');
    this.truefalseData = questionData.get('trueFalse');
    this.fillBlankData = questionData.get('fillInTheBlank');
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
        fillBlankAnswerState: null,
      })
    }
  }

  render = () => {
    if (this.state.logged_in === false){
      return (
        //rending Login component from another file, uses passed props to reference
        <LoginPage onLogin = {this.handleLogin} onCreate = {this.handleCreate}
        error = {this.state.login_error} create_error = {this.state.create_error}
          create_error_message = {this.state.create_error_message}
        />
      )
    } else {
      if (this.state.fetched) {
        //if question data fetched & user has not submitted, render a welcome message
        //and a div for each question. Question components do not include the actual question
        if (this.state.submitted === false){
          return (
            <div className="App">
              <header>
                <Jumbotron className = "jumbo">
                  <h1>Welcome, {this.userData.Name.split(" ")[0]}</h1>
                  <h4>Are you an FBLA Expert?</h4>
                </Jumbotron>
                <Button variant = "outline-primary" onClick = {this.handleLogout}>Logout</Button>
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
                <Button id = "submit-button"
                variant = "success" type = "submit" 
                onClick = {this.handleSubmit}><strong>Submit</strong></Button>
              </div>
            </div>
        )} else { 
          // if the user has clicked 'submit', displays the results page
          // with read-only/disabled questions showing the results
          return (
            <div className = "App submission">
              <header>
                <Jumbotron className = "jumbo">
                  <h1>FBLA Expert</h1>
                  <h4>Score: {this.score}/5</h4>
                </Jumbotron>
                <Button variant = "outline-primary" onClick = {this.handleLogout}>Logout</Button>
              </header>
              <div className = 'question dropdown'>
                  <h5><strong>{this.state.dropdownCorrect === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                  <h6>1. {this.state.dropdownQuestion}</h6>
                  <DropdownQuestion answerChoices = {this.state.dropdownChoices} disabled = 'true'
                selected = {this.state.dropdownState} answer = {this.dropdownData.Answer}/>
              </div>
              <div className = 'question fill-blank'>
                <h5><strong>{this.state.fillBlankCorrect === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                <h6>2. {this.state.fillBlankQuestion}</h6>
                <FillInBlank disabled = 'true' text = {this.state.fillBlankText} correct = {this.state.fillBlankCorrect}
                  answer = {this.fillBlankData.Answer}
                />
              </div>
              <div className = 'question mult-choice'>
                <h5><strong>{this.state.multChoiceCorrect1 === 1 ? "Correct Answer" : "Incorrect Answer"}</strong> </h5>
                <h6>3. {this.state.multQuestion1} </h6>
                <MultChoice answerChoices = {this.state.multChoices1} disabled = 'true' 
                selected = {this.state.multChoiceState1}  answer = {this.multData.Answer}
                />
              </div>
              <div className = 'question mult-choice'>
                <h5><strong>{this.state.multChoiceCorrect2 === 1 ? "Correct Answer" : "Incorrect Answer"}</strong> </h5>
                <h6>4. {this.state.multQuestion2} </h6>
                <MultChoice answerChoices = {this.state.multChoices2} disabled = 'true' 
                selected = {this.state.multChoiceState2}  answer = {this.multData2.Answer}/>
              </div>  
              <div className = 'question trueFalse'>
                <h5><strong>{this.state.trueFalseCorrect === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                <h6>5. {this.state.trueFalseQuestion}</h6>
                <TrueFalse disabled = 'true' answer = {this.truefalseData.Answer}/>
              </div>
              <br></br>
              <div className = "submission-options">
              {/*Three submission options, clicking download report button
              creates a pdf with the current quiz results, which are passed as a paramater*/}
                <div className = "retake">
                <Button variant = "secondary" onClick = {this.handleNewTake}>Take Another Quiz</Button>
                </div>
                <div className = "export">
                <Button variant = "warning" onClick = {() => generatePDF([
                  {
                    type: "Dropdown",
                    question: this.state.dropdownQuestion,
                    answer: this.state.dropdownChoices[this.dropdownData.Answer],
                    selected: this.state.dropdownChoices[this.state.dropdownState],
                    points: this.state.dropdownCorrect
                  },
                  {
                    type: "Fill In The Blank",
                    question: this.state.fillBlankQuestion,
                    answer: this.fillBlankData.Answer,
                    selected: this.state.fillBlankText,
                    points: this.state.fillBlankCorrect
                  },
                  {
                    type: "Multiple Choice",
                    question: this.state.multQuestion1,
                    answer: this.state.multChoices1[this.multData.Answer],
                    selected: this.state.multChoices1[this.state.multChoiceState1],
                    points: this.state.multChoiceCorrect1
                  },
                  {
                    type: "Multiple Choice",
                    question: this.state.multQuestion2,
                    answer: this.state.multChoices2[this.multData2.Answer],
                    selected: this.state.multChoices2[this.state.multChoiceState2],
                    points: this.state.multChoiceCorrect2
                  },
                  {
                    type: "True or False",
                    question: this.state.trueFalseQuestion,
                    answer: this.truefalseData.Answer ? "True" : "False",
                    selected: this.state.trueFalseText,
                    points: this.state.trueFalseCorrect
                  }
                ], this.userData.Name)}>Download Results</Button>
                {/*Displays user's quiz score statistics in a popup*/}
                <ViewStatistics highScore = {this.userData.Highest_Score}
                  lowestScore = {this.userData.Lowest_Score} average = {this.userData.Average}
                />
                </div>
              </div>     
            </div>
          )
        }
      } else {
        return (
          <div className = "loading-screen">
            <h1>Loading...</h1>
            <Spinner animation="border" variant="dark" />
          </div>
        )
      }
    }
  }
}
export default App;