import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";
import {blankBoard, boardArrayToString, gameWinStatus, makeMove, stringBoardToArray} from "./game.js";
import {authenticateToken} from "./auth.js";
import {getPlayerData} from "./misc.js";

dotenv.config();


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
        res.json({roomID: roomID, hostUserName: hostUserName, res: "success", char: hostChar});

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

        // Find player's char
        let p2Char = await dbConnector.execute(`SELECT p2Char FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        p2Char = p2Char[0][0].p2Char;

        // Find whose turn the game begins with
        let newState = (doesHostPlayFirst) ? "p1-turn" : "p2-turn";

        let ticTacToeBoard = blankBoard();

        // Convert the 2D array to a string, using a delimiter
        let boardString = boardArrayToString(ticTacToeBoard);

        // Insert data into the database
        await dbConnector.execute(`UPDATE ${process.env.MYSQL_GAME_TABLE}
                                    SET player2UserName = ?, state = ?, game = ?
                                    WHERE roomID = ?`, [username, newState, boardString, gameRoomID]);

        // Get data about the host
        let hostUsername = await dbConnector.execute(`SELECT hostUserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        hostUsername = hostUsername[0][0].hostUserName;

        if (hostUsername === username) {
            throw new Error("same room"); //Joining own room
        }

        let hostData = await getPlayerData(hostUsername, dbConnector);

        let hostWins = hostData.totalWins;
        let hostLosses = hostData.totalLosses;
        let hostTies = hostData.totalTies;
        let hostFName = hostData.firstName;
        let hostLName = hostData.lastName;

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
            hostTies: hostTies,
            board: ticTacToeBoard,
            char: p2Char
        });
    }
        // Error catching, and send error data to client
    catch (error) {
        console.error(`A user tried to join a game and caused an error: ${error}`);
        res.json({...req.body, res: `${error}`});
    }
}

/**
 * TODO: Write the comments
 * @param req
 * @param res
 * @param dbConnector
 * @returns {Promise<void>}
 */
