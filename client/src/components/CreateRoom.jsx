import {useState} from 'react';
import {createRoom} from '../api/manageRoom';

function CreateRoom() {
    const [roomData, setRoomData] = useState({hostPlaysFirst: false, hostChar: 'X'});

    function changeRoomData(dataType, data) {
        setRoomData({...roomData, [dataType]: data});
    }

    async function createButton() {
        await createRoom(roomData);
    }

    return (<div>
        <form>
            <h1>Create a Room</h1>
            <label> Do you want to play first </label> <br/>
            <input type="checkbox"
                   onChange={(e) => e.target.checked ? changeRoomData("hostPlaysFirst", true) : changeRoomData("hostPlaysFirst", false)}/><br/>
            <label> Which Character Do you want to play as</label><br/>
            <select name="character" value={roomData.hostChar}
                    onChange={(e) => changeRoomData("hostChar", e.target.value)}>
                <option value="X">X</option>
                <option value="O">O</option>
            </select>

            {/*<input type="text" placeholder="Enter username"*/}
            {/*       onChange={(event) => setUserData("username", event.target.value)}/> <br/>*/}
            {/*<label> Password </label> <br/>*/}
            {/*<input type="password" placeholder="Enter password"*/}
            {/*       onChange={(event) => setUserData("password", event.target.value)}/> <br/>*/}
            {/*<div className="checkBox">*/}
            {/*    <input type="checkbox"*/}
            {/*           onChange={(e) => e.target.checked ? setUserData("remember", true) : setUserData("remember", false)}/>*/}
            {/*    <label> Remember Me</label><br/>*/}
            {/*</div>*/}
            <button type="button" onClick={createRoom}>Create Room!</button>
        </form>
    </div>);
}

export default CreateRoom;