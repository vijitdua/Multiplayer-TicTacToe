import Axios from "axios";
import Cookies from "universal-cookie";
import {boardArrayToString} from "./manageGameRoom";

const cookie = new Cookies();

export async function refreshGame() {
    console.log(`Getting game status update`);
    try {
        const roomID = cookie.get("roomID");
        const res = await Axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/get-state/${roomID}`);
        console.log(`Server response: `, res.data.res);

        if((res.data.res) === "success"){
            let oldState = cookie.get("state");

            if(oldState !== res.data.state){
                if(oldState === "waiting-join" && cookie.get("roomType") === "hosted"){
                    // retrieve opponent player data
                    let oppData = await getPlayerData(res.data.gUsername);

                    // Set cookies for opponent data
                    cookie.set("oppUserName", oppData.username);
                    cookie.set("oppFirstName", oppData.firstName);
                    cookie.set("oppLastName", oppData.lastName);
                    cookie.set("oppWins", oppData.totalWins);
                    cookie.set("oppLosses", oppData.totalLosses);
                    cookie.set("oppTies", oppData.totalTies);

                    return 'game-start';
                }

                // Update board if the state changes
                cookie.set("game", boardArrayToString(res.data.board));

                // Check if state is a win, and do appropriate thing
                if(res.data.state === `win-p1` || res.data.state === `win-p2` || res.data.state === `tie`){
                    //TODO: What to do if win?
                }

            }
            cookie.set("state", res.data.state);
        }

        if(res.data.res === `Error: room not found`){
            //TODO: Handle wrong room error
        }
    }
    catch (error) {
        console.log("An error occurred:", error);
        return ("An unknown error occurred");
    }
    return "unknown error";
}

// Gets player data
async function getPlayerData(username){
    console.log(`attempting to get player data for player: ${username}`);
    try{
        const res = await Axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/get-data/${username}`);
        console.log(`Server response: `, res.data.res);
        if(res.data.res === `success`){
            return{
                username: res.data.username,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                totalWins: res.data.totalWins,
                totalLosses: res.data.totalLosses,
                totalTies: res.data.totalTies
            };
        }
        if(res.data.res === `invalid username`){
            return "Invalid Username";
        }
    }
    catch(error){
        console.log("An error occurred:", error);
        return "An unknown error occurred";
    }
    return "unknown error";
}

// Make a move
export async function makeMove(){

}
