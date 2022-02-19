import * as engine from '../engine/core';

class Game {
    constructor(canvasId: string) {
        engine.init(canvasId);
        engine.clearCanvas([0, 0.8, 0, 1]);
        engine.drawSquare([1, 0, 0, 1]);
    }
}

window.onload = function () {
    new Game('GLCanvas');
};
