import React from "react";
import Form from "react-bootstrap/Form";
import './MultChoice.css'


const MultChoice = (props) => {
    let components = []
    if (props.selected === null) {
        components.push(
            <h6 className = 'no-answer'><strong>No answer received</strong></h6>
        )
    }
    for (let i = 0; i < 4; i++) {
        if (props.disabled === 'true'){
            if (i === props.selected) {
                if (props.selected === props.answer){
                    components.push(
                        <Form.Check 
                        type="radio"
                        key={`formHorizontalRadios` + (i+1)}
                        label={<strong>{props.answerChoices[i]} (CORRECT SELECTED)</strong>}
                        name="formHorizontalRadios"
                        disabled = {true}
                        className = 'correct'
                        />
                    ) 
                } else {
                    components.push(
                        <Form.Check 
                        type="radio"
                        key={`formHorizontalRadios` + (i+1)}
                        label={<strong>{props.answerChoices[i]} (INCORRECT SELECTED)</strong>}
                        name="formHorizontalRadios"
                        disabled = {true}
                        className = 'wrong'
                        />
                    )
                }
            }else if (i === props.answer) {
                components.push(
                    <Form.Check 
                    type="radio"
                    key={`formHorizontalRadios` + (i+1)}
                    label={<strong>{props.answerChoices[i]} (CORRECT ANSWER)</strong>}
                    name="formHorizontalRadios"
                    disabled = {true}
                    className = 'correct'
                    />
                )
            }else {
                components.push(
                    <Form.Check 
                    type="radio"
                    key={`formHorizontalRadios` + (i+1)}
                    label={props.answerChoices[i]}
                    name="formHorizontalRadios"
                    disabled = {true}
                    />
                )
            }
        } else {
            if (props.question === '1'){
                components.push(
                    <Form.Check 
                    type="radio"
                    key={`formHorizontalRadios` + (i+1)}
                    label={props.answerChoices[i]}
                    name="formHorizontalRadios"
                    onChange = {(e) => props.onSelect(i, 1, e)}
                    />
                )
            }
            else {
                components.push(
                    <Form.Check 
                    type="radio"
                    key={`formHorizontalRadios` + (i+1)}
                    label={props.answerChoices[i]}
                    name="formHorizontalRadios"
                    onChange = {(e) => props.onSelect(i, 2, e)}
                    />
                )
            }
            
        }
    }
    return (
        <Form.Group >
            {components}
        </Form.Group>
        
    )
}

export default MultChoice;