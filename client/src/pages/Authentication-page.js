import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "../css/authentication.css";

function Authentication() {
    return (<div className="parent">
        <Login />
        <SignUp />
    </div>);
}

export default Authentication;