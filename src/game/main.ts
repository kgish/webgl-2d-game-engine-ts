/*
 * File: main.ts
 * This is the logic of our game. For now, this is very simple.
 */

// Accessing engine internal is not ideal,
// this must be resolved! (later)
import * as loop from '../engine/core/loop';

// Engine stuff
import engine from '../engine/index';
import Camera from '../engine/camera';
import { vec2 } from 'gl-matrix';
import Renderable from '../engine/renderable';

class MyGame {
    // variables for the squares
    mWhiteSq: Renderable | null = null;        // these are the Renderable objects
    mRedSq: Renderable | null = null;

    // The camera to view the scene
    mCamera: Camera | null = null;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),   // position of the camera
            20,                        // width of camera
            [ 20, 40, 600, 300 ]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([ 0.8, 0.8, 0.8, 1 ]);
        // sets the background to gray

        // Step  B: Create the Renderable objects:
        this.mWhiteSq = new engine.Renderable();
        this.mWhiteSq.setColor([ 1, 1, 1, 1 ]);
        this.mRedSq = new engine.Renderable();
        this.mRedSq.setColor([ 1, 0, 0, 1 ]);

        // Step  C: Initialize the white Renderable object: centered, 5x5, rotated
        this.mWhiteSq.getXform().setPosition(20, 60);
        this.mWhiteSq.getXform().setRotationInRad(0.2); // In Radians
        this.mWhiteSq.getXform().setSize(5, 5);

        // Step  D: Initialize the red Renderable object: centered 2x2
        this.mRedSq.getXform().setPosition(20, 60);
        this.mRedSq.getXform().setSize(2, 2);
    }


    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([ 0.9, 0.9, 0.9, 1.0 ]); // clear to light gray

        if (this.mCamera) {
            // Step  B: Activate the drawing Camera
            this.mCamera.setViewAndCameraMatrix();

            // Step  C: Activate the white shader to draw
            this.mWhiteSq?.draw(this.mCamera);

            // Step  D: Activate the red shader to draw
            this.mRedSq?.draw(this.mCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the white square and pulse the red
        const deltaX = 0.05;

        // Step A: Rotate the white square
        const whiteXform = this.mWhiteSq?.getXform();
        if (whiteXform) {
            if (whiteXform.getXPos() > 30) // this is the right-bound of the window
                whiteXform.setPosition(10, 60);
            whiteXform.incXPosBy(deltaX);
            whiteXform.incRotationByDegree(1);
        }

        // Step B: pulse the red square
        const redXform = this.mRedSq?.getXform();
        if (redXform) {
            if (redXform.getWidth() > 5)
                redXform.setSize(2, 2);
            redXform.incSizeBy(0.05);
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    const myGame = new MyGame();

    // new begins the game
    loop.start(myGame);
};
