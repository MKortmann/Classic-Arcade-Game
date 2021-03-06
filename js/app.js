"use strict";
/**
 * The code is composed and written in the order below:
 * PART 1: SETUP CREATE CLASSES:
 * oTimer: literal object used to display the time
 * Enemy: class enemy responsible to create enemies objects.
 * Player: class implement the player object.
 * Game: class responsible to create the amount of numbers of enemies,
 * enemy speed, checkCollisions, throw items/gems, draw animations.
 * Gems: class items create different items objects.
 * PART 2: INITIALIZATION/CREATE OBJECTS:
 * We have global variables resonsible for musics, create objects (enemies, players),
 * start timer, set background status, function track keys
 * PART 3: GAME EXTRA INTERACTION (BUTTONS, ZOOM IN...)
 * In the end you have a simple implementation for the HTML elements as
 * buttons: easier, easy, medium, joystick...
 * @summary Classic Arcade Game concise functionality description.
 */
/** PART 1: SETUP CREATE CLASSES:*/
/**
 * Creates a new timer to track the
 * game elapsed time.
 * I could also use the time already in engine.js
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
			val.textContent = Math.floor(oTimer.timeElapsedSec / 60);
		});
		document.querySelectorAll(".span-timer-s").forEach(function(val) {
			val.textContent = oTimer.timeElapsedSec - (Math.floor(oTimer.timeElapsedSec / 60) * 60);
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
		return string_min + string_sec;
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
		if (counter % 2 == 0) {
			this.sprite = new Array("images/enemy-bug-2.png", "images/enemy-bug-21.png");
		} else {
			this.sprite = new Array("images/enemy-bug.png", "images/enemy-bug-11.png");
		}
		counter++;

		this.x = x;
		this.y = y;
		/**They start at diferent but fixed y positions. The fixed y positions helps
    later when checking about collisions!*/
		this.arrayStartY = new Array(42, 126, 210, 294, 378, 462, 546, 630, 714, 798);

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
		if (oTimer.elapsedTotalTime % 3 == 0) {
			ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y);
		} else {
			ctx.drawImage(Resources.get(this.sprite[1]), this.x, this.y);
		}

		this.drawText();
	}
	/**Using the canvas to show some nice features!*/
	drawText() {
		ctx.font = "26pt Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		let variable = oTimer.displayTimerCanvas() + "  Score: " + oGame.moviments;
		ctx.fillText(variable, 355, 1200);
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 1;
		ctx.strokeText(variable, 355, 1200);
	}
}
/**
 * Creates a player class.
 * You can restart it with different players.
 * @class
 */
class Player {
	/**It started at the middle bottom!*/
	constructor(x = 303, y = 990, figure = "char-boy.png") {
		this.sprite = "images/" + figure;
		this.x = x;
		this.y = y;
		/**very important variable to avoid to open the side-win many times!*/
		this.loop = true;
	}
	/**The same as constructor however you do not need to delete it.*/
	restart(x = 303, y = 990, figure = "char-boy.png") {
		this.sprite = "images/" + figure;
		this.x = x;
		this.y = y;
	}
	win() {
		clearTimeout(oTimer.elapsedTimer);
		/*it should play it only one time!*/
		this.loop = false;
		win.play();
		/*Deactivate the keyboard: because the user have to click with
		the mouse to avoid going out from the winMenu!*/
		document.removeEventListener('keyup', gKeys, true);
		document.getElementById("id-sidenav-1").classList.toggle("open");
	}
	/**If it reaches the water*/
	update() {
		if (this.y <= 35 && this.loop) {
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
		this.loop = true;
		if (restartMusic.paused) {
			restartMusic.play();
		}
		this.x = 303;
		this.y = 990;
		clearTimeout(oTimer.elapsedTimer);
		oTimer.startTimer();
		oGame.moviments = 0;
		/**deleting the items*/
		allItems.forEach(function(item) {
			allItems.pop();
		});
		/**throwing items on canvas again*/
		oGame.throwItems();
		/*reactivate the keyboard!*/
		document.addEventListener('keyup', gKeys, true);
	}
	/**Check the keys! Keep the player in the canvas element!*/
	handleInput(key) {
		switch (key) {
			case "up":
				/*Recall that the player cannot move off screen*/
				this.y >= 42 ? this.y = this.y - 84 : " ";
				oGame.moviments++;
				this.update();

				if (audioB.paused) {
					audioB.play();
				}
				if (audioWalk.paused) {
					audioWalk.play();
				}
				break;
			case "down":
				this.y <= 950 ? this.y = this.y + 84 : "";
				oGame.moviments++;
				this.update();
				if (audioWalk.paused) {
					audioWalk.play();
				}
				break;
			case "left":
				this.x >= 50 ? this.x = this.x - 101 : "";
				oGame.moviments++;
				this.update();
				if (audioWalk.paused) {
					audioWalk.play();
				}
				break;
			case "right":
				this.x <= 505 ? this.x = this.x + 101 : "";
				oGame.moviments++;
				this.update();
				if (audioWalk.paused) {
					audioWalk.play();
				}
				break;
		}
	}
}

/**
 * Creates a player class.
 * You can restart it with different players.
 * @class
 *
 *Create the amount number of enemies with different start location,
 *different speed and add it to the allEnemies array.*/
class Game {

