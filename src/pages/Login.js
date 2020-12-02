import React from 'react';
import Header from '../componets/Header';
import  './../styles.css';
import LoginForm from './../componets/LoginForm';

/* Login Class Component */
class Login extends React.Component
{
    render()
    {
        return(
            <div>
                <Header />
                <div className = "loginContainer">
                	<LoginForm />
                </div>
            </div>
        )
    }
}

export default Login