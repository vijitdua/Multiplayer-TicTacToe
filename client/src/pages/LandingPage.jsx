import {authenticateToken} from "../api/auth";
import NotLoggedInLandingPage from "./NotLoggedInLandingPage";
import LoggedInLandingPage from "./LoggedInLandingPage.jsx";
import {useEffect, useState} from "react";
import {CssBaseline, Typography} from "@mui/material";

function LandingPage() {
    const [loginStatus, setLoginStatus] = useState(null);

    async function checkLoginStatus() {
        let status = await authenticateToken();
        setLoginStatus(status);
    }

    useEffect(() => {
        checkLoginStatus();
    }, []);


    if (loginStatus === true) {
        return <LoggedInLandingPage/>
    } else if (loginStatus === false) {
        return <NotLoggedInLandingPage/>
    } else {
        return <CssBaseline>
            <Typography variant='h4' component='h1'> The page is loading </Typography>
            {/*    Add a loading page*/}
        </CssBaseline>
    }
}

export default LandingPage;