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
            goalsArr: [],
            user: {
                id: "",
                token: ""
            },
            goal: {
                name: "",
                startDate: new Date(),
                endDate: new Date(),
                percentGoal: 0
            },
            goalRes: {
                name: "",
                startDate: new Date(),
                endDate: new Date(),
                percentComplete: 0
            },
            update: false,
            unsuccessfulCreate: false
        }
    }

    /* This function is responsible for setting and updating the startDate variable in the Goal object State. */
    setStartDate = (date) => {
        this.setState({
            goal:{
                ...this.state.goal,
                startDate: date
        }})
    }

    /* This function is responsible for setting and updating the endDate variable in the Goal object State. */
    setEndDate = (date) => {
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
    setPercent = (e) => {
        this.setState({
            goal:{
                ...this.state.goal,
                percentGoal: parseInt(e.target.value)
        }})
    }

    /* This function is responsible for setting the name variable in the goal state object. */
    setName = (e) => {
        this.setState({
            goal:{
                ...this.state.goal,
                name: e.target.value
        }})
    }

    /*
        This function is responsible for creating a goal and making a POST request to the database. The goal state
        object is sent to the database and if the request was successfulthen the update state is set to true and
        the goalRes state object is set with the information from the database. If the request was unsuccessful
        then the user is prompted.
    */
    createGoal = () => {
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/goals/create',
            data: this.state.goal,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({
                goalRes:{
                    ...this.state.goalRes,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                    percentComplete: response.data.percentComplete
            }})
            this.setState({update: true});
        })
        .catch((error) => {
            if(error.response.status === 400)
            {
                this.setState({unsuccessfulCreate: true});
            }
        })
    }

   /*
        This function is responsible for calling the necessary components to mount to the page before the page makes it's inital
        render. It's intended purpose is to call the function setRoute to set up the user state object with the id and token for
        the user.
   */
   async componentDidMount() {
      await this.setRoute();
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
       This function is responsible for updating the page based on if the update State is set to true. If the
       update state is false, the page won't update, but if it is set to true, the page will re-render updating
       any information. Once the Goal has been created, it will set this state to true to updating the content of
       the page.
   */
   componentDidUpdate() {
       if(this.state.update !== false)
       {
           this.setState({update: false});
       }
   }

   /* This function is responsible for updating the deleteConfirmation state. */
   closeDialog = () => {
        this.setState({ unsuccessfulCreate: false });
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

    /* This function is responsible for navigating to the Goal page and pass the user state object. */
    navigateGoal = () => {
        const { history } = this.props;
        const user = this.state.user

        history.push({
            pathname:'/goals',
            user
        });
    }

    /* This function is responsible for handling the user logging out and redirecting the user to the home page. */
    logout = () =>
    {
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
                <div className = "goalsContainer">
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
                            onChange={this.setName}
                            label="Goal Name"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                              }}
                        />
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
<<<<<<< HEAD
                            <DialogContent>
                                Goal was unable to be created. Make sure Goal has a name.
=======
                            <DialogContent> 
                                Goal was unable to be created. Make sure Goal has a name.
>>>>>>> f810bc5716c36710c8d01d02945f92fde46557d5
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.closeDialog}>
                                    Ok.
                                </Button>
                            </DialogActions>
                        </Dialog>
            </div>
            </div>
        )
    }
}

export default withRouter(Goals)