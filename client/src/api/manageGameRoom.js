import Axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();

// Convert 2D board array to string
export function boardArrayToString(board2DArray){
    return board2DArray
        .map(row => row.map(item => item === null ? "null" : item).join(','))
        .join(';');
}

// Convert string of board to 2d array
export function stringBoardToArray(boardString){
    return boardString.split(';').map(row =>
        row.split(',').map(item => item === "null" ? null : item)
    );
}

export async function createRoom(roomData) {
    console.log("Attempting to create a room");
    const token = cookie.get("token");
    roomData = {...roomData, token: token};
    try {
        let res = await Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/createGame`, roomData);
        console.log(`Server response: `, res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return "Please fill all fields before you create a game";
        }
        if (res.data.res === `Error: invalid token`) {
            return "There was an error with your login data, try signing out and logging in again";
        }
        if (res.data.res === `Error: token not received`) {
            return "Unable to process login data, please make sure you are logged in first";
        }
        if (res.data.res === `success`) {
            cookie.set("roomType", "hosted");
            cookie.set("roomID", res.data.roomID);
            //TODO: Check if more things are needed
            return true;
        }

    } catch (error) {
        console.log("An error occurred:", error);
        return ("An unknown error occurred");
    }
    return "unknown error";

}

export async function joinRoom(roomID) {
    console.log(`Attempting to join a game`);
    const token = cookie.get("token");

    try {
        let res = await Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/join`, {
            token: token,
            roomID: roomID
        });
        console.log(`Server response: `, res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return "Please fill all fields before you create a game";
        }
        if (res.data.res === `Error: invalid token`) {
            return "There was an error with your login data, try signing out and logging in again"
        }
        if (res.data.res === `Error: token not received`) {
            return "Unable to process login data, please make sure you are logged in first";
        }
        if (res.data.res === `Error: room not found`) {
            return "The game you are trying to join doesn't exist, please ensure you are typing the correct game ID";
        }
        if (res.data.res === `Error: same room`) {
            return "You can't join a game you hosted";
        }
        if (res.data.res === `success`) {
            cookie.set("roomType", "joined");
            cookie.set("roomID", res.data.roomID);
            cookie.set("hostUserName", res.data.hostUserName);
            cookie.set("hostFirstName", res.data.hostFirstName);
            cookie.set("hostLastName", res.data.hostLastName);
            cookie.set("hostWins", res.data.hostWins);
            cookie.set("hostLosses", res.data.hostLosses);
            cookie.set("hostTies", res.data.hostTies);
            cookie.set("game", boardArrayToString(res.data.board));
            //TODO: Check if more things are needed
            return true;
        }

    } catch (error) {
        console.log("An error occurred:", error);
        return ("An unknown error occurred");
    }
    return "unknown error";

}
