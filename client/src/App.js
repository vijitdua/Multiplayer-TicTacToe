import Authentication from "./pages/Authentication-page.jsx";
import Game from "./pages/Game-page";
import RoomManagement from "./pages/RoomManagement-page";
import NoPage from "./pages/NoPage";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CreateRoom from "./components/CreateRoom";

function App() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/">
                {/*<Route index element={<Home />} />*/}
                <Route path="authenticate" element={<Authentication />} />
                <Route path="login" element={<Authentication />} />
                <Route path="signup" element={<Authentication />} />
                <Route path="Game" element={<Game />} />
                <Route path="create" element={<CreateRoom />}/>
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    </BrowserRouter>);
}

export default App;
