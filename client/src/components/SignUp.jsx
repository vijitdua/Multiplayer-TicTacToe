import {useState} from "react";
import {signUp, login} from "../api/auth";
import '../css/authentication.css';
import ErrorMessage from "./ErrorMessage";
import {CssBaseline} from "@mui/material";

function SignUp() {
    const [user, setUser] = useState(null);
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows its a new error

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    async function signUpButton() {
        const signUpSuccessOrErr = await signUp(user);
        if (signUpSuccessOrErr === true) {
            setUserData("remember", true);
            await login(user);
        } else {
            setErr(signUpSuccessOrErr);
            setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
        }
    }

    return (
        <CssBaseline>
            <div className="authDiv">
                <form className="authForm">
                    <h1>Sign Up</h1>
                    <label> First Name </label> <br/>
                    <input type="text" placeholder="Enter First Name"
                           onChange={(event) => setUserData("firstName", event.target.value)}/> <br/>
                    <label> Last Name </label> <br/>
                    <input type="text" placeholder="Enter Last Name"
                           onChange={(event) => setUserData("lastName", event.target.value)}/> <br/>
                    <label> Username </label> <br/>
                    <input type="text" placeholder="Enter username"
                           onChange={(event) => setUserData("username", event.target.value)}/> <br/>
                    <label> Password </label> <br/>
                    <input type="password" placeholder="Enter password"
                           onChange={(event) => setUserData("password", event.target.value)}/> <br/>
                    <button type="button" onClick={signUpButton}>Sign Up</button>
                    {error && <ErrorMessage message={error} errID={errID}/>}
                </form>
            </div>
        </CssBaseline>
    );
}

export default SignUp;