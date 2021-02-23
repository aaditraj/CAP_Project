import React from "react";
import Button from "react-bootstrap/Button"
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import Jumbotron from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert";
import DropdownQuestion from "./components/Questions/Dropdown/Dropdown.js"
import FillInBlank from "./components/Questions/FillTheBlank/FillTheBlank.js";
import MultChoice from "./components/Questions/MultChoice/MultChoice.js";
import TrueFalse from "./components/Questions/TrueFalse/TrueFalse.js"
import generatePDF from "./components/Report/GeneratePDF.js"
import LoginPage from "./components/Login/Login"
import ViewStatistics from "./components/Report/Statistics"
// import GetData from "./components/DataFetching/GetData";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login_error: false,
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
  
  componentDidMount(){
    console.log("Component did mount was called.")
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
          })
          
        }).catch((error) => console.log(error))
      } else {
        this.setState({
          logged_in : false,
          written: false,
          take_quiz: false,
          login_error: false
        })
      }
    })
    

  }
  componentDidUpdate(prevProps, prevState){
    console.log("Component did update was called.")
    if (!prevState.take_quiz){
      if (this.state.take_quiz) {
        this.setState({
          logged_in : true
        })
        var firebaseApp = firebase.apps[0]
        this.db = firebaseApp.firestore()
        var multChosen = Math.floor(Math.random() * 20);
        this.multRef = this.db.collection("MultipleChoice").doc("" + multChosen);
        var multChosen2 = Math.floor(Math.random() * 20);
        while (multChosen2 === multChosen){
          multChosen2 = Math.floor(Math.random() * 20)
        }
        this.multRef2 = this.db.collection("MultipleChoice").doc("" + multChosen2);
        this.dropdownRef = this.db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)));
        this.trueFalseRef = this.db.collection("TrueFalse").doc( "" + Math.floor((Math.random() * 10)));
        this.fillBlankRef = this.db.collection("FillInTheBlank").doc("" + Math.floor((Math.random() * 10)))
        // GetData(this.state).then((state, data) => {
        //   this.setState({
        //     state
        //   })
        //   this.multData = data[0];
        //   this.multData2 = data[1];
        //   this.dropdownData = data[2];
        //   this.trueFalseData = data[3];
        //   this.fillBlankData = data[4];
        // })
        this.getQuestionData()
      }
    }
  }
  getQuestionData = async() => {
    console.log("calling getData.")
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
 
  handleLogin = (email, password) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(() => {
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
    const promise = auth.signOut();
    promise.catch(e => console.log(e.message))
    
  }
  handleCreate = (firstName, lastName, email, password) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message))
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      
      if (firebaseUser) {
        this.setState({
          take_quiz : true
        })
        if (!(this.state.written)){
          this.writeUserRef = firebase.apps[0].firestore().collection("UserData").doc()
          this.writeUserRef.set({
            Name: firstName + " " + lastName,
            Email: email,
            Scores: [],
            Highest_Score: null,
            Lowest_Score: null,
            Average: null
          })
        }
        this.setState({
          written: true
        })
      }
    })
    
  }

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
  handleSubmit = async() => {
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
              trueFalseCorrect: (Boolean(this.state.trueFalseText.toLowerCase()) === await this.truefalseData.Answer ? 1: 0),
            }, async() => {
              this.setState({
                fillBlankCorrect: (this.state.fillBlankText.toLowerCase() === await this.fillBlankData.Answer ? 1 : 0),
                submissionState: <Alert variant="info" >Processing your submission...</Alert>
              }, async () => {
                this.userData.Scores.push(this.state.multChoiceCorrect1
                  + this.state.multChoiceCorrect2 + this.state.dropdownCorrect + 
                  this.state.trueFalseCorrect + this.state.fillBlankCorrect)
                console.log(this.userData.Scores)
                this.writeUserRef.update({
                  Scores: this.userData.Scores,
                  Highest_Score: Math.max(...this.userData.Scores),
                  Lowest_Score: Math.min(...this.userData.Scores),
                  Average:  (this.userData.Scores.reduce((a, b) => a + b, 0))/(this.userData.Scores.length)
                })
                this.readUserRef = this.db.collection("UserData").where(
                  "Email", "==", firebase.auth().currentUser.email)
                console.log(this.readUserRef)
                await this.readUserRef.get().then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    console.log(doc.data())
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
    }
    
}
  handleNewTake = () => {
    this.multRef = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    this.multRef2 = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    while (this.multRef === this.multRef2){
      this.multRef2 = this.db.collection("MultipleChoice").doc("" + Math.floor((Math.random() * 10)));
    }
    this.dropdownRef = this.db.collection("DropDown").doc("" + Math.floor((Math.random() * 10)))
    this.trueFalseRef = this.db.collection("TrueFalse").doc("" + Math.floor((Math.random() * 10)))
    this.fillBlankRef = this.db.collection("FillInTheBlank").doc("" + Math.floor(Math.random() * 10))
    this.getQuestionData()
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
        <LoginPage onLogin = {this.handleLogin} onCreate = {this.handleCreate}
        error = {this.state.login_error}/>
      )
    } else {
      if (this.state.fetched) {
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
          return (
            <div className = "App submission">
              <header>
                <Jumbotron className = "jumbo">
                  <h1>FBLA Expert</h1>
                  <h4>Results</h4>
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
                ])}>Download Results</Button>
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