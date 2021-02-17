import React from "react";
import Form from "react-bootstrap/Form";
import './FillTheBlank.css'
import xmark from "../../../assets/x.svg";
import checkmark from "../../../assets/check.svg"; 
import InputGroup from "react-bootstrap/InputGroup"

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
                <InputGroup className = "mb3 input-group-display correctFillBlank" key = "correctFillBlank">
                    <Form.Control placeholder = {props.text}   disabled 
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    />
                    <InputGroup.Append>
                            <InputGroup.Text id="inputGroup-sizing-default"><img src = {checkmark} alt = "checkmark"/></InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            )
        } else{
            components.push (
                <div key = "incorrectFillBlank" className = "incorrectFillBlank">
                <InputGroup className = "mb3 input-group-display">
                    <Form.Control placeholder = {props.text}   disabled 
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    />
                    <InputGroup.Append>
                        <InputGroup.Text id="inputGroup-sizing-default"><img src = {xmark} alt = "xmark"/></InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
                <InputGroup className = "mb3 input-group-display">
                    <Form.Control placeholder = {props.answer}   disabled 
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    />
                    <InputGroup.Append>
                        <InputGroup.Text id = "inputGroup-sizing-default">
                            <img src = {checkmark} alt = "checkmark"/>
                        </InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
                </div>
            )
        }
    }
    return (
        <div className = "fill-blank-wrapper">
            {components}
        </div>
    )
}

export default FillInBlank;