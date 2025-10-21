    const board = document.getElementById('board');
    let cells = [];
    let player = 'X';
    let computer = 'O';
    let gameOver = false;

    let playerScore = 0;
    let computerScore = 0;
    let drawScore = 0;

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
      const emptyCells = cells.filter(c => !c.textContent);
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      if (randomCell) {
        randomCell.textContent = computer;
        if (checkWin(computer)) {
          highlightWin(checkWin(computer));
          updateScore('computer');
          gameOver = true;
        } else if (isDraw()) {
          updateScore('draw');
          gameOver = true;
        }
      }
    }

    function checkWin(symbol) {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ];

      for (const pattern of winPatterns) {
        if (pattern.every(i => cells[i].textContent === symbol)) {
          return pattern;
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
