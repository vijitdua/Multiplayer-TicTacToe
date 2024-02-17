import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Sign Up user
 */
app.post("/signup", async (req, res) => {
    try {
        console.log("A new user signed up!", req.body);
        const {firstName, lastName, username, password} = req.body;
        if (!firstName || !lastName || !username || !password) {
            throw new Error("data incomplete");
        }
        const userID = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10); // TODO: understand this
        const response = {userID, firstName, lastName, username};
        res.send(`Signup Data successful: ${response}`);
    } catch (error) {
        console.error(`\n---\nA user tried to signup and caused and caused an error: ${error}\nData Received: ${JSON.stringify(req.body)}\n---\n`);
        res.send(`${error}`);
    }
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});