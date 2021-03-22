let squares;
let playerNamesEl;
let playerPiecesEl;
let boardHistoryEl;
let historyMoves;
let gameBoardEl;
let wonLine;

const lineType = {
    'horizontal': 'horizontalLine',
    'vertical'  : 'verticalLine',
    'diagonalR' : 'diagonalLineR',
    'diagonalL' : 'diagonalLineL'
};

const player = (elementIndex, piece) => {
    const setActive = (active) => {
        if (active) {
            playerNamesEl[elementIndex].classList.add('activePlayer');
        } else {
            playerNamesEl[elementIndex].classList.remove('activePlayer');
        }
    };
    const isActive = () => {
        return playerNamesEl[elementIndex].classList.contains('activePlayer');
    };
    const getName = () => {
        let playerName = playerNamesEl[elementIndex].value;
        if (playerName === '') {
            playerName = `Player ${elementIndex + 1}`;
        }
        return playerName;
    };
    return { elementIndex, piece, setActive, isActive, getName}; //0 or 1
};

const coord = (row, col) => {
    return {row, col};
};

const winningLine = (coords, lineType) => {
    const includes = (row, col) => {
        for (let i = 0; i < coords.length; i++) {
            if (parseInt(coords[i].row) === parseInt(row) && parseInt(coords[i].col) === parseInt(col)) {
                return true;
            }
        }
        return false;
    };
    return {coords, lineType, includes}
};

const gameBoard = () => {
    this.board = [['', '', ''], ['', '', ''], ['', '', '']];
    const addPiece = (piece, row, column, overwrite = false) => {
        let val = this.board[row][column];
        if (overwrite || val === '') {
            this.board[row][column] = piece;
            drawBoard();
            return true;
        }
        return false;
    };
    const clearBoard = () => {
        this.board = [['', '', ''], ['', '', ''], ['', '', '']];
        drawBoard();
    }
    const gameFinished = () => {
        for (let i = 0; i < this.board.length; i++) {
            for (let z = 0; z < this.board[i].length; z++) {
                if (this.board[i][z] === '') {
                    return false;
                }
            }
        }
        return true;
    };
    const addPieces = (pieces) => {
        for (let i = 0; i < pieces.length; i++) {
            for (let z = 0; z < pieces[i].length; z++) {
                addPiece(pieces[i][z], i, z, true);
            }
        }
    };
    const addWinningLine = (wonLine) => {
        for (let i = 0; i < squares.length; i++) {
            if (wonLine.includes(squares[i].dataset.row, squares[i].dataset.col)) {
                squares[i].classList.add(wonLine.lineType);
            }
        }
    };
    const removeWinningLine = (wonLine) => {
        for (let i = 0; i < squares.length; i++) {
            if (wonLine.includes(squares[i].dataset.row, squares[i].dataset.col)) {
                squares[i].classList.remove(wonLine.lineType);
            }
        }
    };
    const drawBoard = () => {
        let i = 0;
        this.board.forEach(
            line => {
                line.forEach(val => {
                    squares[i].innerText = val;
                    i++;
                })
            }
        );
    }
    const checkLines = () => {
        let found;
        let z;
        const coords = [];
        for (let i = 0; i < this.board.length; i++) {
            let initialPiece = this.board[i][0];
            found = true;
            //to save the cols matched
            coords.length = 0;
            coords.push(coord(i, 0));
            for (z = 1; z < this.board[i].length; z++) {
                if (initialPiece === '' || this.board[i][z] !== initialPiece) {
                    found = false;
                    break;
                } else {
                    coords.push(coord(i, z));
                }
            }
            if (found) {
                return winningLine(coords, lineType.horizontal);
            }

        }

        for (let i = 0; i < this.board[0].length; i++) {
            let initialPiece = this.board[0][i];
            found = true;
            //to save the rows matched
            coords.length = 0;
            coords.push(coord(0, i));
            for (z = 1; z < this.board.length; z++) {
                if (initialPiece === '' || this.board[z][i] !== initialPiece) {
                    found = false;
                    break;
                } else {
                    coords.push(coord(z, i));
                }
            }
            if (found) {
                return winningLine(coords, lineType.vertical);
            }
        }

        let initialPiece = this.board[0][0];
        found = true;
        coords.length = 0;
        coords.push(coord(0, 0));
        for (z = 1; z < this.board[0].length; z++) {
            if (initialPiece === '' || this.board[z][z] !== initialPiece) {
                found = false;
                break;
            } else {
                coords.push(coord(z, z));
            }
        }
        if (found) {
            return winningLine(coords, lineType.diagonalR);
        }

        initialPiece = this.board[0][this.board[0].length - 1];
        found = true;
        coords.length = 0;
        coords.push(coord(0, this.board[0].length - 1));
        let row;
        for (z = this.board[0].length - 2; z >= 0; z--) {
            row = this.board[0].length - 1 - z;
            if (initialPiece === '' || this.board[row][z] !== initialPiece) {
                found = false;
                break;
            } else {
                coords.push(coord(row, z));
            }
        }
        if (found) {
            return winningLine(coords, lineType.diagonalL)
        }

        return null;
    }
    return {board, addPiece, addPieces, gameFinished, clearBoard, checkLines, addWinningLine, removeWinningLine};
};

