// Create Input System
// KEYDOWN is a global that contains the last key pressed
// KEYUP is a global that contains the last key that was stopped being pressed
// HORIZONTALINPUT will be 1, 0, or -1  based on A or D pressed
// VERTICALINPUT will be 1, 0, or -1  based on W or S pressed


let RIGHT = 0;
let LEFT = 0;
let UP = 0;
let DOWN = 0;

document.addEventListener('keydown', (event) => {
	const keyName = event.key;

	// Left and Right
	if (keyName === 'a') {
		LEFT = 1;
	}
	if (keyName === 'd') {
		RIGHT = 1;
	}
	if (RIGHT) {
		HORIZONTALINPUT = 1;
	}
	if (LEFT) {
		HORIZONTALINPUT = -1;
	}

	// Up and Down
	if (keyName === 'w') {
		UP = 1;
	}
	if (keyName === 's') {
		DOWN = 1;
	}
	if (UP) {
		VERTICALINPUT = 1;
	}
	if (DOWN) {
		VERTICALINPUT = -1;
	}

	KEYDOWN = keyName;

}, false);

document.addEventListener('keyup', (event) => {
	const keyName = event.key;

	// Left and Right
	if (keyName === 'a') {
		LEFT = HORIZONTALINPUT = 0;
		if (RIGHT) {
			HORIZONTALINPUT = 1;
		}
	}
	if (keyName === 'd') {
		RIGHT = HORIZONTALINPUT = 0;
		if (LEFT) {
			HORIZONTALINPUT = -1;
		}
	}

	// Up and Down
	if (keyName === 'w') {
		UP = VERTICALINPUT = 0;
		if (DOWN) {
			VERTICALINPUT = -1;
		}
	}
	if (keyName === 's') {
		DOWN = VERTICALINPUT = 0;
		if (UP) {
			VERTICALINPUT = 1;
		}
	}

	KEYUP = keyName;

}, false);