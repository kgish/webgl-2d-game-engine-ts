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
import Renderable from '../engine/renderables/renderable';
import Camera from '../engine/camera';

class BlueLevel extends engine.Scene {

    // scene file name
    mSceneFile = 'assets/blue_level.xml';
    // all squares
    mSqSet: Renderable[] = [];        // these are the Renderable objects

    // The camera to view the scene
    mCamera: Camera | null = null;

    // audio clips: supports both mp3 and wav formats
    mBackgroundAudio = 'assets/sounds/bg_clip.mp3';
    mCue = 'assets/sounds/blue_level_cue.wav';

    // textures: (Note: jpg does not support transparency)
    kPortal = 'assets/minion_portal.jpg';
    kCollector = 'assets/minion_collector.jpg';

    constructor() {
        super();
    }

    load() {
        // load the scene file
        engine.xml.load(this.mSceneFile);

        // load the audio files
        engine.audio.load(this.mBackgroundAudio);
        engine.audio.load(this.mCue);

        // load the texture files
        engine.texture.load(this.kPortal);
        engine.texture.load(this.kCollector);
    }

    unload() {
        // stop the background audio
        engine.audio.stopBackground();

        // unload the scene file and loaded resources
        engine.xml.unload(this.mSceneFile);
        engine.audio.unload(this.mBackgroundAudio);
        engine.audio.unload(this.mCue);

        // unload the texture files
        engine.texture.unload(this.kPortal);
        engine.texture.unload(this.kCollector);
    }

    next() {
        super.next();
        const nextLevel = new MyGame();  // load the next level
        nextLevel.start();
    }

    init() {
        const sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile) as string);

        // Step A: Read in the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Read all the squares and texture squares
        sceneParser.parseSquares(this.mSqSet);
        sceneParser.parseTextureSquares(this.mSqSet);

        // now start the Background music ...
        engine.audio.playBackground(this.mBackgroundAudio, 0.5);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        if (this.mCamera) {
            // Step B: set up the camera
            this.mCamera.setViewAndCameraMatrix();
            // Step C: draw everything with the camera
            for (let i = 0; i < this.mSqSet.length; i++) {
                this.mSqSet[i].draw(this.mCamera);
            }
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the first square
        const xform = this.mSqSet[1].getXform();
        const deltaX = 0.05;

        // Move right and swap over
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            engine.audio.playCue(this.mCue, 0.5);
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        // test for white square movement
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            engine.audio.playCue(this.mCue, 1.0);
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) { // this is the left-boundary
                this.next(); // go back to my game
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();  // Quit the game

        // continuously change texture tinting
        const c = this.mSqSet[1].getColor();
        let ca = c[3] + deltaX;
        if (ca > 1) {
            ca = 0;
        }
        c[3] = ca;
    }
}

export default BlueLevel;
