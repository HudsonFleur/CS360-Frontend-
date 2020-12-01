import React from 'react';
import {Link} from 'react-router-dom';
import  './../styles.css';

/* Header Class Component */
class Header extends React.Component
{
    /*  
        This Header Class Component serves as a navigation component navigating to the Home, About Us, 
        Register and Login Page. 
    */
    render()
    {
        return(
            <div className="headerContainer">
                <div className="headerLogo"></div>
                <div className="headerBox">
                    <Link className="headerElements" to="/"> Home </Link>
                    <Link className="headerElements" to="about-us"> About Us </Link>
                    <Link className="headerElements" to="register"> Register </Link>
                    <Link className="headerElements" to="login"> Login </Link>
                </div>
            </div>
        )
    }
}

export default Header