import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise"; //TODO: fix all SQL injections

/**
 * Sign Up a user. (generate user id, user token, and perform other necessary checks)
 * @param req Client Request
 * @param res Client Response
 * @param dbConnector dataBase where data is being accessed
 * @response JSON file with: request body, server response message (success, or error message)
 */
export async function signUp(req, res, dbConnector) {
    try {
        // Destructure data from request
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const password = req.body.password;

        // Check if any field is blank, throw error if any field is blank
        if (!firstName || !lastName || !username || !password) {
            throw new Error("data incomplete");
        }

        // Check if username already exists, throw error if already exists
        let similarUserName = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${username}';`);
        console.log(similarUserName);
        if (similarUserName[0].length > 0) {
            throw new Error("username taken");
        }

        // Store user data, create userID, hashPassword
        const userID = uuidv4();
        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password; //TODO: Implement password hashing
        const token = uuidv4();
        console.log(`hashed code:`, hashedPassword);
        const response = {userID, firstName, lastName, username};
        res.json({...response, res: "SignUpComponent successful"});
        delete req.body.password;
        req.body = {...req.body, userID: userID, password: password, token: token};

        // Insert data into DataBase
        await dbConnector.query(`INSERT INTO ${process.env.MYSQL_USER_TABLE}(userID, username, firstName, lastName, hashedPassword, token)
                            VALUES ('${userID}', '${username}', '${firstName}', '${lastName}', '${hashedPassword}', '${token}'
                            );`)

        console.log("A new user signed up!", req.body);
    }

        // Error catching, and send error data to client
    catch (error) {
        console.error(`A user tried to signup and caused and caused an error: ${error}\nData Received: ${JSON.stringify(req.body)}\n`);
        res.json({...req.body, res: `${error}`});
    }
}

/**
 * Login a user. (search user token, and perform necessary checks for login data)
 * @param req Client Request
 * @param res Client Response
 * @param dbConnector dataBase where data is being accessed
 * @response JSON file with: request body, additional userData if login successful, userToken, server response message (success, or error message)
 */
export async function login(req, res, dbConnector) {
    try {
        // Destructure data from request
        const username = req.body.username;
        const password = req.body.password;
        const givenHashedPassword = password; //TODO: Implement password hashing

        // Check if any field is blank, throw error if any field is blank
        if (!username || !givenHashedPassword) {
            throw new Error("data incomplete");
        }

        // Search if password for user exists (if password doesn't exist, user doesn't exist). If password exists, store temporarily.
        let actualHashedPassword = await dbConnector.execute(`SELECT hashedPassword FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${username}';`);
        if (actualHashedPassword[0].length > 0) {
            actualHashedPassword = actualHashedPassword[0][0].hashedPassword; // Convert var from list to actual element
        } else {
            throw new Error("incorrect data");
        }

        // Check if stored actual password is equal to given password
        if (givenHashedPassword !== actualHashedPassword) {
            throw new Error("incorrect data");
        }


        // If the user reached here, he is the correct user with correct credentials.

        // Get user data from server
        let firstName = await dbConnector.execute(`SELECT firstName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${username}';`);
        let lastName = await dbConnector.execute(`SELECT lastName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${username}';`);
        lastName = lastName[0][0].lastName;
        firstName = firstName[0][0].firstName;
        let token = await dbConnector.execute(`SELECT token FROM ${process.env.MYSQL_USER_TABLE} WHERE username = '${username}';`);
        token = token[0][0].token;

        // Login successful, give user login data
        const resp = "login successful";
        console.log("A user logged in!", req.body);
        res.json({username, firstName, lastName, res: resp, token: token});
    }
        // Error catching, and send error data to client
    catch (error) {
        console.error(`A user tried to login and caused an error: ${error}`);
        res.json({...req.body, res: `${error}`});
    }
}