let squares;
let playerNamesEl;
let playerPiecesEl;
let boardHistoryEl;
let historyMoves;
let gameBoardEl;

const lineType = {
    'horizontal': 'horizontalLine',
    'vertical'  : 'verticalLine',
    'diagonalR' : 'diagonalLineR',
    'diagonalL' : 'diagonalLineL'
};

const player = (name, piece) => {
    this.active = false;
    return {name, piece, active}; //0 or 1
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
    const addPiece = (piece, row, column) => {
        let val = this.board[row][column];
        if (val === '') {
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
    return {board, addPiece, gameFinished, clearBoard, checkLines};
};

const ticTacToe = () => {
    this.players = [player('player1', 'X'), player('player2', 'O')];
    this.boardHistory = [];
    this.gameboard = gameBoard();
    this.started  = false;
    this.finished = false;
    const newGame = () => {
        //randomize the first player
        const num = Math.floor(Math.random() * 2);
        this.players[num].active = true;
        changeActivePlayer();

        //put the object names
        let i = 0;
        this.players.forEach(
            player => {
                playerNamesEl[i].innerText = player.name;
                playerPiecesEl[i].innerText = player.piece;
                i++;
            }
        );

        //clear the winning line if exists
        for (let i = 0; i < squares.length; i++) {
            Object.values(lineType).forEach( val => {
                squares[i].classList.remove(val);
            });
        }

        this.boardHistory.length = 0;
        this.gameboard.clearBoard();
        this.started  = true;
        this.finished = false;

        boardHistoryEl.innerHTML = '';

    };
    const activePlayer = () => {
        let activePlayer = null;
        this.players.forEach(player => {
            if (player.active) {
                activePlayer = player;
            }
        })
        return activePlayer;
    };
    const changeActivePlayer = () => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].name === activePlayer().name) {
                players[i].active = false;
                playerNamesEl[i].classList.remove('activePlayer');
                //next player in the list is the active player
                let newActivePlayerIndex = 0;
                if ((i + 1) < players.length) {
                    newActivePlayerIndex = i + 1;
                }
                players[newActivePlayerIndex].active = true;
                playerNamesEl[newActivePlayerIndex].classList.add('activePlayer');
                return;
            }
        }
    };
    const addPiece = (piece, row, column) => {
        let result = false;
        if (!this.finished) {
            result = this.gameboard.addPiece(piece, row, column);

            if (result) {
                const histSpan = document.createElement('span');
                histSpan.classList.add('historyMove');
                histSpan.innerText = `${new Date().toLocaleTimeString('en-GB')}: ${activePlayer().name} puts piece ${activePlayer().piece}` +
                    ` on row:${parseInt(row) + 1} col:${parseInt(column) + 1}`;
                histSpan.setAttribute('data-index', historyMoves.length);
                histSpan.addEventListener('mouseover', () => {
                    gameBoardEl.innerHTML = '';
                    const squares = this.boardHistory[parseInt(histSpan.dataset.index)];
                    for (let i = 0; i < squares.length; i++) {
                        gameBoardEl.appendChild(squares[i]);
                        squares[i].addEventListener('click', () => {
                            addPiece(activePlayer().piece, squares[i].dataset.row, squares[i].dataset.col);
                        });
                    }
                });
                boardHistoryEl.appendChild(histSpan);

                //check winning condition
                const wonLine = this.gameboard.checkLines();
                if (wonLine !== null) {
                    this.finished = true;
                    for (let i = 0; i < squares.length; i++) {
                        if (wonLine.includes(squares[i].dataset.row, squares[i].dataset.col)) {
                            squares[i].classList.add(wonLine.lineType);
                        }
                    }
                    const histSpan = document.createElement('span');
                    histSpan.classList.add('historyFinish');
                    histSpan.innerText = `${new Date().toLocaleTimeString('en-GB')}: Game won by ${activePlayer().name}`;
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
                const htmlSquares = [];
                for (let i= 0; i < squares.length; i++) {
                    htmlSquares.push(squares[i].cloneNode(true));
                }
                this.boardHistory.push(htmlSquares);

                if (!this.finished) {
                    //only changes player if has success adding piece
                    changeActivePlayer();
                }
            }
        }
        return result;
    };
    return { players, boardHistory, newGame, started, finished, activePlayer, addPiece }
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
          game.addPiece(game.activePlayer().piece, squares[i].dataset.row, squares[i].dataset.col);
      });
    }

    newGameBtn.addEventListener('click', () => {
       game.newGame();
    });

    boardHistoryEl.addEventListener('mouseleave', () => {
        gameBoardEl.innerHTML = '';
        const squares = game.boardHistory[game.boardHistory.length - 1];
        for (let i = 0; i < squares.length; i++) {
            const clone = squares[i].cloneNode(true);
            gameBoardEl.appendChild(clone);
            clone.addEventListener('click', () => {
                game.addPiece(game.activePlayer().piece, squares[i].dataset.row, squares[i].dataset.col);
            });
        }
    });

};


