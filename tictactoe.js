"use strict";
const rl = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";
  static MID_SQUARE_INDEX = "5";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)] = new Square();
    }
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    this.display();
  }

  display() {
    let squares = this.squares;
    console.log("");
    console.log("     |     |");
    console.log(`  ${squares["1"].getMarker()}  |  ${squares["2"].getMarker()}  |  ${squares["3"].getMarker()}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${squares["4"].getMarker()}  |  ${squares["5"].getMarker()}  |  ${squares["6"].getMarker()}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${squares["7"].getMarker()}  |  ${squares["8"].getMarker()}  |  ${squares["9"].getMarker()}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

class Player {
  static STARTING_SCORE = 0;

  constructor(marker) {
    this.marker = marker;
    this.score = Player.STARTING_SCORE;
  }

  addPoint() {
    this.score += 1;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  static WINNING_SCORE = 3;
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ]             // diagonal: bottom-left to top-right
  ];
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.turn = 0;
    this.humansTurn = Boolean(Math.floor(Math.random() * 2));
    this.goFirst = null;
  }

  static joinOr(choices, punc = ',', word = "or") {
    if (choices.length === 1) {
      return choices[0];
    } else if (choices.length === 2) {
      return choices.join(` ${word} `);
    } else {
      return choices.slice(0, choices.length - 1)
        .join(`${punc} `).concat(` ${word} ${choices[choices.length - 1]}`);
    }
  }

  calculateFirstTurn() {
    if (this.goFirst === null) {
      this.goFirst = this.humansTurn;
    } else if (this.goFirst) {
      this.goFirst = false;
      this.humansTurn = false;
    } else {
      this.goFirst = true;
      this.humansTurn = true;
    }
  }

  play() {
    while (true) {

      console.clear();
      if (this.turn === 0) this.displayWelcomeMessage();
      this.calculateFirstTurn();

      while (true) {

        this.playerMoves();
        if (this.gameOver()) break;

        this.playerMoves();
        if (this.gameOver()) break;

        this.nextTurn();
        console.clear();
      }

      if (this.isWinner(this.human)) {
        this.human.addPoint();
      } else if (this.isWinner(this.computer)) {
        this.computer.addPoint();
      }
      this.displayScoreChart();
      this.board.display();
      this.displayResults();
      if (this.isGameWin() || !this.playAgain()) break;
      this.resetBoard();
    }

    this.finalScore();
    this.displayGoodbyeMessage();
  }

  nextTurn() {
    this.turn += 1;
  }

  fullDisplay() {
    if (this.turn === 0) {
      this.displayWelcomeMessage();
    } else {
      this.displayScoreChart();
    }

    this.board.display();
  }

  playerMoves() {

    if (this.humansTurn) {
      if (this.turn !== 0) {
        this.fullDisplay();
      } else {
        this.board.display();
      }
      this.humanMoves();
      this.switchTurn();
    } else {
      this.computerMoves();
      this.switchTurn();
    }
  }

  switchTurn() {
    if (this.humansTurn) {
      this.humansTurn = false;
    } else {
      this.humansTurn = true;
    }
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("+-------------------------+");
    console.log("|                         |");
    console.log("| Welcome to Tic Tac Toe! |");
    console.log("|                         |");
    console.log("+-------------------------+");
    console.log("");
  }

  displayScoreChart() {
    console.log("+-------------------------+");
    console.log("|                         |");
    console.log(`|  You: ${this.human.score} | Computer: ${this.computer.score}   |`);
    console.log("|                         |");
    console.log("+-------------------------+");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("");
    console.log("Thanks for playing Tic Tac Toe. Goodbye!");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = rl.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry that is not a valid choice.");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
    console.clear();
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;

    if (this.computerAlert(this.computer, this.human)) {
      choice = this.computerSmartMove(this.computer, this.human);
    } else if (this.computerAlert(this.human, this.computer)) {
      choice = this.computerSmartMove(this.human, this.computer);
    } else if (this.board.unusedSquares().includes(Square.MID_SQUARE_INDEX)) {
      choice = Square.MID_SQUARE_INDEX;
    } else {
      choice = this.computerRandomMove(validChoices);
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  computerAlert(twoSquarePlayer, oneSquarePlayer) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(twoSquarePlayer, row) === 2 &&
        !this.board.countMarkersFor(oneSquarePlayer, row);
    });
  }

  computerRandomMove(availableChoices) {
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!availableChoices.includes(choice));

    return choice;
  }

  computerSmartMove(twoSquarePlayer, oneSquarePlayer) {
    const ROW = TTTGame.POSSIBLE_WINNING_ROWS.find(row => {
      return this.board.countMarkersFor(twoSquarePlayer, row) === 2 &&
        !this.board.countMarkersFor(oneSquarePlayer, row);
    });

    let index = ROW.map(square => {
      return this.board.squares[square].getMarker();
    }).findIndex(sqr => sqr === Square.UNUSED_SQUARE);

    return ROW[index];
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  playAgain() {
    let answer;

    while (true) {
      answer = rl.question("Would you like to play the next round? (y/n): ").trimStart();

      if (answer.length > 0 &&
          ['y', 'ye', 'yes', 'n', 'no'].includes(answer[0].toLowerCase())) break;

      console.log("That is not a valid answer. Please answer again (y/n): ");
    }

    return answer[0].toLowerCase() === 'y';
  }

  isGameWin() {
    return [this.human.score, this.computer.score]
      .includes(TTTGame.WINNING_SCORE);
  }

  finalScore() {
    let msg;

    console.clear();
    console.log("+-------------------------+");
    console.log("|                         |");
    console.log(`|       Final Score       |`);
    console.log(`|  You: ${this.human.score} | Computer: ${this.computer.score}   |`);
    console.log("|                         |");
    console.log("+-------------------------+");
    console.log("");

    if (this.human.score > this.computer.score) {
      msg = "Congratulations! You won the match!";
    } else if (this.human.score < this.computer.score) {
      msg = "Computer won! Better luck next time!";
    } else {
      msg = "It's a tie! Better luck next time!";
    }

    console.log(msg);
  }

  resetBoard() {
    this.board = new Board();
  }
}

let game = new TTTGame();
game.play();