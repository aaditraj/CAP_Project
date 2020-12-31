import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup"
import "./Dropdown.css"

class DropdownQuestion extends React.Component {
    render() {
        return(
            <Dropdown id="dropdown-button" as={ButtonGroup} onSelect = {this.props.onSelect}>
                <Button variant="secondary">{this.props.value}</Button>

                <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="New Dehli">New Dehli</Dropdown.Item>
                    <Dropdown.Item eventKey="Jaipur">Jaipur</Dropdown.Item>
                    <Dropdown.Item eventKey="Amritsar">Amritsar</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
        
    }
    
}

export default DropdownQuestion;