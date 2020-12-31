import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

const InfoButton = () => {
    return (
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} eventKey="1"  >
                About This Quiz
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>This is a 5 question quiz about FBLA. Question types include multiple choice, true and false, fill in the blank, dropdown, and matching.</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    );
}

export default InfoButton;