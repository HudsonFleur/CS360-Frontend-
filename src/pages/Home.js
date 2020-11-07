import React, {State} from 'react'
import {Link} from 'react-router-dom'
import Header from '../componets/Header'
import Axios from 'axios'

class Home extends React.Component
{
    render()
    {
        return(
            <div>
                <Header />

                <div className="homeContainer">
                <div className="homeBox">
                    <h4 className="text"> What is this App? </h4>
                        <button className="button" type="button"> 
                            <Link 
                            style={{color:'inherit', textDecoration: 'inherit'}}
                            className="text" to="register">
                            Register Now !
                            </Link>
                        </button>   
                </div>

                <div className="homeImage"> Placeholder </div> 
            </div>
            </div>
        )
    }
}

export default Home