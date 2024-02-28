import {useState} from "react";
import {login} from "../api/auth";
import ErrorMessage from "./ErrorMessage.jsx";
import {CssBaseline} from "@mui/material";

function Login() {
    const [user, setUser] = useState(null);
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows its a new error

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    async function loginButton() {
        let err = await login(user);
        if(err !== true){
            setErr(err);
            setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
        }
    }


    return (
            <div className="authDiv">
                <form className="authForm">
                    <h1>Log In</h1>
                    <label> Username </label> <br/>
                    <input type="text" placeholder="Enter username"
                           onChange={(event) => setUserData("username", event.target.value)}/> <br/>
                    <label> Password </label> <br/>
                    <input type="password" placeholder="Enter password"
                           onChange={(event) => setUserData("password", event.target.value)}/> <br/>
                    <div className="checkBox">
                        <input type="checkbox"
                               onChange={(e) => e.target.checked ? setUserData("remember", true) : setUserData("remember", false)}/>
                        <label> Remember Me</label><br/>
                    </div>
                    <button type="button" onClick={loginButton}>Log In</button>
                    {error && <ErrorMessage message={error} errID={errID}/>}
                </form>
            </div>
    );
}

export default Login;