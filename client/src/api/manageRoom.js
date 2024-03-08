import Axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();

export async function createRoom(roomData){
    console.log("Attempting to create a room");
    const token = cookie.get("token");
    roomData = {...roomData, token: token};
    try{
        let res = await Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/createGame`, roomData);
        console.log(`Server response: `, res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return "Please fill all fields before you create a game";
        }
        if (res.data.res === `Error: invalid token`) {
            return "There was an error with your login data, try signing out and logging in again";
        }
        if(res.data.res === `Error: token not received`){
            return "Unable to process login data, please make sure you are logged in first";
        }
        if(res.data.res === `success`){
            cookie.set("roomID", res.data.roomID);
            // TODO: set other cookies if needed
            return true;
        }

    }
    catch(error){
        console.log("An error occurred:", error);
        return ("An unknown error occurred");
    }
    return "unknown error";

}

export function joinRoom(){
    console.log(`Attempting to join a game`);
    const userToken = cookie.get("token");
    Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/gameEvents`, {cmd:"create", token: userToken}).then((res)=>{
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
