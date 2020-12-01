import React from 'react'
import Axios from 'axios'
import {withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import './../styles.css'

/* Tasks Class Component */
class Tasks extends React.Component {
    /* Constructor for Tasks Class */
    /*
        State Declarations
            taskArr:    State array for holding all of the task objects for the user
            taskCreate: State for dealing with Material-UI dialog control, This is specific for viewing the Create Task
                        Dialog, set to false so dialog doesn't open unless called
            taskView:   State for dealing with Material-UI dialog control, This is specific for viewing the View Task 
                        Dialog, set to false so dialog doesn't open unless called
            user:       State object for holding the User information, The id of the User, Token for authentication, 
                        set to empty initially
            task:       State object for holding the Task information for a specific task, The description of the Task,
                        the Due Date it should be completed and if it has been completed
            taskID:     State for holding the ID of a task
            deleteConfirmation:     State for controling the view of the delete confirmation dialog
            updatedTask:            State for controlling the condtion on if the page should update for any new changes made
    */
    constructor(props) 
    {
        super(props);
        this.state = {
            taskArr: [],
            prevTaskArr: [],
            taskCreate: false,
            taskView: false,
            user: {
                id: "",
                token: ""
            },
            task: {
                description: "",
                dueDate: new Date(),
                completed: false,
            },
            taskID: '',
            deleteConfirmation: false,
            updatedTask: false
        }
    }

    /*
        This function is responsible for calling the necessary components to mount to the page before the page makes it's inital
        render. It's intended purpose is to call the function setRoute to set up the user state object with the id and token for
        the user and afterwards call the function getTasks to get all of the Tasks associated with this user.
    */
    async componentDidMount() {
        await this.setRoute();
        this.getTasks();
    }

    /*
        This function is responsible for updating the page by re rendering it. It checked to see
        if the state updatedTask has been set to true and if so, will call getTasks to update the 
        information.
    */
    componentDidUpdate() {
        if(this.state.updatedTask === true )
        {
            this.getTasks();
            this.setState({updatedTask: false})
        }
    }

    /* 
       This function is responsible for setting up the necessary information needed to make calls to the database and navigating, through the
       application. We then set the user state object to the data that was passed from the previous page. If the user object is 
       undefined, the this page is trying to be accessed without having proper authentication.
    */
    setRoute() {
        const { location } = this.props;
        const { history } = this.props;

       if(location.user === undefined && location.response === undefined)
       {
            history.push({pathname:'/'});
       }
       else if(location.response !== undefined)
        {
            this.setState({
                user:{
                    ...this.state.user,
                    id: location.response.data.user._id,
                    token: location.response.data.token
            }})
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
        This function is responsible for retrieving the tasks associated with the account. If the request was successful
        then the taskArr state object is updated with the information found from the database.
    */
    getTasks() {
        Axios({
            method: 'GET',
            url: 'https://cs360-task-manager.herokuapp.com/tasks',
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({taskArr: response.data})
        }).catch(function(error){
            console.log(error)
        })
    }

    /*
        This function is responsible for truncating the description so it will appear on the screen without over lapping
        into the other elements that need to be displayed. If a task description is more than 45 characters, then take 
        the first 40 character and display them.
    */
    truncateDescription(description) {
        return description.length > 45 ? description.substring(0,40) + "..." : description
    }

    /* This function is responsible for adding the offset to accommodate for the UTC time setting that the database is set to. */
    dateAddOffset = () => {
        let offset = (new Date().getTimezoneOffset()) / 60;
        this.state.task.dueDate.setHours(23 + offset)
        this.state.task.dueDate.setMinutes(59)
        this.state.task.dueDate.setSeconds(59)
        this.state.task.dueDate.setMilliseconds(999)
    }

    /* This function is responsible for subtracting the offset to accommodate for the UTC time setting that the database is set to. */
    dateSubOffset = (date) => {
        let offset = (new Date().getTimezoneOffset()) / 60;
        let newDate = new Date(date);
        newDate.setHours(23 - offset)
        
        return newDate
    }

    /*
        This function is responsible for creating a task and making a POST request to the database. The dateAddOffset function
        is called and then the POST request to the database is made, The task state object is sent to the database and if the 
        request was successful (status = 201) then the updatedTask state is set to true and the taskCreate state is set to false.
    */
    createTask = () => {
        this.dateAddOffset()
        
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/tasks',
            data: this.state.task,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            if(response.status === 201)
            {
                this.setState({updatedTask: true})
                this.setState({taskCreate: false})
            }
        })
        .catch(function(error) {})
    }

    /* This function is responsible for setting and or updating the description variable in the task state object. */    
    setDescription = (e) => {
        this.setState({
            task:{
                ...this.state.task,
                description: e.target.value,
        }})
    }

    /* This function is responsible for setting and or updating the dueDate variable in the task state object. */
    setDate = (date) => {
        this.setState({
            task:{
                ...this.state.task,
                dueDate: date
        }})
    }

    /* This function is responsible for setting and or updating the completed variable in the task state object. */
    setCompleted = (event) => {
        this.setState({
            task:{
                ...this.state.task,
                completed: event.target.checked
        }})
    }

    /* This function is responsible for opening the Create Dialog window by setting the taskCreate state to true. */
    createDialogOpen = () => {
        this.setState({taskCreate: true})
    }

    /* This function is responsible for closing the Create Dialog window by setting the taskCreate state to false. */
    createDialogClose = () => {
        this.setState({ taskCreate: false });
    }

    /*
        This function has a GET request to the database to retrieve a specific Task when supplied the Task
        ID. This function is responsible for opening the View Dialog window by setting the taskView state to true.
    */
    viewDialogOpen(TaskID) {

        Axios({
            method: 'GET',
            url: 'https://cs360-task-manager.herokuapp.com/tasks/' + TaskID,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({
                task:{
                    ...this.state.task,
                    description: response.data.description,
                    dueDate: response.data.dueDate,
                    completed: response.data.completed
            }})
            this.setState({
                taskID: TaskID})
        })
        .catch(function(error) {
            console.log(error);
        })
        this.setState({taskView: true})
    }

    /* This function is responsible for closing the View Dialog window by setting the taskView state to false. */
    viewDialogClose = () => {
        this.setState({ taskView: false });
    }

    /*
        This function is responsible for updating the information associated with a specific task. The user is able to 
        change the description, due date, mark it as completed and delete as task. If the request was successful then the 
        task state object is updated.
    */
    editTask = (TaskID) => {
        Axios({
            method: 'PATCH',
            url: 'https://cs360-task-manager.herokuapp.com/tasks/' + TaskID,
            data: this.state.task,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({updatedTask: true})
            this.setState({ taskView: false });
        })
        .catch(function(error) {
            console.log(error);
        })
        
    }

    /*
        This function is responsible for deleting a task. This functions sends a DELETE request to the
        database and if the request was sucessful, the task is deleted, the updatedTask state is set to
        true, the deleteConfirmation state is set to false and the taskView state is set to false.
    */
    deleteTask = (TaskID) => {
        Axios({
            method: 'DELETE',
            url: 'https://cs360-task-manager.herokuapp.com/tasks/' + TaskID,
            data: this.state.task,
            headers: {"Authorization" : `Bearer ${this.state.user.token}`}
        }).then((response) => {
            this.setState({updatedTask: true})
            this.setState({ deleteConfirmation: false });
            this.setState({ taskView: false });
        })
        .catch(function(error) {})
    }

    /* This function is responsible for updating the deleteConfirmation state. */
    openDialog = () => {
        this.setState({ deleteConfirmation: true });
    }

    /* This function is responsible for updating the deleteConfirmation state. */
    closeDialog = () => {
        this.setState({ deleteConfirmation: false });
    }

    /* 
        This function is responsible for checking to see if a task(boolean) is comepleted or not
        an to return the correct string.
    */
    checkCompleted(task)
    {  
        if(task === true)
        return 'Completed'
        else
        return 'Not Completed'
    }

    /* This function is responsible for navigating to the Tasks page and pass the user state object. */
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
    navigateGoal = () => {
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
        .catch(function(error) {
            console.log(error);
        })
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
                <Button variant="contained" color="primary" onClick={this.createDialogOpen}>
                    Create task 
                </Button>
                <Dialog open={this.state.taskCreate} onClose={this.createDialogClose} aria-labelledby="form-dialog-title">
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    autoOk="true"
                                    value={this.state.task.dueDate}
                                    onChange={this.setDate}/>
                            </Grid>
                        </MuiPickersUtilsProvider>
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
                </div>

                <div>
                    {this.state.taskArr.map(task => (
                        <div>
                            <List component="nav" aria-label="mailbox folders">
                                <ListItem button key={task._id} onClick={() => this.viewDialogOpen(task._id)}>
                                    <ListItemText className="taskDescription" primary={this.truncateDescription(task.description)}/>
                                    <ListItemText primary={this.dateSubOffset(task.dueDate).toDateString() }/>
                                    <ListItemText primary={this.checkCompleted(task.completed)} />
                                </ListItem>
                                <Divider />
                            </List>
                        
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
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
                                            <KeyboardDatePicker
                                                variant="inline"
                                                format="MM/dd/yyyy"
                                                margin="normal"
                                                autoOk="true"
                                                label="Due Date"
                                                value={this.state.task.dueDate}
                                                onChange={this.setDate}/>
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    <div>
                                        Completed
                                        <Checkbox
                                            labelPlacement="start"
                                            color="primary"
                                            checked={this.state.task.completed}
                                            onChange={this.setCompleted} />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.openDialog} color="primary">
                                        Delete
                                    </Button>
                                    <Button onClick={this.viewDialogClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => this.editTask(this.state.taskID)} color="primary">
                                        Save Changes
                                    </Button>
                                </DialogActions>
                                </Dialog>

                                <Dialog open={this.state.deleteConfirmation} disableBackdropClick="true" onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Confirmation Required</DialogTitle>
                                    <DialogContent> 
                                        Are you sure you want to this task?
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => this.deleteTask(this.state.taskID)}>
                                            Yes
                                        </Button>
                                        <Button onClick={this.closeDialog}>
                                            No
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
