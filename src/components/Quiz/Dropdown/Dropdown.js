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
class DropdownQuestion extends React.Component {  
    render() {
        let components = [];
        
        if (this.props.disabled === 'false'){
            for (let i = 0; i < 3; i++) {
                components.push(
                    <Dropdown.Item eventKey={this.props.answerChoices[i]}
                    onSelect = {(e) => this.props.onSelect(i, e)}
                    key = {'dropdownItem' + (i+1)}>{this.props.answerChoices[i]}
                    </Dropdown.Item>
                )
            }
            return(
                <Dropdown id="dropdown-button" as={ButtonGroup}>
                    <Button variant="secondary">{this.props.value}</Button>
    
                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
    
                    <Dropdown.Menu>
                        {components}
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
        
        else {
            if (this.props.selected === this.props.answer){
                components.push (
                    <InputGroup className = "mb3 input-group-display" key = "correct-dropdown-answer">
                        <Form.Control placeholder = {this.props.answerChoices[this.props.selected]}   disabled 
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        />
                        <InputGroup.Append>
                                    <InputGroup.Text id="inputGroup-sizing-default"><img src = {checkmark} alt = "checkmark"/></InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                )
            } else {
                components.push(
                        <div>
                            <InputGroup className = "mb3 input-group-display" key = "incorrect-dropdown-answer">
                                <Form.Control placeholder = {this.props.answerChoices[this.props.selected]}   disabled 
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text id="inputGroup-sizing-default"><img src = {xmark} alt = "xmark"/></InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            <InputGroup className = "mb3 input-group-display" key = "correct-dropdown-answer">
                                <Form.Control placeholder = {this.props.answerChoices[this.props.answer]}   disabled 
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
            return(
                <Form.Group>
                    {components}
                </Form.Group>
            )
                
        }
    }
    
}

export default DropdownQuestion;