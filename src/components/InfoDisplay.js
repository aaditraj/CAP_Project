import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

const InfoButton = () => { 
  return (
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} eventKey="1" variant = 'info'>
              About This Quiz
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>This is a 5 question quiz about FBLA (Future Business Leaders of America). Question types include multiple choice, true and false, fill in the blank, and dropdown.</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
  );
}

export default InfoButton;