import React from 'react'
import Axios from 'axios'
import {withRouter} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

/* RegisterForm Class */
class RegisterForm extends React.Component {
    /* Constructor for RegisterForm Class */
    /*
        State Declarations
            user:               State object for holding the User information, the name, the email and password for the account registration.
            confirmPassword:    State variable for holding the confirmation password field.
            nameValidation:     State variable for controling the dialog form for incorrect name requirements.
            emailValidation:    State variable for controling the dialog form for incorrect email requirements.
            passwordValidation:           State variable for controling the dialog form for incorrect password requirements.
            confirmPasswordValidaiton:    State variable for controling the dialog form for incorrect password requirements.
    */
    constructor(props) {
        super(props);
        this.state = {
            user:{
                name: '',
                email: '',
                password: ''
            },
            confirmPassword: '',
            nameValidation: false,
            emailValidation: false,
            passwordValidation: false,
            passwordConfirmationValidation: false
        }
    }
    // Function to set the User Name
    setName = (event) => {
        this.setState({ user:{ ...this.state.user, name: event.target.value}})
    }
    // Function to set the User Email
    setEmail = (event) => {
        this.setState({ user:{ ...this.state.user, email: event.target.value}})
    }
    // Function to set the User Password
    setPassword = (event) => {
        this.setState({ user:{ ...this.state.user, password: event.target.value}})
    }
    // Function to set the confirmation password
    setConfirmPassword = (event) => {
        this.setState({ confirmPassword: event.target.value })
    }
    /*
        This function is responsible for updating the nameValidation state.
    */
    closeDialogN = () => {
        this.setState({ nameValidation: false });
    };
    /*
        This function is responsible for updating the emailValidation state.
    */
    closeDialogE = () => {
        this.setState({ emailValidation: false });
    };
    /*
        This function is responsible for updating the passwordValidation state.
    */
    closeDialogP = () => {
        this.setState({ passwordValidation: false });
    };
    /*
        This function is responsible for updating the passwordConfirmationValidation state.
    */
    closeDialogCP = () => {
        this.setState({ passwordConfirmationValidation: false });
    };
    /* 
        Function for chekcing to see if a email string is a valid email in the form of
        <string>@<string>.<string>
    */
    emailValidationFunc(email)
    {
        let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(mailFormat))
        {
        return (true)
        }
        return (false)
    }

    /* Function to send a POST request to the database (server), create a person object
        which contains the User's Name, User's Email and User's Password and POST to the route for
        handling user registration. Upon successful Registration, redirect to the Task's Page
        and send along the response.
    */
    handleSubmit = () => {
        const { history } = this.props;
        if(this.state.user.name.length < 2) {
            this.setState({nameValidation: true});
        }
        else if(this.emailValidationFunc(this.state.user.email) === false) {
            this.setState({emailValidation: true});
        }
        else if(this.state.user.password.length < 7) {
            this.setState({passwordValidation: true});
        }
        else if(this.state.user.password !== this.state.confirmPassword) {
            this.setState({passwordConfirmationValidation: true});
        }
        else {
            Axios({
                method: 'POST',
                url: 'https://cs360-task-manager.herokuapp.com/users',
                data: this.state.user
            }).then(function(response) {
                if(response.status === 200)
                {
                    history.push({pathname:'/tasks', response});
                }
            }).catch((error) =>{})
        }
    }

    render() {
        return ( 
        <div >
            <div>
                <div>
                    <TextField
                        label="Name"
                        style={{ margin: 8, width: '35ch' }}
                        placeholder="Name"
                        value={this.state.user.name}
                        onChange={this.setName}
                        margin="normal"
                        type="text"/>
                </div>
                <div>
                    <TextField
                        label="Email"
                        style={{ margin: 8, width: '35ch' }}
                        placeholder="Email"
                        value={this.state.user.email}
                        onChange={this.setEmail}
                        margin="normal"
                        type="text"/>
                </div>
                <div>
                    <TextField
                        label="Password"
                        style={{ margin: 8, width: '35ch' }}
                        placeholder="Password"
                        value={this.state.user.password}
                        onChange={this.setPassword}
                        margin="normal"
                        type="password"/>
                </div>
                <div>
                    <TextField
                        label="Confirm Password"
                        style={{ margin: 8, width: '35ch' }}
                        placeholder="Confirm Password"
                        value={this.state.confirmPassword}
                        onChange={this.setConfirmPassword}
                        margin="normal"
                        type="password"/>
                </div>
                <Button onClick={() => this.handleSubmit()}>
                    Register
                </Button>
            </div>

            <Dialog open={this.state.nameValidation} onClose={this.closeDialogN} aria-labelledby="form-dialog-title">
                <DialogTitle>Error</DialogTitle>
                <DialogContent> 
                    Name must be at least 2 characters long.
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialogN}>
                        Ok.
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={this.state.emailValidation} onClose={this.closeDialogE} aria-labelledby="form-dialog-title">
                <DialogTitle>Error</DialogTitle>
                <DialogContent> 
                    Please enter a valid email address.
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialogE}>
                        Ok.
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={this.state.passwordValidation} onClose={this.closeDialogP} aria-labelledby="form-dialog-title">
                <DialogTitle>Error</DialogTitle>
                <DialogContent> 
                    Password must be at least 7 characters long.
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialogP}>
                        Ok.
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={this.state.passwordConfirmationValidation} onClose={this.closeDialogCP} aria-labelledby="form-dialog-title">
                <DialogTitle>Error</DialogTitle>
                <DialogContent> 
                    The passwords do not match, Please re-enter your passwords.
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeDialogCP}>
                        Ok.
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
        )
    }
}

export default withRouter(RegisterForm)