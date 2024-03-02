import Game from "./pages/Game-page";
import LandingPage from "./pages/LandingPage";
import NoPage from "./pages/NoPage";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/">
                <Route index element={<LandingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="Game" element={<Game />} />
                <Route path="create" element={<CreateRoom />}/>
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    </BrowserRouter>);
}

export default App;
