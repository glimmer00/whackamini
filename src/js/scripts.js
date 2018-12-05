class WhackAMini {
  constructor (startButton, resetButton, minis, scoreCounter, alertContainer) {
    // Setup HTML elements
    this.btnStart = startButton;
    this.btnReset = resetButton;
    this.minis = minis;
    this.scoreCounter = scoreCounter;
    this.alertContainer = alertContainer;
    // Setup Images
    this.miniImgSrc = '../images/mini-cooper.png';
    this.miniBonkedImg = new Image();
    this.miniBonkedImg.src = '../images/mini-cooper-clicked.png';
    // Setup misc game variables
    this.prevMiniNumber = null;
    this.timeUp = false;
    this.score = 0;
    this.gameTimer = null;
    this.peekTimer = null;
  }

  init () {
    // Fiddle with the DOM a bit and give the user visual queues
    this.alertContainer.innerHTML = '<h2>Game Started</h2>';
    this.alertContainer.classList.remove('game-over');
    this.alertContainer.classList.add('game-started');
    // Setup all the intial game settings
    this.score = 0;
    this.scoreCounter.innerHTML = this.score;
    this.timeUp = false;
    this.prevMiniNumber = null;
    // Start peeking the minis
    this.peek();
    this.gameTimer = setTimeout(() => {
      // When the game finishes give the user more visual queues
      this.alertContainer.innerHTML = '<h2>Game Over</h2>';
      this.alertContainer.classList.add('game-over');
      this.alertContainer.classList.remove('game-started');
      this.timeUp = true;
    }, 12000);
  }

  stop () {
    // Fiddle with the DOM to show user it's reset
    this.alertContainer.classList.remove('game-started');
    this.alertContainer.innerHTML = '<h2>Instructions</h2><p>Click start to begin the game</p>';
    this.timeUp = true;
    for (let i = 0; i < this.minis.length; i++) {
      if (this.minis[i].classList.contains('up')) {
        this.minis[i].classList.remove('up');
      }
    }
    clearInterval(this.peekTimer);
    clearInterval(this.gameTimer);
  }

  // Function that makes the mini peek up
  peek () {
    const time = Math.round(Math.random() * (2000 - 1000) + 1000);
    const mini = this.chooseRandomMini(this.minis);
    mini.classList.add('up');
    this.peekTimer = setTimeout(() => {
      mini.classList.remove('up');
      if (this.timeUp === false) {
        this.peek();
      }
    }, time);
  }

  // Function that handles you clicking on the mini and making it do its fun animation
  bonk (mini) {
    mini.setAttribute('src', this.miniBonkedImg.src);
    mini.classList.remove('up');
    mini.classList.add('bonked');
    setTimeout(() => {
      mini.setAttribute('src', this.miniImgSrc);
      mini.classList.remove('bonked');
    }, 300);
    this.score++;
    this.scoreCounter.innerHTML = this.score;
  }

  // Utility for choosing a random Mini to show
  chooseRandomMini (minis) {
    const idx = Math.floor(Math.random() * this.minis.length);
    const mini = this.minis[idx];
    if (idx === this.prevMiniNumber) {
      return this.chooseRandomMini(minis);
    }
    this.prevMiniNumber = idx;
    return mini;
  }
}

// Declare the elements required for the game class
const startButton = document.querySelector('#btn-start');
const resetButton = document.querySelector('#btn-reset');
const scoreCounter = document.querySelector('#score-out');
const alertContainer = document.querySelector('#alert-container');
let minis = document.getElementsByClassName('mini-pic');
minis = [...minis];

// Create new instance of the WhackAMini class
const game = new WhackAMini(startButton, resetButton, minis, scoreCounter, alertContainer);

// Game Event Handlers
game.btnStart.onclick = () => {
  // Ensure there are not any games currently running
  if (!game.alertContainer.classList.contains('game-started')) {
    game.init();
  }
};

game.btnReset.onclick = () => {
  // Verify there is in fact a game running that can be stopped
  if (game.alertContainer.classList.contains('game-started') && !game.alertContainer.classList.contains('game-over') ) {
    game.stop();
  }
};

// Attach listeners to all the minis
for (let i = 0; i < game.minis.length; i++) {
  game.minis[i].addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('bonked')) {
      return;
    }
    game.bonk(e.currentTarget);
  }, false);
}
