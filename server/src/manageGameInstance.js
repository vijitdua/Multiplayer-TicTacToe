import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";

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
export async function gameEvents(req,res,dbConnector){
    // Keep this connection alive
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    if(req.body.cmd === "create"){
        await createRoom(req, res, dbConnector);
    }
    if(req.body.cmd === "join"){
        await joinRoom(req,res,dbConnector);
    }
    if(req.body.cmd === "play"){
        //TODO: Add
    }
    else{
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

        if(!hostPlaysFirst || !hostChar) {
            throw new Error("data incomplete");
        }

        if(!hostToken){
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
    try {
        // Destructure data from request
        const playerToken = req.body.token;
        const hostUserName = req.body.hostUserName;

        // Check if player token is correct and get player username
        let playerUserName = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE token = ?;`, [playerToken]);
        console.log(playerUserName);
        if (!(playerUserName[0].length > 0)) {
            throw new Error("invalid token"); // User tried to sign in with invalid / fake token.
        }
        playerUserName = playerUserName[0][0].username;

        // Search if game exists
        let roomID = await dbConnector.execute(`SELECT roomID FROM ${process.env.MYSQL_GAME_TABLE} WHERE hostUserName = ?;`, [hostUserName]);
        if (!(roomID[0].length > 0)) {
            throw new Error("invalid room"); // User tried to join non-existent game.
        }
        roomID = roomID[0][0].roomID;

        // Insert data into DataBase
        await dbConnector.query(`INSERT INTO ${process.env.MYSQL_GAME_TABLE}(player2UserName)
                            VALUES ('${playerUserName}');`)

        // Get host data from server
        let hostFirstName = await dbConnector.execute(`SELECT firstName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?;`, [hostUserName]);
        let hostLastName = await dbConnector.execute(`SELECT lastName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?;`, [hostUserName]);
        hostLastName = hostLastName[0][0].lastName;
        hostFirstName = hostFirstName[0][0].firstName;

        // Joined game successfully
        console.log("A player has joined someone's game room!", {
            ...req.body,
            roomID: roomID,
            hostUserName: hostUserName
        });
        res.json({
            roomID: roomID,
            hostUserName: hostUserName,
            playerUserName: playerUserName,
            res: "success",
            hostFirstName: hostFirstName,
            hostLastName: hostLastName
        });
    }
        // Error catching, and send error data to client
    catch (error) {
        console.error(`A user tried to join a game and caused an error: ${error}`);
        res.json({...req.body, res: `${error}`});
    }
}