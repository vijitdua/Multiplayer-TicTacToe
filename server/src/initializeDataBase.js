import {v4 as uuidv4} from "uuid";
import dotenv from "dotenv";
import mysql from "mysql2/promise"; //TODO: fix all SQL injections
dotenv.config();

/**
 * Initializes the database and returns the connector object
 * @returns {Promise<Connection>} dataBase connection Object
 */
export async function initializeDataBase() {

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

    return dbConnector;
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
                    PRIMARY KEY (roomID)
                    );`);
}