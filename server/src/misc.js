// Return a json file with player data
export async function getPlayerData(username, dbConnector) {
    // Find if the username exists
    let getUsername = await dbConnector.execute(`SELECT username FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?;`, [username]);
    if (!(getUsername.length > 0)) {
        throw new Error("invalid username");
    }

    // Get data
    let totalWins = await dbConnector.execute(`SELECT totalWins FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [username]);
    totalWins = totalWins[0][0].totalWins;
    let totalLosses = await dbConnector.execute(`SELECT totalLosses FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [username]);
    totalLosses = totalLosses[0][0].totalLosses;
    let totalTies = await dbConnector.execute(`SELECT totalTies FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [username]);
    totalTies = totalTies[0][0].totalTies;
    let firstName = await dbConnector.execute(`SELECT firstName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [username]);
    firstName = firstName[0][0].firstName;
    let lastName = await dbConnector.execute(`SELECT lastName FROM ${process.env.MYSQL_USER_TABLE} WHERE username = ?`, [username]);
    lastName = lastName[0][0].lastName;

    // Return data
    return {
        username: username,
        firstName: firstName,
        lastName: lastName,
        totalWins: totalWins,
        totalLosses: totalLosses,
        totalTies: totalTies
    }
}

export async function getDataForClient(req, res, dbConnector) {
    try {
        res.json({...(await getPlayerData(req.params.player, dbConnector)), res: `success`});
    } catch (error) {
        console.error(`A user tried to get a user's data and caused an error: ${error}`);
        res.json({res: `${error}`});
    }
}