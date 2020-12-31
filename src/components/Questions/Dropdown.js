import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup"


class DropdownQuestion extends React.Component {
    render() {
        return(
            <Dropdown as={ButtonGroup} onSelect = {this.props.onSelect}>
                <Button variant="secondary">{this.props.value}</Button>

                <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Correct Ans">Correct Ans</Dropdown.Item>
                    <Dropdown.Item eventKey="Incorrect Ans">Incorrect Ans</Dropdown.Item>
                    <Dropdown.Item eventKey="Incorrect Ans">Incorrect Ans</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
        
    }
    
}

export default DropdownQuestion;