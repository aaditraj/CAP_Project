import React from "react";
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import "./TrueFalse.css"
import checkmark from "../../../assets/check.svg"
import xmark from "../../../assets/x.svg"
class TrueFalse extends React.Component {
    render() {
        if (this.props.disabled === 'false'){
            return (
                <Dropdown id="dropdown-button" as={ButtonGroup} onSelect = {this.props.onSelect}>
                    <Button variant="secondary">{this.props.value}</Button>
    
                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
    
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="True">True</Dropdown.Item>
                        <Dropdown.Item eventKey="False">False</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        } else{
            return(
                <div className = 'TF-result'>
                    <Button disabled 
                    className = {this.props.answer ? 'correctTF' : 'incorrectTF'}>
                    True <img src = {this.props.answer ? checkmark : xmark}
                        alt = {this.props.answer ? 'checkmark' : 'xmark'}
                    /></Button>
                    <Button disabled 
                    className = {this.props.answer ? 'incorrectTF' : 'correctTF'}>
                    False <img src = {this.props.answer ? xmark : checkmark}
                    alt = {this.props.answer ? 'xmark' : 'checkmark'}/></Button>
                </div>
            )
        }
    }
}

export default TrueFalse;