// Enemies our player must avoid

class Enemy {
    constructor(x = -120, y = 200) {
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
    this.speedBug = 7;
    this.arrayStartY = new Array (60, 145, 230, 315, 390, 465);
    this.arrayCompareY = new Array();


  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    const speed = Math.floor(Math.random() * this.speedBug);

    this.x = this.x + speed * Math.random() * 2.5;

    if(this.x >= 707) {
      this.x = -120;
      let randomNumber = Math.floor(Math.random() * this.arrayStartY.length);
      this.y = this.arrayStartY[randomNumber];
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    window.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(x = 303, y = 660) {

    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;

  }

  update() {

  }
  render() {
    window.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.y <= 50 ? this.reset() : " ";
  }
  reset() {
    this.x = 303;
    this.y = 660;
  }
  handleInput(key) {

    switch(key) {

      case "up":
        /*Recall that the player cannot move off screen*/
        this.y >= 60 ? this.y = this.y - 84 : " ";
        break;

      case "down":
        this.y <= 600 ? this.y = this.y + 84 : "";
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

player = new Player();
enemy = new Enemy(-120,60);
enemy2 = new Enemy(-120,145);
enemy3 = new Enemy(-120,230);


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies.push(enemy);
allEnemies.push(enemy2);
allEnemies.push(enemy3);


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
