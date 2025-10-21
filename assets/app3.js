const board = document.getElementById('board');
let cells = [];
let player = 'X';
let computer = 'O';
let gameOver = false;

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const SIZE = 8;           // Board is 8x8
const WIN_LENGTH = 5;     // Win condition: 5 in a row

// ?? Weight map: corners & center more valuable
const weights = Array(SIZE * SIZE).fill(1).map((_, i) => {
  const row = Math.floor(i / SIZE);
  const col = i % SIZE;
  // Center = higher weight, corners = mid weight
  const distFromCenter = Math.abs(row - SIZE/2) + Math.abs(col - SIZE/2);
  return Math.max(1, 20 - distFromCenter); // Center ˜ 20, corners ˜ smaller
});

function createBoard() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
  cells = [];

  for (let i = 0; i < SIZE * SIZE; i++) {
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

  // ?? 1?? Try to WIN
  for (let i of emptyIndices) {
    cells[i].textContent = computer;
    if (checkWin(computer)) {
      finalizeMove(i);
      return;
    }
    cells[i].textContent = '';
  }

  // ?? 2?? Try to BLOCK player
  for (let i of emptyIndices) {
    cells[i].textContent = player;
    if (checkWin(player)) {
      cells[i].textContent = computer;
      finalizeMove(i);
      return;
    }
    cells[i].textContent = '';
  }

  // ?? 3?? Otherwise choose BEST WEIGHTED move
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
  const directions = [
    [1, 0],   // ? horizontal
    [0, 1],   // ? vertical
    [1, 1],   // ? diagonal down-right
    [1, -1]   // ? diagonal up-right
  ];

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      for (const [dx, dy] of directions) {
        const pattern = [];
        for (let k = 0; k < WIN_LENGTH; k++) {
          const r = row + dx * k;
          const c = col + dy * k;
          if (r < 0 || c < 0 || r >= SIZE || c >= SIZE) break;
          pattern.push(r * SIZE + c);
        }
        if (pattern.length === WIN_LENGTH &&
            pattern.every(i => cells[i].textContent === symbol)) {
          return pattern;
        }
      }
    }
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
