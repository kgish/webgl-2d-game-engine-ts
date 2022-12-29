/*
 * File: texture_renderable.ts
 *
 * Supports the drawing an entire file texture mapped onto an entire Renderable.
 *
 */

import Renderable from './renderable';
import * as texture from '../resources/texture';
import * as shaderResources from '../core/shader_resources';

import Camera from '../camera';

class TextureRenderable extends Renderable {
    constructor(myTexture) {
        super();
        super.setColor([ 1, 1, 1, 0 ]); // Alpha of 0: switch off tinting of texture
        super._setShader(shaderResources.getTextureShader());
        this.mTexture = myTexture;  // texture for this object, cannot be a "null"
    }

    draw(camera: Camera) {
        // activate the texture
        texture.activate(this.mTexture);
        super.draw(camera);
    }

    getTexture = () => this.mTexture;

    setTexture(newTexture) {
        this.mTexture = newTexture;
    }
}

export default TextureRenderable;
