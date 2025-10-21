const board = document.getElementById('board');
const SIZE = 8;
let cells = [];
let player = 'O';
let computer = 'X';
let currentPlayer = player;
let gameOver = false;

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

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

  // Initial setup
  const mid = SIZE / 2;
  setCell(mid - 1, mid - 1, 'X');
  setCell(mid, mid, 'X');
  setCell(mid - 1, mid, 'O');
  setCell(mid, mid - 1, 'O');

  updateScore();
}

function setCell(row, col, symbol) {
  cells[row * SIZE + col].textContent = symbol;
}

function getCell(row, col) {
  return cells[row * SIZE + col]?.textContent;
}

function playerMove(index) {
  if (gameOver) return;
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  if (!isValidMove(row, col, player)) return;
  makeMove(row, col, player);
  updateScore();
  currentPlayer = computer;
  computerMove();
}

function computerMove() {
  if (gameOver) return;
  const level = document.getElementById('difficulty').value;

  let moves = getAllValidMoves(computer);
  if (moves.length === 0) {
    if (getAllValidMoves(player).length === 0) endGame();
    currentPlayer = player;
    return;
  }

  let bestMove;
  if (level === 'easy') {
    bestMove = moves[Math.floor(Math.random() * moves.length)];
  } else if (level === 'medium') {
    // Pick move that flips most pieces
    bestMove = moves.sort((a, b) => b.flipped.length - a.flipped.length)[0];
  } else if (level === 'hard') {
    // Smartest: simulate and evaluate board (simple minimax)
    bestMove = chooseBestStrategicMove(moves);
  }

  makeMove(bestMove.row, bestMove.col, computer);
  updateScore();
  currentPlayer = player;
}

function isValidMove(row, col, symbol) {
  if (getCell(row, col)) return false;
  return directions.some(([dx, dy]) => {
    let r = row + dx, c = col + dy, hasOpponent = false;
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      const cell = getCell(r, c);
      if (!cell) return false;
      if (cell !== symbol) hasOpponent = true;
      else return hasOpponent;
      r += dx; c += dy;
    }
    return false;
  });
}

function makeMove(row, col, symbol) {
  const toFlip = [];
  directions.forEach(([dx, dy]) => {
    const flipped = [];
    let r = row + dx, c = col + dy;
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
      const cell = getCell(r, c);
      if (!cell) { flipped.length = 0; break; }
      if (cell === symbol) break;
      flipped.push([r, c]);
      r += dx; c += dy;
    }
    if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && getCell(r, c) === symbol)
      toFlip.push(...flipped);
  });

  if (toFlip.length > 0) {
    setCell(row, col, symbol);
    toFlip.forEach(([r, c]) => setCell(r, c, symbol));
  }
}

function getAllValidMoves(symbol) {
  const moves = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (isValidMove(r, c, symbol)) {
        // Count flipped cells
        let flipped = [];
        directions.forEach(([dx, dy]) => {
          const line = [];
          let rr = r + dx, cc = c + dy;
          while (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) {
            const cell = getCell(rr, cc);
            if (!cell) break;
            if (cell === symbol) break;
            line.push([rr, cc]);
            rr += dx; cc += dy;
          }
          if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && getCell(rr, cc) === symbol)
            flipped.push(...line);
        });
        moves.push({ row: r, col: c, flipped });
      }
    }
  }
  return moves;
}

function chooseBestStrategicMove(moves) {
  // Weighted heuristic: prefer corners > edges > others
  const cornerWeight = 100, edgeWeight = 10;
  let best = moves[0];
  let bestScore = -Infinity;

  moves.forEach(m => {
    const { row, col, flipped } = m;
    let score = flipped.length;
    const corner = (row === 0 || row === SIZE - 1) && (col === 0 || col === SIZE - 1);
    const edge = row === 0 || row === SIZE - 1 || col === 0 || col === SIZE - 1;
    if (corner) score += cornerWeight;
    else if (edge) score += edgeWeight;
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  });

  return best;
}

function updateScore() {
  const counts = { X: 0, O: 0 };
  cells.forEach(c => {
    if (c.textContent === 'X') counts.X++;
    if (c.textContent === 'O') counts.O++;
  });
  document.getElementById('playerScore').textContent = counts.O;
  document.getElementById('computerScore').textContent = counts.X;

  if (counts.X + counts.O === SIZE * SIZE) endGame();
}

function endGame() {
  gameOver = true;
  alert("Game Over! Winner: " +
    (parseInt(playerScore.textContent) > parseInt(computerScore.textContent) ? "Player" : "Computer"));
}

createBoard();
