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
	timeElapsedSec: 0,
	startTimer() {
		this.timeGameStart = Date.now();
		/**We used this.elapsedTimer to stop the timer! and call
		the displayTime each second*/
		this.elapsedTimer = setInterval(this.displayTimer, 1000);
	},
	/**Calculate and display the time: used to display the time to sidenav-win*/
	displayTimer() {
		this.elapsedTotalTime = Date.now() - oTimer.timeGameStart;
		this.timeElapsedSec = Math.floor(this.elapsedTotalTime / 1000);
		this.elapsedSec = this.timeElapsedSec - (Math.floor(this.timeElapsedSec / 60) * 60);
		document.querySelectorAll(".span-timer-m").forEach(function(val) {
			val.textContent = Math.floor(this.timeElapsedSec / 60);
		});
		document.querySelectorAll(".span-timer-s").forEach(function(val) {
			val.textContent = this.timeElapsedSec - (Math.floor(this.timeElapsedSec / 60) * 60);
		});
	},
	/**Calculate and display the time for the canvas!*/
	displayTimerCanvas() {
		this.elapsedTotalTime = Date.now() - oTimer.timeGameStart;
		this.timeElapsedSec = Math.floor(this.elapsedTotalTime / 1000);
		this.elapsedSec = this.timeElapsedSec - (Math.floor(this.timeElapsedSec / 60) * 60);
		/*to be easy to read putting the results in two strings:*/
		let string_min = "Elapsed Time: " + Math.floor(this.timeElapsedSec / 60) + " min ";
		let string_sec = this.timeElapsedSec - (Math.floor(this.timeElapsedSec / 60) * 60) + " sec";
		return  string_min + string_sec;
	},
};
/**
 * Creates a new Enemy Class to create enemies
 *
 * @class
 */
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
		oGame.checkCollisions();
		/**nice to see is that after this.y, you could automatically rescale
		the image writing the width and the height in pixels*/
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		this.drawText();
	}
	/*I would like to use canvas to show some nice features!*/
	drawText() {
		ctx.font = "26pt Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		let variable = oTimer.displayTimerCanvas() + "  Moviments: " + oGame.moviments;
		ctx.fillText(variable, 355, 43);
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 1;
		ctx.strokeText(variable, 355, 43);
	}
}
/**
 * Creates a player class.
 * You can restart it with different players.
 * @class
 */
class Player {
	/**It started at the middle bottom!*/
	constructor(x = 303, y = 630, figure = "char-boy.png") {
		this.sprite = "images/" + figure;
		this.x = x;
		this.y = y;
	}
  win() {
		clearTimeout(oTimer.elapsedTimer);
    document.getElementById("id-sidenav-1").classList.toggle("open");
  }
	/**If it reaches the water*/
	update() {
    if(this.y <= 35) {
      this.win();
    }
   document.querySelectorAll(".span-moviments").forEach(function(val) {
     val.textContent = oGame.moviments;
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
		oGame.moviments = 0;
	}
	/**Check the keys! Keep the player in the canvas element!*/
	handleInput(key) {
		switch (key) {
			case "up":
				/*Recall that the player cannot move off screen*/
				this.y >= 42 ? this.y = this.y - 84 : " ";
        oGame.moviments++;
        this.update();
        break;
			case "down":
				this.y <= 610 ? this.y = this.y + 84 : "";
        oGame.moviments++;
        this.update();
        break;
			case "left":
				this.x >= 50 ? this.x = this.x - 101 : "";
        oGame.moviments++;
        this.update();
        break;
			case "right":
				this.x <= 505 ? this.x = this.x + 101 : "";
        oGame.moviments++;
        this.update();
        break;
		}
	}
}

/**
Create the amount number of enemies with different start location,
different speed and at it directly to the allEnemies array.*/
class Game {

	constructor() {
		this.moviments = 0;
	}

	enemies(number = 5) {
		/**Create the necessary amount of enemies*/
		for (let i = 1; i <= number; i++) {
			/**We have at Enemy constructor(x-position, y-position and speed)*/
			let enemy = new Enemy(-120, 60, 300 * i);
			let randomNumber = Math.floor(Math.random() * enemy.arrayStartY.length);
			let yPosition = enemy.arrayStartY[randomNumber];
			enemy.y = yPosition;
			allEnemies.push(enemy);
		}
		/**Deleting the exceed enemies*/
		while(allEnemies.length > number) {
			allEnemies.pop();
		}
	}
	checkCollisions() {
		allEnemies.forEach(function(enemy) {
			/*The player and the enemy should have in a difference
			of at maximum of 73! And have the same y coordinates.*/
			if ((Math.abs(player.x - enemy.x) < 73) && player.y === enemy.y) {
				player.reset();
			}
		});
	}
}

/**Global*/
let allEnemies = [];

oGame = new Game;
/**Five Enemies*/
oGame.enemies(3);
/**Creating the Player*/
player = new Player();
/**Start Timer*/
oTimer.startTimer();
/**Start at easy level, let the button highlighted to indicate
the state of the game*/
document.querySelector("#easy").style.background = "#39F";

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

/**Close/Open the Win-Sidenav*/
document.querySelector("#b-close-sidenav-1").addEventListener("click", function() {
  document.getElementById("id-sidenav-1").classList.toggle("open");
  /**reset the number of moviments*/
	player.reset();
});

/**Restart with diferent player*/
document.querySelector("#container-players").addEventListener("click", function(evt) {
	document.getElementById("id-sidenav-1").classList.toggle("open");
	  /**reset the number of moviments*/
		player.reset();
		delete player;
		const string = evt.target.id + ".png";
		/**Creating the Player*/
		player = new Player(303,630,string);
});
/**Buttons to restart the game with different levels:*/
/**Difficult Level Easy*/
document.querySelector("#container-buttons").addEventListener("click", function(evt) {
		/**Checking*/
		switch ( evt.target.id ) {
			case "easy":
			oGame.enemies(3);
			player.reset();
			/**Indicate the background*/
			document.querySelector("#easy").style.background = "#39F";
			document.querySelector("#moderate").style.background = "white";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#extreme").style.background = "white";
			break;
			case "moderate":
			oGame.enemies(9);
			player.reset();
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#moderate").style.background = "#39F";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#extreme").style.background = "white";
			break;
			case "hard":
			oGame.enemies(15);
			player.reset();
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#moderate").style.background = "white";
			document.querySelector("#hard").style.background = "#39F";
			document.querySelector("#extreme").style.background = "white";
			break;
			case "extreme":
			oGame.enemies(20);
			player.reset();
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#moderate").style.background = "white";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#extreme").style.background = "#39F";
			break;
			default:
			console.log("error: " + evt.target.id);
		}
});

/**Start Music Background*/
const audio = document.querySelector(".music-background");
if (audio.paused) {
	audio.play();
}
