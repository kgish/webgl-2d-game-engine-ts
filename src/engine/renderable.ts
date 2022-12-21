/*
 * File: renderable.ts
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */

import * as glSys from './core/gl';
import * as shaderResources from './core/shader_resources';
import Transform from './transform';
import SimpleShader from '../engine/simple_shader';
import Camera from '../engine/camera';

class Renderable {
    mShader: SimpleShader;   // the shader for shading this object
    mColor: number[];     // color of pixel
    mXform: Transform;  // the transform object

    constructor() {
        this.mShader = shaderResources.getConstColorShader();
        this.mColor = [1, 1, 1, 1];
        this.mXform = new Transform();
    }

    draw(camera: Camera) {
        const gl = glSys.get();
        if (!gl) {
            throw new Error("Cannot get GL!");
        }
        this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    getXform() { return this.mXform; }

    setColor(color: number[]) { this.mColor = color; }
    getColor = () => this.mColor;
}

export default Renderable;
