import React from 'react';
import {Grid, Paper, Button, Container, Box} from '@mui/material';

function Square({value, onSquareClick, row, col}) {
    return (<Button
        variant="outlined"
        sx={{
            height: '5rem', // Or fixed height if you prefer
            fontSize: '2rem', // Large font size for visibility
            padding: 0, // No padding
            minWidth: 0, // Override Material-UI Button minimum width
        }}
        onClick={() => onSquareClick}
    >
        {value}
    </Button>);
}

function Board() {

    function onClickButton(row, col) {
        //TODO
    }


    // Create a 3x3 grid
    let grid = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]; //TODO: FIX GRID, HOW DO YOU GET THIS

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns with equal fraction
            gridTemplateRows: 'repeat(3, 1fr)', // 3 rows with equal fraction
            gap: 1, // Space between squares
            alignItems: 'stretch', // Stretch items to fill the container
        }}>
            <Square value={grid[0][0]} onSquareClick={() => onClickButton(0, 0)} row={0} col={0}/>
            <Square value={grid[0][1]} onSquareClick={() => onClickButton(0, 1)} row={0} col={1}/>
            <Square value={grid[0][2]} onSquareClick={() => onClickButton(0, 2)} row={0} col={2}/>

            <Square value={grid[1][0]} onSquareClick={() => onClickButton(1, 0)} row={1} col={0}/>
            <Square value={grid[1][1]} onSquareClick={() => onClickButton(1, 1)} row={1} col={1}/>
            <Square value={grid[1][2]} onSquareClick={() => onClickButton(1, 2)} row={1} col={2}/>

            <Square value={grid[2][0]} onSquareClick={() => onClickButton(2, 0)} row={2} col={0}/>
            <Square value={grid[2][1]} onSquareClick={() => onClickButton(2, 1)} row={2} col={1}/>
            <Square value={grid[2][2]} onSquareClick={() => onClickButton(2, 2)} row={2} col={2}/>
        </Box>
    );
};

export default Board;
