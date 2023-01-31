// Factory function to creat players
const createPlayer = (name, mark, type) => {
  return {
    name,
    mark,
    type,
  };
};

// Intializing game vars Module
const initModule = ((doc) => {
  let player1;
  let player2;
  let level;

  // util const
  const _active = 'var(--green-color)';
  const _inactive = 'var(--blue-color)';
  const _visiable = 'flex';
  const _invisibale = 'none';

  // constants for buttons on the game
  const _enterGameBtn = doc.querySelector('#enter-game');
  const _playerVsPlayerBtn = doc.querySelector('#human-vs-human');
  const _playerVsAiBtn = doc.querySelector('#human-vs-ai');
  const _easyAiBtn = doc.querySelector('button[data-type="easy"]');
  const _hardAiBtn = doc.querySelector('button[data-type="hard"]');

  // game sections
  const _introSection = doc.querySelector('.intro');
  const _chooseGameSection = doc.querySelector('.choose-game');
  const _gameSection = doc.querySelector('.game');

  // forms
  const _aiDisplay = doc.querySelector('.ai-form');
  const _twoPlayersDisplay = doc.querySelector('.two-players');
  const _humanPlayerTextBox = doc.querySelector('#player');
  const _player1TextBox = doc.querySelector('#player1');
  const _player2TextBox = doc.querySelector('#player2');
  const _error = doc.querySelector('.error');

  const _showGameDisplay = () => {
    _chooseGameSection.style.display = _invisibale;
    _gameSection.style.display = _visiable;
  };

  // Events listners
  _enterGameBtn.addEventListener('click', () => {
    _introSection.style.display = 'none';
    _chooseGameSection.style.display = _visiable;
  });

  _playerVsPlayerBtn.addEventListener('click', () => {
    _playerVsAiBtn.style.backgroundColor = _inactive;
    _playerVsPlayerBtn.style.backgroundColor = _active;
    _twoPlayersDisplay.style.display = _visiable;
    _aiDisplay.style.display = _invisibale;
  });

  _playerVsAiBtn.addEventListener('click', () => {
    _playerVsAiBtn.style.backgroundColor = _active;
    _playerVsPlayerBtn.style.backgroundColor = _inactive;
    _twoPlayersDisplay.style.display = _invisibale;
    _aiDisplay.style.display = _visiable;
  });

  _easyAiBtn.addEventListener('click', () => {
    level = 'EASY';
    _easyAiBtn.style.backgroundColor = _active;
    _hardAiBtn.style.backgroundColor = _inactive;
    _error.textContent = '';
  });

  _hardAiBtn.addEventListener('click', () => {
    level = 'HARD';
    _easyAiBtn.style.backgroundColor = _inactive;
    _hardAiBtn.style.backgroundColor = _active;
    _error.textContent = '';
  });

  _aiDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    if (level) {
      player1 = createPlayer(_humanPlayerTextBox.value, 'X', 'HUMAN');
      player2 = createPlayer('AI Machine', 'O', 'AI');
      _showGameDisplay();
    } else {
      _error.textContent = 'Please choose a game level.';
      _error.style.transform = 'scale(1)';
      return false;
    }
  });

  _twoPlayersDisplay.addEventListener('submit', (e) => {
    e.preventDefault();
    player1 = createPlayer(_player1TextBox.value, 'X', 'HUMAN');
    player2 = createPlayer(_player2TextBox.value, 'X', 'HUMAN');
    _showGameDisplay();
  });

  return {
    level,
    player1,
    player2,
  };
})(document);
