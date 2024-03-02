import {Box, Button, Container, CssBaseline, Grid, Typography} from "@mui/material";

function NotLoggedInLandingPage() {
    return (<CssBaseline>
        <Container maxWidth='md'>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '100px',
                    '& > *': {
                        alignItems: 'center',
                        margin: '10px',
                    }
                }}>
                <Typography variant='h4' component='h1'>Welcome to TicTacToe online</Typography> <br/>
                <Typography variant='h6' component='p'>It look's like you are not logged in, please log in or sign
                    up</Typography>

                <Grid container spacing={2} justifyContent="center" sx={{mt: '10px'}}>
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={()=> window.location.href = '/login'}
                        >
                            Log In
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={()=> window.location.href = '/signup'}
                        >
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>

            </Box>
        </Container>

    </CssBaseline>);
}

export default NotLoggedInLandingPage;