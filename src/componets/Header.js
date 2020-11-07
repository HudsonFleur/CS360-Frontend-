import React from 'react'
import {Link} from 'react-router-dom'
import  './../styles.css'

class Header extends React.Component
{
    render()
    {
        return(
            <div className="headerContainer">
                <div className="headerLogo"> <center>Placeholder</center> </div>
                <div className="headerBox">
                    <Link className="headerElements" to="/"> Home </Link>
                    <Link className="headerElements" to="about-us"> About Us </Link>
                    <Link className="headerElements" to="login"> Login </Link>
                </div>
            </div>
        )
    }
}

export default Header