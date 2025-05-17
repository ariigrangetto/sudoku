console.log("working");
function createBoard() {
  let boardContainer = document.querySelector(".board");
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.max = 9;
      input.dataset.row = row;

      //dataset lo usamos para saber en que celda del tablero esta cada input
      input.dataset.col = col;
      input.classList.add("cell");
      boardContainer.appendChild(input);
    }
  }
}

function fillBoard(board) {
  const cells = document.querySelectorAll(".cell");

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const index = i * 9 + j;

      //para obtener el indice del input
      //fila * cantidad de columnas + columna
      //para ingresar a la fila 2 columna 3
      // 2 * 9 + 3 = 21
      //input numero 21
      const value = board[i][j];
      //para devolver el valor del elemento de esa fila y columna

      if (value !== ".") {
        cells[index].value = value;
        cells[index].disabled = true;
        cells[index].classList.add("fixed");
      }
    }
  }
}

const intialBoard = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"],
];
function getBoardValues() {
  const inputs = document.querySelectorAll(".cell");
  const values = Array.from({ length: 9 }, () => new Array(9).fill("."));
  //oara crear una matriz de 9x9
  //se usar Array.from ya que si uso new Array, va a ser el mismo array repetido. Seria 9 veces el mismo array compartido
  //ejemplo: values[0][0] => "x";
  //values[1][0] => tambien da "x"

  inputs.forEach((input) => {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const val = input.value;

    values[row][col] = val === "" ? "." : val;
  });
  return values;
}

const MODES = {
  INITIALGAME: "initialGame",
  GAMEOVER: "gameOver",
  WIN: "win",
};

let mode = MODES.INITIALGAME;

function isValid(board) {
  for (let row = 0; row < 9; row++) {
    let seen = new Set();
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === ".") continue;
      if (seen.has(board[row][i])) return false;
      seen.add(board[row][i]);
    }
  }

  for (let col = 0; col < 9; col++) {
    let seen = new Set();
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === ".") continue;
      if (seen.has(board[i][col])) return false;
      seen.add(board[i][col]);
    }
  }

  for (let square = 0; square < 9; square++) {
    let seen = new Set();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let row = Math.floor(square / 3) * 3 + i;
        let col = (square % 3) * 3 + j;

        if (board[row][col] === ".") continue;
        if (seen.has(board[row][col])) return false;

        seen.add(board[row][col]);
      }
    }
  }
  return true;
}

function isComplete(board) {
  for (let row of board) {
    for (let cell of row) {
      if (cell === ".") return false;
    }
  }

  return true;
}

function StartGame() {
  const currentBoard = getBoardValues();
  const valid = isValid(currentBoard);
  const complete = isComplete(currentBoard);

  if (!valid) {
    GameOver();
  }

  if (valid && complete) {
    Win();
  }
}

function GameOver() {
  mode = MODES.GAMEOVER;
  document.querySelector(".error").style.display = "flex";
}

createBoard();
fillBoard(intialBoard);

document.querySelectorAll(".cell").forEach((input) => {
  if (!input.disabled) {
    input.addEventListener("input", StartGame);
  }
});

function Win() {
  mode = MODES.WIN;
  document.querySelector(".error").style.display = "none";
  confetti();
}
