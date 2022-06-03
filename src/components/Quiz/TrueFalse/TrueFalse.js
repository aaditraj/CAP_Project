import React from "react";
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import "./TrueFalse.css"
import checkmark from "../../../assets/check.svg"
import xmark from "../../../assets/x.svg"
import { Form } from "react-bootstrap";

//Displays true-false dropdown for quiz page and a results display

const TrueFalse = (props) => {
    if (props.disabled === 'false'){
        return (
            <Form>
                <Form.Group>
                    <Form.Check 
                    type="radio"
                    key={`formHorizontalRadios1`}
                    label="True"
                    name="formHorizontalRadios"
                    onChange = {(e) => props.onSelect}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Check 
                    type="radio"
                    key={`formHorizontalRadios1`}
                    label="False"
                    name="formHorizontalRadios"
                    onChange = {(e) => props.onSelect}
                    />
                </Form.Group>
            </Form>      
        )
    } else{
        return(
            <div className = 'TF-result'>
                <Button disabled 
                className = {props.answer ? 'correctTF' : 'incorrectTF'}>
                True <img src = {props.answer ? checkmark : xmark}
                    alt = {props.answer ? 'checkmark' : 'xmark'}
                /></Button>
                <Button disabled 
                className = {props.answer ? 'incorrectTF' : 'correctTF'}>
                False <img src = {props.answer ? xmark : checkmark}
                alt = {props.answer ? 'xmark' : 'checkmark'}/></Button>
            </div>
        )
    }
}

export default TrueFalse;