	constructor() {
		this.moviments = 0;
		this.flag = false;
		this.timer = 0;
		/**These are the start coordinates to determine where it starts the text
		animations!!!*/
		this.startY = 70;
		this.startYSecond = 900;
		this.startXAmazing = 355;
		this.startXAmazing2 = 355;
		this.arrayXPrincess = new Array(0, 101, 202, 303, 404, 505, 606);
		this.randomNumberX = 0;
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
		while (allEnemies.length > number) {
			allEnemies.pop();
		}
	}
	/**Used to check collissions between player & enemies & items*/
	checkCollisions() {
		allEnemies.forEach(function(enemy) {
			/*The player and the enemy should have in a difference
			of at maximum of 73! And have the same y coordinates.*/
			if ((Math.abs(player.x - enemy.x) < 70) && (Math.abs(player.y - enemy.y) <= 25)) {
				player.reset();
			}
		});

		allItems.forEach(function(item, num) {
			if ((Math.abs(player.x - item.x) == 10) && (Math.abs(player.y - item.y) == 40)) {
				/**Problems with iphone or smartphone. Sometimes it play and sometimes not.
				I am trying to see if this code below helps */
				if (itemMusic.paused) {
					itemMusic.play();
				} else {
					itemMusic.pause();
				}
				oGame.moviments = oGame.moviments + 50;
				allItems.splice(num, 1);
				oGame.flag = true;
				oGame.timer = oTimer.timeElapsedSec;
				oGame.startY = 70;
				oGame.startYSecond = 900;
				oGame.startXAmazing = 355;
				oGame.startXAmazing2 = 355;
				oGame.randomNumberX = Math.floor(Math.random() * oGame.arrayXPrincess.length);
			}
		});

		if (this.flag) {
			this.drawTextPoint();
			/**The draw stays 1 second on the screen!*/
			if (this.timer + 1 < oTimer.timeElapsedSec) {
				this.flag = false;
			}
		}

	}

	drawTextPoint() {
		ctx.font = "58pt Impact";
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		let variable1 = "!!!Congratulations!!!";
		let variable2 = "!!!Amazing!!!";
		let variable3 = "!!!More 50 Points!!!";

		ctx.fillText(variable1, 355, this.startY++);
		ctx.fillText(variable2, this.startXAmazing++, 470);
		ctx.fillText(variable3, 355, this.startYSecond--);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 3;
		ctx.strokeText(variable1, 355, this.startY);
		ctx.strokeText(variable2, this.startXAmazing2--, 470);
		ctx.strokeText(variable3, 355, this.startYSecond);

		/**Show the princess in the castel*/
		/**Creating the Princess Player*/
		ctx.drawImage(Resources.get(playerPrincess.sprite), this.arrayXPrincess[oGame.randomNumberX], playerPrincess.y);
	}

