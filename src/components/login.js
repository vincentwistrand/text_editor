import '../css/App.css';

import React, { useState } from 'react';
import authModel from "../models/auth";

function Login({setToken, setUser}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checked, setChecked] = useState(false);

    // Show comments.
    const [inputError, setInputError] = useState("");
    const [working, setWorking] = useState("");

    // If login forms or register forms is shown
    const [loginFields, setLoginFields] = useState(true);



    // Set email.
    const handleEmailChange = event => {
        setEmail(event.target.value);
    };

    // Set password.
    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };


    // Checkbox
    const handleCheck = () => {
        setChecked(!checked);
        console.log(checked);
    };


    // Login
    async function login() {
        setInputError("");
        setWorking("Arbetar...");
        const result = await authModel.login(email, password)

        if (result.data) {
            if (result.data.token) {
                const user = await authModel.getUser(result.data._id);
                setToken(result.data.token);
                setUser(user);
            }
        }

        if (result.errors) {
            setWorking("");
            setInputError(result.errors.message);
        }
    }


    // Register
    async function register() {
        setInputError("");
        setWorking("Arbetar...");

        let admin = false;
        if (checked === true) {
            admin = true;
        }

        const result = await authModel.register(email, password, admin)

        if (result.data) {
            setWorking("Registrerad! Loggar in...");
            login();
        }

        if (result.errors) {
            setWorking("");
            setInputError(result.errors.message);
        }
    }


    return (
        <>
            <div className="login-container">
                <div className='loginfields'>
                    {loginFields ? <h1>Logga in</h1>:<h1>Registrera dig</h1>}
                    {working ?
                    <p className='logging_in'>{working}</p>
                    :
                    <p style={{height: '13px', margin: '0'}}></p>
                    }
                    {inputError ?
                    <p className='input_error'>{inputError}</p>
                    :
                    <p style={{height: '13px', margin: '0'}}></p>
                    }
                    <input type="text" placeholder="EMAIL" value={email} onChange={handleEmailChange} required></input><br></br>
                    <input type="password" placeholder="PASSWORD" value={password} onChange={handlePasswordChange} required></input>

                    {loginFields ? 
                    null
                    :
                    <div style={{display: 'flex'}}>
                        <input style={{width: '15px'}} type="checkbox" checked={checked} onChange={handleCheck} />
                        <p style={{fontSize: '13px'}}>Admin</p>
                    </div>
                    }
                
                </div>


                <div className='login_buttons'>
                    {loginFields ?
                    <>
                        <button onClick={() => {
                            setLoginFields(null);
                            setEmail("");
                            setPassword("");
                            setInputError("");
                        }}>Ny användare</button>   
                        <button type="submit" onClick={login}>Logga in</button> 
                    </>
                    :
                    <>
                        <button onClick={() => {
                            setLoginFields(true);
                            setEmail("");
                            setPassword("");
                        }}>Tillbaka</button>   
                        <button type="submit" onClick={register} >Registrera</button>  
                    </>
                    }  
                </div> 
            </div>
        </>
    );
}

export default Login;