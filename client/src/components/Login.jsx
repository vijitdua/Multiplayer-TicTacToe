import {useState} from "react";
import {login} from "../api/auth";
import ErrorMessage from "./ErrorMessage.jsx";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';

function Login() {
    const [user, setUser] = useState(null);
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows its a new error

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    async function loginButton() {
        let err = await login(user);
        if (err !== true) {
            setErr(err);
            setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
        }
    }


    return (
        <Container maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',

                    '& > *': {
                        margin: '15px', // Apply margin to each child
                    },
                }}
            >
                <Box sx={{
                    display: 'flex',
                    '& > *': {
                        margin: '10px',
                    },
                }}>
                    <Avatar>
                        <LockIcon/>
                    </Avatar>
                    <Typography variant="h4" component="h1">Log In</Typography>
                </Box>

                <TextField
                    label="Username"
                    required
                    fullWidth
                    variant="outlined"
                    margin='normal'
                    autoFocus
                    autoComplete="username"
                    onChange={(event) => setUserData("username", event.target.value)}
                />

                <TextField
                    label="Password"
                    required
                    fullWidth
                    variant="outlined"
                    type='password'
                    margin='normal'
                    autoFocus
                    autoComplete="password"
                    onChange={(event) => setUserData("password", event.target.value)}
                />

                <Box sx={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                        onChange={(e) => e.target.checked ? setUserData("remember", true) : setUserData("remember", false)}
                    />
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    onClick={loginButton}
                >
                    Log In
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {/*TODO: Make this work*/}
                            Don't have an account? Sign Up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            {error && <ErrorMessage message={error} errID={errID}/>}
        </Container>
    );
}

export default Login;