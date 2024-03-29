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
import FontRenderable from '../engine/renderables/font_renderable';

class MyGame extends engine.Scene {
    // Textures
    kFontImage = 'assets/consolas-72.png';
    kMinionSprite = 'assets/minion_sprite.png';  // Portal and Collector are embedded here

    // Fonts
    kFontCon16 = 'assets/fonts/consolas-16';  // notice font names do not need extensions!
    kFontCon24 = 'assets/fonts/consolas-24';
    kFontCon32 = 'assets/fonts/consolas-32';  // this is also the default system font
    kFontCon72 = 'assets/fonts/consolas-72';
    kFontSeg96 = 'assets/fonts/segment7-96';

    // The camera to view the scene
    mCamera: Camera | null = null;

    // the hero and the support objects
    mHero: SpriteRenderable | null = null;
    mFontImage: SpriteRenderable | null = null;
    mMinion: SpriteAnimateRenderable | null = null;

    mTextSysFont: FontRenderable | null = null;
    mTextCon16: FontRenderable | null = null;
    mTextCon24: FontRenderable | null = null;
    mTextCon32: FontRenderable | null = null;
    mTextCon72: FontRenderable | null = null;
    mTextSeg96: FontRenderable | null = null;

    mTextToWork: FontRenderable | null = null;

    constructor() {
        super();
    }

    load() {
        // Step A: loads the textures
        engine.texture.load(this.kFontImage);
        engine.texture.load(this.kMinionSprite);

        // Step B: loads all the fonts
        engine.font.load(this.kFontCon16);
        engine.font.load(this.kFontCon24);
        engine.font.load(this.kFontCon32);
        engine.font.load(this.kFontCon72);
        engine.font.load(this.kFontSeg96);
    }

    unload() {
        // Game loop not running, unload all assets
        engine.texture.unload(this.kFontImage);
        engine.texture.unload(this.kMinionSprite);

        // unload the fonts
        engine.font.unload(this.kFontCon16);
        engine.font.unload(this.kFontCon24);
        engine.font.unload(this.kFontCon32);
        engine.font.unload(this.kFontCon72);
        engine.font.unload(this.kFontSeg96);
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
            vec2.fromValues(50, 33),         // position of the camera
            100,                      // width of camera
            [ 0, 0, 600, 400 ] // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([ 0.8, 0.8, 0.8, 1 ]);
        // sets the background to gray

        // Step B: Create the font and minion images using sprite
        this.mFontImage = new engine.SpriteRenderable(this.kFontImage);
        this.mFontImage.setColor([ 1, 1, 1, 0 ]);
        this.mFontImage.getXform().setPosition(15, 50);
        this.mFontImage.getXform().setSize(20, 20);

        // The right minion
        this.mMinion = new engine.SpriteAnimateRenderable(this.kMinionSprite);
        this.mMinion.setColor([ 1, 1, 1, 0 ]);
        this.mMinion.getXform().setPosition(15, 25);
        this.mMinion.getXform().setSize(24, 19.2);
        this.mMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,    // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mMinion.setAnimationType(engine.eAnimationType.eSwing);
        this.mMinion.setAnimationSpeed(15);
        // show each element for mAnimSpeed updates

        // Step D: Create the hero object with texture from the lower-left corner
        this.mHero = new engine.SpriteRenderable(this.kMinionSprite);
        this.mHero.setColor([ 1, 1, 1, 0 ]);
        this.mHero.getXform().setPosition(35, 50);
        this.mHero.getXform().setSize(12, 18);
        this.mHero.setElementPixelPositions(0, 120, 0, 180);

        // Create the fonts
        this.mTextSysFont = new engine.FontRenderable('System Font: in Red');
        this._initText(this.mTextSysFont, 50, 60, [ 1, 0, 0, 1 ], 3);

        this.mTextCon16 = new engine.FontRenderable('Consolas 16: in black');
        this.mTextCon16.setFontName(this.kFontCon16);
        this._initText(this.mTextCon16, 50, 55, [ 0, 0, 0, 1 ], 2);

        this.mTextCon24 = new engine.FontRenderable('Consolas 24: in black');
        this.mTextCon24.setFontName(this.kFontCon24);
        this._initText(this.mTextCon24, 50, 50, [ 0, 0, 0, 1 ], 3);

        this.mTextCon32 = new engine.FontRenderable('Consolas 32: in white');
        this.mTextCon32.setFontName(this.kFontCon32);
        this._initText(this.mTextCon32, 40, 40, [ 1, 1, 1, 1 ], 4);

        this.mTextCon72 = new engine.FontRenderable('Consolas 72: in blue');
        this.mTextCon72.setFontName(this.kFontCon72);
        this._initText(this.mTextCon72, 30, 30, [ 0, 0, 1, 1 ], 6);

        this.mTextSeg96 = new engine.FontRenderable('Segment7-92');
        this.mTextSeg96.setFontName(this.kFontSeg96);
        this._initText(this.mTextSeg96, 30, 15, [ 1, 1, 0, 1 ], 7);

        this.mTextToWork = this.mTextCon16;
    }

