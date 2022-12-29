/*
 * File: texture_shader.ts
 *
 * Wraps over GLSL texture shader, supporting the working with the entire file texture.
 *
 */
import { mat4 } from 'gl-matrix';

import * as glSys from '../core/gl';
import * as vertexBuffer from '../core/vertex_buffer';
import SimpleShader from './simple_shader';

class TextureShader extends SimpleShader {
    mTextureCoordinateRef: WebGLProgram | null = null; // reference to aTextureCoordinate within the shader
    mSamplerRef: WebGLProgram | null = null;

    constructor(vertexShaderPath: string, fragmentShaderPath: string) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        // get the reference of aTextureCoordinate within the shader
        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }

        if (this.mCompiledShader) {
            this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
            this.mSamplerRef = gl.getUniformLocation(this.mCompiledShader, "uSampler");
        }
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor: number[], trsMatrix: mat4, cameraMatrix: mat4) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        if (this.mTextureCoordinateRef) {
            gl.vertexAttribPointer(this.mTextureCoordinateRef as number, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.mTextureCoordinateRef as number);
        }

        // bind uSampler to texture 0
        gl.uniform1i(this.mSamplerRef, 0);  // texture.activateTexture() binds to Texture0
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}

export default TextureShader;
