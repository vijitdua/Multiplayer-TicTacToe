import {useState} from "react";
import {login} from "../api/auth";
import ErrorMessage from "./ErrorMessage.jsx";
import '../css/authentication.css';

function Login() {
    const [user, setUser] = useState(null);
    const [error, setErr] = useState(null);

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    async function loginButton() {
        let err = await login(user);
        if(err !== true){
            setErr(err);
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
                    <input type="checkbox" onChange={(e) => e.target.checked ? setUserData("remember", true) : setUserData("remember", false)}/> <label> Remember Me</label><br/>
                </div>
                <button type="button" onClick={loginButton}>Log In</button>
                {error && <ErrorMessage message={error} />}
            </form>
        </div>
    );
}

export default Login;