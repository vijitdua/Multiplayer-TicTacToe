import {useState} from 'react';
import {joinRoom} from '../logic/manageRoom';

function JoinRoom() {
    const [hostUserName, setHostUserName] = useState(null);

    function joinGame(){
        joinRoom(hostUserName);
    }

    return (<div className='JoinGameRoom'>
        <form>
            <input type="text" placeholder="room host username"
                   onChange={(event) => setHostUserName(event.target.value)}/>
            <button type="button" onClick={joinGame}>Join Game</button>
        </form>
    </div>);
}

export default JoinRoom;