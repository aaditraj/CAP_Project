import React from "react";
import Form from "react-bootstrap/Form";
import './FillTheBlank.css'

const FillInBlank  = (props) => {
    let components  = [];
    if (props.disabled === 'false'){
        components.push(
            <Form.Group className = "formgroup" controlId = "formBasicInput">
                <Form.Control  onChange = {props.onChange} className = 'textbox' placeholder = "Type your answer here..."/> 
            </Form.Group>
        )
        
        
    } else{
        if (props.correct === 1){
            components.push (
                <Form.Group className = "formgroup correctFill" controlId = "formBasicInput">
                    <h6>Correct Answer</h6>
                    <Form.Control disabled  placeholder = {props.text}/> 
                </Form.Group>
            )
        } else{
            components.push (
                <Form.Group className = "formgroup" controlId = "formBasicInput">
                    <div className = "incorrectFill">
                        <h6>Incorrect Answer:</h6>
                        <Form.Control disabled placeholder = {props.text}/> 
                    </div>
                    <div className = "correctFill">
                        <h6>Correct Answer:</h6>
                        <Form.Control disabled  placeholder = {props.answer}/>
                    </div>
                </Form.Group>
            )
        }
    }
    return (
        components
    )
}

export default FillInBlank;