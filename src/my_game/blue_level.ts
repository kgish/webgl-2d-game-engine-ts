/*
 * File: blue_level.ts
 *
 * This is the logic of our game.
 */


// Engine Core stuff
import engine from '../engine/index';

// Local stuff
import MyGame from './my_game';
import SceneFileParser from './util/scene_file_parser';
import Renderable from '../engine/renderable';
import Camera from '../engine/camera';

class BlueLevel extends engine.Scene {

    // scene file name
    mSceneFile = 'assets/blue_level.xml';
    // all squares
    mSQSet: Renderable[] = [];        // these are the Renderable objects

    // The camera to view the scene
    mCamera: Camera | null = null;

    constructor() {
        super();
    }

    init() {
        const sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile) as XMLDocument);

        // Step A: Read in the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Read all the squares
        sceneParser.parseSquares(this.mSQSet);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        if (this.mCamera) {
            // Step A: set up the camera
            this.mCamera.setViewAndCameraMatrix();
            // Step B: draw everything with the camera
            let i;
            for (i = 0; i < this.mSQSet.length; i++) {
                this.mSQSet[i].draw(this.mCamera);
            }
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the first square
        const xform = this.mSQSet[1].getXform();
        const deltaX = 0.05;

        // Move right and swap over
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        // test for white square movement
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) { // this is the left-boundary
                this.next(); // go back to my game
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();  // Quit the game
    }


    next() {
        super.next();
        const nextLevel = new MyGame();  // load the next level
        nextLevel.start();
    }

    load() {
        engine.xml.load(this.mSceneFile);
    }

    unload() {
        // unload the scene flie and loaded resources
        engine.xml.unload(this.mSceneFile);
    }
}

export default BlueLevel;
