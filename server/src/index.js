import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {initializeDataBase, initializeDataBaseWithRetry} from "./initializeDataBase.js";
import {signUp, login, authenticateToken} from "./auth.js";
import {createRoom, exitGame, getGameState, joinRoom, play} from "./manageGameInstance.js";
import {getDataForClient} from "./misc.js";

dotenv.config();

// Express config
const app = express();
// const corsOptions = {
//     origin: process.env.CORS_ORIGIN,
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));
app.use(cors()); //Work with any origin for now
app.use(express.json());

// Initialize database, exit if failed
let dbConnector;
initializeDataBaseWithRetry(5).then(conn => {
    dbConnector = conn;
});

// Posts
app.post("/signup", async (req, res) => signUp(req, res, dbConnector));
app.post("/login", async (req, res) => login(req, res, dbConnector));
app.post("/createGame", async (req, res) => createRoom(req, res, dbConnector));
app.post("/authenticate", async (req, res) => authenticateToken(req, res, dbConnector));
app.post("/join", async (req, res) => joinRoom(req, res, dbConnector));
app.get('/get-state/:gameID', async (req, res) => getGameState(req, res, dbConnector));
app.get('/get-data/:player', async (req, res) => getDataForClient(req, res, dbConnector));
app.post(`/play`, async (req, res) => play(req, res, dbConnector));
app.post(`/exit`, async (req, res) => exitGame(req, res, dbConnector));

// Activate the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});