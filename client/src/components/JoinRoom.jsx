import {useState} from 'react';
import {joinRoom} from '../api/manageGameRoom';
import ErrorMessage from "./ErrorMessage";
import {Avatar, Box, Button, Container, TextField, Typography} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

function JoinRoom() {
    const [roomID, setRoomID] = useState(null);
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows it's a new error

    async function joinRoomButton() {
        let success = await joinRoom(roomID);
        if (success !== true) {
            setErr(success);
            setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
            return;
        }
        if(success === true){
            window.location.href = '/'; //TODO: fix this lol
        }
    }

    return (<Container maxWidth='xs'>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: '16px',

                '& > *': {
                    margin: '15px', // Apply margin to each child
                },
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                    margin: '10px',
                },
            }}>
                <Avatar
                    size='large'
                    sx={{bgcolor: '#53b0c9'}}
                >
                    <LoginIcon/>
                </Avatar>
                <Typography variant="h4" component="h1">Join Game</Typography>
            </Box>

            <TextField
                label="Room ID"
                required
                fullWidth
                variant="outlined"
                margin='normal'
                autoFocus
                onChange={(event) => setRoomID(event.target.value)}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                onClick={joinRoomButton}
            >
                Join Game
            </Button>
        </Box>
            {error && <ErrorMessage message={error} errID={errID}/>}
        </Container>

    );
}

export default JoinRoom;