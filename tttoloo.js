"use strict";
const rl = require("readline-sync");

let Square = {
  UNUSED_SQUARE:   " ",
  HUMAN_MARKER:    "X",
  COMPUTER_MARKER: "O",

  init(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
    return this;
  },

  toString() {
    return this.marker;
  },

  setMarker(marker) {
    this.marker = marker;
  },

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  },

  getMarker() {
    return this.marker;
  },
};

let square = Object.create(Square).init();

let Board = {
  init() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)] = Object.create(Square).init();
    }

    return this;
  },

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("");
    this.display();
  },

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
  },

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  },

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  },

  isFull() {
    return this.unusedSquares().length === 0;
  },

  countMerkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
};

const PlayerPrototype = {
  inititalize(marker) {
    this.marker = marker;
    return this;
  },

  getMarker() {
    return this.marker;
  }
}

let Human = Object.create(PlayerPrototype);
Human.init = function() {
  return this.inititalize(square.HUMAN_MARKER);
}

let Computer = Object.create(PlayerPrototype);
Computer.init = function() {
  return this.inititalize(square.COMPUTER_MARKER);
}

let TTTGame = {
  POSSIBLE_WINNING_ROWS: [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ]             // diagonal: bottom-left to top-right
  ],

  init() {
    this.board = Object.create(Board).init();
    this.human = Object.create(Human).init();
    this.computer = Object.create(Computer).init();
    return this;
  },

  play() {
    this.displayWelcomeMessage();

    this.board.display();
    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.displayWithClear();
    }

    this.board.displayWithClear();
    this.displayResults();
    this.displayGoodbyeMessage();
  },

  displayWelcomeMessage() {
    console.clear();
    console.log("+-------------------------+");
    console.log("|                         |");
    console.log("| Welcome to Tic Tac Toe! |");
    console.log("|                         |");
    console.log("+-------------------------+");
    console.log("");
  },

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe. Goodbye!");
  },

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  },

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${validChoices.join(", ")}): `;
      choice = rl.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry that is not a valid choice.");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
    console.clear();
  },

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    this.board.markSquareAt(choice, this.computer.getMarker());
  },

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  },

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  },

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMerkersFor(player, row) === 3;
    });
  },
};

let game = Object.create(TTTGame).init();
game.play();