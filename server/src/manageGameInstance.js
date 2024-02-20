import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";

dotenv.config();
//TODO: fix all SQL injections

//TODO: Change code to add cleanup, and destroying rooms without server restart

/**
 * Creates a game room
 * @param req Client Request
 * @param res Client Response
 * @param dbConnector dataBase where data is being accessed / modified
 * @response JSON file with: roomID, hostUserName, server response message (success, or error message)
 */
export async function createRoom(req, res, dbConnector) {
    try {
        // Destructure data from request
        const hostToken = req.body.token;
        const roomID = uuidv4();

        // Check if host token is correct and get host username
        let hostUserName = await dbConnector.execute(`SELECT token FROM ${process.env.MYSQL_USER_TABLE} WHERE token = '${hostToken}';`);
        if (!(hostUserName[0].length > 0)) {
            throw new Error("invalid token"); // User tried to sign in with invalid / fake token.
        }
        hostUserName = hostUserName[0][0].username;

        // Insert data into DataBase
        await dbConnector.query(`INSERT INTO ${process.env.MYSQL_GAME_TABLE}(roomID, hostUserName)
                            VALUES ('${roomID}', '${hostUserName}');`)

        console.log("A new game room was hosted!", req.body);
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
        let playerUserName = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE token = '${playerToken}';`);
        console.log(playerUserName);
        if (!(playerUserName[0].length > 0)) {
            throw new Error("invalid token"); // User tried to sign in with invalid / fake token.
        }
        playerUserName = playerUserName[0][0].username;

        // Search if game exists
        let roomID = await dbConnector.execute(`SELECT roomID FROM ${process.env.MYSQL_GAME_TABLE} WHERE hostUserName = '${hostUserName}';`);
        if (!(roomID[0].length > 0)) {
            throw new Error("invalid room"); // User tried to join non-existent game.
        }
        roomID = roomID[0][0].roomID;

        // Insert data into DataBase
        await dbConnector.query(`INSERT INTO ${process.env.MYSQL_GAME_TABLE}(player2UserName)
                            VALUES ('${playerUserName}');`)

        // Get host data from server
        let hostFirstName = await dbConnector.execute(`SELECT firstName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${hostUserName}';`);
        let hostLastName = await dbConnector.execute(`SELECT lastName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${hostUserName}';`);
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