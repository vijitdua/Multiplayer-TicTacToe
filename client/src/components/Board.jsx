import React, {useState} from 'react';
import {Grid, Paper, Button, Container, Box} from '@mui/material';
import ErrorMessage from "./ErrorMessage";
import {login} from "../api/auth";
import {makeMove} from "../api/game";
import Cookies from "universal-cookie";

function Square({value, onSquareClick}) {
    return (<Button
        variant="outlined"
        sx={{
            height: '5rem', // Or fixed height if you prefer
            fontSize: '2rem', // Large font size for visibility
            padding: 0, // No padding
            minWidth: 0, // Override Material-UI Button minimum width
        }}
        onClick={onSquareClick}
    >
        {value}
    </Button>);
}

function Board({grid}) {
    const cookie = new Cookies();
    const [error, setErr] = useState(null);
    const [errID, setErrID] = useState(0); //Error Message component won't re-render if same error occurs, but if new error ID is sent, it knows it's a new error

    async function onClickButton(row, col) {
        console.log("Clicked");
        let success = await makeMove(row, col, cookie.get("roomID"));
        if (success !== true) {
            setErr(success);
            setErrID(prevId => prevId + 1); // Increment errorId to ensure a new key for each error
        }
    }


    return (<>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns with equal fraction
                gridTemplateRows: 'repeat(3, 1fr)', // 3 rows with equal fraction
                gap: 1, // Space between squares
                alignItems: 'stretch', // Stretch items to fill the container
            }}>
                <Square value={grid[0][0]} onSquareClick={() => onClickButton(0, 0)}/>
                <Square value={grid[0][1]} onSquareClick={() => onClickButton(0, 1)}/>
                <Square value={grid[0][2]} onSquareClick={() => onClickButton(0, 2)}/>

                <Square value={grid[1][0]} onSquareClick={() => onClickButton(1, 0)}/>
                <Square value={grid[1][1]} onSquareClick={() => onClickButton(1, 1)}/>
                <Square value={grid[1][2]} onSquareClick={() => onClickButton(1, 2)}/>

                <Square value={grid[2][0]} onSquareClick={() => onClickButton(2, 0)}/>
                <Square value={grid[2][1]} onSquareClick={() => onClickButton(2, 1)}/>
                <Square value={grid[2][2]} onSquareClick={() => onClickButton(2, 2)}/>
            </Box>
            {error && <ErrorMessage message={error} errID={errID}/>}
        </>
    );
};

export default Board;
