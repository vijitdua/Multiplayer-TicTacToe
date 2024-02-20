import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise"; //TODO: fix all SQL injections

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initializes the database and returns the connector object
async function initializeDataBase() {

    //mySQL connector object
    let dbConnector = await mysql.createConnection({
        host: `${process.env.MYSQL_HOST}`,
        user: `${process.env.MYSQL_USERNAME}`,
        password: `${process.env.MYSQL_PASSWORD}`
    });

    // Connecting to database
    await dbConnector.connect();

    // Making database if it doesn't exist
    await dbConnector.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB};`);

    // Switch to correct database
    await dbConnector.query(`USE ${process.env.MYSQL_DB};`);

    //Creating table if it doesn't exist
    await dbConnector.query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_TABLE}(
                    userID varchar(255) NOT NULL, 
                    username varchar(255) NOT NULL,
                    firstName varchar(255) NOT NULL,
                    lastName varchar(255) NOT NULL,
                    hashedPassword varchar(255) NOT NULL,
                    PRIMARY KEY (username)
                    );`);

    return dbConnector;
}

// Initialize database
let dbConnector;
initializeDataBase().then((conn) => {
        dbConnector = conn;
    }).catch((error) => {
        console.error('Database initialization failed:', error);
        process.exit(1); // Exit the process with an error code
    });


/**
 * Sign Up user
 */
app.post("/signup", async (req, res) => {
    try {
        // Destructure data from request
        const {firstName, lastName, username, password} = req.body;

        // Check if any fields were blank
        if (!firstName || !lastName || !username || !password) {
            throw new Error("data incomplete");
        }

        // Check if username already exists
        let similarUserName = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_TABLE} WHERE username = '${username}';`);
        console.log(similarUserName);
        if(similarUserName[0].length>0){
            throw new Error("username taken");
        }

        // Store user data, create userID, hashPassword
        const userID = uuidv4();
        // const hashedPassword = await bcrypt.hash(password, 10); // TODO: understand this
        const hashedPassword = password;
        console.log(`hashed code:`, hashedPassword);
        const response = {userID, firstName, lastName, username};
        res.json({...response, msg: "SignUp successful"});
        delete req.body.password;
        req.body = {...req.body, userID: userID, hashedPassword: hashedPassword};

        await dbConnector.query(`INSERT INTO ${process.env.MYSQL_TABLE}(userID, username, firstName, lastName, hashedPassword)
                            VALUES ('${userID}', '${username}', '${firstName}', '${lastName}', '${hashedPassword}'
                            );`)

        console.log("A new user signed up!", req.body);
    }
        // Error catching
    catch (error) {
        console.error(`A user tried to signup and caused and caused an error: ${error}\nData Received: ${JSON.stringify(req.body)}\n`);
        res.send(`${error}`);
    }
});

/**
 * Activate the server
 */
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});