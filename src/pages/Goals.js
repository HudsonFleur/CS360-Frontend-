/*
-------------------- Log File --------------------
Last Worked on: November 24th   Hudson Fleurimond
    Known Issues:
        . 

    What Needs Work:
        . UI styling, UI needs an overhaul
        . Logout error handling (500)

    Concerns:
        . 
*/
import React from 'react';
import Axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import { withRouter } from "react-router-dom";
import './../styles.css';

/* Goals Class */
class Goals extends React.Component
{
    /* Constructor for class */
    /*
        State Declarations
            user:       State object for holding the User information, The id of the User, Token for authentication, 
                        set to empty initially
            goal:       State object for holding the Goal information for a goal that is going to be sent to the database.
                        It contains a Start Date, an End Date and a PercentGoal.
            goalRes :   State object for holding the Goal information for a the response that is sent back from the database
                        It contains a Start Date, an End Date and a PercentGoal.
            update:     State for controlling the page to check to see if there has been an update. Set to false

            unsuccessfulSave:       State for controling the view of the unsucessful save dialog
    */
    constructor(props) 
    {
        super(props);
        this.state = {
            user: {
                id: "",
                token: ""
            },
            goal: {
                startDate: new Date(),
                endDate: new Date(),
                percentGoal: 0
            },
            goalRes: {
                startDate: new Date(),
                endDate: new Date(),
                percentComplete: 0
            },
            update: false,
            unsuccessfulCreate: false
        }
    }
    /*
        This function is responsible for setting and updating the startDate variable in the Goal object State.
    */
    setStartDate = (date) =>
    {
        this.setState({
            goal:{
                ...this.state.goal,
                startDate: date
        }})
    }
    /*
        This function is responsible for setting and updating the endDate variable in the Goal object State.
    */
    setEndDate = (date) =>
    {
        this.setState({
            goal:{
                ...this.state.goal,
                endDate: date
        }})
    }
    /*
        This function is responsible for setting and updating the percentGoal variable in the Goal object State.
        Parses the input as an Int
    */
    setPercent = (e) =>
    {
        this.setState({
            goal:{
                ...this.state.goal,
                percentGoal: parseInt(e.target.value)
        }})
    }
    /*
        This function is responsible for creating a Goal and sendng a POST request to the database. The Goal object state
        is sent to the database. If the operation was a sucessful, the response code should be Code 201 and the update State
        is set to true.
    */
    createGoal = () =>
    {
        Axios({
            method: 'POST',
            url: 'http://localhost:5000/goals/create',
            data: this.state.goal,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({
                goalRes:{
                    ...this.state.task,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                    percentComplete: response.data.percentComplete
            }})
            this.setState({update: true});
        })
        .catch(function(error) {
            if(error.response.status === 400)
            {
                this.setState({unsuccessfulCreate: true});
            }
        })
    }
   /*
        This function is responsible for calling the necessary components to mount to the page before the page makes it's inital
        render. It's intended purpose is to call the function setRoute to set up the User information.
   */
   async componentDidMount()
   {
      await this.setRoute();
   }
   /*
       This function is responsible for setting up the necessary information needed to make calls to the DB and navigating, through the
       application. We then set the user state object to the data that was passed from the previous page. If the user object is 
       undefined, the this page is trying to be accessed without having proper authentication.
   */
   setRoute() 
   {
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
       This function is responsible for updating the page based on if the update State is set to true. If the
       update state is false, the page won't update, but if it is set to true, the page will re-render updating
       any information. Once the Goal has been created, it will set this state to true to updating the content of
       the page.
   */
   componentDidUpdate()
   {
       if(this.state.update !== false)
       {
           this.setState({update: false});
       }
   }
   /*
        This function is responsible for updating the deleteConfirmation state.
   */
   closeDialog = () => {
        this.setState({ unsuccessfulCreate: false });
    };
   /*
        This function is responsible for navigating to the Task page and pass the user state object.
   */
   navigateTask = () => 
   {
       const { history } = this.props;
       const user = this.state.user
       
       history.push({
           pathname:'/tasks',
           user
        });
   }
   /*
        This function is responsible for navigating to the Settings(User) page and pass the user state object.
   */
   navigateSetitng = () => 
   {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/user',
            user
        });
    }
    /*
        This function is responsible for navigating to the Goal page and pass the user state object.
   */
    navigateGoal = () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/goals',
            user
        });
    }
    /*
        This function is responsible for handling the user logging out and redirecting the user to the home page.
    */
    logout = () => 
    {
        const { history } = this.props;
        Axios({
            method: 'POST',
            url: 'http://localhost:5000/users/logout',
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
                            <Button variant="contained" color="primary" >
                                Notes
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    label="Start Day"
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    autoOk="true"
                                    value={this.state.goal.startDate}
                                    onChange={this.setStartDate}/>
                            </Grid>
                        </MuiPickersUtilsProvider>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    label="End Day"
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    autoOk="true"
                                    value={this.state.goal.endDate}
                                    onChange={this.setEndDate}/>
                            </Grid>
                        </MuiPickersUtilsProvider>

                        <TextField
                            autoFocus
                            margin="dense"
                            onChange={this.setPercent}
                            label="Percent Goal"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                              }}
                        />

                        <Button onClick={this.createGoal}>
                            Create Goal
                        </Button>

                        <div>
                            You have completed {this.state.goalRes.percentComplete} % of your goals.
                        </div>

                        <Dialog open={this.state.unsuccessfulCreate} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Create Error</DialogTitle>
                            <DialogContent> 
                                Goal was unable to be created.
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

export default withRouter(Goals)