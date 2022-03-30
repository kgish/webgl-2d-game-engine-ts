/*
 * File: main.ts
 *
 * This is the logic of our game. For now, this is very simple.
 *
 */

// client program simple import from engine/index.js for all engine symbols
import * as engine from '../engine/index';
import { Renderable } from '../engine';

class MyGame {
    mWhiteSq: Renderable;
    mRedSq: Renderable;

    constructor(htmlCanvasID: string) {
        // Step A: Initialize the game engine
        engine.init(htmlCanvasID);

        // Step B: Create the Renderable objects:
        this.mWhiteSq = new engine.Renderable();
        this.mWhiteSq.setColor([ 1, 1, 1, 1 ]);
        this.mRedSq = new engine.Renderable();
        this.mRedSq.setColor([ 1, 0, 0, 1 ]);

        // Step C: Draw!
        engine.clearCanvas([ 0, 0.8, 0, 1 ]);  // Clear the canvas

        // Step C1: Draw Renderable objects with the white shader
        this.mWhiteSq.draw();

        // Step C2: Draw Renderable objects with the red shader
        this.mRedSq.draw();
    }
}

window.onload = function () {
    new MyGame('GLCanvas');
};
