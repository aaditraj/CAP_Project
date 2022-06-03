import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import RangeSlider from "react-bootstrap-range-slider";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class QuizEditor extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            dropdown: 1,
            fillBlank: 1,
            trueFalse: 1,
            multChoice: 2,
            limited: []
        }
    }

    componentDidMount() {
        let maxes = this.props.maxes
        let current = this.props.currentStates
        let limitedQs = []
        for (let max in maxes){
            if (maxes[max] < 5) {
                limitedQs.push(max)
            }
        }
        this.setState({
            limited: limitedQs,
            dropdown: current.dropdown,
            fillBlank: current.fillBlank,
            trueFalse: current.trueFalse,
            multChoice: current.multChoice
        })
        console.log(limitedQs)
    }
    
    render() {
        return (
            <>
            <Button variant="outline-primary" onClick={() => this.setState({show: true})}>Edit</Button>
            <Modal show={this.state.show} onHide={() => this.setState({show: false})}>
                <Modal.Header closeButton>
                <Modal.Title>Customize Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="quiz-edit-form">
                        <Form.Label>Dropdown<span className="limited">{this.state.limited.includes('dropdown') ? ' (limited)' : null}</span>:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="9">
                            <RangeSlider
                                max={this.props.maxes.dropdown}
                                tooltip='off'
                                value={this.state.dropdown}
                                onChange={e => this.setState({dropdown: e.target.value})}
                            />
                            </Col>
                            <Col xs="3">
                            <Form.Control min={0} max={this.props.maxes.dropdown} type="number" 
                            onChange={e => this.setState({dropdown: e.target.value})} value={this.state.dropdown}/>       
                            </Col>
                        </Form.Group>
                        <Form.Label>Fill in The Blank<span className="limited">{this.state.limited.includes('fillBlank') ? ' (limited)' : null}</span>:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="9">
                            <RangeSlider
                                max={this.props.maxes.fillBlank}
                                tooltip='off'
                                value={this.state.fillBlank}
                                onChange={e => this.setState({fillBlank: e.target.value})}
                            />
                            </Col>
                            <Col xs="3">
                            <Form.Control  min={0} max={this.props.maxes.fillBlank} type="number" 
                            onChange={e => this.setState({fillBlank: e.target.value})} value={this.state.fillBlank}/>
                            </Col>
                        </Form.Group>
                        <Form.Label>Multiple Choice<span className="limited">{this.state.limited.includes('multChoice') ? ' (limited)' : null}</span>:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="9">
                            <RangeSlider
                                max={this.props.maxes.multChoice}
                                tooltip='off'
                                value={this.state.multChoice}
                                onChange={e => this.setState({multChoice: e.target.value})}
                            />
                            </Col>
                            <Col xs="3">
                            <Form.Control  min={0} max={this.props.maxes.multChoice} type="number" 
                            onChange={e => this.setState({multChoice: e.target.value})} value={this.state.multChoice}/>
                            </Col>
                        </Form.Group>
                        <Form.Label>True False<span className="limited">{this.state.limited.includes('trueFalse') ? ' (limited)' : null}</span>:</Form.Label>
                        <Form.Group as={Row}>
                            <Col xs="9">
                            <RangeSlider
                                max={this.props.maxes.trueFalse}
                                tooltip='off'
                                value={this.state.trueFalse}
                                onChange={e => this.setState({trueFalse: e.target.value})}
                            />
                            </Col>
                            <Col xs="3">
                            <Form.Control  min={0} max={this.props.maxes.trueFalse} type="number" 
                            onChange={e => this.setState({trueFalse: e.target.value})} value={this.state.trueFalse}/>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => this.setState({show: false})}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                    this.props.onSave(this.state.dropdown, this.state.fillBlank, this.state.multChoice, this.state.trueFalse);
                    this.setState({show: false})
                }}>
                    Save
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }
}

export default QuizEditor;