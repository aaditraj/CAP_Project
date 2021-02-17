import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import "./Login.css"

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            create : false,
        }
    }
    
    render() {
        var email, password, firstName, lastName;
        if (this.state.create){
            email = null;
            password = null;
            return (
                <Card bg = "light" text = "dark">
                    <Card.Header><h3>Create an Account</h3></Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group>
                                <Form.Control onChange = {(e) => 
                                    firstName = e.target.value} 
                                className = "login-textbox" placeholder = "First Name"
                                    autoComplete = "off"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control onChange = {(e) =>
                                    lastName= e.target.value} 
                                className = "login-textbox" placeholder = "Last Name"
                                    autoComplete = "off"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control onChange = {(e) => 
                                    email =  e.target.value} 
                                className = "login-textbox" placeholder = "Email"
                                autoComplete = "off"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control onChange = {(e) =>
                                    password = e.target.value}
                                className = "login-textbox" placeholder = "Password"
                                    type = "password" autoComplete = "off"
                                />
                            </Form.Group>
                            <Button onClick = {() =>
                            this.props.onCreate(firstName, lastName, email, password)}
                            className = "done">Done</Button>
                            <Button onClick = {() => this.setState({create: false})}>Back</Button>
                        </Form>
                    </Card.Body>
                </Card>
            )
        } else{
            return(
            <Card bg = "light" text = "dark">
                <Card.Header><h3>Login</h3></Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control onChange = {(e) =>
                                email = e.target.value} 
                            className = "login-textbox" placeholder = "Email"
                                autoComplete = "off"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control onChange = {(e) =>
                                password = e.target.value}
                            className = "login-textbox" placeholder = "Password"
                                type = "password" autoComplete = "off"
                            />
                        </Form.Group>
                        <Button className = "Login" onClick = {() => 
                        this.props.onLogin(email, password)}>Login</Button>
                        <Button onClick = {() => this.setState({
                            create: true
                        })}>Create Account</Button>
                    </Form>
                </Card.Body>
            </Card>
            )
        }
       
    }
    
    
    
}

export default LoginPage;