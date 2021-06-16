import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown"

//displays statistics from App file when user clicks 'View Statistics'
//Statistics include average, highest, and lowest scores across all user's attempts
class ViewStatistics extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
        }
    }
  
    render(){
      let controller;
      let components = [];
      if (this.props.itemFormat === "navItem") {
        controller = <Button className="user-option stats" variant="link" 
        onClick={() => {this.setState({show: true})}}>Statistics</Button>

      } else {
        controller = <Button variant="primary" 
        onClick={() => {this.setState({show: true})}}>
        <h4>Statistics</h4></Button>
      }
      if(this.props.fetched){
        if (this.props.attempts === 0){
          components.push(<h4 className="no-quizzes-disclaimer">You have not attempted any quizzes so far.
          Please take a quiz.</h4>)
        } else {
          components.push(
            <Modal.Body className="statistics-modal">
                
              <h5><p>Highest Score:</p><p>{this.props.data.Highest_Score}</p></h5>
          
          
              <h5><p>Lowest Score:</p> <p>{this.props.data.Lowest_Score}</p></h5>
          
          
              <h5><p>Average Score: </p><p>{this.props.data.Average}</p></h5>
          
          
              <h5><p>Attempts: </p><p>{this.props.data.Scores.length}</p></h5>
                
            </Modal.Body>
          )
        }
      } else {
        components.push(<Modal.Body></Modal.Body>)
      }
      return (
          <>
            {controller}
            <Modal show={this.state.show} onHide={() => this.setState({show: false})}>
              <Modal.Header closeButton>
                <Modal.Title>Statistics</Modal.Title>
              </Modal.Header>
              {components}
              <Modal.Footer>
                <Button variant="secondary" onClick={() => {this.setState({show: false})}}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
    }
    
  }
  
  export default ViewStatistics;