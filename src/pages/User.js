import React from 'react'
import Axios from 'axios'
import {withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

/* User Class Component */
class User extends React.Component
{
    /* Constructor for User Class */
    /*
        State Declarations
            user:   State object for holding the User information, The id of the User, Token for authentication,
                    set to empty initially
            userInfo:   State object for holding the User Account information, The name of the User and the email associated
                        with the account
            successfulSave:         State for controling the view of the sucessful save dialog
            unsuccessfulSave:       State for controling the view of the unsucessful save dialog
            deleteConfirmation:     State for controling the view of the delete confirmation dialog
    */
    constructor(props)
    {
        super(props);
        this.state = {
            user: {
                id: "",
                token: ""
            },
            userInfo: {
                name: "",
                email: "",
            },
            password: "",
            successfulSave: false,
            unsuccessfulSave: false,
            deleteConfirmation: false
        }
    }

    /*
        This function is responsible for calling the necessary components to mount to the page before the page makes it's inital
        render. It's intended purpose is to call the function setRoute to set up the user state object with the id and token for
        the user and afterwards call the function getUserInfo to get the informtaion of the account associated with this user.
    */
    async componentDidMount() {
       await this.setRoute();
       this.getUserInfo();
    }

    /*
       This function is responsible for setting up the necessary information needed to make calls to the database and navigating, through the
       application. We then set the user state object to the data that was passed from the previous page. If the user object is
       undefined, the this page is trying to be accessed without having proper authentication.
    */
    setRoute() {
        const { location } = this.props;
        const { history } = this.props;

       if(location.user === undefined)
       {
            history.push({pathname:'/'});
       }
       else
       {
            this.setState({
                user:{
                    ...this.state.user,
                    id: location.user.id,
                    token: location.user.token
            }})
        }
    }

    /*
        This function is responsible for retrieving the information associated with the account. If the request was successful
        then the userInfo state object is updated with the information found from the database.
    */
    getUserInfo() {
        Axios({
            method: 'GET',
            url: 'https://cs360-task-manager.herokuapp.com/users/me',
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({
                userInfo:{
                    ...this.state.userInfo,
                    name: response.data.name,
                    email: response.data.email,
            }})
        })
        .catch(function(error) {})
    }

    /*
        This function is responsible for updating the information associated with the account. If the user supplies a new
        password, it will be appended to the userInfo object. If the request was successful (status = 200) then the userInfo
        state object is updated with the information and will promp the user of the changes. If the response failed then it
        will give the user the proper error prompt.
    */
    updateUserInfo = () => {
        if(this.state.password !== "" && this.state.password.length >= 7)
        {
            this.setState({
                userInfo:{
                    ...this.state.userInfo,
                    password: this.state.password
            }})
        }

        Axios({
            method: 'PATCH',
            url: 'https://cs360-task-manager.herokuapp.com/users/me',
            data: this.state.userInfo,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
          }).then((response) => {
              if(response.status === 200)
              {
                this.setState({successfulSave: true});
              }
          })
          .catch((error) => {
              if(error.response.status === 400)
              {
                  this.setState({unsuccessfulSave: true});
              }
          })
    }

    /* This function is responsible for updating the successfulSave state. */
    closeDialogS = () => {
        this.setState({ successfulSave: false });
    }

    /* This function is responsible for updating the unsuccessfulSave state. */
    closeDialogU = () => {
        this.setState({ unsuccessfulSave: false });
    }

    /* This function is responsible for updating the deleteConfirmation state. */
    openDialog = () => {
        this.setState({ deleteConfirmation: true });
    }

    /* This function is responsible for updating the deleteConfirmation state. */
    closeDialog = () => {
        this.setState({ deleteConfirmation: false });
    }

    /* This function is responsible for setting and updating the name variable in the userInfo object State. */
    updateName = (e) => {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                name: e.target.value,
        }})
    }

    /* This function is responsible for setting and updating the email variable in the userInfo object State. */
    updateEmail = (e) => {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                email: e.target.value,
        }})
    }

    /* This function is responsible for setting and updating the password state. */
    updatePassword = (e) => {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                password: e.target.value,
        }})
    }

    /*
        This function is responsible for deleting a User account. This functions sends a DELETE request to the
        database and if the request was sucessful, the User is redirected back to the home page.
    */
    deleteUser = () => {
        const { history } = this.props;
        Axios({
            method: 'DELETE',
            url: 'https://cs360-task-manager.herokuapp.com/users/me',
            data: this.state.userInfo,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
          }).then((response) => {
            history.push({pathname:'/'});
          })
          .catch(function(error) {})
    }

    /* This function is responsible for navigating to the Task page and pass the user state object. */
    navigateTask = () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/tasks',
            user
        });
    }

    /* This function is responsible for navigating to the Settings(User) page and pass the user state object. */
    navigateSetitng = () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/user',
            user
        });
    }

    /* This function is responsible for navigating to the Goals page and pass the user state object. */
    navigateGoal= () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/goals',
            user
        });
    }

    /* This function is responsible for handling the user logging out and redirecting the user to the home page. */
    logout = () => {
        const { history } = this.props;
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/users/logout',
            data: this.state.user,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            history.push({pathname:'/'});
        })
        .catch(function(error) {})
    }
    render()
    {
        return(
            <div>
                <div className="taskbarContainer">
                        <div className="taskbarLeft">
                            <Button variant="contained" color="primary" onClick={this.navigateGoal}>
                                Goals
                            </Button>
                            <Button variant="contained" color="primary" onClick={this.navigateTask}>
                                Tasks
                            </Button>
                        </div>
                        <div className="taskbarRight">
                            <Button variant="contained" color="primary" onClick={this.navigateSetitng}>
                                Settings
                            </Button>
                            <Button variant="contained" color="primary" onClick={this.logout}>
                                Sign-Out
                            </Button>
                        </div>
                </div>
                <div>
                	<div className = "settingsContainer">
                    <TextField
                        label="Name"
                        style={{ margin: 8, width: '25ch' }}
                        placeholder="Name"
                        multiline
                        value={this.state.userInfo.name}
                        onChange={this.updateName}
                        margin="normal"
                        type="text"
                    />
                    <TextField
                        label="Email"
                        style={{ margin: 8, width: '25ch' }}
                        placeholder="Email Address"
                        multiline
                        value={this.state.userInfo.email}
                        onChange={this.updateEmail}
                        margin="normal"
                        type="text"
                    />
                    <TextField
                        label="Password"
                        style={{ margin: 8, width: '25ch' }}
                        placeholder="Password"
                        value={this.state.userInfo.password}
                        onChange={this.updatePassword}
                        margin="normal"
                        type="password"
                    />
                    </div>
                </div>
                <div>
                <div className = "editButtonContainer">
                    <Button onClick={this.updateUserInfo}>
                        Save Changes
                    </Button>
                    <Button onClick={this.openDialog}>
                        Delete Account
                    </Button>
                </div>
                </div>

                <Dialog open={this.state.successfulSave} onClose={this.closeDialogS} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Sucess</DialogTitle>
                    <DialogContent>
                        User information was successfully updated.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialogS}>
                            Ok.
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.unsuccessfulSave} onClose={this.closeDialogU} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Save Error</DialogTitle>
                    <DialogContent>
                        User information was unable to save. Check to make sure your Name, Email and Password
                        are within the correct requirements.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialogU}>
                            Ok.
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.deleteConfirmation} disableBackdropClick="true" onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Confirmation Required</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete your Account?
                        Once you confirm, all of your data will be permanently deleted.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.deleteUser}>
                            Delete My Account
                        </Button>
                        <Button onClick={this.closeDialog}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default withRouter(User)