import {useState} from "react";
import {signUp, login} from "../logic/auth";

function SignUp() {
    const [user, setUser] = useState(null);

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    function signUpButton() {
        if (signUp(user)) {
            login(user);
        }
    }

    return (
        <div className="SignUp">
            <form>
                <input type="text" placeholder="First Name"
                       onChange={(event) => setUserData("firstName", event.target.value)}/>
                <input type="text" placeholder="Last Name"
                       onChange={(event) => setUserData("lastName", event.target.value)}/>
                <input type="text" placeholder="username"
                       onChange={(event) => setUserData("username", event.target.value)}/>
                <input type="password" placeholder="password"
                       onChange={(event) => setUserData("password", event.target.value)}/>
                <button type="button" onClick={signUpButton}>Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;