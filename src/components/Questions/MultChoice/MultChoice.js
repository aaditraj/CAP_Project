import React from "react";
import Form from "react-bootstrap/Form";
import './MultChoice.css'
import xmark from "../../../assets/x.svg";
import checkmark from "../../../assets/check.svg";


const MultChoice = (props) => {
    let components = []
    for (let i = 0; i < 4; i++) {
        if (props.disabled === 'true'){
            if (i === props.selected) {
                if (props.selected === props.answer){
                    components.push(
                        <Form.Check 
                        type="radio"
                        key={`formHorizontalRadios` + (i+1)}
                        label={<div><strong>{props.answerChoices[i]} (CORRECT SELECTED)</strong> 
                        <img src = {checkmark}/></div>}
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
                        label={<div><strong>{props.answerChoices[i]} (INCORRECT SELECTED)</strong>
                        <img src = {xmark}/></div>}
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
                    label={<div><strong>{props.answerChoices[i]} (CORRECT ANSWER)</strong>
                    <img src = {checkmark}/></div>}
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
        <Form>
        <Form.Group className = "radios">
            {components}
        </Form.Group>
        </Form>
        
    )
}

export default MultChoice;