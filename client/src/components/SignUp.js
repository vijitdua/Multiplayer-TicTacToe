import {useState} from "react";
import {signUp, login} from "../logic/auth";
import '../css/authentication.css';

function SignUp() {
    const [user, setUser] = useState(null);

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    async function signUpButton() {
        const signupSuccess = await signUp(user);
        if(signupSuccess){
            setUserData("remember", true);
            await login(user);
        }
    }

    return (
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
            </form>
        </div>
    );
}

export default SignUp;