import {useState} from "react";
import Axios from "axios";

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
    //     const response = await Axios.get(`http://${process.env.SERVER_PORT}`);
    //     console.log(response);
    // }

    function sendUserData() {
        console.log(`Attempting to signup`);
        Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/signup`, user).then((res) => {
            console.log("Server response: ", res.data);
            if(res.data === `Error: data incomplete`){
                window.alert("Please fill all fields before you signup");
            }
            if(res.data === `Error: userid already in use`){
                window.alert("Please choose a different userID");
            }
        }).catch((error) => {
            console.log("An error occurred:", error);
        });
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