const ticTacToe = () => {
    this.players = [];
    this.boardHistory = [];
    this.gameboard = gameBoard();
    this.moveDone  = false;
    this.finished = false;
    const newGame = () => {

        //to change names
        this.moveDone = false;
        toggleInputs(true);

        this.players = getPlayers();

        //randomize the first player
        const num = Math.floor(Math.random() * 2);
        changeActivePlayer(num);

        //clear the winning line if exists
        for (let i = 0; i < squares.length; i++) {
            Object.values(lineType).forEach( val => {
                squares[i].classList.remove(val);
            });
        }

        this.boardHistory.length = 0;
        this.gameboard.clearBoard();
        this.finished = false;

        boardHistoryEl.innerHTML = '';

    };
    const getActivePlayer = () => {
        let activePlayer = null;
        this.players.forEach(player => {
            if (player.isActive()) {
                activePlayer = player;
            }
        });
        return activePlayer;
    };
    const getPlayers = () => {
        const players = [];
        for (let i = 0; i < playerNamesEl.length; i++) {
            players.push(player(i, playerPiecesEl[i].innerText));
        }
        return players;
    };
    const changeActivePlayer = (index) => {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setActive(i === index);
        }
    };
    const getNextPlayer = (previousIndex) => {
        if ((previousIndex + 1) < this.players.length) {
            return this.players[previousIndex + 1];
        } else {
            return players[0];
        }
    };
    const addPiece = (piece, row, column) => {
        let result = false;
        if (!this.finished) {
            result = this.gameboard.addPiece(piece, row, column);

            if (result) {

                //get info about the players and block the input names
                if (!this.moveDone) {
                    toggleInputs(false);
                    this.moveDone = true;
                }

                const activePlayer = getActivePlayer();

                const histSpan = document.createElement('span');
                histSpan.classList.add('historyMove');
                histSpan.innerText = `${new Date().toLocaleTimeString('en-GB')}: ${activePlayer.getName()} puts piece ${activePlayer.piece}` +
                    ` on row:${parseInt(row) + 1} col:${parseInt(column) + 1}`;
                histSpan.setAttribute('data-index', historyMoves.length);
                histSpan.addEventListener('mouseover', () => {
                    const pieces = this.boardHistory[parseInt(histSpan.dataset.index)];
                    this.gameboard.addPieces(pieces);
                    this.gameboard.removeWinningLine(wonLine);
                });
                boardHistoryEl.appendChild(histSpan);

                //check winning condition
                wonLine = this.gameboard.checkLines();
                if (wonLine !== null) {
                    this.finished = true;
                    this.gameboard.addWinningLine(wonLine);
                    const histSpan = document.createElement('span');
                    histSpan.classList.add('historyFinish');
                    histSpan.innerText = `${new Date().toLocaleTimeString('en-GB')}: Game won by ${activePlayer.getName()}`;
                    boardHistoryEl.appendChild(histSpan);
                } else if (this.gameboard.gameFinished()) {
                    //if no line with all squares occupied
                    this.finished = true;
                    const histSpan = document.createElement('span');
                    histSpan.classList.add('historyFinish');
                    histSpan.innerText = `${new Date().toLocaleTimeString('en-GB')}: Game finished without winner`;
                    boardHistoryEl.appendChild(histSpan);
                }

                //fill history moves array
                this.boardHistory.push(createNewPieces());

                if (!this.finished) {
                    //only changes player if has success adding piece
                    activePlayer.setActive(false);
                    getNextPlayer(activePlayer.elementIndex).setActive(true);
                }
            }
        }
        return result;
    };
    const createNewPieces = () => {
        const newPieces = []
        let z = -1;
        for (let i = 0; i < squares.length; i++) {
            if (i % 3 === 0) {
                z++;
                newPieces.push([]);
            }
            newPieces[z].push(squares[i].innerText);
        }
        return newPieces;
    };
    const toggleInputs = (enabled) => {
        for (let i = 0; i < playerNamesEl.length; i++) {
            playerNamesEl[i].readOnly = !enabled;
        }
    };
    return { boardHistory, newGame, finished, getActivePlayer, addPiece, gameboard, getPlayers }
};

window.onload = () => {

    playerNamesEl = document.getElementsByClassName('playerName');
    playerPiecesEl = document.getElementsByClassName('pieceType');
    boardHistoryEl = document.getElementById('boardHistory');
    gameBoardEl = document.getElementById('board');
    const newGameBtn = document.getElementById('newGameBtn');
    squares = gameBoardEl.getElementsByClassName('square');
    historyMoves = boardHistoryEl.getElementsByClassName('historyMove');

    const game = ticTacToe();

    game.newGame();

    for (let i = 0; i < squares.length; i++) {
      squares[i].addEventListener('click', () => {
          game.addPiece(game.getActivePlayer().piece, squares[i].dataset.row, squares[i].dataset.col);
      });
    }

    newGameBtn.addEventListener('click', () => {
       game.newGame();
    });

    boardHistoryEl.addEventListener('mouseleave', () => {
        const pieces = game.boardHistory[game.boardHistory.length - 1];
        game.gameboard.addPieces(pieces);
        game.gameboard.addWinningLine(wonLine);
    });

    for (let i = 0; i < playerNamesEl.length; i++) {
        playerNamesEl[i].addEventListener('onchange', () => {
            game.p
        });
    }

};


