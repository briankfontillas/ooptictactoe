"use strict";
const rl = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)] = new Square();
    }
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
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }
}

class Row {
  constructor() {

  }
}

class Marker {
  constructor() {

  }
}

class Player {
  constructor(marker) {
    this.marker = marker
  }

  getMarker() {
    return this.marker;
  }

  play() {

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
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    //SPIKE
    this.displayWelcomeMessage();

    while (true) {
      this.board.display();

      this.humanMoves();
      this.board.display();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;
      break;
    }

    this.displayResults();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.log("+-------------------------+");
    console.log("|                         |");
    console.log("| Welcome to Tic Tac Toe! |");
    console.log("|                         |");
    console.log("+-------------------------+");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe. Goodbye!");
  }

  displayResults() {

  }

  humanMoves() {
    let choice;

    while (true) {
      choice = rl.question("Choose a square between 1 and 9: ");

      let integerValue = parseInt(choice, 10);
      if (integerValue >= 1 && integerValue <= 9) break;

      console.log("Sorry that is not a valid choice.")
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    console.log("compcom")
  }

  gameOver() {
    //STUB
    return false;
  }
}

let game = new TTTGame();
console.log(Square.marker);
game.play();