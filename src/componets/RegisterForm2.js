import React, {useState} from 'react'
import Axios from 'axios'
import { useHistory } from 'react-router-dom';

function RegisterForm()
{
    const history = useHistory();

    const [person, setPerson] = useState({
      name: "",
      email: "",
      password: "",
    })

    const setName = (name) => {
        setPerson( {...person, name: name });
    }
    const setEmail = (email) => {
      setPerson( {...person, email: email });
    }
    const setPassword = (password) => {
      setPerson( {...person, password: password });
    } 
    const handleSubmit = () => {
      history.push({
        pathname:'/about-us',
        data: {
          name: "Test 1 2 3"
        }
      } );
        Axios({
          method: 'POST',
          url:'http://192.168.50.103:5000/users', 
          data: person
        }).then(function (response) {
          if(response.status === 200)
          {
            console.log(response);
          }
          })
          .catch(function (error) {
            console.log(error);
          });

    }
        return(
            <div>
                <form onSubmit={handleSubmit}>
                    <label> Name: 
                        <input type="text" onChange={setName} />
                    </label>
                    <label> Email: 
                        <input type="text" onChange={setEmail} />
                    </label>
                    <label> Password: 
                        <input type="password" onChange={setPassword} />
                    </label>
                    <label> Confirm Password: 
                        <input type="password"/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>
      </div>
            </div>
        )
        }

export default RegisterForm