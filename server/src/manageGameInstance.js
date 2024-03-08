import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";
import {authenticateToken} from "./auth.js";

dotenv.config();
//TODO: fix all SQL injections

//TODO: Change code to add cleanup, and destroying rooms without server restart

/**
 * Manages communicating game data and events
 * @param req Client Request
 * @param res Client Response
 * @param dbConnector dataBase where data is being accessed / modified
 * @returns {Promise<void>}
 */
export async function gameEvents(req, res, dbConnector) {
    // Keep this connection alive
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    if (req.body.cmd === "create") {
        await createRoom(req, res, dbConnector);
    }
    if (req.body.cmd === "join") {
        await joinRoom(req, res, dbConnector);
    }
    if (req.body.cmd === "play") {
        //TODO: Add
    } else {
        // No update yet, check again after a delay
        setTimeout(gameEvents, 1000); // Adjust delay as needed
    }

    // const checkUpdates = ;

    res.json({});


}

/**
 * Creates a game room
 * @param req Client Request (json req must have .token, .hostPlaysFirst(true or false), .hostChar('X' or 'O')).
 * @param res Client Response
 * @param dbConnector dataBase where data is being accessed / modified
 * @response JSON file with: roomID, hostUserName, server response message (success, or error message)
 */
export async function createRoom(req, res, dbConnector) {
    console.log("Create room called");
    try {
        // Destructure data from request
        const hostToken = req.body.token;
        const roomID = uuidv4();
        const hostPlaysFirst = (req.body.hostPlaysFirst) ? 1 : 0;
        const hostChar = req.body.hostChar;
        const p2Char = (hostChar === 'X') ? 'O' : 'X';
        const gameState = "waiting-join";

        if (!hostPlaysFirst || !hostChar) {
            throw new Error("data incomplete");
        }

        if (!hostToken) {
            throw new Error("token not received");
        }

        // Check if host token is correct and get host username
        let hostUserName = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE token = ?;`, [hostToken]);
        if (!(hostUserName[0].length > 0)) {
            throw new Error("invalid token"); // User tried to sign in with invalid / fake token.
        }
        hostUserName = hostUserName[0][0].username;
        await dbConnector.execute(`DELETE FROM ${process.env.MYSQL_GAME_TABLE} WHERE hostUserName = ?;`, [hostUserName]); // Delete existing game rooms for that username

        // Insert data into DataBase
        await dbConnector.query(`INSERT INTO ${process.env.MYSQL_GAME_TABLE}(roomID, hostUserName, state, hostPlaysFirst, p1Char, p2Char)
                            VALUES (?, ?, ?, ?, ?, ?);`, [roomID, hostUserName, gameState, hostPlaysFirst, hostChar, p2Char]);

        console.log("A new game room was hosted!", {roomID: roomID, hostUserName: hostUserName});
        res.json({roomID: roomID, hostUserName: hostUserName, res: "success"});

    }
        // Error catching, and send error data to client
    catch (error) {
        console.error(`A user tried to create a new game and caused an error: ${error}`);
        res.json({...req.body, res: `${error}`});
    }
}


/**
 * Joins an existing game room
 * @param req Client Request
 * @param res Client Response
 * @param dbConnector dataBase where data is being accessed / modified
 * @response JSON file with: roomID, hostUserName, hostFirstName, hostLastName, server response message (success, or error message)
 */
export async function joinRoom(req, res, dbConnector) {
    // Check if p2username is null, & if state is waiting-join. Join using game id only
    try {
        const userToken = req.body.token;
        const attemptedJoinRoomID = req.body.roomID;

        if (!attemptedJoinRoomID) {
            throw new Error("data incomplete");
        }

        if (!userToken) {
            throw new Error("token not received");
        }

        // Find p2 username from token and check if token is correct
        let username = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE token = ?;`, [userToken]);
        if (!(username.length > 0)) {
            throw new Error("invalid token");
        }
        username = username[0][0].username;

        // Check if attempted join game room ID is real
        let gameRoomID = await dbConnector.execute(`SELECT roomID from ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [attemptedJoinRoomID]);
        if (!(gameRoomID.length > 0 && gameRoomID[0].length > 0 && attemptedJoinRoomID === gameRoomID[0][0].roomID)) {
            throw new Error("room not found");
        }
        gameRoomID = gameRoomID[0][0].roomID;

        // Find if host plays first or not
        let doesHostPlayFirst = await dbConnector.execute(`SELECT hostPlaysFirst FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        doesHostPlayFirst = doesHostPlayFirst[0][0].hostPlaysFirst;
        doesHostPlayFirst = (doesHostPlayFirst !== 0); // convert number to boolean

        // Find whose turn the game begins with
        let newState = (doesHostPlayFirst) ? "p1-turn" : "p2-turn";

        // Insert data into the database
        await dbConnector.execute(`UPDATE ${process.env.MYSQL_GAME_TABLE}
                                    SET player2UserName = ?, state = ?
                                    WHERE roomID = ?`, [username, newState, gameRoomID]);

        // Get data about the host
        let hostUsername = await dbConnector.execute(`SELECT hostUserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        hostUsername = hostUsername[0][0].hostUserName;
        console.log(hostUsername);
        let hostWins = await dbConnector.execute(`SELECT totalWins FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [hostUsername]);
        hostWins = hostWins[0][0].totalWins;
        let hostLosses = await dbConnector.execute(`SELECT totalLosses FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [hostUsername]);
        hostLosses = hostLosses[0][0].totalLosses;
        let hostTies = await dbConnector.execute(`SELECT totalTies FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [hostUsername]);
        hostTies = hostTies[0][0].totalTies;
        let hostFName = await dbConnector.execute(`SELECT firstName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [hostUsername]);
        hostFName = hostFName[0][0].firstName;
        let hostLName = await dbConnector.execute(`SELECT lastName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [hostUsername]);
        hostLName = hostLName[0][0].lastName;


        if (hostUsername === username) {
            throw new Error("same room"); //Joining own room
        }

        // Console logs
        console.log("A player has joined someone's game room!", {
            ...req.body,
            roomID: gameRoomID,
            hostUserName: hostUsername,
            playerUsername: username
        });

        // Send Data Back to the user
        res.json({
            res: "success",
            roomID: gameRoomID,
            hostUserName: hostUsername,
            hostFirstName: hostFName,
            hostLastName: hostLName,
            hostWins: hostWins,
            hostLosses: hostLosses,
            hostTies: hostTies
        });
    }
        // Error catching, and send error data to client
    catch (error) {
        console.error(`A user tried to join a game and caused an error: ${error}`);
        res.json({...req.body, res: `${error}`});
    }


}
