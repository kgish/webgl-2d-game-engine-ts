/*
 * File: sprite_shader.ts
 *
 * Wraps over GLSL texture shader, supporting the definition of one sprite element
 * from a texture file.
 *
 */

import * as glSys from '../core/gl';
import TextureShader from './texture_shader';

class SpriteShader extends TextureShader {
    mTexCoordBuffer: WebGLBuffer | null = null; // this is the reference to gl buffer that contains the actual texture coordinate

    constructor(vertexShaderPath: string, fragmentShaderPath: string) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call TextureShader constructor

        const initTexCoord = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }
        this.mTexCoordBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
                // DYNAMIC_DRAW: says buffer content may change!
    }

    _getTexCoordBuffer = () => this.mTexCoordBuffer;

    setTextureCoordinate(texCoord: number[]) {
        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
    }

    cleanUp() {
        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }

        gl.deleteBuffer(this.mTexCoordBuffer);

        // now call super class' clean up ...
        super.cleanUp();
    }
}

export default SpriteShader;
