import React from "react";
import Form from "react-bootstrap/Form";
import './FillTheBlank.css'

const FillInBlank  = (props) => {
    return (
        <Form.Group className = "formgroup" controlId = "formBasicInput">
            <Form.Control className = 'textbox' onChange = {props.onChange} placeholder = "Type your answer here..."/> 
        </Form.Group>
    )
}

export default FillInBlank;