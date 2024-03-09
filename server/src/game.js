// Convert 2D board array to string
export function boardArrayToString(board2DArray){
    return board2DArray
        .map(row => row.map(item => item === null ? "null" : item).join(','))
        .join(';');
}

// Convert string of board to 2d array
export function stringBoardToArray(boardString){
    return boardString.split(';').map(row =>
        row.split(',').map(item => item === "null" ? null : item)
    );
}

// Return a blank board
export function blankBoard(){
    return [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
}

// Make a move in the board
export function makeMove(playerChar, row, col, board){
    if (board[row][col] === null) { // Check if the cell is empty
        board[row][col] = playerChar;
    } else {
        throw new Error('Cell is already occupied');
    }
    return board;
}

// Check if anyone won. Either return char of who won, null if no one, 'T' if tie.
export function gameWinStatus(board){

    function checkDiagonalWin(board) {
        if (board[1][1] !== null) {
            if (((board[0][0] === board[1][1]) && (board[1][1] === board[2][2])) || ((board[2][0] === board[1][1]) && (board[1][1] === board[0][2]))){
                return board[1][1];
            }
        }
        return false;
    }

    // Checks for horizontal wins on a 2D board
    function checkHorizontalWin(board) {
        for (let row = 0; row < 3; row++) {
            let current = null;
            let count = 0;

            for (let col = 0; col < 3; col++) {
                // Access the cell with board[row][col]
                if (board[row][col] !== 'X' && board[row][col] !== 'O') {
                    // If the cell is not 'X' or 'O', reset count and current
                    count = 0;
                    current = null;
                    continue;
                }
                if (board[row][col] === current) {
                    // If the cell is the same as the last one, increment count
                    count++;
                    if (count === 3) {
                        // If there are three in a row, return true
                        return board[row][col];
                    }
                } else {
                    // If the cell is different, start a new count
                    current = board[row][col];
                    count = 1;
                }
            }
        }
        return false; // No horizontal win was found
    }

    function checkIfBoardFull(board) {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }


    // Checks for vertical wins on a 2D board
    function checkVerticalWin(board) {
        for (let col = 0; col < 3; col++) {
            let current = null;
            let count = 0;

            for (let row = 0; row < 3; row++) {
                // Access the cell with board[row][col]
                if (board[row][col] !== 'X' && board[row][col] !== 'O') {
                    // If the cell is not 'X' or 'O', reset count and current
                    count = 0;
                    current = null;
                    continue;
                }
                if (board[row][col] === current) {
                    // If the cell is the same as the last one, increment count
                    count++;
                    if (count === 3) {
                        // If there are three in a column, return true
                        return board[row][col];
                    }
                } else {
                    // If the cell is different, start a new count
                    current = board[row][col];
                    count = 1;
                }
            }
        }
        return false; // No vertical win was found
    }

    let diagonalWin = checkDiagonalWin(board);
    if(diagonalWin){
        return diagonalWin;
    }
    let verticalWin = checkVerticalWin(board);
    if(verticalWin){
        return verticalWin;
    }
    let horizontalWin = checkHorizontalWin(board);
    if(horizontalWin){
        return horizontalWin;
    }
    if(checkIfBoardFull(board)){
        return 'T';
    }
    return null;
}