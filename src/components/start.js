import '../css/App.css';

import React, { useState } from 'react';

import Header from "./header";
import Docs from "./docs";
import Login from "./login";

function Start() {
    const [user, setUser] = useState("");

    // If token you are logged in
    const [token, setToken] = useState("");

    return (
        <>
            <Header />

            {token ? 
            <Docs user={user} token={token}/>
            :
            <Login setToken={setToken} setUser={setUser} />
            }

        </>
    );
}

export default Start;