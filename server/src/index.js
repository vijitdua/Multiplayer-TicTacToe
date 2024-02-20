import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise"; //TODO: fix all SQL injections
import {initializeDataBase} from "./initializeDataBase.js";
import {signUp, login} from "./auth.js";

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


// SignUp user
app.post("/signup", async (req, res) => signUp(req, res, dbConnector));

//Login user
app.post("/login", async (req, res) => login(req, res, dbConnector));


// Activate the server
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});