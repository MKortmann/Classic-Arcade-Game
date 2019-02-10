/**Enemy Class*/
class Enemy {
	/**We have here start position (x,y) and standard speed factor*/
	constructor(x = -120, y = 200, speed = 700) {
		/**A sprite image is simply a single image files
		which has multiple drawings within that single
		image*/
		this.sprite = "images/enemy-bug.png";
		this.x = x;
		this.y = y;
		/**They start at diferent but fixed y positions*/
		this.arrayStartY = new Array(42, 126, 210, 294, 378, 462);
		/**Each enemy has a different speed*/
		this.speedEnemy = speed;
	}
	/** Update the enemy's position, required method for game
	 Parameter: dt, a time delta between ticks*/
	update(dt) {
		/** The dt parameter will ensure the game runs at the same speed for
		 all computers.*/
		const speed = Math.floor(Math.random() * this.speedEnemy);
		/*To be more realistic: the X-speed will be not constant.*/
		this.x = this.x + Math.random() * (dt * speed);
		/**If it arrives at the end of the canvas*/
		if (this.x >= 707) {
			this.x = -120;
			/**It will restart at random y position!*/
			let randomNumber = Math.floor(Math.random() * this.arrayStartY.length);
			this.y = this.arrayStartY[randomNumber];
		}
	}
	/** Draw the enemy on the screen*/
	render() {
		/**Check if the enemy reach the player*/
		checkCollisions();
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}

/**Player Class*/
class Player {
	/**It started at the middle bottom!*/
	constructor(x = 303, y = 630) {
		this.sprite = "images/char-boy.png";
		this.x = x;
		this.y = y;
	}
  win() {
		clearTimeout(oTimer.elapsedTimer);
    document.getElementById("id-sidenav-1").classList.toggle("open");
  	this.reset();
  }
	/**If it reaches the water*/
	update() {
    if(this.y <= 30) {
      this.win();
    }
   document.querySelectorAll(".span-moviments").forEach(function(val) {
     val.textContent = moviments;
   });
	}
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		this.update();
	}
	/**Reset the player position*/
	reset() {
		this.x = 303;
		this.y = 630;
		clearTimeout(oTimer.elapsedTimer);
		oTimer.startTimer();
		moviments = 0;
	}

	/**Check the keys! Keep the player in the canvas element!*/
	handleInput(key) {
		switch (key) {
			case "up":
				/*Recall that the player cannot move off screen*/
				this.y >= 42 ? this.y = this.y - 84 : " ";
        moviments++;
        this.update();
        break;
			case "down":
				this.y <= 610 ? this.y = this.y + 84 : "";
        moviments++;
        this.update();
        break;
			case "left":
				this.x >= 50 ? this.x = this.x - 101 : "";
        moviments++;
        this.update();
        break;
			case "right":
				this.x <= 505 ? this.x = this.x + 101 : "";
        moviments++;
        this.update();
        break;
		}
	}
}
/**Create the amount number of enemies with different start location,
different speed and at it directly to the allEnemies array.*/
var allEnemies = [];
let moviments = 0;

function enemies(number = 5) {
	for (let i = 1; i <= number; i++) {
		/**We have at Enemy constructor(x-position, y-position and speed)*/
		let enemy = new Enemy(-120, 60, 300 * i);
		let randomNumber = Math.floor(Math.random() * enemy.arrayStartY.length);
		let yPosition = enemy.arrayStartY[randomNumber];
		enemy.y = yPosition;
		allEnemies.push(enemy);
	}

	while(allEnemies.length > number) {
		console.log(allEnemies.length);
		console.log(number);
		allEnemies.pop();
	}

}
/**Five Enemies*/
enemies(5);
/**Creating the Player*/
player = new Player();

function checkCollisions() {
	allEnemies.forEach(function(enemy) {
		/*The player and the enemy should have in a difference
		of at maximum of 73! And have the same y coordinates.*/
		if ((Math.abs(player.x - enemy.x) < 73) && player.y === enemy.y) {
			player.reset();
		}
	});
}

/** This listens for key presses and sends the keys to your
 Player.handleInput() method. */
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	player.handleInput(allowedKeys[e.keyCode]);
});

/**Close the Win-Sidenav*/
document.querySelector("#b-close-sidenav-1").addEventListener("click", function() {
  document.getElementById("id-sidenav-1").classList.toggle("open");
  /**reset the number of moviments*/
  moviments = 0;
  oTimer.startTimer();
});

/**
 * Creates a new timer to track the
 * game elapsed time.
 * @class
 */
let oTimer = {
	timeNow: 0,
	timeGameStart: 0,
	elapsedTotalTime: 0,
	elapsedTimer: 0,
	startTimer() {
		this.timeGameStart = Date.now();
		/**We used this.elapsedTimer to stop the timer! and call
		the displayTime each second*/
		this.elapsedTimer = setInterval(this.displayTimer, 1000);
	},
	/**Calculate and display the time*/
	displayTimer() {
		this.elapsedTotalTime = Date.now() - oTimer.timeGameStart;
		let timeElapsedSec = Math.floor(this.elapsedTotalTime / 1000);
		this.elapsedSec = timeElapsedSec - (Math.floor(timeElapsedSec / 60) * 60);
		document.querySelectorAll(".span-timer-m").forEach(function(val) {
			val.textContent = Math.floor(timeElapsedSec / 60);
		});
		document.querySelectorAll(".span-timer-s").forEach(function(val) {
			val.textContent = timeElapsedSec - (Math.floor(timeElapsedSec / 60) * 60);
		});
	},
};

oTimer.startTimer();
document.querySelector("#easy").style.background = "red";

/**Difficult Level Easy*/
document.querySelector("#easy").addEventListener("click", function() {
	enemies(5);
  /**reset the number of moviments*/
  moviments = 0;
  oTimer.startTimer();
	player.reset();
	/**Indicate the background*/
	document.querySelector("#easy").style.background = "red";
	document.querySelector("#moderate").style.background = "white";
	document.querySelector("#hard").style.background = "white";
	document.querySelector("#extreme").style.background = "white";
});
/**Difficult Level Moderate*/
document.querySelector("#moderate").addEventListener("click", function() {
	enemies(9);
  /**reset the number of moviments*/
  moviments = 0;
  oTimer.startTimer();
	player.reset();
	document.querySelector("#easy").style.background = "white";
	document.querySelector("#moderate").style.background = "red";
	document.querySelector("#hard").style.background = "white";
		document.querySelector("#extreme").style.background = "white";
});
/**Difficult Level Hard*/
document.querySelector("#hard").addEventListener("click", function() {
	enemies(15);
  /**reset the number of moviments*/
  moviments = 0;
  oTimer.startTimer();
	player.reset();
	document.querySelector("#easy").style.background = "white";
	document.querySelector("#moderate").style.background = "white";
	document.querySelector("#hard").style.background = "red";
		document.querySelector("#extreme").style.background = "white";
});
/**Difficult Level Hard*/
document.querySelector("#extreme").addEventListener("click", function() {
	enemies(20);
  /**reset the number of moviments*/
  moviments = 0;
  oTimer.startTimer();
	player.reset();
	document.querySelector("#easy").style.background = "white";
	document.querySelector("#moderate").style.background = "white";
	document.querySelector("#hard").style.background = "white";
		document.querySelector("#extreme").style.background = "red";
});
