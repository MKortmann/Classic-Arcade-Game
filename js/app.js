// Enemies our player must avoid

class Enemy {
    constructor(x = -120, y = 200, speed = 7) {
      // Variables applied to each of our instances go here,
      // we've provided one for you to get started

      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      /**A sprite image is simply a single image files
      which has multiple drawings within that single
      image*/
      this.sprite = 'images/enemy-bug.png';
      this.x = x;
      this.y = y;
      /**They start at diferent y positions*/
      /*this.arrayStartY = new Array (60, 145, 230, 315, 390, 465);*/
      this.arrayStartY = new Array(42, 126, 210,294,378,462);
      /**Each enemy has a different speed*/
      this.speedBug = speed;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    const speed = Math.floor(Math.random() * this.speedBug);

    /*To be more realistic: the X-speed will be not constant.*/
    this.x = this.x + speed * Math.random() * 2.5;
    /*They will start at random Y-Screen positions*/
    if(this.x >= 707) {
      this.x = -120;
      let randomNumber = Math.floor(Math.random() * this.arrayStartY.length);
      this.y = this.arrayStartY[randomNumber];
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    checkCollisions();
    window.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(x = 303, y = 630) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
  }
  update() {
    this.y <= 30 ? this.reset() : " ";
  }
  render() {
    window.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.update();
  }
  reset() {
    this.x = 303;
    this.y = 630;
  }
  handleInput(key) {

    switch(key) {

      case "up":
        /*Recall that the player cannot move off screen*/
        this.y >= 42 ? this.y = this.y - 84 : " ";
                console.log(player.y);
        break;

      case "down":
        this.y <= 610 ? this.y = this.y + 84 : "";
        break;

      case "left":
        this.x >= 50 ? this.x = this.x - 101 : "";
        break;

      case "right":
        this.x <= 505 ? this.x = this.x + 101 : "";
        break;

    }
  }

}

/**Create the amount number of enemies with different start location,
different speed and at it directly to the allEnemies array.*/
var allEnemies = [];
function enemies(number = 5) {
  for(let i = 1; i <= number; i++) {
    let enemy = new Enemy(-120, 60, 3*i);
    let randomNumber = Math.floor(Math.random() * enemy.arrayStartY.length);
    let yPosition = enemy.arrayStartY[randomNumber];
    enemy.y = yPosition;
    allEnemies.push(enemy);
  }
}
/**Five Enemies*/
enemies(10);
/**Creating the Player*/
player = new Player();

function checkCollisions() {
  allEnemies.forEach(function(enemy) {
      /*The player and the enemy should have in a difference
      of at maximum of 73! And have the same y coordinates.*/
      if( (Math.abs(player.x - enemy.x) < 73) && player.y === enemy.y ) {
        player.reset();
      }
  });

}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
