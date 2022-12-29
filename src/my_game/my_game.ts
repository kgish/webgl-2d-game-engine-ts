/*
 * File: my_game.ts
 *
 * This is the logic of our game. For now, this is very simple.
 */

import { vec2 } from 'gl-matrix';

// Engine stuff
import engine from '../engine/index';

// Local stuff
import BlueLevel from './blue_level';
import Camera from '../engine/camera';
import Renderable from '../engine/renderables/renderable';

class MyGame extends engine.Scene {
    // textures:
    kPortal = 'assets/minion_portal.png';      // supports png with transparency
    kCollector = 'assets/minion_collector.png';

    // The camera to view the scene
    mCamera: Camera | null = null;

    // the hero and the support objects
    mHero: Renderable | null = null;
    mPortal: Renderable | null = null;
    mCollector: Renderable | null = null;

    // audio clips: supports both mp3 and wav formats
    // mBackgroundAudio = 'assets/sounds/bg_clip.mp3';
    // mCue = 'assets/sounds/my_game_cue.wav';

    constructor() {
        super();
    }

    load() {
        // loads the audios
        // engine.audio.load(this.mBackgroundAudio);
        // engine.audio.load(this.mCue);

        // loads the textures
        engine.texture.load(this.kPortal);
        engine.texture.load(this.kCollector);
    }

    unload() {
        // Step A: Game loop not running, unload all assets
        // stop the background audio
        // engine.audio.stopBackground();

        // unload the scene resources
        // engine.audio.unload(this.mBackgroundAudio);
        // engine.audio.unload(this.mCue);

        // Game loop not running, unload all assets
        engine.texture.unload(this.kPortal);
        engine.texture.unload(this.kCollector);
    }

    next() {
        super.next();  // this must be called!

        // Starts the next level
        const nextLevel = new BlueLevel();  // next level to be loaded
        nextLevel.start();
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(20, 60),         // position of the camera
            20,                      // width of camera
            [ 20, 40, 600, 300 ] // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([ 0.8, 0.8, 0.8, 1 ]); // sets the background to gray

        // Step B: Create the game objects
        this.mPortal = new engine.TextureRenderable(this.kPortal);
        this.mPortal.setColor([ 1, 0, 0, 0.2 ]);  // tints red
        this.mPortal.getXform().setPosition(25, 60);
        this.mPortal.getXform().setSize(3, 3);

        this.mCollector = new engine.TextureRenderable(this.kCollector);
        this.mCollector.setColor([ 0, 0, 0, 0 ]);  // No tinting
        this.mCollector.getXform().setPosition(15, 60);
        this.mCollector.getXform().setSize(3, 3);

        // Step C: Create the hero object in blue
        this.mHero = new engine.Renderable();
        this.mHero.setColor([ 0, 0, 1, 1 ]);
        this.mHero.getXform().setPosition(20, 60);
        this.mHero.getXform().setSize(2, 3);

        // now start the Background music ...
        // engine.audio.playBackground(this.mBackgroundAudio, 1.0);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([ 0.9, 0.9, 0.9, 1.0 ]); // clear to light gray

        if (this.mCamera) {
            // Step  B: Activate the drawing Camera
            this.mCamera.setViewAndCameraMatrix();

            // Step  C: draw everything
            this.mPortal?.draw(this.mCamera);
            this.mHero?.draw(this.mCamera);
            this.mCollector?.draw(this.mCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // let's only allow the movement of hero,
        // and if hero moves too far off, this level ends, we will
        // load the next level
        const deltaX = 0.05;
        const xform = this.mHero?.getXform();

        if (xform) {
            // Support hero movements
            if (engine.input.isKeyPressed(engine.input.keys.Right)) {
                // engine.audio.playCue(this.mCue, 0.5);
                // engine.audio.incBackgroundVolume(0.05);
                xform.incXPosBy(deltaX);
                if (xform.getXPos() > 30) { // this is the right-bound of the window
                    xform.setPosition(12, 60);
                }
            }

            if (engine.input.isKeyPressed(engine.input.keys.Left)) {
                // engine.audio.playCue(this.mCue, 1.5);
                // engine.audio.incBackgroundVolume(-0.05);
                xform.incXPosBy(-deltaX);
                if (xform.getXPos() < 11) {  // this is the left-bound of the window
                    this.next();
                }
            }
        }

        // continuously change texture tinting
        const c = this.mPortal?.getColor();
        if (c) {
            let ca = c[3] + deltaX;
            if (ca > 1) {
                ca = 0;
            }
            c[3] = ca;
        }

        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();  // Quit the game

    }
}

export default MyGame;

window.addEventListener('load', () => {
    engine.init("GLCanvas");

    const myGame = new MyGame();
    myGame.start();
});
