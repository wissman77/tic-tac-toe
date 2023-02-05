// Factory function to creat players
const createPlayer = (name, mark, type) => {
  return {
    name,
    mark,
    type,
    score: 0,
  };
};

// Gameboard object
const gameBoard = {
  board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

const gameController = (() => {
  // destrut the gameboard into board variable
  let board = [...gameBoard.board];
  const _humanPlayer = 'X';
  const _aiPlayer = 'O';

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // check for winner and return an object with various properties
  function checkWin(player, boardCopy = board) {
    const mark = player.mark;
    const winner = {};
    winner.winningPlayer = player;
    winner.isWinner = false;
    winningCombos.forEach((combo) => {
      const a = boardCopy[combo[0]];
      const b = boardCopy[combo[1]];
      const c = boardCopy[combo[2]];
      if (a === mark && b === mark && c === mark) {
        winner.isWinner = true;
        winner.winningCombo = combo;
      }
    });
    return winner;
  }

  function turn(currentPlayer, index) {
    board[index] = currentPlayer.mark;
  }

  function getEmptyCells(boardCopy) {
    return boardCopy.filter((s) => s !== _humanPlayer && s !== _aiPlayer);
  }

  // return random cell index
  function randomEmptyCell() {
    return getEmptyCells(board)[
      Math.floor(Math.random() * getEmptyCells(board).length)
    ];
  }

  // by checking if the board is full and no cell is empty it is a draw
  function isTie() {
    return getEmptyCells(board).length === 0;
  }

  function initializeBoard() {
    board = [...gameBoard.board];
  }

  // implemented by ahmed abdosahed
  // https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
  function _minimax(newBoard, playerMark) {
    const availSpots = getEmptyCells(newBoard);

    if (checkWin({ mark: _humanPlayer }, newBoard).isWinner) {
      return { score: -10 };
    } else if (checkWin({ mark: _aiPlayer }, newBoard).isWinner) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = playerMark;

      if (playerMark === _aiPlayer) {
        let result = _minimax(newBoard, _humanPlayer);
        move.score = result.score;
      } else {
        let result = _minimax(newBoard, _aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if (playerMark === _aiPlayer) {
      var bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  // best spot for ai using minimax
  function bestSpot() {
    return _minimax(board, _aiPlayer).index;
  }

  return {
    turn,
    checkWin,
    isTie,
    randomEmptyCell,
    initializeBoard,
    bestSpot,
  };
})();

// Intializing game vars Module
const initModule = ((doc) => {
  let player1;
  let player2;
  let level;
  let currentPlayer;

  // util const
  const GREEN = 'var(--green-color)';
  const BLUE = 'var(--blue-color)';
  const YELLOW = 'var(--light-yellow-color)';
  const VISIBLE = 'flex';
  const INVISIBLE = 'none';

  // constants for buttons on the game
  const enterGameBtn = doc.querySelector('#enter-game');
  const playerVsPlayerBtn = doc.querySelector('#human-vs-human');
  const playerVsAiBtn = doc.querySelector('#human-vs-ai');
  const easyAiBtn = doc.querySelector('button[data-type="easy"]');
  const hardAiBtn = doc.querySelector('button[data-type="hard"]');

  // game sections
  const introSection = doc.querySelector('.intro');
  const chooseGameSection = doc.querySelector('.choose-game');
  const gameSection = doc.querySelector('.game');

  // forms
  const aiDisplay = doc.querySelector('.ai-form');
  const twoPlayersDisplay = doc.querySelector('.two-players');
  const humanPlayerTextBox = doc.querySelector('#player');
  const player1TextBox = doc.querySelector('#player1');
  const player2TextBox = doc.querySelector('#player2');
  const error = doc.querySelector('.error');

  // game section constants
  const player1Name = doc.querySelector('.player1-name');
  const player2OrAIName = doc.querySelector('.player2-or-ai-name');
  const player1ScoreDisplay = doc.querySelector('.player1-score');
  const player2OrAIScoreDisplay = doc.querySelector('.player2-or-ai-score');
  const cells = doc.querySelector('.cells');
  const messages = doc.querySelector('.messages');
  const endGameActions = doc.querySelector('.game-actions');
  const playAgainBtn = doc.querySelector('.play-again');
  const exitGameBtn = doc.querySelector('.exit-game');

  const showGameDisplay = () => {
    chooseGameSection.style.display = INVISIBLE;
    gameSection.style.display = VISIBLE;
    player1Name.textContent = `${player1.name} (${player1.mark})`;
    player2OrAIName.textContent = `${player2.name} (${player2.mark})`;
    currentPlayer = player1;
    messages.textContent = `${currentPlayer.name}'s turn`;
  };

  // Events listners
  // First screen
  enterGameBtn.addEventListener('click', () => {
    introSection.style.display = 'none';
    chooseGameSection.style.display = VISIBLE;
  });

  // Second Screen - Player Vs Player - shows the human player form
  playerVsPlayerBtn.addEventListener('click', () => {
    playerVsAiBtn.style.backgroundColor = BLUE;
    playerVsPlayerBtn.style.backgroundColor = GREEN;
    twoPlayersDisplay.style.display = VISIBLE;
    aiDisplay.style.display = INVISIBLE;
  });

  // Second screen - Player vs AI - shows the human vs ai player form
  playerVsAiBtn.addEventListener('click', () => {
    playerVsAiBtn.style.backgroundColor = GREEN;
    playerVsPlayerBtn.style.backgroundColor = BLUE;
    twoPlayersDisplay.style.display = INVISIBLE;
    aiDisplay.style.display = VISIBLE;
  });

  // determine the game level as EASY
  easyAiBtn.addEventListener('click', () => {
    level = 'EASY';
    easyAiBtn.style.backgroundColor = GREEN;
    hardAiBtn.style.backgroundColor = BLUE;
    error.textContent = '';
  });

  // determine the game level as UNBEATABLE
  hardAiBtn.addEventListener('click', () => {
    level = 'UNBEATABLE';
    easyAiBtn.style.backgroundColor = BLUE;
    hardAiBtn.style.backgroundColor = GREEN;
    error.textContent = '';
  });

  // create the ai and humen players and display the game board
  aiDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    if (level) {
      player1 = createPlayer(humanPlayerTextBox.value, 'X', 'HUMAN');
      player2 = createPlayer('AI Machine', 'O', 'AI');
      showGameDisplay();
    } else {
      error.textContent = 'Please choose a game level.';
      error.style.transform = 'scale(1)';
    }
  });

  // create the ai and humen players and display the game board
  twoPlayersDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    player1 = createPlayer(player1TextBox.value, 'X', 'HUMAN');
    player2 = createPlayer(player2TextBox.value, 'O', 'HUMAN');
    showGameDisplay();
  });

  // play again button - clean the cells and create new fresh empty cells
  // and initialize the board in gameControll module
  playAgainBtn.addEventListener('click', () => {
    cells.innerHTML = '';
    produceCells();
    gameController.initializeBoard();
    endGameActions.classList.remove('show');
    currentPlayer = player1;
  });

  // refresh the page to restart the game
  exitGameBtn.addEventListener('click', () => doc.location.reload());

  // create empty cells with key-data as indexes and add eventListener to call play method each click
  function produceCells() {
    for (let i = 0; i < 9; i++) {
      const cell = doc.createElement('div');
      cell.setAttribute('data-key', i);
      cell.textContent = '';
      cell.classList.add('cell');
      cell.addEventListener('click', play);
      cells.appendChild(cell);
    }
  }

  // swip players
  function switchPlayers() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  // disable the click event to prevent continue playing when there is a win or draw
  function removeEventListeners() {
    for (let i = 0; i < cells.childElementCount; i++) {
      cells.children[i].removeEventListener('click', play, false);
    }
  }

  // changes the background color of the winniong combos with a selected color
  function changeBackgroundOfWinningCells(combo, color) {
    for (let i = 0; i < combo.length; i++) {
      cells.children[combo[i]].style.backgroundColor = color;
    }
  }

  // users the module function to determine if the player is a winner
  function isWinner(player) {
    return gameController.checkWin(player).isWinner;
  }

  // declare the winner, choose the color for winning combos,
  // and showiing the end game options display to restart or exit the game
  function declareWinner(player) {
    messages.textContent = `The Winner is ${player.name}`;
    const winner = gameController.checkWin(player);
    let color;
    if (player === player1) {
      player1ScoreDisplay.textContent = player.score;
      color = BLUE;
    } else {
      player2OrAIScoreDisplay.textContent = player.score;
      color = GREEN;
    }
    changeBackgroundOfWinningCells(winner.winningCombo, color);
    endGameActions.classList.add('show');
    removeEventListeners();
  }

  // if there is a draw, change the background color of all cells to lightyellow
  // and show the restart and exit game button display
  function tieActions() {
    messages.textContent = "It's a Draw!";
    for (let i = 0; i < cells.childElementCount; i++) {
      cells.children[i].style.backgroundColor = YELLOW;
    }
    endGameActions.classList.add('show');
    removeEventListeners();
  }

  // The main function when the human player clicks any cell
  // if the second player is an AI depens on the difficulity the game
  // will call the minimax algorithm or a random dummy cell choose
  // if the second player if human will only swap and wait for another click
  function play(e) {
    let cellIndex = +e.target.getAttribute('data-key');
    if (currentPlayer.type === 'HUMAN') {
      if (cells.children[cellIndex].textContent === '') {
        cells.children[cellIndex].textContent = currentPlayer.mark;
        gameController.turn(currentPlayer, cellIndex);
        if (isWinner(currentPlayer)) {
          // winning logic
          currentPlayer.score += 1;
          declareWinner(currentPlayer);
          return;
        }
        if (gameController.isTie()) {
          // Draw logic
          tieActions();
          return;
        }
        switchPlayers();
        messages.textContent = `${currentPlayer.name}'s turn`;
        if (currentPlayer.type === 'AI') {
          if (level === 'EASY') {
            cellIndex = gameController.randomEmptyCell();
          } else {
            // TODO and minimax call
            cellIndex = gameController.bestSpot();
          }
          setTimeout(() => {
            gameController.turn(currentPlayer, cellIndex);
            cells.children[cellIndex].textContent = currentPlayer.mark;
            if (isWinner(currentPlayer)) {
              // winning logic
              currentPlayer.score += 1;
              declareWinner(currentPlayer);
              return;
            }
            if (gameController.isTie()) {
              // Draw logic
              tieActions();
              return;
            }
            switchPlayers();
            messages.textContent = `${currentPlayer.name}'s turn`;
          }, 500);
        }
      }
      return;
    }
  }

  produceCells();
})(document);
