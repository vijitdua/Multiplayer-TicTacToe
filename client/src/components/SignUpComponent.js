import {useState} from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUpComponent() {
    const [user, setUser] = useState(null);
    const cookie = new Cookies();

    /**
     * setUserData: Changes data of User Object
     * @param dataType Key of the data of modify
     * @param data Value to link to key
     */
    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    /**
     * Attempts to loginComponent using given data
     */
    function login() {
        Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/login`, user).then((res)=>{
            cookie.set("username", res.data.username);
            cookie.set("userID", res.data.username);
            cookie.set("firstName", res.data.firstName);
            cookie.set("lastName", res.data.lastName);
            cookie.set("hashedPassword", res.data.hashedPassword);
        });
    }

    /**
     * Attempts to send user data to server, returns true if successful
     */
    function sendUserData() {
        console.log(`Attempting to signup`);
        Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/signup`, user).then((res) => {
            console.log("Data recieved by server & response: ", res.data);
            if (res.data.res === `Error: data incomplete`) {
                window.alert("Please fill all fields before you signup");
                return false;
            }
            if (res.data.res === `Error: username taken`) {
                window.alert("Please choose a different username");
                return false;
            }
            return true;
        }).catch((error) => {
            console.log("An error occurred:", error);
            return false;
        });
        return false;
    }

    /**
     * Sends user data to server, if successful logs in using same data.
     */
    function signUpButton() {
        if (sendUserData()) {
            login();
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
                <button type="button" onClick={signUpButton}>Sign Up!</button>
            </form>
        </div>
    );
}

export default SignUpComponent;