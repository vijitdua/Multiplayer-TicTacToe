import {Box, CssBaseline, Link, Typography} from "@mui/material";

function NoPage() {
    return (<CssBaseline>
        <Box
        sx={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *' : {
                display: 'flex',
                margin: '15px',
            }
        }}>
            <Typography variant='h2' component='h1'>404!</Typography>
            <Typography variant='p' component='p'>The page you are looking for does not exist.</Typography>
            <Link href="/" variant="body2">Go Back To the Homepage</Link>
        </Box>
    </CssBaseline>);
}

export default NoPage;