import React from "react";
import Form from "react-bootstrap/Form";


const MultChoice = (props) => {
    return (
        <Form.Group >
            <Form.Check 
            type="radio"
            id={`formHorizontalRadios1`}
            label={props.answerChoices[0]}
            name="formHorizontalRadios"
            onChange = {props.onSelect}
            />
            <Form.Check 
            type="radio"
            id={`formHorizontalRadios2`}
            label={props.answerChoices[1]}
            name="formHorizontalRadios"
            onChange = {props.onSelect}
            />
            <Form.Check 
            type="radio"
            id={`formHorizontalRadios3`}
            label={props.answerChoices[2]}
            name="formHorizontalRadios"
            onChange = {props.onSelect}
            />
            <Form.Check 
            type="radio"
            id={`formHorizontalRadios4`}
            label={props.answerChoices[3]}
            name="formHorizontalRadios"
            onChange = {props.onSelect}
            />
        </Form.Group>
        
    )
}

export default MultChoice;