import React from 'react'
import Axios from 'axios'

class RegisterForm extends React.Component {
    constructor(person) {
        super(person);
        this.state = {
            name: "",
            email: "",
            password: "",
        };

        this.setName = this.setName.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setName(event) {
        this.setState({ name: event.target.value });
    }
    setEmail(event) {
        this.setState({ email: event.target.value });
    }
    setPassword(event) {
        this.setState({ password: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault()

        const person = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        };
        Axios.post('http://localhost:5000/users', person)
            .then(function(response) {
                console.log(response)
            })
            .catch(function(error) {
                console.log(error);
            });

        this.setState({ name: "", email: "", password: "" })
    }

    render() {
        return ( 
        <div >
            <form onSubmit = { this.handleSubmit } >
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

export default RegisterForm