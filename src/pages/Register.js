import React from 'react';
import Header from '../componets/Header';
import RegisterForm from './../componets/RegisterForm';
import  './../styles.css';

/* Register Class Component */
class Register extends React.Component
{
    render()
    {
        return(
            <div>
                <Header />
                <div className = "registerContainer">
                	<RegisterForm />
                </div>
            </div>
        )
    }
}

export default Register