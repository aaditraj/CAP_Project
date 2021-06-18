import React from "react";
import '/Users/araj/Desktop/Coding/cap/cap_project/src/App.css';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

import GetData from "./DataFetching/GetData"

//styling components from React Bootstrap
import Jumbotron from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {
    Link
  } from "react-router-dom";

//Question components (e.g. radio buttons, textboxes) for the questions
import DropdownQuestion from "./Dropdown/Dropdown.js"
import FillInBlank from "./FillTheBlank/FillTheBlank.js";
import MultChoice from "./MultChoice/MultChoice.js";
// import TrueFalse from "./components/Quiz/TrueFalse/TrueFalse.js"

//features for the results page: generating report, and viewing statistics
import generatePDF from "./Report/GeneratePDF.js"
import ViewStatistics from "./Report/Statistics"

class Quiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selection: null,
            fetched: false,
            // userDataFetched: false,
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
            trueFalseState: null,
            trueFalseCorrect: 0,
            submissionState: null,
        }
    }


    async componentDidMount(){
        // firebase.auth().onAuthStateChanged(async firebaseUser => {
        //     if (firebaseUser) {
            this.handleTopicSelect()
            var firebaseApp = firebase.apps[0]
            this.db = firebaseApp.firestore()
            this.allUserData = this.db.collection("UserData")
            this.readUserRef = this.allUserData.where(
                "Email", "==", firebase.auth().currentUser.email)
            await this.readUserRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                this.userData = doc.data();
                this.writeUserRef = this.allUserData.doc(doc.id)
                })
                // this.setState({
                //     userDataFetched: true
                // })
                // this.setState({
                // logged_in: true,
                // })
            //   this.handleNewTake()
            })
        //     } else {
        //     this.setState({
        //         // logged_in : false,
        //         // written: false,
        //         // login_error: false,
        //         // create_error: false,
        //         fetched: false,
        //         submitted: false,
        //         submissionState: null
        //     })
        //     }
        // })
    }
    handleTopicSelect = () => {
        this.setState({
            selection: this.props.selected
        },this.prepareQuiz);

        // this.setState({
        //     title: event.target.value
        // }, function() {
        //     this.validateTitle();
        //   });
    }


    handleDropdownSelect = (i, e) => {
        this.setState({
          dropdownText: e,
          dropdownState: i
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
        if (q === 3){
        this.setState({
            trueFalseState: i
        })
        }
    }

    //checks that all questions 
    //are answered with no errors 
    //if no error, compares user's 
    //answer with database and writes 
    //score and new statistics
    // to the database
    handleSubmit = async() => {
        this.score = 0;
        if (this.state.multChoiceState1 === null 
        || this.state.multChoiceState2 === null
        || this.state.dropdownState === null
        || this.state.trueFalseState === null
        || this.state.fillBlankText === ''
        || this.state.fillBlankError) {
            this.setState({
            submissionState: <Alert className="submission-alert"
            variant="danger" dismissible
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
                trueFalseCorrect: (Boolean(this.state.trueFalseState) !== await this.truefalseData.Answer ? 1: 0),
                }, async() => {
                this.setState({
                    fillBlankCorrect: (this.state.fillBlankText.toLowerCase().trim() === await this.fillBlankData.Answer.toLowerCase().trim() ? 1 : 0),
                    submissionState: <Alert className="submission-alert"
                    variant="info" >Processing your submission...</Alert>
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
                        this.props.onUserDataChange(this.userData)
                        this.setState({
                        submitted: true
                        })
                        this.allUserData = this.db.collection("UserData")
                    })
                    })
                }) 
                })
            })
            })
        })
        // this.resultsPDF = generatePDF([
        //   {
        //     type: "Dropdown",
        //     question: this.state.dropdownQuestion,
        //     answer: this.state.dropdownChoices[this.dropdownData.Answer],
        //     selected: this.state.dropdownChoices[this.state.dropdownState],
        //     points: this.state.dropdownCorrect
        //   },
        //   {
        //     type: "Fill In The Blank",
        //     question: this.state.fillBlankQuestion,
        //     answer: this.fillBlankData.Answer,
        //     selected: this.state.fillBlankText,
        //     points: this.state.fillBlankCorrect
        //   },
        //   {
        //     type: "Multiple Choice",
        //     question: this.state.multQuestion1,
        //     answer: this.state.multChoices1[this.multData.Answer],
        //     selected: this.state.multChoices1[this.state.multChoiceState1],
        //     points: this.state.multChoiceCorrect1
        //   },
        //   {
        //     type: "Multiple Choice",
        //     question: this.state.multQuestion2,
        //     answer: this.state.multChoices2[this.multData2.Answer],
        //     selected: this.state.multChoices2[this.state.multChoiceState2],
        //     points: this.state.multChoiceCorrect2
        //   },
        //   {
        //     type: "True or False",
        //     question: this.state.trueFalseQuestion,
        //     answer: this.truefalseData.Answer ? "True" : "False",
        //     selected: this.state.trueFalseState,
        //     points: this.state.trueFalseCorrect
        //   }
        // ], this.userData.Name, false)
        
        var resultsPDF = this.createPDF(false)
        console.log(resultsPDF)
        const date = Date().split(" ");
        let dateStr = "";
        for (let i = 0; i <= 4; i++){
            if (i === 4){
                dateStr += date[i]
            }else{
                dateStr += date[i] + "-"
            }
        }
        var metadata = {
            "Score": this.score.toString(),
            "Topic": this.state.selection
        }
        var resultsStorageRef = firebase.storage().ref().child(`Results/${firebase.auth().currentUser.email}/results_${dateStr}.pdf`)
        resultsStorageRef.put(resultsPDF, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        }
    }

     //resets question information when user takes new quiz
  prepareQuiz = async () => {
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
        trueFalseState: null,
        trueFalseCorrect: 0,
        submissionState: null,
        submitted: false,
        fillBlankError: false,
        fillBlankAnswerState: null,
      })
    }
  }

  createPDF = (showDialog) => {
    var pdf = generatePDF([
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
          selected: this.state.trueFalseState === 0 ? "True" : "False",
          points: this.state.trueFalseCorrect
        }
      ], this.state.selection, this.userData.Name, showDialog)
      console.log(pdf)
      if (!showDialog){
          return pdf;
      }
  }

  render() {
    
    // if(!this.state.selection){
    //     if(this.state.userDataFetched){
    //         let components = [];
    //         let topics = ["Know Your Numbers", "Dates and Times", "People", "Places", "Terms, Creeds, Mottos", "Potpourri"]
    //         for (let index = 0; index < topics.length; index++) {
    //             components.push(
    //                 <div className="topic-container">
    //                     {/* <Image src="https://logodix.com/logo/1610537.png" alt={topics[index]} className="topic-image"/> */}
    //                     <div className="topic-image" id={topics[index].split(" ")[0]}>
    //                     <Button className="middle" onClick = {() => this.handleTopicSelect(topics[index])}>{topics[index]}</Button>
    //                     </div>
    //                 </div>
    //             )   
    //         }
    //         return(
    //             <div>
    //                 <Jumbotron className = "jumbo">
    //                     <h1>Welcome, {firebase.auth().currentUser.displayName.split(" ")[0]}</h1>
    //                     <h4>Choose a Quiz Topic Below!</h4>
    //                 </Jumbotron>
    //                 <div id="Choose-Topics">

    //                     <div className="topics-wrapper">
    //                         {components}
    //                     </div>
                        

    //                 </div>
    //             </div>
    //         )
            
        // } else {
        //     return(
        //         <div className = "loading-screen">
        //         <h1>Loading...</h1>
        //         <Spinner animation="border" variant="light" />
        //         </div>
        //     )
        // }
        

    // } else {
    if (this.state.fetched) {
        //if question data fetched & user has not submitted, render a welcome message
        //and a div for each question. Question components do not include the actual question
        if (this.state.submitted === false){
            let components = []
            if (this.state.submissionState !== null){
                components.push(
                    <div className = 'submissionError'>
                    {this.state.submissionState}
                    </div>
                )
            }
            return (
            <div className="Quiz">
                <header className="quiz-header">
                    <Jumbotron className = "jumbo jumbo1">
                        <h1>FBLA Expert</h1>
                        <h4>{this.state.selection}</h4>
                    </Jumbotron>
                    {/* <Button variant="link"
                    className="go-back" onClick = {() => this.setState({fetched: false, selection: null})}>Back</Button> */}
                {/* <Dropdown className = "logout">
                    <Dropdown.Toggle variant="outline-primary">
                        {this.userData.Name}
                    </Dropdown.Toggle>
    
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey={'logout'}
                        onSelect = {this.handleLogout}
                        key = {'logout'}>Logout
                        </Dropdown.Item>
                        <ViewStatistics
                        menuItem = "true" highScore = {this.userData.Highest_Score}
                        lowestScore = {this.userData.Lowest_Score} average = {this.userData.Average}
                        attempts = {this.userData.Scores.length}
                        />
                        <Leaderboard data = {this.allUserData}/>     
                    </Dropdown.Menu>
                </Dropdown> */}
                {/* <Button variant = "outline-primary" onClick = {this.handleLogout}>Logout</Button> */}
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
                <div id = "mult-choice" className = "question">
                <h5>5. {this.state.trueFalseQuestion}</h5>
                <MultChoice onSelect = {(i, q) => this.handleMultChoiceSelect(i, q)} disabled = 'false'
                    answerChoices = {['True', 'False']} question = '3'
                />
                {/* <TrueFalse onSelect = {this.handleTrueFalseSelect} disabled = 'false'/> */}
                </div>
                {components}
                <div className = "submit">
                <Button id = "submit-button"
                type = "submit" 
                onClick = {this.handleSubmit}><strong>
                <h4>Submit</h4></strong></Button>
                </div>
            </div>
        )} else { 
            // if the user has clicked 'submit', displays the results page
            // with read-only/disabled questions showing the results
            return (
            <div className = "Quiz submission">
                <header>
                <Jumbotron className = "jumbo">
                    <h1>FBLA Expert</h1>
                    <h4>You scored {this.score}/5 in "{this.state.selection}"</h4>
                </Jumbotron>
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
                {/* <TrueFalse disabled = 'true' answer = {this.truefalseData.Answer}/> */}
                <MultChoice answerChoices = {['True', 'False']} disabled = 'true' selected = {this.state.trueFalseState}
                answer = {this.truefalseData.Answer ? 0 : 1}/>
                </div>
                <div id = "submission-options">
                {/*Three submission options, clicking download report button
                creates a pdf with the current quiz results, which are passed as a paramater*/}
                <div className = "take-another-quiz">
                <Button id="retake-button" as={Link} to="/">
                <h4>Take Another Quiz</h4></Button>
                </div>
                <div className = "export">
                <Button variant = "primary" onClick = {() => this.createPDF(true)}>
                <h4>Download Results</h4></Button>
                </div>
                {/*Displays user's quiz score statistics in a popup*/}
                <div><ViewStatistics itemFormat = "button" fetched={true} data={this.userData}/></div>
                </div>
            </div>
            )
        }
        } else {
        return (
            <div className = "loading-screen">
            <h1>Loading...</h1>
            {/* <Spinner animation="border" variant="light" /> */}
            <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
        }
    }

}

export default Quiz;