import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Form from "react-bootstrap/Form"
import "./Dropdown.css"


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
                    <Form.Group className = "formgroup correctDropdown">
                        <h6>Correct Answer</h6>
                        <Form.Control placeholder = {this.props.selected}  disabled />
                    </Form.Group>
                )
            } else {
                components.push(
                        <Form.Group className = "formgroup">
                            <div className = "userAnswer">
                                <h6>You Selected:</h6>
                                <Form.Control placeholder = {this.props.answerChoices[this.props.selected]}  disabled />
                            </div>
                            <div className = "correctAnswer">
                                <h6>Correct Answer:</h6>
                                <Form.Control placeholder = {this.props.answerChoices[this.props.answer]}  disabled />
                            </div>
                        </Form.Group>
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