import {Grid, Link, Typography} from "@mui/material";
import {getOpponentUsername} from "../api/manageGameRoom";
import Cookies from "universal-cookie";

function PlayerDataDisplay({waitingForJoin}){

    const cookie = new Cookies();

    if(waitingForJoin){
        return (
            <Grid container spacing={2} justifyContent='space-between'>
                <Grid item>
                    <Typography variant='p' component='p'> Opponent: ---</Typography>
                    <Typography variant='p'
                                component='p'> ---, --- </Typography>
                    <Typography variant='p' component='p'> Games Won: -, Games
                        Lost: -</Typography>
                    <Typography variant='p' component='p'> Ties: -, Total
                        Games: - </Typography>
                </Grid>
                <Grid item>
                    <Typography variant='p' component='p'> You: {cookie.get("username")}</Typography>
                    <Typography variant='p'
                                component='p'> {cookie.get("lastName")}, {cookie.get("firstName")} </Typography>
                    <Typography variant='p' component='p'> Games Won: {cookie.get("wins")}, Games
                        Lost: {cookie.get("losses")}</Typography>
                    <Typography variant='p' component='p'> Ties: {cookie.get("ties")}, Total
                        Games: {cookie.get("ties") + cookie.get("wins") + cookie.get("losses")} </Typography>
                </Grid>
            </Grid>);
    }
    else {
        return (
            <Grid container spacing={2} justifyContent='space-between'>
                <Grid item>
                    <Typography variant='p' component='p'> Opponent: {cookie.get("oppUserName")}</Typography>
                    <Typography variant='p'
                                component='p'> {cookie.get("oppLastName")}, {cookie.get("oppFirstName")} </Typography>
                    <Typography variant='p' component='p'> Games Won: {cookie.get("oppWins")}, Games
                        Lost: {cookie.get("oppLosses")}</Typography>
                    <Typography variant='p' component='p'> Ties: {cookie.get("oppTies")}, Total
                        Games: {cookie.get("oppTies") + cookie.get("oppWins") + cookie.get("oppLosses")} </Typography>
                </Grid>
                <Grid item>
                    <Typography variant='p' component='p'> You: {cookie.get("username")}</Typography>
                    <Typography variant='p'
                                component='p'> {cookie.get("lastName")}, {cookie.get("firstName")} </Typography>
                    <Typography variant='p' component='p'> Games Won: {cookie.get("wins")}, Games
                        Lost: {cookie.get("losses")}</Typography>
                    <Typography variant='p' component='p'> Ties: {cookie.get("ties")}, Total
                        Games: {cookie.get("ties") + cookie.get("wins") + cookie.get("losses")} </Typography>
                </Grid>
            </Grid>);
    }
}

export default PlayerDataDisplay;