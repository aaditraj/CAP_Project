import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Form from "react-bootstrap/Form"
import "./Dropdown.css"
import xmark from "../../../assets/x.svg";
import checkmark from "../../../assets/check.svg"; 
import InputGroup from "react-bootstrap/InputGroup"

//Displays dropdown question for quiz page and textbox results display
const DropDown = (props) => {      
    if (props.disabled === 'false'){
        let components = []
        console.log(props.answerChoices)
        for (let i = 0; i < 3; i++) {
            components.push(
                <Dropdown.Item key={props.answerChoices[i]} eventKey={props.answerChoices[i]}
                onSelect = {(e) => props.onSelect(i, props.question, e)}
                key = {'dropdownItem' + (i+1)}>{props.answerChoices[i]}
                </Dropdown.Item>
            )
        }
        return(
            <Dropdown id="dropdown-button" as={ButtonGroup}>
                <Button variant="secondary">{props.value}</Button>

                <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    {components}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
    
    else {
        let answerDisplay
        if (props.selected === props.answer){
            answerDisplay = 
                <InputGroup className = "mb3 input-group-display" key = "correct-dropdown-answer">
                    <Form.Control placeholder = {props.answerChoices[props.selected]}   disabled 
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    />
                    <InputGroup.Append>
                                <InputGroup.Text id="inputGroup-sizing-default"><img src = {checkmark} alt = "checkmark"/></InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            
        } else {
            answerDisplay = 
                <>
                    <InputGroup className = "mb3 input-group-display" key = "incorrect-dropdown-answer">
                        <Form.Control placeholder = {props.answerChoices[props.selected]}   disabled 
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        />
                        <InputGroup.Append>
                            <InputGroup.Text id="inputGroup-sizing-default"><img src = {xmark} alt = "xmark"/></InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <InputGroup className = "mb3 input-group-display" key = "correct-dropdown-answer">
                        <Form.Control placeholder = {props.answerChoices[props.answer]}   disabled 
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        />
                        <InputGroup.Append>
                            <InputGroup.Text id = "inputGroup-sizing-default">
                                <img src = {checkmark} alt = "checkmark"/>
                            </InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </> 
        }
        return(
            <Form.Group>
                {answerDisplay}
            </Form.Group>
        )  
    }
}
    
export default DropDown;