const board = document.getElementById('board');
let cells = [];
let player = 'X';
let computer = 'O';
let gameOver = false;

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

// 1?? Define weights for each cell position
const weights = [2, 1, 2, 1, 17, 1, 2, 1, 2];

function createBoard() {
  board.innerHTML = '';
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => playerMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function playerMove(index) {
  if (cells[index].textContent || gameOver) return;
  cells[index].textContent = player;
  if (checkWin(player)) {
    highlightWin(checkWin(player));
    updateScore('player');
    gameOver = true;
    return;
  }
  if (isDraw()) {
    updateScore('draw');
    gameOver = true;
    return;
  }
  computerMove();
}

function computerMove() {
  if (gameOver) return;

  const emptyIndices = cells
    .map((c, i) => (!c.textContent ? i : null))
    .filter(i => i !== null);

  // 1?? Try to win
  for (let i of emptyIndices) {
    cells[i].textContent = computer;
    if (checkWin(computer)) {
      finalizeMove(i);
      return;
    }
    cells[i].textContent = '';
  }

  // 2?? Try to block player's win
  for (let i of emptyIndices) {
    cells[i].textContent = player;
    if (checkWin(player)) {
      cells[i].textContent = computer;
      finalizeMove(i);
      return;
    }
    cells[i].textContent = '';
  }

  // 3?? Choose the highest weighted move
  let bestMove = emptyIndices[0];
  let bestWeight = -Infinity;
  for (let i of emptyIndices) {
    if (weights[i] > bestWeight) {
      bestWeight = weights[i];
      bestMove = i;
    }
  }
  cells[bestMove].textContent = computer;
  finalizeMove(bestMove);
}

function finalizeMove(i) {
  if (checkWin(computer)) {
    highlightWin(checkWin(computer));
    updateScore('computer');
    gameOver = true;
  } else if (isDraw()) {
    updateScore('draw');
    gameOver = true;
  }
}

function checkWin(symbol) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const pattern of winPatterns) {
    if (pattern.every(i => cells[i].textContent === symbol)) return pattern;
  }
  return null;
}

function highlightWin(pattern) {
  pattern.forEach(i => cells[i].classList.add('win-glow'));
}

function isDraw() {
  return cells.every(c => c.textContent);
}

function updateScore(type) {
  if (type === 'player') playerScore++;
  else if (type === 'computer') computerScore++;
  else drawScore++;

  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
  document.getElementById('drawScore').textContent = drawScore;
}

function resetBoard() {
  gameOver = false;
  createBoard();
}

createBoard();
