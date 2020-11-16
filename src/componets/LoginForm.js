/*
-------------------- Log File --------------------
Last Worked on: November 15th   Hudson Fleurimond
    Known Issues:
        . 

    What Needs Work:
        . UI Styling, UI needs an overhaul of course, only implementation has been done
        . CSS styles get whatever is on the home, We need to give everything a style or CSS components
            so the default isn't the same thing everywhere,
        . Adding Alerts and Error Notifications
        . Renaming of variables

    Concerns:
        . Add and change state to an User object
        . Change post method form
*/
import React from 'react'
import Axios from 'axios'
import { useHistory, withRouter } from "react-router-dom";
import Login from '../pages/Login';

// LoginForm class
class LoginForm extends React.Component
{   // Constructor for Login Class
    /*
        State Declarations
            email:      State object for holding the email of the User, set to empty initially
            password:   State object for holding the password of the User, set to empty initially
    */
    constructor(props) 
    {
        super(props);
        this.state = {
            email: "",
            password: "",
        }
        this.getEmail = this.getEmail.bind(this);
        this.getPassword = this.getPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // Function to get the User Email
    getEmail(event) {
        this.setState({ email: event.target.value });
    }
    // Function to get the User Password
    getPassword(event) {
        this.setState({ password: event.target.value });
    }
    /* Function to send a POST request to the database (server), create a person object
        which contains the User's Email and User's Password and POST to the route for
        handling user logins. Upon successful Login, redirect to the Task's Page
        and send along the response.
    */
    handleSubmit(event) 
    {
        event.preventDefault()
        const person = {
            email: this.state.email,
            password: this.state.password
        };
        const { history } = this.props;
        Axios.post('http://localhost:5000/users/login', person)
            .then(function(response) {
                history.push({
                    pathname:'/tasks',
                    response
                });
            })
            .catch(function(error) {
                console.log(error);
            });

        this.setState({ email: "", password: "" })
    }
    render()
    {
        return (
            <div >
            <form onSubmit = { this.handleSubmit} >
                <label >
                    Email: <input type = "text" value = { this.state.email } onChange = { this.getEmail }/> 
                </label> 
                
                <label >
                    Password: <input type = "password" value = { this.state.password } onChange = { this.getPassword }/> 
                </label>    
                <input type = "submit" value = "Submit" />
            </form> 
        </div >
        )
    }
}

export default withRouter(LoginForm)