import React, {State} from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'

class Home extends React.Component
{
    render()
    {
        return(
<div id="wrapper">
        <div id="container">
            organize  
            <div id="flip">
                <div><div>your thoughts</div></div>
                <div><div>your work</div></div>
                <div><div>your life</div></div>
            </div>
        </div>
        <div id="signup-container">
            This is where the sign up and about buttons would go
        </div>
</div>

        )
    }
}

export default Home