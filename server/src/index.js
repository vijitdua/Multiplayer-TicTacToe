import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise"; //TODO: fix all SQL injections
import {initializeDataBase} from "./initializeDataBase.js";
import {signUp, login, authenticateToken} from "./auth.js";
import {createRoom, exitGame, getGameState, joinRoom, play} from "./manageGameInstance.js";
import {getDataForClient} from "./misc.js";
import {makeMove} from "./game.js";

dotenv.config();

// Express config
const app = express();
app.use(cors());
app.use(express.json());

// Initialize database, exit if failed
let dbConnector;
initializeDataBase().then((conn) => {
    dbConnector = conn;
}).catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
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
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});