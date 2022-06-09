import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
//displays statistics from App file when user clicks 'View Statistics'
//Statistics include average, highest, and lowest scores across all user's attempts
const ViewStatistics = (props) => {
  
    const [show, setShow] = useState(false)
  
      let controller;
      let component;
      if (props.itemFormat === "navItem") {
        controller = <Button className="user-option stats" variant="link" 
        onClick={() => setShow(true)}>Statistics</Button>

      } else {
        controller = <Button variant="primary" 
        onClick={() => setShow(true)}>
        <h4>Statistics</h4></Button>
      }
      if(props.fetched){
        if (props.data.Scores.length === 0){
          component = <h4 className="no-quizzes-disclaimer">You have not attempted any quizzes so far.
          Please take a quiz.</h4>
        } else {
          let highestScore = props.data.Highest_Score
          let lowestScore = props.data.Lowest_Score
          let average = props.data.Average
          let attempts = props.data.Scores.length
          highestScore = (Number.isInteger(highestScore) ? highestScore : highestScore.toFixed(2))
          lowestScore = (Number.isInteger(lowestScore) ? lowestScore : lowestScore.toFixed(2))
          average = (Number.isInteger(average) ? average : average.toFixed(2))
          component = 
            <Modal.Body className="statistics-modal">
                
              <h5><p>Highest Score:</p><p>{highestScore}%</p></h5>
          
          
              <h5><p>Lowest Score:</p> <p>{lowestScore}%</p></h5>
          
          
              <h5><p>Average Score: </p><p>{average}%</p></h5>
          
          
              <h5><p>Attempts: </p><p>{attempts}</p></h5>
                
            </Modal.Body>
          
        }
      } else {
        component = <Modal.Body></Modal.Body>
      }
      return (
          <>
            {controller}
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Statistics</Modal.Title>
              </Modal.Header>
              {component}
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
    }
    

  
  export default ViewStatistics;