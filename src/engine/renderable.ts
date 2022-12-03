/*
 * File: renderable.ts
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 *
 */

import * as glSys from './core/gl';
import * as shaderResources from './core/shader_resources';
import { mat4 } from 'gl-matrix';

export default class Renderable {
    mShader;
    mColor: GLclampf[];

    constructor() {
        this.mShader = shaderResources.getConstColorShader();   // the shader for shading this object
        this.mColor = [ 1, 1, 1, 1 ];    // color of pixel
    }

    draw(trsMatrix: mat4) {
        const gl = glSys.get();
        this.mShader.activate(this.mColor, trsMatrix);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    setColor(color: GLclampf[]) {
        this.mColor = color;
    }

    getColor() {
        return this.mColor;
    }
}
