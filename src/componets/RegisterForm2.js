import React from 'react'
import Axios from 'axios'

class RegisterForm extends React.Component
{
    constructor(person)
    {
        super(person);
        this.state = {
            name:"",
            email: "",
            password:"",
         };
         this.state = {
             users: []
         };

         this.setName = this.setName.bind(this);
         this.setEmail = this.setEmail.bind(this);
         this.setPassword = this.setPassword.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
    }

    setName(event) {
        this.setState({name: event.target.value});
    }
    setEmail(event) {
        this.setState({email: event.target.value});
    }
    setPassword(event) {
        this.setState({password: event.target.value});
    }
    handleSubmit(event){
        console.log(this.state);

        const person = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        };
        Axios.post('/http://localhost:3000/contact', person)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

    }

      componentDidMount() {
        Axios.get("users.json").then((response) => {
          this.setState({ users: response.data });
        });
      }
   

    render()
    {
        const {users} = this.state;
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label> Name: 
                        <input type="text" value={this.state.name} onChange={this.setName} />
                    </label>
                    <label> Email: 
                        <input type="text" value={this.state.email} onChange={this.setEmail} />
                    </label>
                    <label> Password: 
                        <input type="password" value={this.state.password} onChange={this.setPassword} />
                    </label>
                    <label> Confirm Password: 
                        <input type="password"/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>
        <ul>
          {users.map((user) => (
            <li>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>City:</strong> {user.address.city}
              </p>
            </li>
          ))}
        </ul>
      </div>
            </div>
        )
    }
}

export default RegisterForm