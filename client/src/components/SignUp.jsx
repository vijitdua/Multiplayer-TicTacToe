import {useState} from "react";
import {signUp, login} from "../api/auth";
import ErrorMessage from "./ErrorMessage";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel, Grid, Link,
    TextField,
    Typography
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

function SignUp() {
    const [user, setUser] = useState(null);
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows its a new error

    function setUserData(dataType, data) {
        setUser({...user, [dataType]: data});
    }

    async function signUpButton() {
        const signUpSuccess = await signUp(user);
        if (signUpSuccess === true) {
            setUserData("remember", true);
            await login(user);
            window.location.href = '/';
            return;
        }
        setErr(signUpSuccess);
        setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > *': {
                        margin: '10px',
                    },
                }}>
                    <Avatar
                        size='large'
                        sx={{bgcolor: '#343536'}}
                    >
                        <LockIcon/>
                    </Avatar>
                    <Typography variant="h4" component="h1">Sign Up</Typography>
                </Box>

                {/*<Grid sx={{ margin: '0 !important' }}>*/}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        margin: '0 !important',
                    }}
                >
                    <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        onChange={(event) => setUserData("firstName", event.target.value)}
                        sx={{marginRight: '5px'}}
                    />

                    <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        onChange={(event) => setUserData("lastName", event.target.value)}
                        sx={{marginLeft: '5px'}}
                    />

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
                    onClick={signUpButton}
                >
                    Sign Up
                </Button>
                <Grid container spacing={2} justifyContent='space-between'>
                    <Grid item>
                        <Link href='/' variant='body2'>
                            Home
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Already have an account? Login
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            {error && <ErrorMessage message={error} errID={errID}/>}
        </Container>
    );
}

export default SignUp;