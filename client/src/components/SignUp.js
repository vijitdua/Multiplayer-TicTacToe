import {useState} from "react";
import "./SignUp.css";


// import axios from "axios";

function SignUp() {
    const [user, setUser] = useState(null);

    /**
     * setUserData: Changes data of User Object
     * @param dataType Key of the data of modify
     * @param data Value to link to key
     */
    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    // async function getUserData(){
    //     const response = await axios.get(`http://${process.env["SERVER_PORT "]}`)
    // }

    function sendUserData() {
        console.log(`http://localhost:3005`);
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
                <button type="button" onClick={sendUserData}>Sign Up!</button>
            </form>
        </div>
    );
}

export default SignUp;