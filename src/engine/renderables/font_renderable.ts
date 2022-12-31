/*
 * File: font_renderable.ts
 *
 * Supports the drawing of a string based on a selected Font.
 *
 */

import Transform from '../transform.js';
import SpriteRenderable from './sprite_renderable.js';
import * as defaultResources from '../resources/default_resources.js';
import * as font from '../resources/font.js';
import Camera from '../camera';

class FontRenderable {
    mFontName: string | null = null;
    mOneChar: SpriteRenderable | null = null;
    mXform: Transform | null = null;
    mText: string | null = null;

    constructor(aString: string) {
        this.mFontName = defaultResources.getDefaultFontName();
        this.mOneChar = new SpriteRenderable(font.imageName(this.mFontName));
        this.mXform = new Transform(); // transform that moves this object around
        this.mText = aString;
    }

    draw(camera: Camera) {
        // we will draw the text string by calling to mOneChar for each of the
        // chars in the mText string.
        if (this.mXform && this.mText && this.mFontName && this.mOneChar) {
            const widthOfOneChar = this.mXform.getWidth() / this.mText.length;
            const heightOfOneChar = this.mXform.getHeight();
            // this.mOneChar.getXform().SetRotationInRad(this.mXform.getRotationInRad());
            const yPos = this.mXform.getYPos();

            // center position of the first char
            let xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
            let charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
            for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
                aChar = this.mText.charCodeAt(charIndex);
                charInfo = font.getCharInfo(this.mFontName, aChar);
                if (!charInfo) {
                    throw(`FontRenderable: draw() fontName='${this.mFontName}' charIndex='${charIndex}' aChar='${aChar}' cannot get char info!`);
                }

                // set the texture coordinate
                this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTexCoordRight,
                    charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

                // now the size of the char
                xSize = widthOfOneChar * charInfo.mCharWidth;
                ySize = heightOfOneChar * charInfo.mCharHeight;
                this.mOneChar.getXform().setSize(xSize, ySize);

                // how much to offset from the center
                xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
                yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

                this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

                this.mOneChar.draw(camera);

                xPos += widthOfOneChar;
            }
        } else {
            throw('FontRenderable: draw() failed!');
        }
    }

    getXform() {
        return this.mXform;
    }

    getText() {
        return this.mText;
    }

    setText(t: string) {
        this.mText = t;
        this.setTextHeight(this.getXform()?.getHeight() || 0);
    }

    setTextHeight(h: number) {
        const charInfo = font.getCharInfo(this.mFontName || '', 'A'.charCodeAt(0)); // this is for 'A'
        const w = h * (charInfo?.mCharAspectRatio || 0);
        this.getXform()?.setSize(w * (this.mText?.length || 0), h);
    }


    getFontName = () => this.mFontName;

    setFontName(f: string) {
        this.mFontName = f;
        this.mOneChar?.setTexture(font.imageName(this.mFontName));
    }

    setColor(c: number[]) {
        this.mOneChar?.setColor(c);
    }

    getColor = () => this.mOneChar?.getColor();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update() {
    }

    /*
     * this can be a potentially useful function. Not included/tested in this version of the engine

    getStringWidth(h) {
        let stringWidth = 0;
        let charSize = h;
        let charIndex, aChar, charInfo;
        for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
            aChar = this.mText.charCodeAt(charIndex);
            charInfo = font.getCharInfo(this.mFont, aChar);
            stringWidth += charSize * charInfo.mCharWidth * charInfo.mXAdvance;
        }
        return stringWidth;
    }
    */
}

export default FontRenderable;
