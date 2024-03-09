import Axios from "axios";
import Cookies from "universal-cookie";
import {boardArrayToString} from "./manageGameRoom";

const cookie = new Cookies();

// Return true if there are changes to the game, else false
export async function refreshGame() {
    try {
        const roomID = cookie.get("roomID");
        const res = await Axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/get-state/${roomID}`);
        let statusUpdate = false;
        if ((res.data.res) === "success") {
            let oldState = cookie.get("state");
            if (oldState !== res.data.state) {
                statusUpdate = true;
                if (oldState === "waiting-join" && cookie.get("roomType") === "hosted") {
                    // retrieve opponent player data
                    let oppData = await getPlayerData(res.data.gUsername);

                    // Set cookies for opponent data
                    cookie.set("oppUserName", oppData.username);
                    cookie.set("oppFirstName", oppData.firstName);
                    cookie.set("oppLastName", oppData.lastName);
                    cookie.set("oppWins", oppData.totalWins);
                    cookie.set("oppLosses", oppData.totalLosses);
                    cookie.set("oppTies", oppData.totalTies);

                }

                // Update board if the state changes
                cookie.set("game", boardArrayToString(res.data.board));

            }
            cookie.set("state", res.data.state);
        }

        if (res.data.res === `Error: room not found`) {
            //TODO: Handle wrong room error
        }
        return statusUpdate;
    } catch (error) {
        console.log("An error occurred:", error);
        return "Error";
    }
}

// Gets player data
async function getPlayerData(username) {
    console.log(`attempting to get player data for player: ${username}`);
    try {
        const res = await Axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/get-data/${username}`);
        console.log(`Server response: `, res.data.res);
        if (res.data.res === `success`) {
            return {
                username: res.data.username,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                totalWins: res.data.totalWins,
                totalLosses: res.data.totalLosses,
                totalTies: res.data.totalTies
            };
        }
        if (res.data.res === `invalid username`) {
            return "Invalid Username";
        }
    } catch (error) {
        console.log("An error occurred:", error);
        return "An unknown error occurred";
    }
    return "unknown error";
}

// Make a move
export async function makeMove(row, col, roomID) {
    console.log(`Attempting to make a move at row ${row}, col ${col}, in room id: ${roomID}`)
    const token = cookie.get("token");
    try{
        const res = await Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/play`, {token: token, row: row, col: col, roomID: roomID});
        if(res.data.res === `success`){
            return true;
        }
        if(res.data.res === `Error: data incomplete`){
            return "Error processing game data";
        }
        if(res.data.res === `Error: room not found`){
            return "The room you were in doesn't exist anymore, please leave the room";
        }
        if(res.data.res === `Error: invalid token`){
            return "There seems to be an error with your login data, please log out and log in again";
        }
        if(res.data.res === `Error: token not recieved`){
            return "There seems to be an error with your login data, please log out and log in again";
        }
        if(res.data.res=== `Error: occupied`){
            return "This block is occupied";
        }
        if(res.data.res === `Error: not your turn`){
            return "It is not your turn";
        }
    }catch(error){
        console.log("An error occurred:", error);
        return "An unknown error occurred";
    }
    return "unknown error";
}

export function updateOwnScores(){
    try{
        const data = getPlayerData(cookie.get("username"));
        cookie.set("losses", data.totalLosses);
        cookie.set("wins", data.totalWins);
        cookie.set("ties", data.totalTies);
    } catch(error){
        console.log("Error occurred updating own scores: ", error);
    }
}
