/*
 * File: sprite_renderable.ts
 *
 * Supports the drawing and of one sprite element mapped onto entire Renderable.
 *
 */

import TextureRenderable from './texture_renderable';
import * as texture from '../resources/texture';
import * as shaderResources from '../core/shader_resources';

import Camera from '../camera';
import SpriteShader from '../shaders/sprite_shader';

// The expected texture coordinate array is an array of 8 floats where elements:
//  [0] [1]: is u/v coordinate of Top-Right
//  [2] [3]: is u/v coordinate of Top-Left
//  [4] [5]: is u/v coordinate of Bottom-Right
//  [6] [7]: is u/v coordinate of Bottom-Left
// Convention: eName is an enumerated data type
const eTexCoordArrayIndex = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});

class SpriteRenderable extends TextureRenderable {
    // sprite coordinate
    mElmLeft = 0.0;   // bounds of texture coordinate (0 is left, 1 is right)
    mElmRight = 1.0;  //
    mElmTop = 1.0;    //   1 is top and 0 is bottom of image
    mElmBottom = 0.0; //

    constructor(myTexture: string) {
        super(myTexture);
        super._setShader(shaderResources.getSpriteShader());
    }

    // specify element region by texture coordinate (between 0 to 1)
    setElementUVCoordinate(left: number, right: number, bottom: number, top: number) {
        this.mElmLeft = left;
        this.mElmRight = right;
        this.mElmBottom = bottom;
        this.mElmTop = top;
    }

    // specify element region by pixel positions (between 0 to image resolutions)
    setElementPixelPositions(left: number, right: number, bottom: number, top: number) {
        const texInfo = texture.get(this.mTexture) as { mWidth: number, mHeight: number};
        // entire image width, height
        if (texInfo) {
            const imageW = texInfo.mWidth;
            const imageH = texInfo.mHeight;

            this.mElmLeft = left / imageW;
            this.mElmRight = right / imageW;
            this.mElmBottom = bottom / imageH;
            this.mElmTop = top / imageH;
        }
    }

    getElementUVCoordinateArray() {
        return [
            this.mElmRight, this.mElmTop,          // x,y of top-right
            this.mElmLeft, this.mElmTop,
            this.mElmRight, this.mElmBottom,
            this.mElmLeft, this.mElmBottom
        ];
    }

    draw(camera: Camera) {
        // set the current texture coordinate
        //
        // activate the texture
        (this.mShader as SpriteShader).setTextureCoordinate(this.getElementUVCoordinateArray());
        super.draw(camera);
    }
}

export default SpriteRenderable;

export { eTexCoordArrayIndex };
