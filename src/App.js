import React, { Component } from 'react'
import {Route,Switch} from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Register from './pages/Register'
import './styles.css'


class App extends Component
{
    render() 
    {
        const App = () => (
            
            <div>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/about-us' component={AboutUs}/>
                    <Route exact path='/register' component={Register}/>
                </Switch>
            </div>
        )

        return(
            <Switch>
                <App />
            </Switch>
        )
    }
    
}

export default App
