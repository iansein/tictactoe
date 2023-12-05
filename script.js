//^ Player object
function player(name) {
  let score = 0;
  let playerName = name;
  const marks = [];
  const win = () => score++;
  const getScore = () => score;
  const restartScore = () => (score = 0);
  const restartMarks = () => marks.splice(0);
  const setMark = (mark) => marks.push(mark);
  const getMarks = () => marks;
  const setName = (name) => {
    playerName = name;
  };
  const getName = () => playerName;
  return {
    win,
    getScore,
    getMarks,
    setMark,
    setName,
    getName,
    restartScore,
    restartMarks,
  };
}

//^ This object has the functions that manipulate the game board
const gameBoard = (function () {
  let attempts = 9;
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

  const restartGame = (playerOne, playerTwo) => {
    const container = document.querySelector(".container-game");

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    playerOne.restartScore();
    playerOne.restartMarks();

    playerTwo.restartScore();
    playerTwo.restartMarks();
    attempts = 9;

    for (let i = 1; i < 10; i++) {
      let cell = document.createElement("div");
      cell.setAttribute("data-position", i);
      cell.classList.add("cell");
      container.appendChild(cell);
    }
  };

  const nextRound = (playerOne, playerTwo) => {
    const container = document.querySelector(".container-game");

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    playerOne.restartMarks();

    playerTwo.restartMarks();
    attempts = 9;

    for (let i = 1; i < 10; i++) {
      let cell = document.createElement("div");
      cell.setAttribute("data-position", i);
      cell.classList.add("cell");
      container.appendChild(cell);
    }
  };
  const getAttempts = () => attempts;
  const subtractAttempts = () => attempts--;
  const getOdds = () => oddsToWin;

  //& This function checks if the player won
  const checkWinner = (player) => {
    if (player.getMarks().length >= 3) {
      for (let i = 0; i < oddsToWin.length; i++) {
        let winningPlay = game.findOddsToWin(oddsToWin[i], player.getMarks());
        if (winningPlay) {
          player.win();
          const cells = document.querySelectorAll(".cell");
          cells.forEach((cell) => {
            let cellAttribute = Number(cell.getAttribute("data-position"));
            if (winningPlay.includes(cellAttribute))
              cell.style.backgroundColor = "#72CC50";
          });
          showWindow(player);
          return true;
        }
      }
    }
  };

  const refreshTable = function (playerOne, playerTwo) {
    const playerOneTable = document.querySelector("#player-one");
    const playerTwoTable = document.querySelector("#player-two");
    playerOneTable.textContent = `${playerOne.getName()}: ${playerOne.getScore()}`;
    playerTwoTable.textContent = `${playerTwo.getName()}: ${playerTwo.getScore()}`;
  };

  const showWindow = function (player) {
    const modalWinPara = document.querySelector("#modal-win");
    const popup = document.getElementById("popup");
    const btnRestart = document.querySelector(".btn-restart");

    popup.style.display = "block";
    modalWinPara.textContent = `${player.getName()} wins!`;
  };

  return {
    restartGame,
    getAttempts,
    subtractAttempts,
    getOdds,
    checkWinner,
    showWindow,
    refreshTable,
    nextRound,
  };
})();

const game = (function () {
  const playerOne = player("X");
  const playerTwo = player("Y");
  const btnRestart = document.querySelector(".btn-restart");
  btnRestart.addEventListener("click", () => {
    gameBoard.restartGame(playerOne, playerTwo);
    const popup = document.getElementById("popup");
    popup.style.display = "none";
    gameBoard.refreshTable(playerOne, playerTwo);
    play();
  });

  const nextRound = document.querySelector(".btn-next-round");
  nextRound.addEventListener("click", () => {
    gameBoard.nextRound(playerOne, playerTwo);
    const popup = document.getElementById("popup");
    popup.style.display = "none";
    gameBoard.refreshTable(playerOne, playerTwo);
    play();
  });

  const play = function () {
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const clickHandler = () => {
        if (gameBoard.getAttempts() % 2 === 0) {
          let imgCircle = document.createElement("img");
          imgCircle.src = "./assets/circle.png";
          imgCircle.classList.add("marks");
          cell.appendChild(imgCircle);
          gameBoard.subtractAttempts();
          playerOne.setMark(Number(cell.getAttribute("data-position")));
          if (gameBoard.checkWinner(playerOne)) {
            gameBoard.refreshTable(playerOne, playerTwo);
          }
          cell.removeEventListener("click", clickHandler);
        } else {
          let imgCross = document.createElement("img");
          imgCross.src = "./assets/cross.png";
          imgCross.classList.add("marks");
          cell.appendChild(imgCross);
          gameBoard.subtractAttempts();
          playerTwo.setMark(Number(cell.getAttribute("data-position")));
          if (gameBoard.checkWinner(playerTwo)) {
            gameBoard.refreshTable(playerOne, playerTwo);
          }
          cell.removeEventListener("click", clickHandler);
        }
      };
      cell.addEventListener("click", clickHandler);
    });
  };

  const startTheGame = function () {
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

      game.play();
    });
  };

  const findOddsToWin = function (oddsToWin, marks) {
    let winningPlay = oddsToWin.every((item) => marks.includes(item));
    if (winningPlay) {
      console.log(oddsToWin);
      return oddsToWin;
    }
    return false;
  };

  return { play, findOddsToWin, startTheGame };
})();

game.startTheGame();
