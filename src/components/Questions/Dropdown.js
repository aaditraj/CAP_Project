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
                    <div className = "result">
                        <Form.Control placeholder = {this.props.selected}  disabled className = "ddCorrectTextbox"/>
                    </div>
                )
            } else {
                if (this.props.selected === null){
                    components.push (
                        <div className = "incorrect">
                        <div className = "userAnswer">
                            <h6><strong>No Answer Received</strong></h6>
                            {/* <Form.Control placeholder = {'No Answer Received'}  disabled /> */}
                        </div>
                        <div className = "correctAnswer">
                            <h6><strong>Correct Answer:</strong></h6>
                            <Form.Control placeholder = {this.props.answerChoices[this.props.answer]}  disabled />
                        </div>
                    </div>
                    )
                } else{
                    components.push(
                        <div className = "incorrect">
                            <div className = "userAnswer">
                                <h6><strong>You Selected:</strong></h6>
                                <Form.Control placeholder = {this.props.answerChoices[this.props.selected]}  disabled />
                            </div>
                            <div className = "correctAnswer">
                                <h6><strong>Correct Answer:</strong></h6>
                                <Form.Control placeholder = {this.props.answerChoices[this.props.answer]}  disabled />
                            </div>
                        </div>
                    )
                }
                
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