export async function getGameState(req, res, dbConnector) {
    const attemptedRoomID = req.params.gameID;
    try {

        // Check if game room ID is real
        let gameRoomID = await dbConnector.execute(`SELECT roomID from ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [attemptedRoomID]);
        if (attemptedRoomID !== gameRoomID[0][0].roomID) {
            throw new Error("room not found");
        }
        gameRoomID = gameRoomID[0][0].roomID;

        // Get host username
        let hUsername = await dbConnector.execute(`SELECT hostUserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [gameRoomID]);
        hUsername = hUsername[0][0].hostUserName;

        // Get guest username
        let gUsername = await dbConnector.execute(`SELECT player2UserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [gameRoomID]);
        gUsername = gUsername[0][0].player2UserName;

        // Get game state
        let gameState = await dbConnector.execute(`SELECT state FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [gameRoomID]);
        gameState = gameState[0][0].state;

        // Get current game board
        let game = await dbConnector.execute(`SELECT game FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [gameRoomID]);
        if (gameState !== `waiting-join`) {
            game = game[0][0].game;
            game = stringBoardToArray(game);
        } else {
            game = blankBoard();
        }

        // Respond back with the state of the game
        res.json({res: `success`, state: gameState, board: game, hUsername: hUsername, gUsername: gUsername});
    } catch (error) {
        console.error(`A user tried to get a game's status and caused an error: ${error}`);
        res.json({res: `${error}`});
    }

}

export async function play(req, res, dbConnector) {
    try {
        const token = req.body.token;
        const row = req.body.row;
        const col = req.body.col;
        const attemptedRoomID = req.body.roomID;
        // Check if token received
        if (!token) {
            throw new Error("token not received");
        }

        // Find username from token and check if token is correct
        let username = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE token = ?;`, [token]);
        if (!(username.length > 0)) {
            throw new Error("invalid token");
        }
        username = username[0][0].username;
        // Check if game room exists
        let gameRoomID = await dbConnector.execute(`SELECT roomID from ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [attemptedRoomID]);
        if (attemptedRoomID !== gameRoomID[0][0].roomID) {
            throw new Error("room not found");
        }
        gameRoomID = gameRoomID[0][0].roomID;

        // Check if data is complete
        if (row === undefined || col === undefined || attemptedRoomID === undefined) {
            throw new Error("data incomplete");
        }

        // Find game state
        let gameState = await dbConnector.execute(`SELECT state FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [gameRoomID]);
        gameState = gameState[0][0].state;

        // If the game hasn't started, you can't play
        if (gameState === `waiting-join`) {
            throw new Error(`waiting-join`);
        }

        // Find if player is host or guest
        let hostOrGuest;
        let hostUsername = await dbConnector.execute(`SELECT hostUserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        hostUsername = hostUsername[0][0].hostUserName;
        let guestUsername = await dbConnector.execute(`SELECT player2UserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        guestUsername = guestUsername[0][0].player2UserName;

        if (hostUsername === username) {
            hostOrGuest = 'host';
        }
        if (guestUsername === username) {
            hostOrGuest = 'guest';
        }

        // Check if it is the correct turn
        if ((hostOrGuest === `host` && gameState === `p1-turn`) || (hostOrGuest === `guest` && gameState === `p2-turn`)) {
            let char;

            // find player char
            if (hostOrGuest === `host`) {
                char = await dbConnector.execute(`SELECT p1Char FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
                char = char[0][0].p1Char;
            } else if (hostOrGuest === `guest`) {
                char = await dbConnector.execute(`SELECT p2Char FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
                char = char[0][0].p2Char;
            }
            // Get current game board
            let game = await dbConnector.execute(`SELECT game FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [gameRoomID]);
            game = game[0][0].game;
            game = stringBoardToArray(game);

            // Check if the board has space available to move on
            if (game[row][col] === null) {
                game = makeMove(char, row, col, game);
                let boardString = boardArrayToString(game);
                await dbConnector.execute(`UPDATE ${process.env.MYSQL_GAME_TABLE}
                                    SET game = ?
                                    WHERE roomID = ?`, [boardString, gameRoomID]);
                if (gameWinStatus(game) !== null) {
                    let winStatus = gameWinStatus(game);
                    if (winStatus === `T`) {
                        winStatus = `tie`;

                        await dbConnector.execute(`UPDATE ${process.env.MYSQL_USER_TABLE}
                                   SET totalTies = totalTies + 1
                                   WHERE username = ?`, [hostUsername]);

                        await dbConnector.execute(`UPDATE ${process.env.MYSQL_USER_TABLE}
                                   SET totalTies = totalTies + 1
                                   WHERE username = ?`, [guestUsername]);
                    }
                    let p1Char = await dbConnector.execute(`SELECT p1Char FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
                    p1Char = p1Char[0][0].p1Char;
                    if (winStatus === `X` || winStatus === `O`) {
                        winStatus = (winStatus === p1Char) ? `win-p1` : `win-p2`;
                        if(winStatus === `win-p1`){
                            await dbConnector.execute(`UPDATE ${process.env.MYSQL_USER_TABLE}
                                   SET totalWins = totalWins + 1
                                   WHERE username = ?`, [hostUsername]);
                            await dbConnector.execute(`UPDATE ${process.env.MYSQL_USER_TABLE}
                                   SET totalLosses = totalLosses + 1
                                   WHERE username = ?`, [guestUsername]);
                        }
                        if(winStatus === `win-p2`){
                            await dbConnector.execute(`UPDATE ${process.env.MYSQL_USER_TABLE}
                                   SET totalWins = totalWins + 1
                                   WHERE username = ?`, [guestUsername]);
                            await dbConnector.execute(`UPDATE ${process.env.MYSQL_USER_TABLE}
                                   SET totalLosses = totalLosses + 1
                                   WHERE username = ?`, [hostUsername]);
                        }
                    }
                    await dbConnector.execute(`UPDATE ${process.env.MYSQL_GAME_TABLE}
                                    SET state = ?
                                    WHERE roomID = ?`, [winStatus, gameRoomID]);
                } else {
                    await dbConnector.execute(`UPDATE ${process.env.MYSQL_GAME_TABLE}
                                    SET state = ?
                                    WHERE roomID = ?`, [(gameState === `p1-turn`) ? 'p2-turn' : 'p1-turn', gameRoomID]);
                }
            } else {
                throw new Error(`occupied`);
            }
            res.json({res: `success`});
        } else {
            throw new Error("not your turn");
        }

    } catch (error) {
        console.error(`A user tried to make a move and caused an error: ${error}`);
        res.json({res: `${error}`})
    }
}

export async function exitGame(req,res,dbConnector){
    console.log("Trying to exit a game");
    try{
        const token = req.body.token;
        const attemptedRoomID = req.body.roomID;

        // Check if token received
        if (!token) {
            throw new Error("token not received");
        }

        // Find username from token and check if token is correct
        let username = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE token = ?;`, [token]);
        if (!(username.length > 0)) {
            throw new Error("invalid token");
        }
        username = username[0][0].username;
        // Check if game room exists
        let gameRoomID = await dbConnector.execute(`SELECT roomID from ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?;`, [attemptedRoomID]);
        if (attemptedRoomID !== gameRoomID[0][0].roomID) {
            throw new Error("room not found");
        }
        gameRoomID = gameRoomID[0][0].roomID;

        // Find if player is host or guest
        let hostOrGuest = false;
        let temp = await dbConnector.execute(`SELECT hostUserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        if (temp[0][0].hostUserName === username) {
            hostOrGuest = 'host';
        }
        temp = await dbConnector.execute(`SELECT player2UserName FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        if (temp[0][0].player2UserName === username) {
            hostOrGuest = 'guest';
        }

        if(hostOrGuest !== false){
            await dbConnector.execute(`DELETE FROM ${process.env.MYSQL_GAME_TABLE} WHERE roomID = ?`, [gameRoomID]);
        }
        else{
            throw new Error("not your game");
        }


    }catch(error){
        console.error(`A user tried to exit a game and caused an error: ${error}`)
    }
}