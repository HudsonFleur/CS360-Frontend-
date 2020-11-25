/*
-------------------- Log File --------------------
Last Worked on: November 24th   Hudson Fleurimond
    Known Issues:
        . 

    What Needs Work:
        . UI Styling, UI needs an overhaul of course, only implementation has been done
        . CSS styles get whatever is on the home, We need to give everything a style or CSS components
            so the default isn't the same thing everywhere,
        . Adding Alerts and Error Notifications

    Concerns:
        . Change post method form
        . Redo Entire page with material ui
*/
import React from 'react'
import Axios from 'axios'
import {withRouter} from "react-router-dom";

// LoginForm class
class RegisterForm extends React.Component {
    // Constructor for Login Class
    /*
        State Declarations
            name:       State object for holding the name of the User, set to empty initially
            email:      State object for holding the email of the User, set to empty initially
            password:   State object for holding the password of the User, set to empty initially
    */
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
        }
        this.setName = this.setName.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // Function to set the User Name
    setName(event) {
        this.setState({ name: event.target.value });
    }
    // Function to set the User Email
    setEmail(event) {
        this.setState({ email: event.target.value });
    }
    // Function to set the User Password
    setPassword(event) {
        this.setState({ password: event.target.value });
    }
    /* Function to send a POST request to the database (server), create a person object
        which contains the User's Name, User's Email and User's Password and POST to the route for
        handling user registration. Upon successful Registration, redirect to the Task's Page
        and send along the response.
    */
    handleSubmit(event) {
        event.preventDefault()
        const person = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        };
        const { history } = this.props;
        Axios.post('http://localhost:5000/users', person)
            .then(function(response) {
                history.push({
                    pathname:'/tasks',
                    response
                });
            })
            .catch(function(error) {});

        this.setState({ name: "", email: "", password: "" })
    }

    render() {
        return ( 
        <div >
            <form onSubmit = { this.handleSubmit} >
                <label > 
                    Name: <input type = "text" value = { this.state.name } onChange = { this.setName }/> 
                </label > 
                
                <label >
                    Email: <input type = "text" value = { this.state.email } onChange = { this.setEmail }/> 
                </label> 
                
                <label >
                    Password: <input type = "password" value = { this.state.password } onChange = { this.setPassword }/> 
                </label>
                
                <label >
                    Confirm Password: <input type = "password" />
                </label> 
                
                <input type = "submit" value = "Submit" />
            </form> 
        </div >
        )
    }
}

export default withRouter(RegisterForm)