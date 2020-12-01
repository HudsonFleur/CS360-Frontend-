import React from 'react';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';

/* Function Component Home */
function Home()
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
            <div>
                <Button variant="contained" color="primary" > 
                    <Link 
                        style={{color:'inherit', textDecoration: 'inherit'}}
                        to="/register">
                        Register Now !
                    </Link>
                </Button>
            </div>

            <div> 
                Already Have an Account?
                <button className="button" type="button"> 
                    <Link 
                        style={{color:'inherit', textDecoration: 'inherit'}}
                        className="text" to="/login">
                        Login
                    </Link>
                </button> 
            </div>
        </div>
</div>
    )
}

export default Home