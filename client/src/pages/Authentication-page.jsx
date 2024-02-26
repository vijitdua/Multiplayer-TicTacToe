import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "../css/authentication.css";
import {CssBaseline} from "@mui/material";

function Authentication() {
    return (<>
        <CssBaseline>
            <Login />
            <SignUp />
        </CssBaseline>

    </>);
}

export default Authentication;