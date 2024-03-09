import MyAppBar from "../components/MyAppBar";
import {useEffect, useState} from "react";
import {checkIfValidRoom, clearGameCookies} from "../api/manageGameRoom";
import StatusBar from "../components/StatusBar";
import Board from "../components/Board";
import {Box, Container, Grid} from "@mui/material";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";

function LoggedInLandingPage() {
    const [inGameStatus, setInGameStatus] = useState(null);

    async function checkIfInGame() {
        let status = await checkIfValidRoom();
        setInGameStatus(status);

        // Remove room data if not in a valid room
    }

    useEffect(() => {
        checkIfInGame();
    }, []);

    // If in game
    if (inGameStatus === true) {
        return (<>
            <MyAppBar/>
            <Container maxWidth='md'>
                <Box sx={{
                    marginTop: `30px`,
                    '& > *': {
                    margin: `10px`
                },
                }}>
                    hi //TODO: Add game stuff
                    <StatusBar gameStatus={`p1-turn`}/> <br/>
                    {/*//TODO: Fix*/}
                    <Board/>
                </Box>
            </Container>
        </>);
    }
    // If not in a game
    else if (inGameStatus === false) {
        return (<>
            <MyAppBar/>
            <Container maxWidth='lg'>
                <Box>
                    <Grid container spacing={2} justifyContent="center" sx={{mt: '10px'}}>
                        <CreateRoom/>
                        <JoinRoom/>
                    </Grid>
                </Box>
            </Container>
        </>);
    }
    // Loading
    else {
        return (<>
            <MyAppBar/>
            Loading
        </>);
    }

    //TODO: Check if user is in a game room, if game room is alive. If they have permission to connect, and then load the game room page. Otherwise not. Also clear game room cookies if anything is false.
}

export default LoggedInLandingPage;