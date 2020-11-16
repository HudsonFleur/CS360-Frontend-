/*
-------------------- Log File --------------------
Last Worked on: November 16th   Hudson Fleurimond
    Known Issues:
        . Date Format is an issue, cause multiple logs to the console which is causing unnecessary load
        . Edit Task isn't Saving the Edits, Error 400
        . When opening a previous Task, Date appears and then disappears, or currentDate Appears
        . getTask giving a Error 401 (Unauthorized), this needs to be fixed because somehow, it isn't doing the
            initial render, at the moment the page relies on ComponentDidUpdate to retrieve the task
        . ComponentDidUpdate is causing a memory leak, performance issue 

    What Needs Work:
        . Reread and update comments / add more comments
        . UI Styling, UI needs an overhaul of course, only implementation has been done
        . CSS styles get whatever is on the home, We need to give everything a style or CSS components
            so the default isn't the same thing everywhere,
        . Adding Alerts and Error Notifications

    Concerns:
        . ComponentDidUpdate, maybe should have a timer so it isn't updating every single second or a strict condition variable
            A timer that resets every 5 minutes should suffice

    IMPORTANT: Unauthorized Error 401 was fixed by making ComponentDidMount async and putting an await on setRoutes,
                Issue was the tokens wasn't being set before calling getTask
*/
import React from 'react'
import Axios from 'axios'
import {withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './../styles.css'

// Tasks Class
class Tasks extends React.Component {
    // Constructor for Tasks Class
    /*
        State Declarations
            tasks:      State array for holding all of the task objects for the respective user, set to empty initially
            open:       State for dealing with Material-UI dialog control, This is specific for viewing the Create Task
                        Dialog, set to false so dialog doesn't open unless called
            taskView:   State for dealing with Material-UI dialog control, This is specific for viewing the View Task 
                        Dialog, set to false so dialog doesn't open unless called
            user:       State object for holding the User information, The id of the User, Token for authentication, 
                        set to empty initially
            task:       State object for holding the Task information for a specific task, The description of the Task,
                        the Due Date it should be completed, if it has been completed and the owner of the task (User ID)
    */
    constructor(props) 
    {
        super(props);
        this.state = {
            tasks: [],
            open: false,
            taskView: false,
            user: {
                id: "",
                token: ""
            },
            task: {
                description: "",
                dueDate: (new Date()).toISOString().split('T')[0],
                completed: false,
                owner: ""
            }
        }
    }
// --------------------------------------------- Page Rendering Functions ---------------------------------------------------------------------
    /*
        This function is responsible for calling the necessary components to mount to the page before the page render
        It's intended purpose is to call the function setRoute to set up the User information and then call the function
        getTasks to get all of the tasks associated with this user. This is extremely important to render anything that 
        needs to be fetched from the server (database) before the page loads
    */
    async componentDidMount()
    {
        await this.setRoute();
        this.getTasks();
    }
    /*
        This function is responsible for calling the necessary components to remount to the page before the page after the
        page has done it's initial render. It's intended purpose is to call the function getTasks again to get all of the tasks 
        that may have been added since the initial render associated with this user. This is extremely important to re-render the
        page.
    */
    componentDidUpdate()
    {
        this.getTasks();
    }
    /*
        This function is responsible for setting up the necessary information needed to make calls to the DB and navigating, through the
        application. 

            const { location } = this.props; 
                This is extremely important as it allows us to receive data that was passed to the page, data such as the token needed for 
                authentication and the User ID. Imported with the import {withRouter } from "react-router-dom"; module

        We then set our User State variable to the data that was passed from the previous page.
    */
    setRoute() 
    {
        const { location } = this.props;
        if(location.response !== undefined)
        {
            this.setState({
                user:{
                    ...this.state.user,
                    id: location.response.data.user._id,
                    token: location.response.data.token
            }})
            console.log("From Response", location.response.data.token)
        }
        else
        {
            this.setState({
                user:{
                    ...this.state.user,
                    id: location.user.id,
                    token: location.user.token
            }})
            console.log("From User", location.user.token)
        }
    }
    /*
        This function is responsible for getting all of the tasks associated with this user, being that we should have already
        set up the routes, we can now make a GET request to our server and set our tasks State to our response.
    */
    getTasks()
    {
        const { location } = this.props;
        console.log('Fromt getTask', this.state.user.token)
        Axios({
            method: 'GET',
            url: 'http://192.168.50.103:5000/tasks',
            //headers: {"Authorization" : `Bearer ${location.response.data.token}`}
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({tasks: response.data})
        }).catch(function(error){
            console.log(error)
        })
    }
// --------------------------------------------- Creating Tasks Functions ---------------------------------------------------------------------
    /*
        This function is responsible for creating a task and posting it to the database. We send the task state as it
        should contain all of the information the user wants in this specific task. If the operation was a success and 
        we get a response of code 201, then we can close the dialog window by changing it's open state to false.
    */
    createTask = () => 
    {
        const { location } = this.props;
        Axios({
            method: 'POST',
            url: 'http://192.168.50.103:5000/tasks',
            data: this.state.task,
            //headers: {"Authorization" : `Bearer ${location.response.data.token}`}
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            if(response.status === 201)
            {
                this.setState({open: false})
            }
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    /*
        This function is responsible for setting and or updating our description variable in the task State.
        It also sets the owner for this task.
    */    
    setDescription = (e) =>
    {
        this.setState({
            task:{
                ...this.state.task,
                description: e.target.value,
                owner: this.state.user.id
        }})
    }
    /*
        This function is responsible for setting and or updating our dueDate variable in the task State.
    */
    setDate = (e) =>
    {
        this.setState({
            task:{
                ...this.state.task,
                date: e.target.value
        }})
    }
    /*setOwner = (e) =>
    {
        this.setState({
            task:{
                ...this.state.task,
                owner: this.state.user.id
        }})
    }*/
    /*
        This function is responsible for opening the Create Dialog window by setting the open State to true.
    */
    createDialogOpen = () => {
        this.setState({open: true})
    };
    /*
        This function is responsible for closing the Create Dialog window by setting the open State to false.
    */
    createDialogClose = () => {
        this.setState({ open: false });
    };
// --------------------------------------------- Reading Tasks(View) Functions ---------------------------------------------------------------------
    /*
        This function is responsible for opening the Create Dialog window by setting the open State to true,
        and this function has a GET request to the database to retrieve a specific Task when supplied the Task
        ID for it. It updates the task State to contain the data retrieved from the database.
    */
    viewDialogOpen(TaskID) {
        const { location } = this.props;
        Axios({
            method: 'GET',
            url: 'http://192.168.50.103:5000/tasks/' + TaskID,
            //headers: {"Authorization" : `Bearer ${location.response.data.token}`}
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({
                task:{
                    ...this.state.task,
                    description: response.data.description,
                    dueDate: response.data.dueDate,
            }})
        })
        .catch(function(error) {
            console.log(error);
        })
        this.setState({taskView: true})
    };
    /*
        This function is responsible for closing the View Dialog window by setting the taskView State to false.
    */
    viewDialogClose = () => {
        this.setState({ taskView: false });
    };
// --------------------------------------------- Updating Functions ---------------------------------------------------------------------
    editTask = (TaskID) => {
        const { history } = this.props;
        Axios({
            method: 'PATCH',
            url: 'http://192.168.50.103:5000/tasks/' + TaskID,
            data: this.state.task,
            //headers: {"Authorization" : `Bearer ${location.response.data.token}`}
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({ taskView: false });
        })
        .catch(function(error) {
            console.log(error);
        })
    }
// --------------------------------------------- Deleting Tasks Functions ---------------------------------------------------------------------
    deleteTask = (TaskID) => {
        const { history } = this.props;
        Axios({
            method: 'DELETE',
            url: 'http://192.168.50.103:5000/tasks/' + TaskID,
            data: this.state.task,
            //headers: {"Authorization" : `Bearer ${location.response.data.token}`}
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({ taskView: false });
        })
        .catch(function(error) {
            console.log(error);
        })
    }
// --------------------------------------------- Navigating Functions -------------------------------------------------------------------------
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
                <Button variant="contained" color="primary" onClick={this.createDialogOpen}>
                    Create task 
                </Button>
                <Dialog open={this.state.open} onClose={this.createDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create Task</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            multiline
                            margin="dense"
                            onChange={this.setDescription}
                            label="Description"
                            type="text"
                            fullWidth
                        />
                        <TextField
                            label="Due Date"
                            format={"YYYY-MM-DD"}
                            type="date"
                            onChange={this.setDate}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.createDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.createTask} color="primary">
                            Create Task
                        </Button>
                    </DialogActions>
                </Dialog>

                    <button className="button" type="button"> Sort By </button>
                    <button className="button" type="button"> Trash </button>
                </div>

                <div>
                    {this.state.tasks.map(task => (
                        <div>
                        <button key={task._id} onClick={() => this.viewDialogOpen(task._id)}>
                                <div> {task.description} </div>
                        </button>
                                <Dialog open={this.state.taskView} onClose={this.viewDialogClose} aria-labelledby="form-dialog-title2">
                                <DialogTitle id="form-dialog-title2">Edit Task</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        multiline
                                        margin="dense"
                                        value={this.state.task.description}
                                        onChange={this.setDescription}
                                        label="Description"
                                        type="text"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Due Date"
                                        format={"YYYY-MM-DD"}
                                        type="date"
                                        //value={this.state.task.dueDate}
                                        onChange={this.setDate}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => this.deleteTask(task._id)} color="primary">
                                        Delete
                                    </Button>
                                    <Button onClick={this.viewDialogClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => this.editTask(task._id)} color="primary">
                                        Save Changes
                                    </Button>
                                </DialogActions>
                                </Dialog> 
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
export default withRouter(Tasks)