import React, {useState} from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp() {
    const [user, setUser] = useState(null);
    const cookies = new Cookies();

    const signUp = () => {
        Axios.post("http://localhost:3005/signup", user).then(res => { // Send data to server //TODO: change to env port
            const {token, userID, firstName, lastName, username, hashedPassword} = res.data; // Destructure data returned from server into frontend

            // Store cookies of user login data
            cookies.set("token", token);
            cookies.set("userID", userID);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            cookies.set("username", username);
            cookies.set("hashedPassword", hashedPassword);
        });
    }

    return (<div className="signUp">
            <label> Sign Up </label>
            <input placeholder="First Name" onChange={(event) => setUser({...user, firstName: event.target.value})}/>
            <input placeholder="Last Name" onChange={(event) => setUser({...user, lastName: event.target.value})}/>
            <input placeholder="Username" onChange={(event) => setUser({...user, username: event.target.value})}/>
            <input type="password" placeholder="Password"
                   onChange={(event) => setUser({...user, password: event.target.value})}/>
            <button onClick={signUp}> Sign Up</button>
        </div>
    );
}

export default SignUp;