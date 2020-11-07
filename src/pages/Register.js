import React from 'react'
import Header from '../componets/Header'
import RegisterForm from './../componets/RegisterForm'
import  './../styles.css'

class Register extends React.Component
{
    render()
    {
        return(
            <div>
                <Header />
                    <div className="text"> Register</div>
                    <RegisterForm />

            </div>
        )
    }
}

export default Register