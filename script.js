function player(name = "DefaultName", imgPath = "defaultPath") {
  let score = 0;
  let playerName = name;
  let markImgPath = imgPath;
  const marks = [];

  const win = () => score++;
  const getScore = () => score;

  const restartScore = () => {
    score = 0;
  };

  const restartMarks = () => {
    marks.length = 0;
  };

  const setMark = (mark) => marks.push(mark);
  const getMarks = () => marks;

  const setName = (name) => {
    playerName = name;
  };

  const getName = () => playerName;
  const getMarkImagePath = () => markImgPath;

  return {
    win,
    getScore,
    getMarks,
    setMark,
    setName,
    getName,
    restartScore,
    restartMarks,
    getMarkImagePath,
  };
}

const gameBoard = (function () {
  const CONTAINER_SELECTOR = ".container-game";

  let attempts = 9;

  const clearContainer = () => {
    const container = document.querySelector(CONTAINER_SELECTOR);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  const createCell = () => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    return cell;
  };

  const initializeGame = () => {
    const container = document.querySelector(CONTAINER_SELECTOR);

    for (let i = 1; i < 10; i++) {
      let cell = createCell();
      cell.setAttribute("data-position", i);
      container.appendChild(cell);
    }
  };

  const refreshTable = function (playerOne, playerTwo) {
    const playerOneTable = document.querySelector("#player-one");
    const playerTwoTable = document.querySelector("#player-two");
    playerOneTable.textContent = `${playerOne.getName()}: ${playerOne.getScore()}`;
    playerTwoTable.textContent = `${playerTwo.getName()}: ${playerTwo.getScore()}`;
  };

  const restartGame = (playerOne, playerTwo) => {
    clearContainer();
    initializeGame();
    playerOne.restartScore();
    playerOne.restartMarks();
    playerTwo.restartScore();
    playerTwo.restartMarks();
    attempts = 9;
  };

  const nextRound = (playerOne, playerTwo) => {
    clearContainer();
    initializeGame();
    playerOne.restartMarks();
    playerTwo.restartMarks();
    attempts = 9;
  };

  return {
    restartGame,
    getAttempts: () => attempts,
    subtractAttempts: () => attempts--,
    getOdds: () => oddsToWin,
    refreshTable,
    nextRound,
  };
})();

const game = (function () {
  const CLASS_MARKS = "marks";
  const CLASS_POPUP = "popup";
  const CLASS_BTN_RESTART = ".btn-restart";
  const CLASS_BTN_NEXT_ROUND = ".btn-next-round";

  const playerOne = player("Player One", "./assets/cross.png");
  const playerTwo = player("Player Two", "./assets/circle.png");
  const btnRestart = document.querySelector(CLASS_BTN_RESTART);
  const btnNextRound = document.querySelector(CLASS_BTN_NEXT_ROUND);

  const oddsToWin = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [7, 5, 3],
  ];

  const restartGame = () => {
    gameBoard.restartGame(playerOne, playerTwo);
    const popup = document.getElementById(CLASS_POPUP);
    popup.style.display = "none";
    gameBoard.refreshTable(playerOne, playerTwo);
    play();
  };

  const nextRound = () => {
    gameBoard.nextRound(playerOne, playerTwo);
    const popup = document.getElementById(CLASS_POPUP);
    popup.style.display = "none";
    gameBoard.refreshTable(playerOne, playerTwo);
    play();
  };

  const addMark = (cell, player) => {
    const img = document.createElement("img");
    img.src = player.getMarkImagePath();
    img.classList.add(CLASS_MARKS);
    cell.appendChild(img);
    gameBoard.subtractAttempts();
    player.setMark(Number(cell.getAttribute("data-position")));
    if (checkWinner(player)) {
      gameBoard.refreshTable(playerOne, playerTwo);
    } else if (gameBoard.getAttempts() === 0) {
      showWindowDraw();
    }
  };

  const play = () => {
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const clickHandler = () => {
        if (gameBoard.getAttempts() % 2 === 0) {
          addMark(cell, playerTwo);
          cell.removeEventListener("click", clickHandler);
        } else {
          addMark(cell, playerOne);
          cell.removeEventListener("click", clickHandler);
        }
      };
      cell.addEventListener("click", clickHandler);
    });
  };

  const startTheGame = () => {
    const form = document.querySelector(".form-names");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const playerOneName = document.querySelector("#name-player-one").value;
      const playerTwoName = document.querySelector("#name-player-two").value;
      const playerOneTable = document.querySelector("#player-one");
      const playerTwoTable = document.querySelector("#player-two");

      playerOneTable.textContent = `${playerOneName}: ${playerOne.getScore()}`;
      playerTwoTable.textContent = `${playerTwoName}: ${playerOne.getScore()}`;

      playerOne.setName(playerOneName);
      playerTwo.setName(playerTwoName);

      form.classList.add("form-display");

      play();
    });
  };

  const changeCellColors = (winningPlay) => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      let cellAttribute = Number(cell.getAttribute("data-position"));
      if (winningPlay.includes(cellAttribute)) {
        cell.style.backgroundColor = "#72CC50";
      }
    });
  };

  const checkWinner = (player) => {
    if (player.getMarks().length >= 3) {
      for (let i = 0; i < oddsToWin.length; i++) {
        let winningPlay = game.findOddsToWin(oddsToWin[i], player.getMarks());
        if (winningPlay) {
          player.win();
          changeCellColors(winningPlay);
          showWindowWinner(player);
          return true;
        }
      }
    }
    return false;
  };

  const showWindowWinner = function (player) {
    const modalWinPara = document.querySelector("#modal-win");
    const popup = document.getElementById("popup");

    popup.style.display = "block";
    modalWinPara.textContent = `${player.getName()} wins!`;
  };

  const showWindowDraw = function () {
    const modalWinPara = document.querySelector("#modal-win");
    const popup = document.getElementById("popup");

    popup.style.display = "block";
    modalWinPara.textContent = `It's a draw`;
  };

  const findOddsToWin = (oddsToWin, marks) => {
    let winningPlay = oddsToWin.every((item) => marks.includes(item));
    return winningPlay ? oddsToWin : false;
  };

  btnRestart.addEventListener("click", restartGame);
  btnNextRound.addEventListener("click", nextRound);

  return { play, findOddsToWin, startTheGame };
})();

game.startTheGame();
