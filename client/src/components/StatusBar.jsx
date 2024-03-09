import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {getRoomID} from "../api/manageGameRoom";
import Cookies from "universal-cookie";

const StatusBar = ({gameStatus}) => {
    const cookie = new Cookies();

    let statusMessage = `error getting game status`;
    const roomID = getRoomID();

    if (gameStatus === 'waiting-join') {
        statusMessage = <> Waiting for an opponent to join the room <br/> RoomID: {roomID} </>;
    } else if (gameStatus === 'p1-turn') {
        if(cookie.get("roomType") === `hosted`){
            statusMessage = `It is ${cookie.get("username")}'s turn`;
        }
        else if(cookie.get("roomType") === `joined`){
            statusMessage = `It is ${cookie.get("oppUserName")}'s turn`;
        }
    } else if(gameStatus === `p2-turn`){
        if(cookie.get("roomType") === `joined`){
            statusMessage = `It is ${cookie.get("username")}'s turn`;
        }
        else if(cookie.get("roomType") === `hosted`){
            statusMessage = `It is ${cookie.get("oppUserName")}'s turn`;
        }
    } else if(gameStatus === `win-p1`){
        if(cookie.get("roomType") === `hosted`){
            statusMessage = `${cookie.get("username")} Won!`;
        }
        else if(cookie.get("roomType") === `joined`){
            statusMessage = `${cookie.get("oppUserName")} Won!`;
        }
    }
    else if(gameStatus === `win-p2`){
        if(cookie.get("roomType") === `joined`){
            statusMessage = `${cookie.get("username")} Won!`;
        }
        else if(cookie.get("roomType") === `hosted`){
            statusMessage = `${cookie.get("oppUserName")} Won!`;
        }
    } else if(gameStatus === `tie`){
        statusMessage = `The game is a Tie!`;
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: 'primary.main',
            color: 'white',
            boxShadow: 1
        }}>
            <Typography variant="h6">{statusMessage}</Typography>
        </Box>
    );
};

export default StatusBar;
