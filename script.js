function player() {
  let score = 0;
  const marks = [];
  const win = () => score++;
  const getScore = () => score;
  const setMark = (mark) => marks.push(mark);
  const getMarks = () => marks;
  return { win, getScore, getMarks, setMark };
}

const playerOne = player("X");
const playerTwo = player("Y");

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

  const restartGame = () => {};
  const getAttempts = () => attempts;
  const subtractAttempts = () => attempts--;
  const getOdds = () => oddsToWin;
  const checkWinner = (player) => {
    if (player.getMarks().length >= 3) {
      for (let i = 0; i < oddsToWin.length; i++) {
        let winningPlay = game.findOddsToWin(oddsToWin[i], player.getMarks());
        if (game.findOddsToWin(oddsToWin[i], player.getMarks())) {
          console.log(winningPlay);
          const cells = document.querySelectorAll(".cell");
          cells.forEach((cell) => {
            if (
              winningPlay.includes(Number(cell.getAttribute("data-position")))
            ) {
              cell.style.backgroundColor = "#72CC50";
            }
          });
          console.log("WIN");
          player.score++;
          break;
        }
      }
    }
  };
  return { restartGame, getAttempts, subtractAttempts, getOdds, checkWinner };
})();

const game = (function () {
  const play = function (playerOne, playerTwo) {
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
          gameBoard.checkWinner(playerOne);
          cell.removeEventListener("click", clickHandler);
        } else {
          let imgCross = document.createElement("img");
          imgCross.src = "./assets/cross.png";
          imgCross.classList.add("marks");
          cell.appendChild(imgCross);
          gameBoard.subtractAttempts();
          playerTwo.setMark(Number(cell.getAttribute("data-position")));
          gameBoard.checkWinner(playerTwo);
          cell.removeEventListener("click", clickHandler);
        }
      };
      cell.addEventListener("click", clickHandler);
    });
  };

  const findOddsToWin = function (oddsToWin, marks) {
    console.log(oddsToWin, marks);

    let winningPlay = oddsToWin.every((item) => marks.includes(item));
    if (winningPlay) {
      console.log(oddsToWin);
      return oddsToWin;
    }

    return false;
  };

  return { play, findOddsToWin };
})();

game.play(playerOne, playerTwo);
