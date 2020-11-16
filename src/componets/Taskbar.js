/*
========================== Log File ========================================
Last Worked on: November 15th   Hudson Fleurimond
    Known Issues:
        .

    What Needs Work:
        .

    Concerns:
        . This component may not be needed as it won't function as planned, will remove once
            it has been confirmed this component isn't needed.
*/
import React from 'react'
import {Link} from 'react-router-dom'
import  './../styles.css'

class Taskbar extends React.Component
{
    render()
    {
        return(
            <div className="headerContainer">
                <div className="headerBox">
                    <Link className="headerElements" to="/goals"> Goals </Link>
                    <Link className="headerElements" to="/tasks"> Tasks </Link>
                    <Link className="headerElements" to="/notes"> Notes </Link>
                    <Link className="headerElements" to="/user"> Settings </Link>
                </div>
            </div>
        )
    }
}

export default Taskbar