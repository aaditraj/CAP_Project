import React from "react"
import firebase from 'firebase';
import "./Feedback.css"


//React Bootstrap components
import { Form, Col}  from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import Jumbotron from "react-bootstrap/Jumbotron"

class Feedback extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            topic: null,
            question_type: null,
            question: null,
            answer: null,
            choices: [null, null, null, null],
            question_submission_state: null,
            validated: false,
            feedback: null,
            feedback_submission_state: null
        }
    }

   

    handleTopicSelect = (e) => {
        this.setState({
            topic: e.target.value
        })
    }

    handleTypeSelect = (e) => {
        this.setState({
            question_type: e.target.value
        })
    }

    handleQuestionChange = (e) => {
        this.setState({
            question: e.target.value
        })
    }

    handleAnswerChange = (e) => {
        this.setState({
            answer: e.target.value
        })
    }

    addChoice = (e, i) => {
        var newChoices = this.state.choices
        newChoices[i] = e.target.value
        this.setState({
            choices: newChoices
        })
    }

    handleFeedbackChange = (e) => {
        this.setState({
            feedback: e.target.value
        })
    }

    sendFeedback = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }
        else{
            console.log("sending message!")
            var db = firebase.apps[0].firestore()
            db.collection("Feedback").doc("Messages").collection("Messages").add({
                Email: firebase.auth().currentUser.email,
                Message: this.state.feedback
            })
            this.setState({
                feedback_submission_state: <Alert variant="success" dismissible
                onClose={()=>{this.setState({feedback_submission_state:null})}}>Message sent successfully!</Alert>
            })
        }
        this.setState({message_validated: true})
        e.preventDefault()
    }

    sendQuestion = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        }
        else {
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
                onClose={()=>{this.setState({question_submission_state:null})}}>Question sent successfully!</Alert>
            })
        }
        this.setState({validated: true})
        e.preventDefault()
        
    }

    render() {
        let components = []
        switch(this.state.question_type){
            case("DropDown"):
                components = [
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridChoice1">
                        <Form.Label>Choice 1</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 0)}}/>
                        <Form.Control.Feedback type="invalid">Please provide 3 choices</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridChoice2">
                        <Form.Label>Choice 2</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 1)}}/>
                        </Form.Group>
                    
                        <Form.Group as={Col} controlId="formGridChoice3">
                        <Form.Label>Choice3</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 2)}}/>
                        </Form.Group>
                    </Form.Row> 
                ]
                break;
            case("MultipleChoice"):
                components = [
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridChoice1">
                        <Form.Label>Choice 1</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 0)}}/>
                        <Form.Control.Feedback type="invalid">Please provide 4 choices</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridChoice2">
                        <Form.Label>Choice 2</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 1)}}/>
                        </Form.Group>
                    
                        <Form.Group as={Col} controlId="formGridChoice3">
                        <Form.Label>Choice 3</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 2)}}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridChoice4">
                        <Form.Label>Choice 4</Form.Label>
                        <Form.Control required onChange={(e) => {this.addChoice(e, 3)}}/>
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
                    <Form noValidate validated={this.state.validated} onSubmit={this.sendQuestion}>
                        <Form.Group>
                            <Form.Label>Topic</Form.Label>
                            <Form.Control required as="select" onChange={ (e) => {this.handleTopicSelect(e)} }>
                                <option value="">Select</option>
                                <option value="Know Your Numbers">Know Your Numbers</option>
                                <option value="Dates and Times">Dates and Times</option>
                                <option value="People">People</option>
                                <option value="Places">Places</option>
                                <option value="Terms, Creeds, Mottos">Terms, Creeds, Mottos</option>
                                <option value="Potpourri">Potpourri</option>

                            </Form.Control>
                            <Form.Control.Feedback type="invalid">Please choose a topic.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Question Type</Form.Label>
                            <Form.Control required as="select" onChange={ (e) => {this.handleTypeSelect(e)} }>
                                <option value="">Select</option>
                                <option value="DropDown">Dropdown</option>
                                <option value="FillInTheBlank">Fill in the Blank</option>
                                <option value="MultipleChoice">Multiple Choice</option>
                                <option value="TrueFalse">True/False</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">Please choose a question type.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Question</Form.Label>
                            <Form.Control required placeholder="Enter question" onChange={ (e) => {this.handleQuestionChange(e)}}/>
                            <Form.Control.Feedback type="invalid">Please provide a question.</Form.Control.Feedback>
                        </Form.Group>
                        {components}
                        <Form.Group>
                            <Form.Label>Answer</Form.Label>
                            <Form.Control required placeholder="Enter answer" onChange={ (e) => {this.handleAnswerChange(e)} }/>
                            <Form.Control.Feedback type="invalid">Please provide an answer.</Form.Control.Feedback>
                        </Form.Group>
                        {this.state.question_submission_state}
                        <Button className = "send-question" variant="success"
                        type="submit">Send!</Button>
                    </Form>
                </Card>
                <Card className = "feedback-input" bg="light">
                    <h2>Send Us Feedback!</h2>
                    <Form noValidate validated={this.state.message_validated} onSubmit={this.sendFeedback}>
                        <Form.Group>
                            <Form.Label>Message</Form.Label>
                            <Form.Control as="textarea" rows={3}
                            required onChange={ (e) => {this.handleFeedbackChange(e)} }/>
                            <Form.Control.Feedback type="invalid">Please enter a message.</Form.Control.Feedback>
                        </Form.Group>
                        {this.state.feedback_submission_state}
                        <Button className = "send-feedback" variant="success"
                        type="submit">Send!</Button>
                    </Form>
                </Card>
                
            </div>
            </div>
        )
    }
}

export default Feedback;