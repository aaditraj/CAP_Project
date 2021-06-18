import React from "react"
import firebase from 'firebase';
import "./Feedback.css"


//React Bootstrap components
import { Form, Col}  from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import Jumbotron from "react-bootstrap/Jumbotron"
import {Link} from "react-router-dom"
class Feedback extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            topic: "",
            question_type: "",
            question: "",
            answer: "",
            choices: ["", "", "", ""],
            question_submission_state: "",
            feedback: "",
            feedback_submission_state: "",
            question_disabled: true,
            feedback_disabled: true
        }
    }

   

    handleTopicSelect = (e) => {
        this.setState({
            topic: e.target.value
        }, () => {this.checkQuestionValidity()})
        console.log(e.target.value)
    }

    handleTypeSelect = (e) => {
        this.setState({
            question_type: e.target.value
        },   () => {this.checkQuestionValidity()})
        console.log(e.target.value)
    }

    handleQuestionChange = (e) => {
        this.setState({
            question: e.target.value
        },  () => {this.checkQuestionValidity()})
        console.log(e.target.value)
    }

    handleAnswerChange = (e) => {
        this.setState({
            answer: e.target.value
        }, () => {this.checkQuestionValidity()})
        console.log(e.target.value)
    }

    addChoice = (e, i) => {
        var newChoices = this.state.choices
        newChoices[i] = e.target.value
        this.setState({
            choices: newChoices
        }, () => {this.checkQuestionValidity()})
        console.log(e.target.value)
    }

    isFieldEmpty = (field) => {
        return (field === null || field.replace(/\s/g, '').length === 0)
    }

    isArrayEmpty = (field) => {
        for(let i = 0; i < field.length; i++){
            if (this.isFieldEmpty(field[i])){
                return true
            }
        }
        return false
    }

    checkQuestionValidity = () => {
        if (!this.isFieldEmpty(this.state.topic) && !this.isFieldEmpty(this.state.question_type) &&
        !this.isFieldEmpty(this.state.answer)) {
            switch (this.state.question_type){
                case ("Multiple Choice"):
                    if (this.isArrayEmpty(this.state.choices)){
                        this.setState({question_disabled: true})
                    } else {
                        this.setState({question_disabled: false})
                    }
                    break;
                case ("DropDown"):
                    if (this.isArrayEmpty(this.state.choices.slice(0, 3))){
                        this.setState({question_disabled: true})
                    } else {
                        this.setState({question_disabled: false})
                    }
                    break;
                default:
                    this.setState({question_disabled: false})
            }
        } else {
            this.setState({question_disabled: true})
        }
    }


    handleFeedbackChange = (e) => {
        this.setState({
            feedback: e.target.value
        }, () => this.checkFeedbackValidity())
        console.log(e.target.value)
    }

    checkFeedbackValidity = () => {
        if (this.isFieldEmpty(this.state.feedback)){
            this.setState({
                feedback_disabled: true
            })
        } else {
            this.setState({
                feedback_disabled: false
            })
        }
    }

    sendFeedback = (e) => {
        console.log("sending message!")
        var db = firebase.apps[0].firestore()
        db.collection("Feedback").doc("Messages").collection("Messages").add({
            Email: firebase.auth().currentUser.email,
            Message: this.state.feedback
        })
        this.setState({
            feedback_submission_state: <Alert variant="success" dismissible
            onClose={()=>{this.setState({feedback_submission_state:null})}}>Message sent successfully!</Alert>,
            feedback: "",
            feedback_disabled: true
    })
    }

    sendQuestion = (e) => {
            console.log("sending question!")
            var db = firebase.apps[0].firestore()
            var choices = this.state.choices
            if (choices[3] === null){
                db.collection("Feedback").doc("Suggestions").collection("Questions").add({
                    Topic: this.state.topic,
                    Type: this.state.question_type,
                    Question: this.state.question,
                    Choices: this.state.choices.slice(0, 3),
                    Answer: this.state.answer
                })
            } else {
                db.collection("Feedback").doc("Suggestions").collection("Questions").add({
                    Topic: this.state.topic,
                    Type: this.state.question_type,
                    Question: this.state.question,
                    Choices: this.state.choices,
                    Answer: this.state.answer
                })
            }
            this.setState({
                question_submission_state: <Alert variant="success" dismissible
                onClose={()=>{this.setState({question_submission_state:null})}}>Question sent successfully!</Alert>,
                topic: "",
                question_type: "",
                question: "",
                answer: "",
                choices: ["", "", "", ""],
                question_disabled: true
        })
    }

    render() {
        let components = []
        switch(this.state.question_type){
            case("DropDown"):
                components = [
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridChoice1">
                        <Form.Label>Choice 1</Form.Label>
                        <Form.Control value={this.state.choices[0]} 
                        onChange={(e) => {this.addChoice(e, 0)}}
                        />
                        <Form.Control.Feedback type="invalid">Please provide 3 choices</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridChoice2">
                        <Form.Label>Choice 2</Form.Label>
                        <Form.Control value={this.state.choices[1]} 
                        onChange={(e) => {this.addChoice(e, 1)}}
                        />
                        </Form.Group>
                    
                        <Form.Group as={Col} controlId="formGridChoice3">
                        <Form.Label>Choice3</Form.Label>
                        <Form.Control value={this.state.choices[2]} 
                        onChange={(e) => {this.addChoice(e, 2)}}
                        />
                        </Form.Group>
                    </Form.Row> 
                ]
                break;
            case("MultipleChoice"):
                components = [
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridChoice1">
                        <Form.Label>Choice 1</Form.Label>
                        <Form.Control value={this.state.choices[0]} 
                        onChange={(e) => {this.addChoice(e, 0)}}
                        />
                        <Form.Control.Feedback type="invalid">Please provide 4 choices</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridChoice2">
                        <Form.Label>Choice 2</Form.Label>
                        <Form.Control value={this.state.choices[1]} 
                        onChange={(e) => {this.addChoice(e, 1)}}
                        />
                        </Form.Group>
                    
                        <Form.Group as={Col} controlId="formGridChoice3">
                        <Form.Label>Choice 3</Form.Label>
                        <Form.Control value={this.state.choices[2]} 
                        onChange={(e) => {this.addChoice(e, 2)}}
                        />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridChoice4">
                        <Form.Label>Choice 4</Form.Label>
                        <Form.Control value={this.state.choices[3]} 
                         onChange={(e) => {this.addChoice(e, 3)}}
                         />
                        </Form.Group>
                    </Form.Row> 
                ]
                break;
            default:
                components = []
 
        }
        return(
            <div className = "feedback-page">
                <Jumbotron className = "jumbo">
                    <h1>FBLA Expert</h1>
                    <h4>Help Us Improve!</h4>
                </Jumbotron>
                <div className="feedback">
                <Card className = "feedback-input" bg="light">
                    <h2>Suggest a Question!</h2>
                    <Form>
                        <Form.Group>
                            <Form.Label>Topic</Form.Label>
                            <Form.Control value={this.state.topic} as="select"
                            onChange={ (e) => {this.handleTopicSelect(e)} }
                            >
                                <option value="">Select</option>
                                <option value="Know Your Numbers">Know Your Numbers</option>
                                <option value="Dates and Times">Dates and Times</option>
                                <option value="People">People</option>
                                <option value="Places">Places</option>
                                <option value="Terms, Creeds, Mottos">Terms, Creeds, Mottos</option>
                                <option value="Potpourri">Potpourri</option>

                            </Form.Control>
                            {/* <Form.Control.Feedback type="invalid">Please choose a topic.</Form.Control.Feedback> */}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Question Type</Form.Label>
                            <Form.Control value={this.state.question_type} as="select" 
                            onChange={ (e) => {this.handleTypeSelect(e)} }>
                                <option value="">Select</option>
                                <option value="DropDown">Dropdown</option>
                                <option value="FillInTheBlank">Fill in the Blank</option>
                                <option value="MultipleChoice">Multiple Choice</option>
                                <option value="TrueFalse">True/False</option>
                            </Form.Control>
                            {/* <Form.Control.Feedback type="invalid">Please choose a question type.</Form.Control.Feedback> */}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Question</Form.Label>
                            <Form.Control value={this.state.question}
                            placeholder="Enter question"
                            onChange={ (e) => {this.handleQuestionChange(e)}}/>
                            {/* <Form.Control.Feedback type="invalid">Please provide a question.</Form.Control.Feedback> */}
                        </Form.Group>
                        {components}
                        <Form.Group>
                            <Form.Label>Answer</Form.Label>
                            <Form.Control value={this.state.answer}
                            placeholder="Enter answer"
                            onChange={ (e) => {this.handleAnswerChange(e)} }/>
                            {/* <Form.Control.Feedback type="invalid">Please provide an answer.</Form.Control.Feedback> */}
                        </Form.Group>
                        {this.state.question_submission_state}
                        <Button disabled={this.state.question_disabled} className = "send-question"
                        onClick={this.sendQuestion}>Send!</Button>
                    </Form>
                </Card>
                <Card className = "feedback-input" bg="light">
                    <h2>Send Us Feedback!</h2>
                    <Form>
                        <Form.Group>
                            <Form.Label>Message</Form.Label>
                            <Form.Control value={this.state.feedback} as="textarea"  rows={3}
                            onChange={ (e) => {this.handleFeedbackChange(e)} }
                            />
                            {/* <Form.Control.Feedback type="invalid">Please enter a message.</Form.Control.Feedback> */}
                        </Form.Group>
                        {this.state.feedback_submission_state}
                        <Button disabled={this.state.feedback_disabled} className = "send-feedback"
                        onClick={this.sendFeedback}>Send!</Button>
                    </Form>
                </Card>
                
            </div>
            </div>
        )
    }
}

export default Feedback;