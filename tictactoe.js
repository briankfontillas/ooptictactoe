class Board {
  constructor() {

  }
}

class Square {
  constructor() {

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
  constructor() {

  }

  mark() {

  }

  play() {

  }
}

class Human extends Player {
  constructor() {

  }
}

class Computer extends Player {
  constructor() {
    
  }
}

class TTTGame {
  constructor() {

  }

  play() {
    //SPIKE
    this.displayWelcomeMessage();

    while (true) {
      this.displayBoard();

      this.firstPlayerMoves();
      if (this.gameOver()) break;

      this.secondPlayerMoves();
      if (this.gameOver()) break;
      break;
    }

    this.displayResults();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {

  }

  displayGoodbyeMessage() {

  }

  displayResults() {

  }

  displayBoard() {

  }

  firstPlayerMoves() {

  }

  secondPlayerMoves() {

  }

  gameOver() {
    //STUB
    return false;
  }
}

let game = new TTTGame();
game.play();