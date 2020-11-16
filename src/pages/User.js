/*
========================== Log File ========================================
Last Worked on: November 15th   Hudson Fleurimond
    Known Issues:
        . Error 400 When trying to save update
        . Add function to cancel button

    What Needs Work:
        . Reread and update comments / add more comments
        . UI styling, UI needs an overhaul
        . Adding Alerts and Error Notifications

    Concerns:
        .
*/
import React from 'react'
import Axios from 'axios'
import {withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// User Class
class User extends React.Component
{
    // Constructor for User Class
    /*
            State Declarations
                user:       State object for holding the User information, The id of the User, Token for authentication, 
                            set to empty initially
                userInfo:   State object for holding the User Account information, The name of the User, the email associated
                            with the account and the password
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
                password: ""

            }
        }
    }
    /*
            This function is responsible for calling the necessary components to mount to the page before the page render
            It's intended purpose is to call the function setRoute to set up the User information and then call the function
            getTasks to get all of the tasks associated with this user. This is extremely important to render anything that 
            needs to be fetched from the server (database) before the page loads
    */
    componentDidMount()
    {
        this.setRoute();
        this.getUserInfo();
    }
    /*
        This function is responsible for setting up the necessary information needed to make calls to the DB and navigating, through the
        application. We then set our User State variable to the data that was passed from the previous page.
    */
    setRoute() 
    {
        const { location } = this.props;
        this.setState({
            user:{
                ...this.state.user,
                id: location.user.id,
                token: location.user.token
        }})
    }
    getUserInfo() {
        const { location } = this.props;
        Axios({
            method: 'GET',
            url: 'http://192.168.50.103:5000/users/me',
            headers: {"Authorization" : `Bearer ${location.user.token}`}
            //headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({
                userInfo:{
                    ...this.state.userInfo,
                    name: response.data.name,
                    email: response.data.email,
            }})
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    updateUserInfo = () => {
        const { location } = this.props;
        const { history } = this.props;
        const user = this.state.user

        Axios({
            method: 'PATCH',
            url: 'http://192.168.50.103:5000/users/me',
            data: this.state.userInfo,
            headers: {"Authorization" : `Bearer ${location.user.token}`}
          }).then((response) => {
            history.push({
                pathname:'/tasks',
                user
            });
          })
          .catch(function(error) {
            console.log(error);
          })
    }
    updateName = (e) =>
    {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                name: e.target.value,
        }})
    }
    updateEmail = (e) =>
    {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                email: e.target.value,
        }})
    }
    updatePassword = (e) =>
    {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                password: e.target.value,
        }})
    }
    deleteUser = () => {
        const { location } = this.props;
        const { history } = this.props;
        Axios({
            method: 'DELETE',
            url: 'http://192.168.50.103:5000/users/me',
            data: this.state.userInfo,
            headers: {"Authorization" : `Bearer ${location.user.token}`}
          }).then((response) => {
            history.push({pathname:'/'});
          })
          .catch(function(error) {
            console.log(error);
          })
    }
// --------------------------------------------- Navigating Functions ---------------------------------------------------------------------
    navigateTask = () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/tasks',
            user
        });
    }
    navigateSetitng = () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/user',
            user
        });
    }
    logout = () => {
        const { history } = this.props;
        Axios({
            method: 'POST',
            url: 'http://192.168.50.103:5000/users/logout',
            data: this.state.user,
            //headers: {"Authorization" : `Bearer ${location.response.data.token}`}
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            history.push({pathname:'/'});
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    render()
    {
        return(
            <div>
                <div className="headerContainer">
                    <div className="headerBox">
                        <Button variant="contained" color="primary" >
                            Goals
                        </Button>
                        <Button variant="contained" color="primary" onClick={this.navigateTask}>
                            Tasks
                        </Button>
                        <Button variant="contained" color="primary" >
                            Notes
                        </Button>
                        <Button variant="contained" color="primary" onClick={this.navigateSetitng}>
                            Settings
                        </Button>
                        <Button variant="contained" color="primary" onClick={this.logout}>
                            Sign-Out
                        </Button>
                    </div>
                </div>
                <div>
                    <TextField
                        label="Name"
                        style={{ margin: 8, width: '25ch' }}
                        placeholder="Name"
                        multiline
                        value={this.state.userInfo.name}
                        onChange={this.updateName}
                        margin="normal"
                        type="text"
                        fullWidth
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
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        style={{ margin: 8, width: '25ch' }}
                        placeholder="Password"
                        multiline
                        value={this.state.userInfo.password}
                        onChange={this.updatePassword}
                        margin="normal"
                        type="password"
                        fullWidth
                    />
                </div>
                <Button onClick={this.updateUserInfo}>
                    Save Changes
                </Button>
                <Button>
                    Cancel
                </Button>
                <Button onClick={() => this.deleteUser}>
                    Delete Account
                </Button>
            </div>
        )
    }
}
export default withRouter(User)