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
import SpriteRenderable from '../engine/renderables/sprite_renderable';
import SpriteAnimateRenderable from '../engine/renderables/sprite_animate_renderable';

class MyGame extends engine.Scene {
    // textures:
    // kPortal = 'assets/minion_portal.png';      // supports png with transparency
    // kCollector = 'assets/minion_collector.png';
    kFontImage = 'assets/consolas-72.png';
    kMinionSprite = 'assets/minion_sprite.png';  // Portal and Collector are embedded here

    // The camera to view the scene
    mCamera: Camera | null = null;

    // the hero and the support objects
    // mHero: Renderable | null = null;
    mHero: SpriteRenderable | null = null;
    // mPortal: Renderable | null = null;
    mPortal: SpriteRenderable | null = null;
    // mCollector: Renderable | null = null;
    mCollector: SpriteRenderable | null = null;
    mFontImage: SpriteRenderable | null = null;
    // mMinion: SpriteRenderable | null = null;
    mRightMinion: SpriteAnimateRenderable | null = null;
    mLeftMinion: SpriteAnimateRenderable | null = null;

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
        // engine.texture.load(this.kPortal);
        // engine.texture.load(this.kCollector);
        engine.texture.load(this.kFontImage);
        engine.texture.load(this.kMinionSprite);
    }

    unload() {
        // Step A: Game loop not running, unload all assets
        // stop the background audio
        // engine.audio.stopBackground();

        // unload the scene resources
        // engine.audio.unload(this.mBackgroundAudio);
        // engine.audio.unload(this.mCue);

        // Game loop not running, unload all assets
        // engine.texture.unload(this.kPortal);
        // engine.texture.unload(this.kCollector);
        engine.texture.unload(this.kFontImage);
        engine.texture.unload(this.kMinionSprite);
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
        this.mCamera.setBackgroundColor([ 0.8, 0.8, 0.8, 1 ]);
        // sets the background to gray

        // Step B: Create the game objects
        // this.mPortal = new engine.TextureRenderable(this.kPortal);
        this.mPortal = new engine.SpriteRenderable(this.kMinionSprite);
        this.mPortal.setColor([ 1, 0, 0, 0.2 ]);  // tints red
        this.mPortal.getXform().setPosition(25, 60);
        this.mPortal.getXform().setSize(3, 3);
        this.mPortal.setElementPixelPositions(130, 310, 0, 180);

        // this.mCollector = new engine.TextureRenderable(this.kCollector);
        this.mCollector = new engine.SpriteRenderable(this.kMinionSprite);
        this.mCollector.setColor([ 0, 0, 0, 0 ]);  // No tinting
        this.mCollector.getXform().setPosition(15, 60);
        this.mCollector.getXform().setSize(3, 3);
        this.mCollector.setElementUVCoordinate(0.308, 0.483, 0, 0.352);

        // Step C: Create the font and minion images using sprite
        this.mFontImage = new engine.SpriteRenderable(this.kFontImage);
        this.mFontImage.setColor([ 1, 1, 1, 0 ]);
        this.mFontImage.getXform().setPosition(13, 62);
        this.mFontImage.getXform().setSize(4, 4);

        // The right minion
        this.mRightMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
        this.mRightMinion.setColor([ 1, 1, 1, 0 ]);
        this.mRightMinion.getXform().setPosition(26, 56.5);
        this.mRightMinion.getXform().setSize(4, 3.2);
        this.mRightMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
        this.mRightMinion.setAnimationSpeed(50);
        // show each element for mAnimSpeed updates

        // the left minion
        this.mLeftMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
        this.mLeftMinion.setColor([ 1, 1, 1, 0 ]);
        this.mLeftMinion.getXform().setPosition(15, 56.5);
        this.mLeftMinion.getXform().setSize(4, 3.2);
        this.mLeftMinion.setSpriteSequence(348, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
            204, 164,       // width x height in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        this.mLeftMinion.setAnimationType(engine.eAnimationType.eRight);
        this.mLeftMinion.setAnimationSpeed(50);
        // show each element for mAnimSpeed updates

        // this.mMinion = new engine.SpriteRenderable(this.kMinionSprite);
        // this.mMinion.setColor([ 1, 1, 1, 0 ]);
        // this.mMinion.getXform().setPosition(26, 56);
        // this.mMinion.getXform().setSize(5, 2.5);

        // Step C: Create the hero object in blue
        // this.mHero = new engine.Renderable();
        // this.mHero.setColor([ 0, 0, 1, 1 ]);
        // this.mHero.getXform().setPosition(20, 60);
        // this.mHero.getXform().setSize(2, 3);

        // Step D: Create the hero object with texture from the lower-left corner
        this.mHero = new engine.SpriteRenderable(this.kMinionSprite);
        this.mHero.setColor([ 1, 1, 1, 0 ]);
        this.mHero.getXform().setPosition(20, 60);
        this.mHero.getXform().setSize(2, 3);
        this.mHero.setElementPixelPositions(0, 120, 0, 180);

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
            this.mCollector?.draw(this.mCamera);
            this.mHero?.draw(this.mCamera);
            this.mFontImage?.draw(this.mCamera);
            // this.mMinion?.draw(this.mCamera);
            this.mRightMinion?.draw(this.mCamera);
            this.mLeftMinion?.draw(this.mCamera);
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
                    // this.next();
                    xform.setXPos(20);
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

        // New update code for changing the sub-texture regions being shown"
        const deltaT = 0.001;

        // The font image:
        // zoom into the texture by updating texture coordinate
        // For font: zoom to the upper left corner by changing bottom right
        const texCoord = (this.mFontImage as SpriteRenderable).getElementUVCoordinateArray();
        // The 8 elements:
        //      mTexRight,  mTexTop,          // x,y of top-right
        //      mTexLeft,   mTexTop,
        //      mTexRight,  mTexBottom,
        //      mTexLeft,   mTexBottom
        let b = texCoord[engine.eTexCoordArrayIndex.eBottom] + deltaT;
        let r = texCoord[engine.eTexCoordArrayIndex.eRight] - deltaT;
        if (b > 1.0) {
            b = 0;
        }
        if (r < 0) {
            r = 1.0;
        }
        this.mFontImage?.setElementUVCoordinate(
            texCoord[engine.eTexCoordArrayIndex.eLeft],
            r,
            b,
            texCoord[engine.eTexCoordArrayIndex.eTop]
        );
        //

        // // The minion image:
        // // For minion: zoom to the bottom right corner by changing top left
        // texCoord = this.mMinion?.getElementUVCoordinateArray() || [ 0, 0, 0, 0 ];
        // // The 8 elements:
        // //      mTexRight,  mTexTop,          // x,y of top-right
        // //      mTexLeft,   mTexTop,
        // //      mTexRight,  mTexBottom,
        // //      mTexLeft,   mTexBottom
        // let t = texCoord[engine.eTexCoordArrayIndex.eTop] - deltaT;
        // let l = texCoord[engine.eTexCoordArrayIndex.eLeft] + deltaT;
        //
        // if (l > 0.5) {
        //     l = 0;
        // }
        // if (t < 0.5) {
        //     t = 1.0;
        // }
        //
        // this.mMinion?.setElementUVCoordinate(
        //     l,
        //     texCoord[engine.eTexCoordArrayIndex.eRight],
        //     texCoord[engine.eTexCoordArrayIndex.eBottom],
        //     t
        // );

        // New code for controlling the sprite animation
        // controlling the sprite animation:
        // remember to update the minion's animation
        if (this.mRightMinion && this.mLeftMinion) {
            this.mRightMinion.updateAnimation();
            this.mLeftMinion.updateAnimation();

            // Animate left on the sprite sheet
            if (engine.input.isKeyClicked(engine.input.keys.One)) {
                this.mRightMinion.setAnimationType(engine.eAnimationType.eLeft);
                this.mLeftMinion.setAnimationType(engine.eAnimationType.eLeft);
            }

            // swing animation
            if (engine.input.isKeyClicked(engine.input.keys.Two)) {
                this.mRightMinion.setAnimationType(engine.eAnimationType.eSwing);
                this.mLeftMinion.setAnimationType(engine.eAnimationType.eSwing);
            }

            // Animate right on the sprite sheet
            if (engine.input.isKeyClicked(engine.input.keys.Three)) {
                this.mRightMinion.setAnimationType(engine.eAnimationType.eRight);
                this.mLeftMinion.setAnimationType(engine.eAnimationType.eRight);
            }

            // decrease the duration of showing each sprite element, thereby speeding up the animation
            if (engine.input.isKeyClicked(engine.input.keys.Four)) {
                this.mRightMinion.incAnimationSpeed(-2);
                this.mLeftMinion.incAnimationSpeed(-2);
            }

            // increase the duration of showing each sprite element, thereby slowing down the animation
            if (engine.input.isKeyClicked(engine.input.keys.Five)) {
                this.mRightMinion.incAnimationSpeed(2);
                this.mLeftMinion.incAnimationSpeed(2);
            }
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
