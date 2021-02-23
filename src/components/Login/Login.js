import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import Jumbotron from "react-bootstrap/Jumbotron"
import "./Login.css"

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            create : false,
            login_error: null,
            password_info : null,
            message: null,
            new_email: null,
            new_password: null,
            login_email: null,
            login_pw: null,
            firstName: null,
            lastName: null
        }
    }
    componentDidUpdate(prevProps){  
        if (!(prevProps.error)) {
            if (this.props.error){
                this.setState({
                    login_error: <Alert variant = "danger">Invalid Login</Alert>
                })
                this.forceUpdate()
            }
        }    
    }
    handleCreatePasswordChange = (password) => {
        this.setState({
            new_password: password,
            password_info: <Alert variant = "info"
            dismissible 
            onClose = {() => this.setState({
                password_info: null
            })}>Your password must
            <li>Be at least 8 characters long</li>
            <li>Contain at least 2 uppercase letters</li>
            <li>Contain at least one special character</li>
            <li>Contain at least 2 digits</li>
            <li>Contain at least 3 lowercase letters</li>
            </Alert>
        })
    }
    handleCreate = (firstName, lastName, email, password) => {
        if (password === null || email === null || firstName === null || lastName === null){
            this.setState({
                message: <Alert variant="danger" dismissible 
                onClose = {() => this.setState({
                    message: null
                })}>Missing information</Alert>
            })
        } else if (!(password.match(/^.*[A-Z].*[A-Z].*$/))){
            this.setState({
                message: <Alert variant="danger" dismissible
                onClose = {() => this.setState({
                  message: null
                })}>Password must contain at least 2 uppercase letters</Alert>
            })
        } else if (!(password.match(/^.*[!@#$&*].*$/))){
            this.setState({
                message: <Alert variant="danger" dismissible
                onClose = {() => this.setState({
                  message: null
                })}>Password must contain at least one special character
                (!, @, #, etc.)</Alert>
            })
        } else if (!(password.match(/^.*[0-9].*[0-9].*$/))){
            this.setState({
                message: <Alert variant="danger" dismissible
                onClose = {() => this.setState({
                  message: null
                })}>Password must contain at least 2 digits</Alert>
            })
        } else if (!(password.match(/^.*[a-z].*[a-z].*[a-z].*$/))){
            this.setState({
                message: <Alert variant="danger" dismissible
                onClose = {() => this.setState({
                  message: null
                })}>Password must contain at least 3 lowercase letters</Alert>
            })
        } else if (!(password.match(/^.{8,}$/))){
            this.setState({
                message: <Alert variant="danger" dismissible
                onClose = {() => this.setState({
                  message: null
                })}>Password must have at least 8 characters</Alert>
            })
        } else if (!(email.match(/^\S+@\S+\.\S+$/))) {
            this.setState({
                message: <Alert variant="danger" dismissible
                onClose = {() => this.setState({
                  message: null
                })}>Invalid email. Check if it is in proper format, with no spaces at the end.</Alert>
            })
        
        }  
        else {
            this.setState({
                message: null
            })
            this.props.onCreate(firstName, lastName, email, password)
        }
    }
    handleLogin = (email, password) => {
        this.props.onLogin(email, password)
    }

    render() {
        if (this.state.create){
            return (
                <div>
                    <Jumbotron className = "jumbo">
                        <h1>FBLA Expert!</h1>
                        <h4>Test Your Knowledge About FBLA!</h4>
                    </Jumbotron>
                    <Card bg = "light" text = "dark">
                        <Card.Header className = "card-header"><h2>Create an Account</h2></Card.Header>
                        <Card.Body className = "login-wrapper">
                            <Form className = "wrapper">
                                <Form.Group>
                                    <h6 className = 'login-h6'>First Name</h6>
                                    <Form.Control onChange = {(e) => 
                                        this.setState({firstName: e.target.value})} 
                                    className = "create-textbox" placeholder = "First Name"
                                        autoComplete = "off"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <h6 className = 'login-h6'>Last Name</h6>
                                    <Form.Control onChange = {(e) =>
                                        this.setState({lastName: e.target.value})} 
                                    className = "create-textbox" placeholder = "Last Name"
                                        autoComplete = "off"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <h6 className = 'login-h6'>Email</h6>
                                    <Form.Control onChange = {(e) => 
                                        this.setState({new_email:  e.target.value})} 
                                    className = "create-textbox" placeholder = "Email"
                                    autoComplete = "off"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <h6 className = 'login-h6'>Password</h6>
                                    <Form.Control onChange = {(e) =>
                                        this.handleCreatePasswordChange(e.target.value)}
                                    className = "create-textbox" placeholder = "Password"
                                        type = "password" autoComplete = "off"
                                    />
                                    <h5 className = "password-info">{this.state.password_info}</h5>
                                </Form.Group>
                                <h5 className = "error-message">{this.state.message}</h5>
                                <Button onClick = {() =>
                                this.handleCreate(this.state.firstName, this.state.lastName, this.state.new_email, 
                                this.state.new_password)}
                                className = "done">Done</Button>
                                <Button onClick = {() => this.setState({create: false})}>Back</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )
        } else{
            return(
                <div>
                    <Jumbotron className = "jumbo">
                        <h1>FBLA Expert!</h1>
                        <h4>Test Your Knowledge About FBLA!</h4>
                    </Jumbotron>
                    <Card bg = "light" text = "dark">
                        <Card.Header className = "card-header"><h2>Login</h2></Card.Header>
                        <Card.Body className = "login-wrapper">
                            <Form className = "wrapper">
                                <Form.Group>
                                    <Form.Control onChange = {(e) =>
                                        this.setState({login_email: e.target.value})} 
                                    className = "login-textbox" placeholder = "Email"
                                        autoComplete = "off"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control onChange = {(e) =>
                                        this.setState({login_pw: e.target.value})}
                                    className = "login-textbox" placeholder = "Password"
                                        type = "password" autoComplete = "off"
                                    />
                                </Form.Group>
                                <h5>{this.state.login_error}</h5>
                                <Button className = "Login" onClick = {() => 
                                this.handleLogin(this.state.login_email, this.state.login_pw)}>Login</Button>
                                <Button className = "sign-up" 
                                variant = "link" onClick = {() => this.setState({
                                    create: true
                                })}>Sign Up</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )
        }
       
    }
    
    
    
}

export default LoginPage;