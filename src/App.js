import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './styles.css'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Tasks from './pages/Tasks'
import Goals from './pages/Goals'
import User from './pages/User'

class App extends Component
{
    render() 
    {
        const App = () => (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/tasks'    component={Tasks} />
                    <Route exact path='/user' component={User} />
                    <Route exact path='/goals' component={Goals} />
                </Switch>
            </Router>             
        )

        return(
            <App />
        )
    }
}

export default App
