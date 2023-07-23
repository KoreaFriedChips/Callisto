let players = ["player-one", "player-two", "player-three", "player-four"];
let playerScores = [0, 0, 0, 0];
let playerIndex = 0;
let currentPlayer = players[playerIndex];
// pieces: type of piece, show, #
let pieces = [
  ["W", false, 1, 1, 1, 1],
  ["+", false, 1, 1, 1, 1],
  ["T", false, 1, 1, 1, 1],
  ["U", false, 1, 1, 1, 1],
  ["L", false, 2, 2, 2, 2],
  ["Short T", false, 2, 2, 2, 2],
  ["Z", false, 2, 2, 2, 2],
  ["Square", false, 2, 2, 2, 2],
  ["Turn", false, 2, 2, 2, 2],
  ["1x3", false, 2, 2, 2, 2],
  ["1x2", false, 2, 2, 2, 2],
  ["New Base", true, 3, 3, 3, 3],
];
function togglePiece(name) {
  pieces.forEach(([piece, show, val1, val2, val3, val4], index) => {
    pieces[index][1] = piece === name;
  });
}
function getPieceShape(piece, rotation, centerX, centerY) {
  const cellsAround = [
    [
      document.getElementById(`${centerX - 1}_${centerY - 1}`), // top left
      document.getElementById(`${centerX - 1}_${centerY}`), // top mid
      document.getElementById(`${centerX - 1}_${centerY + 1}`), // top right
    ],
    [
      document.getElementById(`${centerX}_${centerY - 1}`), // mid left
      null,
      document.getElementById(`${centerX}_${centerY + 1}`), // mid right
    ],
    [
      document.getElementById(`${centerX + 1}_${centerY - 1}`), // bot left
      document.getElementById(`${centerX + 1}_${centerY}`), // bot mid
      document.getElementById(`${centerX + 1}_${centerY + 1}`), // bot right
    ],
  ];

  // rotate 90 degrees clockwise, selecting same squares so technically counterclock-wise
  const N = 3;
  for (let r = 0; r < rotate; r++) {
    for (i = 0; i < parseInt(N / 2); i++) {
      for (j = i; j < N - i - 1; j++) {
        // Swap elements of each cycle
        // in clockwise direction
        var temp = cellsAround[i][j];
        cellsAround[i][j] = cellsAround[N - 1 - j][i];
        cellsAround[N - 1 - j][i] = cellsAround[N - 1 - i][N - 1 - j];
        cellsAround[N - 1 - i][N - 1 - j] = cellsAround[j][N - 1 - i];
        cellsAround[j][N - 1 - i] = temp;
      }
    }
  }
  if (flipPiece) {
    for (i = 0; i <= 2; i++) {
      var temp = cellsAround[i][0];
      cellsAround[i][0] = cellsAround[i][2];
      cellsAround[i][2] = temp;
    }
  }

  let cellShape = [];
  switch (piece) {
    case "W":
      cellShape = [
        cellsAround[0][0],
        cellsAround[1][0],
        cellsAround[2][1],
        cellsAround[2][2],
      ];
      break;
    case "+":
      cellShape = [
        cellsAround[0][1],
        cellsAround[1][0],
        cellsAround[1][2],
        cellsAround[2][1],
      ];
      break;
    case "T":
      cellShape = [
        cellsAround[0][0],
        cellsAround[0][1],
        cellsAround[0][2],
        cellsAround[2][1],
      ];
      break;
    case "U":
      cellShape = [
        cellsAround[0][0],
        cellsAround[1][0],
        cellsAround[1][2],
        cellsAround[0][2],
      ];
      break;
    case "L":
      cellShape = [cellsAround[0][1], cellsAround[2][1], cellsAround[2][2]];
      break;
    case "Short T":
      cellShape = [cellsAround[1][0], cellsAround[1][2], cellsAround[2][1]];
      break;
    case "Z":
      cellShape = [cellsAround[1][0], cellsAround[2][1], cellsAround[2][2]];
      break;
    case "Square":
      cellShape = [cellsAround[1][0], cellsAround[2][0], cellsAround[2][1]];
      break;
    case "Turn":
      cellShape = [cellsAround[0][1], cellsAround[1][2]];
      break;
    case "1x3":
      cellShape = [cellsAround[0][1], cellsAround[2][1]];
      break;
    case "1x2":
      cellShape = [cellsAround[1][0]];
      break;
    case "New Base":
      break;
    default:
      null;
  }
  return cellShape;
}

let rotate = 0;
let flipPiece = false;
function rotateRight() {
  rotate--;
  if (rotate < 0) rotate = 3;
}
function rotateLeft() {
  rotate = (rotate + 1) % 4;
}
function flip() {
  flipPiece = !flipPiece;
}

const cells = document.querySelectorAll(".cell");
let isPlacingPiece = false;

function highlightCellAndSurrounding(cell) {
  const [centerX, centerY] = cell.id.split("_").map(Number);
  let cellShape = [];
  pieces.forEach(([piece, show, val1, val2, val3, val4]) => {
    if (show) {
      cellShape = getPieceShape(piece, rotate, centerX, centerY);
    }
  });
  const isHovering = document.createElement("div");
  const hoverId = "hover_" + cell.id; // Unique identifier for each hover element
  isHovering.classList.add("hovering");
  isHovering.setAttribute("data-hover-id", hoverId);
  cell.appendChild(isHovering);
  cellShape.forEach((cell) => {
    if (cell) {
      const hoverDiv = document.createElement("div");
      hoverDiv.classList.add("hovering");
      hoverDiv.setAttribute("data-hover-id", hoverId);
      cell.appendChild(hoverDiv);
    }
  });
}

