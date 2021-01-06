import React from "react";
import Dropdown from "react-bootstrap/Dropdown"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"

class TrueFalse extends React.Component {
    render() {
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
    }
}

export default TrueFalse;