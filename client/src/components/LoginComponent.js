import {useState} from "react";
import {login} from "../logic/auth";

function LoginComponent(){
    const [user, setUser] = useState(null);

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    function loginButton(){
        login(user);
    }

    return (
        <div className="Login">
            <form>
                <input type="text" placeholder="username"
                       onChange={(event) => setUserData("username", event.target.value)}/>
                <input type="password" placeholder="password"
                       onChange={(event) => setUserData("password", event.target.value)}/>
                <button type="button" onClick={loginButton}>Log In</button>
            </form>
        </div>
    );
}

export default LoginComponent;