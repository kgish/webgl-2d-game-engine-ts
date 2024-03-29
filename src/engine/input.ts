/*
 * File: input.ts
 *
 * Interfaces with HTML5 to to receive keyboard events
 *
 * For a complete list of key codes, see
 * https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 */

// Key code constants
const keys = {
    // arrows
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,

    // space bar
    Space: 32,

    // numbers
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five : 53,
    Six : 54,
    Seven : 55,
    Eight : 56,
    Nine : 57,

    // Alphabets
    A : 65,
    D : 68,
    E : 69,
    F : 70,
    G : 71,
    I : 73,
    J : 74,
    K : 75,
    L : 76,
    Q : 81,
    R : 82,
    S : 83,
    T : 84,
    U : 85,
    V : 86,
    W : 87,
    X : 88,
    Y : 89,
    Z : 90,

    LastKeyCode: 222
};

// Previous key state
const mKeyPreviousState: boolean[] = []; // a new array
// The pressed keys.
const mIsKeyPressed: boolean[] = [];
// Click events: once an event is set, it will remain there until polled
const mIsKeyClicked: boolean[] = [];

// Event handler functions
function onKeyDown(event: KeyboardEvent) {
    mIsKeyPressed[event.keyCode] = true;
}

function onKeyUp(event: KeyboardEvent) {
    mIsKeyPressed[event.keyCode] = false;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function cleanUp() {
}

function init() {
    let i;
    for (i = 0; i < keys.LastKeyCode; i++) {
        mIsKeyPressed[i] = false;
        mKeyPreviousState[i] = false;
        mIsKeyClicked[i] = false;
    }

    // register handlers
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
}

function update() {
    let i;
    for (i = 0; i < keys.LastKeyCode; i++) {
        mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i];
        mKeyPreviousState[i] = mIsKeyPressed[i];
    }
}

// Function for GameEngine programmer to test if a key is pressed down
function isKeyPressed(keyCode: number) {
    return mIsKeyPressed[keyCode];
}

function isKeyClicked(keyCode: number) {
    return mIsKeyClicked[keyCode];
}

export {
    keys, init, cleanUp,
    update,
    isKeyClicked,
    isKeyPressed
};