function removeHighlightFromCellAndSurrounding(cell) {
  const hoverId = "hover_" + cell.id; // Get the unique identifier for the hover element
  const hoverElements = document.querySelectorAll(
    `[data-hover-id="${hoverId}"]`
  );

  hoverElements.forEach((hoverElement) => {
    if (hoverElement && hoverElement.parentNode) {
      hoverElement.parentNode.removeChild(hoverElement);
    }
  });
}

function checkPlayable(cellShape, id) {
  // check it is touching another cell that is your colour and already placed
  // check it is not on outer blue or out of bounds
  // check it is not on top of another placed piece
  let adjacent = false,
    outOfBounds = false,
    onTop = false;
  let curIndex = playerIndex + 2;
  console.log(curIndex);
  if (cellShape.length === 1) {
    adjacent = true;
    if (
      (pieces[11][curIndex] >= 2 && cellShape[0].classList.contains("blue")) ||
      pieces[11][curIndex] <= 0
    ) {
      console.log(curIndex + " " + pieces[11][curIndex]);
      outOfBounds = true;
    }
  } else if (
    (pieces[11][curIndex] >= 2 && cellShape.length >= 2) ||
    pieces[id][curIndex] <= 0
  ) {
    outOfBounds = true;
  }
  for (const cell of cellShape) {
    if (!cell || cell.classList.contains("dark-blue")) {
      outOfBounds = true;
      break;
    }
    if (cell.classList.contains("piece")) {
      onTop = true;
      break;
    }
    const [centerX, centerY] = cell.id.split("_").map(Number);
    const surroundingCells = [
      document.getElementById(`${centerX - 1}_${centerY}`), // top mid
      document.getElementById(`${centerX}_${centerY - 1}`), // mid left
      document.getElementById(`${centerX}_${centerY + 1}`), // mid right
      document.getElementById(`${centerX + 1}_${centerY}`), // bot mid
    ];
    for (const surroundingCell of surroundingCells) {
      if (surroundingCell && surroundingCell.classList.contains("piece")) {
        if (
          (surroundingCell.classList.contains("player-one") &&
            playerIndex === 0) ||
          (surroundingCell.classList.contains("player-two") &&
            playerIndex === 1) ||
          (surroundingCell.classList.contains("player-three") &&
            playerIndex === 2) ||
          (surroundingCell.classList.contains("player-four") &&
            playerIndex === 3)
        )
          adjacent = true;
      }
    }
  }
  console.log(adjacent + " " + outOfBounds + " " + onTop);
  return adjacent && !outOfBounds && !onTop;
}

function updateButtonLabels() {
  console.log(pieces);
  const buttons = document.querySelectorAll(".button-container button");
  let id = playerIndex + 3,
    nxtPlayer = players[(playerIndex + 1) % 4],
    prvPlayer = players[playerIndex];
  if (id > 5) id -= 4;
  buttons.forEach((button, index) => {
    if (button.classList.contains(prvPlayer))
      button.classList.remove(prvPlayer);
    if (!button.classList.contains(nxtPlayer)) button.classList.add(nxtPlayer);
    if (index < pieces.length)
      button.textContent = `${pieces[index][0]}` + ` (${pieces[index][id]})`;
  });
}

function updateScore(num) {
  const scores = document.querySelectorAll(".score");
  scores.forEach((score, index) => {
    if (index === playerIndex) {
      playerScores[index] += num;
      score.textContent = `${playerScores[index]}`;
    }
  });
}

function passTurn() {
  updateButtonLabels();
  playerIndex += 1;
  if (playerIndex >= 4) playerIndex -= 4;
  currentPlayer = players[playerIndex];
}

cells.forEach((cell) => {
  cell.addEventListener("mouseenter", () => {
    // console.log("enter: " + cell.id);
    if (!isPlacingPiece && !cell.classList.contains("piece")) {
      highlightCellAndSurrounding(cell);
    }
  });

  cell.addEventListener("mouseleave", () => {
    if (isPlacingPiece) {
      return;
    }
    removeHighlightFromCellAndSurrounding(cell);
  });

  cell.addEventListener("click", () => {
    if (!isPlacingPiece && !cell.classList.contains("piece")) {
      const [centerX, centerY] = cell.id.split("_").map(Number);
      let cellShape = [];
      let id = 0;
      pieces.forEach(([piece, show, val], index) => {
        if (show) {
          cellShape = getPieceShape(piece, rotate, centerX, centerY);
          id = index;
        }
      });
      cellShape.push(cell);
      if (checkPlayable(cellShape, id)) {
        cellShape.forEach((cell) => {
          if (cell) {
            cell.classList.add("piece");
            cell.classList.add(currentPlayer);
          }
        });
        pieces.forEach(([piece, show, val], index) => {
          if (show) {
            pieces[index][playerIndex + 2]--;
            updateButtonLabels();
            updateScore(cellShape.length);
          }
        });
        playerIndex += 1;
        if (playerIndex >= 4) playerIndex -= 4;
        currentPlayer = players[playerIndex];
        console.log(currentPlayer);
      }
    }
  });
});
