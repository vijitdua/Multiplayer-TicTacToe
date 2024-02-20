import {useState} from 'react';
import {} from '../logic/manageRoom';

function CreateRoom() {
    const [roomName, setRoomName] = useState(null);

    return (<div className='CreateGameRoom'>
        <form>
            <input type="text" placeholder="room-name"
                   onChange={(event) => setRoomName(event.target.value)}/>
            <button type="button" onClick={/* change this */}>Join Game</button>
        </form>
    </div>);
}

export default CreateRoom;