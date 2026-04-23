let game = null;

const setupScreen  = document.getElementById('number-of-players');
const gameScreen   = document.getElementById('game-box');
const pCountInput  = document.getElementById('pCount');
const startBtn     = document.getElementById('startBtn');
const turnLabel    = document.getElementById('turn-label');
const statusMsg    = document.getElementById('status-msg');
const cardsDiv     = document.getElementById('cards');
const firstBtn     = document.getElementById('first');
const secondBtn    = document.getElementById('second');

const rollBtn = document.createElement('button');
rollBtn.id = 'rollBtn';
rollBtn.textContent = 'Бросить кубики';
document.querySelector('.dice-buttons').before(rollBtn);

startBtn.addEventListener('click', () => {
  const count = parseInt(pCountInput.value);
  const names = Array.from({ length: count }, (_, i) => `Игрок ${i + 1}`);

  game = new Game(names);

  setupScreen.style.display = 'none';
  gameScreen.style.display  = 'block';

  firstBtn.disabled  = true;
  secondBtn.disabled = true;

  renderAll();
});

rollBtn.addEventListener('click', () => {
  const { die1, die2, sum } = game.rollDice();

  firstBtn.textContent  = `${die1} + ${die2}`;
  secondBtn.textContent = `${sum}`;

  rollBtn.disabled = true;

  if (game.canCurrentPlayerMove()) {
    const { die1: d1, die2: d2, sum: s } = game.dice.getValues();
    firstBtn.disabled  = !game.getCurrentPlayer().canPlayPair(d1, d2);
    secondBtn.disabled = !game.getCurrentPlayer().canPlaySum(s);
    statusMsg.textContent = 'Выбери ход';
  } else {
    firstBtn.disabled  = true;
    secondBtn.disabled = true;
    statusMsg.textContent = 'Нет доступных ходов — ход пропущен';
    setTimeout(() => {
      game.nextTurn();
      nextRound();
    }, 1500);
  }
});

firstBtn.addEventListener('click', () => {
  const result = game.playPair();
  handleResult(result);
});

secondBtn.addEventListener('click', () => {
  const result = game.playSum();
  handleResult(result);
});

function handleResult(result) {
  statusMsg.textContent = result.message;
  renderAll();

  if (game.getWinner()) {
    rollBtn.disabled   = true;
    firstBtn.disabled  = true;
    secondBtn.disabled = true;
    turnLabel.textContent = ` Победил ${game.getWinner().name}!`;
    return;
  }

  game.nextTurn();
  nextRound();
}

function nextRound() {
  const state = game.getGameState();
  turnLabel.textContent = `Ход: ${state.currentPlayer}`;
  rollBtn.disabled      = false;
  firstBtn.disabled     = true;
  secondBtn.disabled    = true;
  firstBtn.textContent  = '—';
  secondBtn.textContent = '—';
  statusMsg.textContent = '';
  renderAll();
}

function renderAll() {
  const state = game.getGameState();
  cardsDiv.innerHTML = '';

  state.players.forEach(p => {
    const card = document.createElement('div');
    card.className = 'player-card';

    if (p.name === state.currentPlayer) {
      card.classList.add('active');
    }

    const title = document.createElement('h3');
    title.textContent = p.name;
    card.appendChild(title);

    for (let i = 1; i <= 12; i++) {
      const tile = document.createElement('span');
      tile.textContent = i;
      tile.className = p.remainingNumbers.includes(i) ? 'tile active-tile' : 'tile removed-tile';
      card.appendChild(tile);
    }

    cardsDiv.appendChild(card);
  });

  if (!game.getWinner()) {
    turnLabel.textContent = `Ход: ${state.currentPlayer}`;
  }
}
