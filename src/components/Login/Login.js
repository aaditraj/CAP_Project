import React from "react"

//React Bootstrap components
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"
import Jumbotron from "react-bootstrap/Jumbotron"

//Styling for login and account creation page
import "./Login.css"

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.passwordInfo = <Button size = 'sm' onClick = {this.popPasswordRules}
        variant = "link">Password Rules</Button>
        this.state = {
            create : false,
            login_error: null,
            password_info : this.passwordInfo,
            message: null,
            new_email: null,
            new_password: null,
            retype_password: null,
            login_email: null,
            login_pw: null,
            firstName: null,
            lastName: null
        }
    }

    //detecting if there is login error or
    //account creation error from props passed in App file
    componentDidUpdate(prevProps){  
        if (!(prevProps.error)) {
            if (this.props.error){
                this.setState({
                    login_error: <Alert variant = "danger" dismissible
                    onClose = {() => this.setState({login_error: null})}>Invalid Login</Alert>
                })
                this.forceUpdate()
            }
        } if (!(prevProps.create_error)) {
            if (this.props.create_error){
                this.setState({
                    message: this.CreateAlert(this.props.create_error_message 
                        + " Redirecting to login page...")
                })
                setTimeout(() => {window.location.reload()}, 3000)
            }
        }  
    }

    handleCreatePasswordChange = (password) => {
        this.setState({
            new_password: password,
        })
    }
    
    //creates a popup displaying password rules when clicking 
    //'Password Rules' link
    popPasswordRules = () => {
        this.setState({
            password_info:  <Alert dismissible 
            onClose = {() => this.setState({password_info : this.passwordInfo})}variant = "secondary"
            >Your password must:
            <li>Be at least 8 characters long</li>
            <li>Contain at least 2 uppercase letters</li>
            <li>Contain at least one special character</li>
            <li>Contain at least 2 digits</li>
            <li>Contain at least 3 lowercase letters</li>
            </Alert>
        })
    }

    isFieldEmpty = (field) => {
        return (field === null || field.replace(/\s/g, '').length === 0)
    }

    CreateAlert = (message) => {
        return <Alert variant="danger" dismissible 
        onClose = {() => this.setState({
            message: null
        })}>{message}</Alert>
    }

    //checks if fields are empty, password mismatch,
    //password rules violation, and invalid email using regex
    handleCreate = (firstName, lastName, email, password, retype) => {
        if (this.isFieldEmpty(firstName) || this.isFieldEmpty(lastName) || this.isFieldEmpty(email) 
            || this.isFieldEmpty(password)){
            this.setState({
                message: this.CreateAlert("All fields are required")
            })
        } else if (password !== retype){
            this.setState({
                message: this.CreateAlert("Passwords are not matching")
            })
        } else if (!(password.match(/^.*[A-Z].*[A-Z].*$/))){
            this.setState({
                message: this.CreateAlert("Password must contain at least 2 uppercase letters")
            })
        } else if (!(password.match(/^.*[!@#$&*].*$/))){
            this.setState({
                message: this.CreateAlert("Password must contain at least one special character (!, @, #, etc.)")
            })
        } else if (!(password.match(/^.*[0-9].*[0-9].*$/))){
            this.setState({
                message: this.CreateAlert("Password must contain at least 2 digits")
            })
        } else if (!(password.match(/^.*[a-z].*[a-z].*[a-z].*$/))){
            this.setState({
                message: this.CreateAlert("Password must contain at least 3 lowercase letters")
            })
        } else if (!(password.match(/^.{8,}$/))){
            this.setState({
                message: this.CreateAlert("Password must contain at least 8 characters")
            })
        } else if (!(email.match(/^\S+@\S+\.\S+$/))) {
            this.setState({
                message: this.CreateAlert("Email is not in proper format")
            })
        }  
        else {
            this.setState({
                message: null
            })
            this.props.onCreate(firstName, lastName, email, password)
        }
    }

    //if no error, calls the login function from App file
    handleLogin = (email, password) => {
        if (this.isFieldEmpty(email) || this.isFieldEmpty(password)){
            this.setState({
                login_error: <Alert variant="danger" dismissible 
                onClose = {() => this.setState({login_error: null})}>All fields are required</Alert>
            })
        } else {
            this.props.onLogin(email, password)
        }
    }

    //render for two cases: user creates account and user is logging in
    render() {
        if (this.state.create){
            return (
                <div>
                    <Jumbotron className = "jumbo">
                        <h1>FBLA Expert!</h1>
                        <h4>Test Your Knowledge About FBLA!</h4>
                    </Jumbotron>
                    <Card bg = "light" text = "dark">
                        <Card.Header className = "card-header"><h2>Create Account</h2></Card.Header>
                        <Card.Body className = "login-wrapper">
                            <Form>
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
                                <Form.Group>
                                    <h6 className = 'login-h6'>Retype Password</h6>
                                    <Form.Control onChange = {(e) =>
                                        this.setState({retype_password: e.target.value})}
                                    className = "create-textbox" placeholder = "Password"
                                        type = "password" autoComplete = "off"
                                    />
                                </Form.Group>
                                <h5 className = "error-message">{this.state.message}</h5>
                                <Button onClick = {() =>
                                this.handleCreate(this.state.firstName, this.state.lastName, this.state.new_email, 
                                this.state.new_password, this.state.retype_password)}
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
                            <Form>
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