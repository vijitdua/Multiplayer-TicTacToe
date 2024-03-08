import {useState} from 'react';
import {createRoom} from '../api/manageRoom';
import ErrorMessage from "./ErrorMessage";
import {
    Avatar,
    Box, Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel, MenuItem,
    Select,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

function CreateRoom() {
    const [roomData, setRoomData] = useState(null);
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows it's a new error

    function changeRoomData(dataType, data) {
        setRoomData({...roomData, [dataType]: data});
    }

    async function createRoomButton() {
        let success = await createRoom(roomData);
        if (success !== true) {
            setErr(success);
            setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
            return;
        }
        if(success === true){
            window.location.href = '/'; //TODO: fix this lol
        }
    }

    return(
        <Container maxWidth='xs'>
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
                        <AddIcon/>
                    </Avatar>
                    <Typography variant="h4" component="h1">Create Game</Typography>
                </Box>

                <FormControl fullWidth>
                    <InputLabel>Do You Want to Play First</InputLabel>
                    <Select
                        label="play first choose"
                        onChange={(e) => changeRoomData("hostPlaysFirst", e.target.value)}
                    >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                    </Select>
                </FormControl> <br/>

                <FormControl fullWidth>
                    <InputLabel>Choose Your Character</InputLabel>
                    <Select
                        label="host char choose"
                        onChange={(e) => changeRoomData("hostChar", e.target.value)}
                    >
                        <MenuItem value="X">X</MenuItem>
                        <MenuItem value="O">O</MenuItem>
                    </Select>
                </FormControl> <br />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    onClick={createRoomButton}
                >
                    Create Game
                </Button>

            </Box>
            {error && <ErrorMessage message={error} errID={errID}/>}
    </Container>
    );
}

export default CreateRoom;