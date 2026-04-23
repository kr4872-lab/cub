class Dice {
  constructor() {
    this.die1 = 1;
    this.die2 = 1;
  }

  roll() {
    this.die1 = Math.floor(Math.random() * 6) + 1;
    this.die2 = Math.floor(Math.random() * 6) + 1;
  }

  getValues() {
    return {
      die1: this.die1,
      die2: this.die2,
      sum: this.die1 + this.die2
    };
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }

  hasNumber(n) {
    return this.numbers.includes(n);
  }

  removeNumber(n) {
    if (this.hasNumber(n)) {
      this.numbers = this.numbers.filter(num => num !== n);
      return true;
    }
    return false;
  }

  canPlayPair(a, b) {
    if (a === b) {
      return this.numbers.filter(n => n === a).length >= 2;
    }
    return this.hasNumber(a) && this.hasNumber(b);
  }

  canPlaySum(s) {
    return this.hasNumber(s);
  }

  hasWon() {
    return this.numbers.length === 0;
  }
}

class Game {
  constructor(playerNames) {
    this.players = playerNames.map(name => new Player(name));
    this.currentPlayerIndex = 0;
    this.dice = new Dice();
    this.winner = null;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return this.getCurrentPlayer();
  }

  getWinner() {
    return this.winner;
  }

  canCurrentPlayerMove() {
    const currentPlayer = this.getCurrentPlayer();
    const { die1, die2, sum } = this.dice.getValues();
    if (currentPlayer.canPlaySum(sum)) return true;
    if (currentPlayer.canPlayPair(die1, die2)) return true;
    return false;
  }

  rollDice() {
    this.dice.roll();
    return this.dice.getValues();
  }

  playSum() {
    const currentPlayer = this.getCurrentPlayer();
    const { sum } = this.dice.getValues();

    if (!currentPlayer.canPlaySum(sum)) {
      return { success: false, message: `Числа ${sum} нет на доске` };
    }

    currentPlayer.removeNumber(sum);

    if (currentPlayer.hasWon()) {
      this.winner = currentPlayer;
      return { success: true, winner: currentPlayer.name,
               message: `${currentPlayer.name} убрал ${sum} и победил!` };
    }

    return { success: true, message: `Убрано число ${sum}` };
  }

  playPair() {
    const currentPlayer = this.getCurrentPlayer();
    const { die1, die2 } = this.dice.getValues();

    if (!currentPlayer.canPlayPair(die1, die2)) {
      return { success: false, message: `Пары ${die1} и ${die2} нет на доске` };
    }

    currentPlayer.removeNumber(die1);
    currentPlayer.removeNumber(die2);

    if (currentPlayer.hasWon()) {
      this.winner = currentPlayer;
      return { success: true, winner: currentPlayer.name,
               message: `${currentPlayer.name} убрал ${die1} и ${die2} и победил!` };
    }

    return { success: true, message: `Убрана пара ${die1} и ${die2}` };
  }

  getGameState() {
    return {
      currentPlayer: this.getCurrentPlayer().name,
      winner: this.winner ? this.winner.name : null,
      players: this.players.map(p => ({
        name: p.name,
        remainingNumbers: [...p.numbers],
        count: p.numbers.length,
        hasWon: p.hasWon()
      })),
      lastDiceRoll: this.dice.getValues()
    };
  }
}