	throwItems(numbers = 7) {
		let sprite = new Array("images/GemBlue.png", "images/Heart.png", "images/Key.png",
			"images/Rock.png", "images/Star.png", "images/Selector.png", "images/GemGreen.png", "images/GemOrange.png");

		let arrayStartY = new Array(106, 190, 274, 358, 442, 526, 610, 694, 778, 862);
		let arrayStartX = new Array(10, 111, 212, 313, 414, 515, 616);
		/**Do not throw more items if there is already items on screen!*/
		if (numbers > allItems.length) {

			for (let i = 0; i < numbers; i++) {
				/**Calculate the random y position!*/
				let randomNumberY = Math.floor(Math.random() * arrayStartY.length);
				let y = arrayStartY[randomNumberY];
				/**Calculate the random x position!*/
				let randomNumberX = Math.floor(Math.random() * arrayStartX.length);
				let x = arrayStartX[randomNumberX];
				/*Random figure from array*/
				let randomNumberF = Math.floor(Math.random() * sprite.length);
				let oGem = new Gems(x, y, sprite[randomNumberF]);
				allItems.push(oGem);
			};
		}
	}
}
/**
 * Creates a Gem class.
 * You can create different object items
 * @class
 *
 **/
class Gems {
	/**We have here start position (x,y) and standard speed factor*/
	constructor(x = -120, y = 200, figure = "images/GemBlue.png") {
		/**A sprite image is simply a single image files
		which has multiple drawings within that single
		image*/
		this.sprite = figure;
		this.x = x;
		this.y = y;
	}
	/** Draw the enemy on the screen*/
	render() {
		/**nice to see is that after this.y, you could automatically rescale
		the image writing the width and the height in pixels*/
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
	}
}

/* PART 2: INITIALIZATION/CREATE OBJECTS:*/
/**Global variables:*/

var allEnemies = [];
let allItems = [];

/**counter: for enemies! It is used in the Enemy constructor to distribute the
enemy-bug and enemy-bug2 equally in the canvas! They have different design.*/
let counter = 0;

/*Audios*/
let audioB = document.querySelector(".music-background");
let audioWalk = document.querySelector("#walk");
let winGame = document.querySelector("#win");
let itemMusic = document.querySelector("#gem");
let restartMusic = document.querySelector("#restart");

/**Global objects:*/
let oGame = new Game;
/**throwItems*/
oGame.throwItems(6);
/**Start at easier level with 3 enemies*/
oGame.enemies(4);
/**Creating the Player*/
let player = new Player();
/**Creating the Princess Player*/
let playerPrincess = new Player(100, -5, "char-pink-girl.png");
/**Start Timer*/
oTimer.startTimer();
/**Start at easy level, let the button highlighted to indicate
the state of the game*/
document.querySelector("#easier").style.background = "#39F";

/**Music Background*/
const audio = document.querySelector(".music-background");

/* PART 3: GAME EXTRA INTERACTION (BUTTONS, ZOOM IN...)*/
/**Joystick for smartphone, tablet...*/
document.querySelector("#grid-container").addEventListener("click", clickKeys, true);
/** FOR JOYSTICK: This listens for key presses and sends the keys to your
 Player.handleInput() method. */
function clickKeys(evt) {
	let allowedClicks = {
		"arrow_back": 'left',
		"arrow_upward": 'up',
		"arrow_forward": 'right',
		"arrow_downward": 'down'
	};
	player.handleInput(allowedClicks[evt.target.textContent]);
}

/** FOR KEYBOARD: This listens for key presses and sends the keys to your
 Player.handleInput() method. */
function gKeys(evt) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	player.handleInput(allowedKeys[evt.keyCode]);
}

document.addEventListener('keyup', gKeys, true);

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
	const string = evt.target.id + ".png";
	/**restart the Player*/
	player.restart(303, 990, string);
});
/**Joystick On-Off*/
document.querySelector(".joystick").addEventListener("click", function() {
	document.querySelector("#grid-container").classList.toggle("display");
}, false);
/**Buttons to restart the game with different levels:*/

document.querySelector("#container-buttons").addEventListener("click", function(evt) {
	/**Checking*/
	switch (evt.target.id) {
		case "easier":
			oGame.enemies(4);
			player.reset();
			/**Indicate the background button colors*/
			document.querySelector("#easier").style.background = "#39F";
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#normal").style.background = "white";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#harder").style.background = "white";
			break;
		case "easy":
			oGame.enemies(6);
			player.reset();
			/**Indicate the background*/
			document.querySelector("#easier").style.background = "white";
			document.querySelector("#easy").style.background = "#39F";
			document.querySelector("#normal").style.background = "white";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#harder").style.background = "white";
			break;
		case "normal":
			oGame.enemies(9);
			player.reset();
			document.querySelector("#easier").style.background = "white";
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#normal").style.background = "#39F";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#harder").style.background = "white";
			break;
		case "hard":
			oGame.enemies(12);
			player.reset();
			document.querySelector("#easier").style.background = "white";
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#normal").style.background = "white";
			document.querySelector("#hard").style.background = "#39F";
			document.querySelector("#harder").style.background = "white";
			break;
		case "harder":
			oGame.enemies(17);
			player.reset();
			document.querySelector("#easier").style.background = "white";
			document.querySelector("#easy").style.background = "white";
			document.querySelector("#normal").style.background = "white";
			document.querySelector("#hard").style.background = "white";
			document.querySelector("#harder").style.background = "#39F";
			break;
	}
});
