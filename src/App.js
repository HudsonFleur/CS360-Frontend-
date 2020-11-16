import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './styles.css'

import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Register from './pages/Register'
import Login from './pages/Login'
import Tasks from './pages/Tasks'
import User from './pages/User'


class App extends Component
{
    render() 
    {
        const App = () => (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/tasks'    component={Tasks} />
                    <Route path='/about-us' component={AboutUs} />
                    <Route path='/register' component={Register} />
                    <Route path='/login' component={Login} />
                    <Route path='/user' component={User} />
                </Switch>
            </Router>             
        )

        return(
            <App />
        )
    }
}

export default App
