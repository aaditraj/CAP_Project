import React from "react";
import '/Users/araj/Desktop/Coding/cap/cap_project/src/App.css';
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

import GetData from "./DataFetching/GetData"

//styling components from React Bootstrap
import Jumbotron from "react-bootstrap/Jumbotron";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {
    Link
  } from "react-router-dom";

//Question components (e.g. radio buttons, textboxes) for the questions
import DropDown from "./Dropdown/Dropdown.js"
import FillInBlank from "./FillTheBlank/FillTheBlank.js";
import MultChoice from "./MultChoice/MultChoice.js";
import QuizEditor from "./QuizEditor"
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
            submitted: false,
            multChoice: [],
            dropdown: [],
            fillBlank: [],
            trueFalse: [],
            questionNumbers: {
                multChoice: 2,
                dropdown: 1,
                fillBlank: 1,
                trueFalse: 1
            },
            maxQuestionNumbers: {
                multChoice: null,
                dropdown: null,
                fillBlank: null,
                trueFalse: null
            },
            score: 0,
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
        })
    }
    handleTopicSelect = () => {
        this.setState({
            selection: this.props.selected
        },this.prepareQuiz);
    }


    handleDropdownSelect = (i, q, e) => {
        // this.setState({
        //   dropdownText: e,
        //   dropdownState: i
        // })
        let dropdownQs = this.state.dropdown
        dropdownQs[q].selected = i
        dropdownQs[q].text = dropdownQs[q].choices[i]
        this.setState({
            dropdown: dropdownQs
        })

    }

    //checking for invalid data entry in fill-in-the-blank textbox
    //if no error, captures user's entry
    handleFillBlank = (q, e) => {
        let fillBlankQs = this.state.fillBlank
        if (!(e.target.value.match(/^[A-Za-z]+$/)) && 
        (e.target.value !== '')){
            fillBlankQs[q].error = true
            fillBlankQs[q].answerState = 'Your answer should only include letters (a-z, A-Z).'
        // this.setState({
        //     fillBlankError: true,
        //     fillBlankAnswerState: 'Your answer should only include letters (a-z, A-Z).'
        // })
        } else{
            fillBlankQs[q].error = false
            fillBlankQs[q].answerState = null
            fillBlankQs[q].selected = e.target.value

        this.setState({
            fillBlankError: false,
            fillBlankAnswerState: null,
            fillBlankText: e.target.value
        })
        }
    }

    handleMultChoiceSelect = (i, q, e) => {
        // if (q === 1){
        // this.setState({
        //     multChoiceState1: i
        // })
        // }
        // if (q === 2){
        // this.setState({
        //     multChoiceState2: i
        // })
        // }
        // if (q === 3){
        // this.setState({
        //     trueFalseState: i
        // })
        // }
        let multChoiceQs = this.state.multChoice
        multChoiceQs[q].selected = i
        this.setState({
            multChoice: multChoiceQs
        })
    }

    handleTrueFalseSelect = (i, q, e) => {
        let trueFalseQs = this.state.trueFalse
        trueFalseQs[q].selected = Boolean((i === 0 ? 1 : 0))
        this.setState({
            trueFalse: trueFalseQs
        })
    }

    calcQScore = (question) => {
        let point = (question.selected === question.answer ? 1 : 0)
        return point;
    }

    //checks that all questions 
    //are answered with no errors 
    //if no error, compares user's 
    //answer with database and writes 
    //score and new statistics
    // to the database
    handleSubmit = async() => {
        // this.score = 0;
        // if (this.state.multChoiceState1 === null 
        // || this.state.multChoiceState2 === null
        // || this.state.dropdownState === null
        // || this.state.trueFalseState === null
        // || this.state.fillBlankText === ''
        // || this.state.fillBlankError) {
        //     this.setState({
        //     submissionState: <Alert className="submission-alert"
        //     variant="danger" dismissible
        //     onClose = {() => this.setState({
        //         submissionState: null
        //     })}>Please attempt all questions and fix any errors.</Alert>
        //     })
        // } else{
            let multChoiceQs = this.state.multChoice
            let dropdownQs = this.state.dropdown
            let trueFalseQs = this.state.trueFalse
            let fillBlankQs = this.state.fillBlank

            let allQuestionSets = [multChoiceQs, dropdownQs, trueFalseQs, fillBlankQs]
            let correctCount = 0

            allQuestionSets.forEach((set, i) => {
                allQuestionSets[i].forEach((q, j) => {
                    allQuestionSets[i][j].correct = this.calcQScore(q)
                    correctCount += allQuestionSets[i][j].correct
                })
            })
            // multChoiceQs.forEach((q, index) => {
            //     multChoiceQs[index].correct = this.calcQScore(q)
            //     correctCount += multChoiceQs[index].correct
            // })
            // let dropdownQs = this.state.dropdown
            // dropdownQs.forEach((q, index) => {
            //     dropdownQs[index].correct = this.calcQScore(q)
            // })
            // let trueFalseQs = this.state.trueFalse
            // trueFalseQs.forEach((q, index) => {
            //     trueFalseQs[index].correct = this.calcQScore(q)
            // })
            // let fillBlankQs = this.state.fillBlank
            // fillBlankQs.forEach((q, index) => {
            //     fillBlankQs[index].correct = (q.selected.toLowerCase().trim() === q.answer.toLowerCase().trim() ? 1 : 0)
            // })
            this.setState({
                multChoice: multChoiceQs,
                dropdown: dropdownQs,
                trueFalse: trueFalseQs,
                fillBlank: fillBlankQs,
            }, console.log(this.state.multChoice, this.state.trueFalse,
                this.state.dropdown, this.state.fillBlank))
            let qNumbers = this.state.questionNumbers
            let totalQs = qNumbers.multChoice + qNumbers.dropdown + qNumbers.trueFalse + qNumbers.fillBlank
            let finalScore = correctCount/totalQs * 100
            this.setState({score:finalScore})
            this.userData.Scores.push(finalScore)
            let highestScore = this.userData.Highest_Score === null || finalScore > this.userData.Highest_Score ? finalScore : this.userData.Highest_Score
            let lowestScore = this.userData.Lowest_Score === null || finalScore < this.userData.Lowest_Score ? finalScore : this.userData.Lowest_Score
            let average = this.userData.Average === null ? finalScore : ((this.userData.Average * (this.userData.Scores.length - 1)) + finalScore) / this.userData.Scores.length
            this.writeUserRef.update({
                Scores: this.userData.Scores,
                Highest_Score: highestScore,
                Lowest_Score: lowestScore,
                Average:  average
            }).then(() => {
            // this.readUserRef = this.db.collection("UserData").where(
            //     "Email", "==", firebase.auth().currentUser.email)
            // await this.readUserRef.get().then((querySnapshot) => {
            //     querySnapshot.forEach((doc) => {
            //     this.userData = doc.data();
            //     })
                this.userData.Highest_Score = highestScore
                this.userData.Lowest_Score = lowestScore
                this.userData.Average = average
                this.props.onUserDataChange(this.userData)
                window.scrollTo(0, 0)
                this.setState({
                    submitted: true
                })
                this.allUserData = this.db.collection("UserData")
            })
        // this.setState({
        //     multChoiceCorrect1: (this.state.multChoiceState1 === await this.multData.Answer ? 1 : 0),
        // }, async () => {
        //     this.setState({
        //     multChoiceCorrect2: (this.state.multChoiceState2 === await this.multData2.Answer ? 1 : 0),
        //     }, async () => {
        //     this.setState({
        //         dropdownCorrect: (this.state.dropdownState === await this.dropdownData.Answer ? 1: 0),
        //     }, async () => {
        //         this.setState({
        //         trueFalseCorrect: (Boolean(this.state.trueFalseState) !== await this.truefalseData.Answer ? 1: 0),
        //         }, async() => {
        //         this.setState({
        //             fillBlankCorrect: (this.state.fillBlankText.toLowerCase().trim() === await this.fillBlankData.Answer.toLowerCase().trim() ? 1 : 0),
        //             submissionState: <Alert className="submission-alert"
        //             variant="info" >Processing your submission...</Alert>
        //         }, async () => {
        //             this.score = this.state.multChoiceCorrect1
        //             + this.state.multChoiceCorrect2 + this.state.dropdownCorrect + 
        //             this.state.trueFalseCorrect + this.state.fillBlankCorrect
        //             this.userData.Scores.push(this.score)
        //             this.writeUserRef.update({
        //             Scores: this.userData.Scores,
        //             Highest_Score: Math.max(...this.userData.Scores),
        //             Lowest_Score: Math.min(...this.userData.Scores),
        //             Average:  ((this.userData.Scores.reduce((a, b) => a + b, 0))/(this.userData.Scores.length)).toFixed(2)
        //             }).then(async () => {
        //             this.readUserRef = this.db.collection("UserData").where(
        //                 "Email", "==", firebase.auth().currentUser.email)
        //             await this.readUserRef.get().then((querySnapshot) => {
        //                 querySnapshot.forEach((doc) => {
        //                 this.userData = doc.data();
        //                 })
        //                 this.props.onUserDataChange(this.userData)
        //                 window.scrollTo(0, 0)
        //                 this.setState({
        //                 submitted: true
        //                 })
        //                 this.allUserData = this.db.collection("UserData")
        //             })
        //             })
        //         }) 
        //         })
        //     })
        //     })
        // })
        
            // var resultsPDF = this.createPDF(false)
            // console.log(resultsPDF)
            // const date = Date().split(" ");
            // let dateStr = "";
            // for (let i = 0; i <= 4; i++){
            //     if (i === 4){
            //         dateStr += date[i]
            //     }else{
            //         dateStr += date[i] + "-"
            //     }
            // }
            // var metadata = {
            //     "Score": finalScore.toString(),
            //     "Topic": this.state.selection
            // }
            // var resultsStorageRef = firebase.storage().ref().child(`Results/${firebase.auth().currentUser.email}/results_${dateStr}.pdf`)
            // resultsStorageRef.put(resultsPDF, metadata).then((snapshot) => {
            //     console.log('Uploaded a blob or file!');
            // });
        // }
    }

    //resets question information when user takes new quiz
    prepareQuiz = async () => {
        let qNumbers = this.state.questionNumbers
        var data = await GetData(this.state.selection, qNumbers.multChoice, qNumbers.dropdown, qNumbers.fillBlank, qNumbers.trueFalse)
        window.scrollTo(0, 0)
        this.setState({
            multChoice: data[1],
            dropdown: data[2],
            fillBlank: data[3],
            trueFalse: data[4],
            maxQuestionNumbers: {
                multChoice: data[5][0],
                dropdown: data[5][1],
                fillBlank: data[5][2],
                trueFalse: data[5][3]
            },
            fetched: data[0]
        })
        // var state = data[0];
        // var questionData = data[1]
        // window.scrollTo(0, 0)
        // this.setState({
        //     multChoices1: state.multChoices1,
        //     multQuestion1: state.multQuestion1,
        //     multChoices2: state.multChoices2,
        //     multQuestion2: state.multQuestion2,
        //     dropdownChoices: state.dropdownChoices,
        //     dropdownQuestion: state.dropdownQuestion,
        //     trueFalseQuestion: state.trueFalseQuestion,
        //     fillBlankQuestion: state.fillBlankQuestion,
        //     fetched: state.fetched
        // })
        // this.multData = questionData.get('multipleChoice');
        // this.multData2 = questionData.get('multipleChoice2');
        // this.dropdownData = questionData.get('dropdown');
        // this.truefalseData = questionData.get('trueFalse');
        // this.fillBlankData = questionData.get('fillInTheBlank');
        // if (this.state.fetched === true){
        //     this.setState({
        //     multChoiceState1: null,
        //     multChoiceCorrect1: 0,
        //     multChoiceState2: null,
        //     multChoiceCorrect2: 0,
        //     dropdownText: 'Choose',
        //     dropdownState: null,
        //     dropdownCorrect: 0,
        //     fillBlankCorrect: 0,
        //     fillBlankText: '',
        //     trueFalseState: null,
        //     trueFalseCorrect: 0,
        //     submissionState: null,
        //     submitted: false,
        //     fillBlankError: false,
        //     fillBlankAnswerState: null,
        //     })
        // }
    }

    handleQuizEdit = (dd, fb, mc, tf) => {
        this.setState({
            fetched: false,
            questionNumbers: {
                dropdown: parseInt(dd),
                fillBlank: parseInt(fb),
                multChoice: parseInt(mc),
                trueFalse: parseInt(tf)
            }
        }, this.prepareQuiz)
    }

    createPDF = (showDialog) => {
        let questions = [];
        this.state.dropdown.forEach((q) => {
            questions.push({
                type: "Dropdown",
                selected: q.choices[q.selected],
            })
        })
        this.state.fillBlank.forEach((q) => {
            questions.push({
                type: "Fill In The Blank",
                selected: q.selected,
            })
        })
        this.state.multChoice.forEach((q) => {
            questions.push({
                type: "Multiple Choice",
                selected: q.choices[q.selected],
            })
        })
        
        this.state.trueFalse.forEach((q) => {
            questions.push({
                type: "True or False",
                selected: q.selected
            })
        })
        let index = 0
        let sets = [this.state.dropdown, this.state.fillBlank, this.state.multChoice, this.state.trueFalse]
        sets.forEach((set) => {
            set.forEach((q) => {
                questions[index].question = q.question
                questions[index].answer = q.answer
                questions[index].points = q.correct
                index++
            })
        })
        var pdf = generatePDF(questions, this.state.score.toFixed(2), this.state.selection, this.userData.Name, showDialog)
        console.log(pdf)
        if (!showDialog){
            return pdf;
        }
    }

  render() {
    if (this.state.fetched) {
        //if question data fetched & user has not submitted, render a welcome message
        //and a div for each question. Question components do not include the actual question
        if (this.state.submitted === false){
            let questions = []
            let i = 0
            this.state.dropdown.forEach((dropdown) => {
                questions.push(
                    <div key={`dropdown${i}`} className = "question dropdown">
                    <h5>{questions.length + 1}. {dropdown.question}</h5>
                    <DropDown onSelect = {this.handleDropdownSelect} value = {this.state.dropdown[i].text}
                    answerChoices = {dropdown.choices} disabled = 'false'
                    question = {i}/>
                    </div>
                )
                i++
            })
            i = 0
            this.state.fillBlank.forEach((fillBlank) => {
                questions.push(
                    <div key={`fillBlank${i}`} className = "question fill-blank">
                    <h5>{questions.length + 1}. {fillBlank.question}</h5>
                    <FillInBlank onChange = {this.handleFillBlank} disabled = 'false' question = {i}/>
                    <div className = 'fillBlankError'>
                        <h6>{this.state.fillBlank[i].answerState}</h6>
                    </div>
                    </div>
                )
                i++
            })
            i = 0
            this.state.multChoice.forEach((multQuestion) => {
                questions.push(
                    <div key={`multChoice${i}`} className = "question mult-choice">
                    <h5>{questions.length + 1}. {multQuestion.question}</h5>
                    <MultChoice onSelect = {this.handleMultChoiceSelect} disabled = 'false' 
                    answerChoices = {multQuestion.choices} question = {i}/>
                    </div>
                )
                i++
            })
            i = 0
            this.state.trueFalse.forEach((tf) => {
                questions.push(
                    <div key={`trueFalse${i}`} className = "question mult-choice trueFalse">
                    <h5>{questions.length + 1}. {tf.question}</h5>
                    <MultChoice onSelect = {this.handleTrueFalseSelect} disabled = 'false'
                        answerChoices = {['True', 'False']} question = {i}
                    />
                    </div>
                )
                i++
            })
            let submissionState = this.state.submissionState ? 
            <div className = 'submissionError'>
            {this.state.submissionState}
            </div> : null
            return (
            <div className="Quiz">
                <header className="quiz-header">
                    <Jumbotron className = "jumbo jumbo1">
                        <h1>FBLA Expert</h1>
                        <h4>{this.state.selection}</h4>
                    </Jumbotron>
                    <div id="edit-quiz">
                        {/* <img id="edit-quiz" src="../../edit.svg"/> */}
                        {/* <Button id="edit-quiz" variant="outline-primary"
                        onClick={QuizEditor}>Edit</Button> */}
                        <QuizEditor onSave={this.handleQuizEdit} maxes={this.state.maxQuestionNumbers}
                            currentStates={this.state.questionNumbers}
                        />
                    </div>
                </header>
                {/* <div className = "question dropdown">
                <h5>1. {this.state.dropdownQuestion}</h5>
                <DropDown onSelect = {this.handleDropdownSelect} value = {this.state.dropdownText}
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
                </div> */}
                {questions}
                {submissionState}
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
            let answers = []
            let i = 0
            this.state.dropdown.forEach((dropdown) => {
                answers.push(
                    <div key={`dropdown${i}ans`} className = "question dropdown">
                    <h5><strong>{dropdown.correct === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                    <h5>{answers.length + 1}. {dropdown.question}</h5>
                    <DropDown answerChoices = {dropdown.choices} disabled = 'true'
                    selected = {dropdown.selected} answer = {dropdown.answer}/>
                    </div>
                )
                i++
            })
            i = 0
            this.state.fillBlank.forEach((fillBlank) => {
                answers.push(
                    <div key={`fillBlank${i}ans`} className = "question fill-blank">
                    <h5><strong>{fillBlank.correct === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                    <h5>{answers.length + 1}. {fillBlank.question}</h5>
                    <FillInBlank disabled = 'true' text = {fillBlank.selected} correct = {fillBlank.correct}
                    answer = {fillBlank.answer}
                    />
                    </div>
                )
                i++
            })
            i = 0
            this.state.multChoice.forEach((multQuestion) => {
                answers.push(
                    <div key={`multChoice${i}ans`} className = "question mult-choice">
                    <h5><strong>{multQuestion.correct === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                    <h5>{answers.length + 1}. {multQuestion.question}</h5>
                    <MultChoice answerChoices = {multQuestion.choices} disabled = 'true' 
                    selected = {multQuestion.selected}  answer = {multQuestion.answer}
                    />
                    </div>
                )
                i++
            })
            i = 0
            this.state.trueFalse.forEach((tf) => {
                answers.push(
                    <div key={`trueFalse${i}ans`} className = "question mult-choice trueFalse">
                    <h5><strong>{tf.correct === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                    <h5>{answers.length + 1}. {tf.question}</h5>
                    <MultChoice answerChoices = {['True', 'False']} disabled = 'true' selected = {tf.selected ? 0 : 1}
                    answer = {tf.answer ? 0 : 1}/>
                    </div>
                )
                i++
            })


            return (
            <div className = "Quiz submission">
                <header>
                <Jumbotron className = "jumbo">
                    <h1>FBLA Expert</h1>
                    <h4>You scored {this.state.score.toFixed(2)}% in "{this.state.selection}"</h4>
                </Jumbotron>
                </header>
                {answers}
                {/* <div className = 'question dropdown'>
                    <h5><strong>{this.state.dropdownCorrect === 1 ? "Correct Answer" : "Incorrect Answer"}</strong></h5>
                    <h6>1. {this.state.dropdownQuestion}</h6>
                    <DropDown answerChoices = {this.state.dropdownChoices} disabled = 'true'
                selected = {this.state.dropdownState} answer = {this.dropdownData.Answer}/>
                </div> */}
                {/* <div className = 'question fill-blank'>
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
                {/* <MultChoice answerChoices = {['True', 'False']} disabled = 'true' selected = {this.state.trueFalseState}
                answer = {this.truefalseData.Answer ? 0 : 1}/>
                </div>  */}
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
            <h1>Loading Quiz...</h1>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
        }
    }

}

export default Quiz;