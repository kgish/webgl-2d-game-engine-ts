/*
 * File: renderable.ts
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

import * as glSys from '../core/gl';
import * as shaderResources from '../core/shader_resources';

import Transform from '../transform';
import SimpleShader from '../shaders/simple_shader';
import Camera from '../../engine/camera';
import TextureShader from '../shaders/texture_shader';

class Renderable {
    mShader: SimpleShader | TextureShader | null; // the shader for shading this object
    mXform: Transform; // the transform object
    mColor: number[];  // color of pixel

    constructor() {
        this.mShader = shaderResources.getConstColorShader();
        this.mXform = new Transform();
        this.mColor = [ 1, 1, 1, 1 ];
    }

    draw(camera: Camera) {
        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }
        // Always activate the shader first!
        if (this.mShader) {
            this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    getXform = () => this.mXform;

    setColor(color: number[]) {
        this.mColor = color;
    }

    getColor = () => this.mColor;

    // this is private/protected
    _setShader(s: SimpleShader | TextureShader) {
        this.mShader = s;
    }
}

export default Renderable;
