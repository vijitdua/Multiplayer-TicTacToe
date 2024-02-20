import Axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();

export function createRoom(){

}

export function joinRoom(){
    console.log(`Attempting to join a game`);
    const userToken = cookie.get("token");
    Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/join-room`, {token: userToken}).then((res)=>{
        console.log("Data received by server & response: ", res.data);
        if (res.data.res === `Error: invalid token`) {
            window.alert("Login data is incorrect, please sign-out and login again");
            return false;
        }
        if (res.data.res === `Error: invalid room`) {
            window.alert("The room you are trying to join doesn't exist");
            return false;
        }

        // Setting cookies about the room we are in (these expire with browser session)
        cookie.set("gameRoomID", res.data.roomID);
        cookie.set("hostUserName", res.data.username);
        cookie.set("hostFirstName", res.data.hostFirstName);
        cookie.set("hostLastName", res.data.hostLastName);
        console.log("Game joined successfully");
        return true;
    }).catch((error) => {
        console.log("An error occurred:", error);
        return false;
    });
    return false;
}