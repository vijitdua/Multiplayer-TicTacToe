import './App.css';
import SignUp from './components/SignUp.js'
import Login from "./components/Login.js"
import {StreamChat} from "stream-chat";
import Cookies from "universal-cookie";

function App() {

    const streamAPIKey = process.env.STREAM_API_KEY;
    const cookies = new Cookies();
    const token = cookies.get("token"); // Check if user is already signed in
    const streamServerClient = StreamChat.getInstance(streamAPIKey);

    if (token) {
        streamServerClient.connectUser({
            id: cookies.get("userID"),
            name: cookies.get("username"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedpassword")
        },
            token).then( (user) => {
                console.log(user);
        } );
    }

    return (
        <div className="App">
            <SignUp/>
            <Login/>
        </div>
    );
}

export default App;
