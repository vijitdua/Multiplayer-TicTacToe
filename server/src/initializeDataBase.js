import dotenv from "dotenv";
import mysql from "mysql2/promise"; //TODO: fix all SQL injections
dotenv.config();

/**
 * Initializes the database and returns the connector object
 * @returns {Promise<Connection>} dataBase connection Object
 */
export async function initializeDataBase() {

    console.log("Connecting to database and initializing if needed");

    // Connect to the database
    let dbConnector = await mysql.createConnection({
        host: `${process.env.MYSQL_HOST}`,
        user: `${process.env.MYSQL_USERNAME}`,
        password: `${process.env.MYSQL_PASSWORD}`
    });
    await dbConnector.connect();

    // Making database if it doesn't exist, and use the database
    await dbConnector.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB};`);
    await dbConnector.query(`USE ${process.env.MYSQL_DB};`);

    // Create tables if they don't already exist
    await createUserDataTableIfNotExists(dbConnector);
    await createGameDataTableIfNotExists(dbConnector);

    console.log("Database connection successful");
    return dbConnector;
}

// Recursive function to initialize database with retries
export async function initializeDataBaseWithRetry(attempts) {
    try {
        const conn = await initializeDataBase();
        console.log('Database connected successfully!');
        return conn; // Return the connection if successful
    } catch (error) {
        console.error('Database initialization attempt failed:', error);
        if (attempts > 0) {
            console.log(`Retrying... attempts left: ${attempts - 1}`);
            await delay(5000); // Wait for 5 seconds before retrying
            return initializeDataBaseWithRetry(attempts - 1);
        } else {
            console.error('All retries failed.');
            process.exit(1); // Exit process after all retries are exhausted
        }
    }
}

// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a user data table if it doesn't exist already
 * @param dbConnector DataBase connector variable
 * @returns void
 */
async function createUserDataTableIfNotExists(dbConnector){
    await dbConnector.query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_USER_TABLE}(
                    userID varchar(255) NOT NULL, 
                    username varchar(255) NOT NULL,
                    firstName varchar(255) NOT NULL,
                    lastName varchar(255) NOT NULL,
                    hashedPassword varchar(255) NOT NULL,
                    token varchar(255) NOT NULL,
                    totalWins int,
                    totalLosses int,
                    totalTies int,
                    UNIQUE(username),
                    UNIQUE(userID),
                    UNIQUE(token),
                    PRIMARY KEY (username)
                    );`);
}

/**
 * Creates a game room data table if it doesn't exist already
 * @param dbConnector DataBase connector variable
 * @returns void
 */
async function createGameDataTableIfNotExists(dbConnector){
    await dbConnector.query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_GAME_TABLE}(
                    roomID varchar(255) NOT NULL, 
                    hostUserName varchar(255) NOT NULL,
                    player2UserName varchar(255),
                    state varchar(255),
                    hostPlaysFirst bool,
                    p1Char char(1),
                    p2Char char(2),
                    game varchar(255),
                    UNIQUE(roomID),
                    PRIMARY KEY (roomID)
                    );`);
}