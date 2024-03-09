import React from 'react';
import {AppBar, Toolbar, Typography, IconButton, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from "../api/auth";
import {clearGameCookies} from "../api/manageGameRoom";

function MyAppBar() {
    return (
        <AppBar position="static" sx={{backgroundColor: "#5fb2c9"}}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="home"
                    sx={{mr: 2}}
                    onClick={() => {
                        window.location.href = '/';
                        clearGameCookies();
                    }}
                        >
                        <HomeIcon />
                        </IconButton>

                    {/* Title */}
                        <Typography variant="h6" component="div" sx={{flexGrow: 1, textAlign: 'center'}}>
                    TicTacToe online
                </Typography>

                <Button
                    color="inherit"
                    endIcon={<LogoutIcon/>}
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                >
                    SignOut
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;
