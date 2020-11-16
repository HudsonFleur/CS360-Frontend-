import React from 'react'
import Header from '../componets/Header'
import  './../styles.css'
import LoginForm from './../componets/LoginForm'

class Login extends React.Component
{
    render()
    {
        return(
            <div>
                <Header />
                <LoginForm />
            </div>
        )
    }
}

export default Login