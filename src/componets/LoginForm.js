import React from 'react';
import Axios from 'axios';
import {withRouter } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

/* LoginForm Class */
class LoginForm extends React.Component
{   /* Constructor for Login Class */
    /*
        State Declarations
            user:           State object for holding the User information, the email and password for the user logging in.
            loginFailed:    State variable for controling the dialog form for errors when a user attempts to login.
    */
    constructor(props) 
    {
        super(props);
        this.state = {
            user:{
                email: '',
                password: ''
            },
            loginFailed: false
        }
    }
    /* Function to get the User Email */
    getEmail = (event) => {
        this.setState({ user:{ ...this.state.user, email: event.target.value}})
    }
    /* Function to get the User Password */
    getPassword = (event) => {
        this.setState({ user:{ ...this.state.user, password: event.target.value}})
    }
    /*
        This function is responsible for updating the loginFailed state.
    */
    closeDialog = () => {
        this.setState({ loginFailed: false });
    };
    /* Function to send a POST request to the database (server), create a person object
        which contains the User's Email and User's Password and POST to the route for
        handling user logins. Upon successful Login, redirect to the Task's Page
        and send along the response.
    */
   
    handleSubmit = () =>
    {
        const { history } = this.props;

        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/users/login',
            data: this.state.user
        }).then(function(response) {
            if(response.status === 200)
            {
                history.push({pathname:'/tasks', response});
            }
        }).catch((error) =>
        {
            if(error.response.status === 400)
            {
                this.setState({loginFailed: true});
            }
        })
    }

    render()
    {
        return (
            <div>
                <div>
                    <TextField
                        label="Email"
                        style={{ margin: 8, width: '35ch' }}
                        placeholder="Email"
                        value={this.state.user.email}
                        onChange={this.getEmail}
                        margin="normal"
                        type="text"/>
                </div>
                <div>
                    <TextField
                        label="Password"
                        style={{ margin: 8, width: '35ch' }}
                        placeholder="Password"
                        value={this.state.user.password}
                        onChange={this.getPassword}
                        margin="normal"
                        type="password"/> 
                </div>
                <div>
                    <Button onClick={() => this.handleSubmit()}>
                            Login
                    </Button>
                </div>

                <Dialog open={this.state.loginFailed} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent> 
                        The username or password is incorrect.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog}>
                            Ok.
                        </Button>
                    </DialogActions>
                </Dialog>
        </div>
        )
    }
}

export default withRouter(LoginForm)