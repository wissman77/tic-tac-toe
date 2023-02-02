// Factory function to creat players
const createPlayer = (name, mark, type) => {
  return {
    name,
    mark,
    type,
    score: 0,
  };
};

function Gameboard() {
  this.board = ['', '', '', '', '', '', '', '', ''];
}

const gameController = (() => {
  let board = new Gameboard().board;

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

  function checkWin(player) {
    const mark = player.mark;
    const winner = {};
    winner.winningPlayer = player;
    winner.isWinner = false;
    winningCombos.forEach((combo) => {
      const a = board[combo[0]];
      const b = board[combo[1]];
      const c = board[combo[2]];
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

  function getEmptyCells() {
    const emptyCells = [];
    board.forEach((cell, index) => {
      if (cell === '') emptyCells.push(index);
    });
    return emptyCells;
  }

  function randomEmptyCell() {
    return getEmptyCells()[Math.floor(Math.random() * getEmptyCells().length)];
  }

  function isTie() {
    return getEmptyCells().length === 0;
  }

  function initializeBoard() {
    board = new Gameboard().board;
  }

  return {
    turn,
    checkWin,
    isTie,
    randomEmptyCell,
    initializeBoard,
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
  const VISIBLE = 'flex';
  const INVISIBLE = 'none';

  // constants for buttons on the game
  const enterGameBtn = doc.querySelector('#enter-game');
  const playerVsPlayerBtn = doc.querySelector('#human-vs-human');
  const playerVsAiBtn = doc.querySelector('#human-vs-ai');
  // const easyAiBtn = doc.querySelector('button[data-type="easy"]');
  // const hardAiBtn = doc.querySelector('button[data-type="hard"]');

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
  };

  // Events listners
  enterGameBtn.addEventListener('click', () => {
    introSection.style.display = 'none';
    chooseGameSection.style.display = VISIBLE;
  });

  playerVsPlayerBtn.addEventListener('click', () => {
    playerVsAiBtn.style.backgroundColor = BLUE;
    playerVsPlayerBtn.style.backgroundColor = GREEN;
    twoPlayersDisplay.style.display = VISIBLE;
    aiDisplay.style.display = INVISIBLE;
  });

  playerVsAiBtn.addEventListener('click', () => {
    playerVsAiBtn.style.backgroundColor = GREEN;
    playerVsPlayerBtn.style.backgroundColor = BLUE;
    twoPlayersDisplay.style.display = INVISIBLE;
    aiDisplay.style.display = VISIBLE;
  });

  aiDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    player1 = createPlayer(humanPlayerTextBox.value, 'X', 'HUMAN');
    player2 = createPlayer('AI Machine', 'O', 'AI');
    showGameDisplay();
  });

  twoPlayersDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    player1 = createPlayer(player1TextBox.value, 'X', 'HUMAN');
    player2 = createPlayer(player2TextBox.value, 'O', 'HUMAN');
    showGameDisplay();
  });

  playAgainBtn.addEventListener('click', () => {
    cells.innerHTML = '';
    produceCells();
    gameController.initializeBoard();
    endGameActions.classList.remove('show');
    currentPlayer = player1;
    messages.textContent = "Let's Play!";
  });

  exitGameBtn.addEventListener('click', () => doc.location.reload());

  function produceCells() {
    for (let i = 0; i < 9; i++) {
      const cell = doc.createElement('div');
      cell.setAttribute('data-key', i);
      cell.textContent = '';
      cell.style.backgroundColor = '#fff';
      cell.classList.add('cell');
      cell.addEventListener('click', play);
      cells.appendChild(cell);
    }
  }

  function switchPlayers() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function removeEventListeners() {
    for (let i = 0; i < cells.childElementCount; i++) {
      cells.children[i].removeEventListener('click', play, false);
    }
  }

  function changeBackgroundOfWinningCells(combo, color) {
    for (let i = 0; i < combo.length; i++) {
      cells.children[combo[i]].style.backgroundColor = color;
    }
  }

  function isWinner(player) {
    const winner = gameController.checkWin(player);
    if (winner.isWinner) {
      return winner.isWinner;
    }
    return false;
  }

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

  function tieActions() {
    messages.textContent = "It's a Draw!";
    for (let i = 0; i < cells.childElementCount; i++) {
      cells.children[i].style.backgroundColor = '#fdfd88';
    }
    endGameActions.classList.add('show');
    removeEventListeners();
  }

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
          cellIndex = gameController.randomEmptyCell();
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
          }, 700);
        }
      }
      return;
    }
  }

  produceCells();
})(document);