    _initText(font: FontRenderable, posX: number, posY: number, color: number[], text: number) {
        font.setColor(color);
        font.getXform()?.setPosition(posX, posY);
        font.setTextHeight(text);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([ 0.9, 0.9, 0.9, 1.0 ]); // clear to light gray

        if (this.mCamera) {
            // Step  B: Activate the drawing Camera
            this.mCamera.setViewAndCameraMatrix();

            // Step  C: Draw everything
            this.mHero?.draw(this.mCamera);
            this.mFontImage?.draw(this.mCamera);
            this.mMinion?.draw(this.mCamera);

            // Drawing the text output
            this.mTextSysFont?.draw(this.mCamera);
            this.mTextCon16?.draw(this.mCamera);
            this.mTextCon24?.draw(this.mCamera);
            this.mTextCon32?.draw(this.mCamera);
            this.mTextCon72?.draw(this.mCamera);
            this.mTextSeg96?.draw(this.mCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // let's only allow the movement of hero,
        const deltaX = 0.5;
        const xform = this.mHero?.getXform();

        if (!xform) {
            throw new Error('Cannot get hero xform!');
        }

        // Support hero movements
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 100) { // this is the right-bound of the window
                xform.setPosition(0, 50);
            }
        }

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 0) {  // this is the left-bound of the window
                xform.setPosition(100, 50);
            }
        }

        // New update code for changing the sub-texture regions being shown
        const deltaT = 0.001;

        // <editor-fold desc='The font image:'>
        // zoom into the texture by updating texture coordinate
        // For font: zoom to the upper left corner by changing bottom right
        if (!this.mFontImage) {
            throw new Error('Cannot get font image!');
        }

        const texCoord = this.mFontImage.getElementUVCoordinateArray();
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
        this.mFontImage.setElementUVCoordinate(
            texCoord[engine.eTexCoordArrayIndex.eLeft],
            r,
            b,
            texCoord[engine.eTexCoordArrayIndex.eTop]
        );
        //

        // remember to update this.mMinion's animation
        if (!this.mMinion) {
            throw new Error('Cannot get minion!');
        }
        this.mMinion.updateAnimation();

        // interactive control of the display size

        // choose which text to work on
        if (engine.input.isKeyClicked(engine.input.keys.Zero)) {
            this.mTextToWork = this.mTextCon16;
        }
        if (engine.input.isKeyClicked(engine.input.keys.One)) {
            this.mTextToWork = this.mTextCon24;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.mTextToWork = this.mTextCon32;
        }
        if (engine.input.isKeyClicked(engine.input.keys.Four)) {
            this.mTextToWork = this.mTextCon72;
        }
        if (!this.mTextToWork) {
            throw new Error('Cannot get text to work!');
        }

        const deltaF = 0.005;
        if (!this.mTextSysFont) {
            throw new Error('Cannot get text system font!');
        }
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            if (engine.input.isKeyPressed(engine.input.keys.X)) {
                this.mTextToWork.getXform()?.incWidthBy(deltaF);
            }
            if (engine.input.isKeyPressed(engine.input.keys.Y)) {
                this.mTextToWork.getXform()?.incHeightBy(deltaF);
            }
            this.mTextSysFont.setText(this.mTextToWork.getXform()?.getWidth().toFixed(2) + 'x' + this.mTextToWork.getXform()?.getHeight().toFixed(2));
        }

        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            if (engine.input.isKeyPressed(engine.input.keys.X)) {
                this.mTextToWork.getXform()?.incWidthBy(-deltaF);
            }
            if (engine.input.isKeyPressed(engine.input.keys.Y)) {
                this.mTextToWork.getXform()?.incHeightBy(-deltaF);
            }
            this.mTextSysFont.setText(this.mTextToWork.getXform()?.getWidth().toFixed(2) + 'x' + this.mTextToWork.getXform()?.getHeight().toFixed(2));
        }
    }
}

export default MyGame;

window.addEventListener('load', () => {
    engine.init('GLCanvas');

    const myGame = new MyGame();
    myGame.start();
});
