import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {StreamChat} from "stream-chat"; // Chat server for players
import {v4 as uuidv4} from "uuid"; // Generate user ID's
import bcrypt from "bcrypt"; // Hash passwords

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to stream-chat server
const streamAPIKey = process.env.STREAM_API_KEY;
const streamAPISecret = process.env.STREAM_API_SECRET;
const streamServerClient = StreamChat.getInstance(streamAPIKey, streamAPISecret);


// Handle signup
app.post("/signup", async (req, res) => {
    console.log("signup a")
    try {
        const {firstName, lastName, username, password} = req.body;
        const userID = uuidv4();
        const hashedPassword = bcrypt.hash(password, 10);
        const token = streamServerClient.createToken(userID);
        let response = {token, userID, firstName, lastName, username, hashedPassword};
        console.log("r", response);
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});

app.post("/login");

app.listen(3005, () => {
    console.log("Server is running on port");
    console.log(streamAPIKey);
}); //TODO: change to env port
