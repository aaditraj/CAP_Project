import React from "react";
import Form from "react-bootstrap/Form";
import './MultChoice.css'


const MultChoice = (props) => {
    let components = []
    for (let i = 0; i < 4; i++) {
        if (props.disabled === 'true'){
            if (i === props.selected) {
                if (props.selected === props.answer){
                    components.push(
                        <Form.Check 
                        type="radio"
                        id={`formHorizontalRadios` + (i+1)}
                        label={props.answerChoices[i] + ' (CORRECT SELECTED)'}
                        name="formHorizontalRadios"
                        disabled = {true}
                        className = 'correct'
                        />
                    )
                } else {
                    components.push(
                        <Form.Check 
                        type="radio"
                        id={`formHorizontalRadios` + (i+1)}
                        label={props.answerChoices[i] + ' (INCORRECT SELECTED)'}
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
                    id={`formHorizontalRadios` + (i+1)}
                    label={props.answerChoices[i] + ' (CORRECT ANSWER)'}
                    name="formHorizontalRadios"
                    disabled = {true}
                    className = 'correct'
                    />
                )
            }else {
                components.push(
                    <Form.Check 
                    type="radio"
                    id={`formHorizontalRadios` + (i+1)}
                    label={props.answerChoices[i]}
                    name="formHorizontalRadios"
                    disabled = {true}
                    />
                )
            }
        } else {
            components.push(
                <Form.Check 
                type="radio"
                id={`formHorizontalRadios` + (i+1)}
                label={props.answerChoices[i]}
                name="formHorizontalRadios"
                onChange = {(e) => props.onSelect(i, e)}
                />
            )
        }
    }
    return (
        <Form.Group >
            {components}
        </Form.Group>
        
    )
}

export default MultChoice;