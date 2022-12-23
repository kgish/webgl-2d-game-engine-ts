/*
 * File: simple_shader.ts
 *
 * Defines the SimpleShader class.
 *
 */

import { mat4 } from 'gl-matrix';

import * as glSys from './core/gl';
import * as vertexBuffer from './core/vertex_buffer';
import * as text from './resources/text';

export class SimpleShader {
    mCompiledShader: WebGLProgram | null;  // reference to the compiled shader in webgl context
    mVertexPositionRef: GLint; // reference to VertexPosition within the shader
    mVertexShader: WebGLShader | null;
    mFragmentShader: WebGLShader | null;
    mPixelColorRef: WebGLUniformLocation | null = null;     // reference to the pixelColor uniform in the fragment shader
    mModelMatrixRef: WebGLUniformLocation | null = null; // reference to model transform matrix in vertex shader
    mCameraMatrixRef: WebGLUniformLocation | null = null; // reference to the View/Projection matrix in the vertex shader

    constructor(vertexShaderPath: string, fragmentShaderPath: string) {

        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }

        // Step A: Load and compile vertex and fragment shaders
        this.mVertexShader = compileShader(vertexShaderPath, gl.VERTEX_SHADER);
        this.mFragmentShader = compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

        // Step B: Create and link the shaders into a program.
        this.mCompiledShader = gl.createProgram();
        if (!this.mCompiledShader) {
            throw new Error('Cannot create WebGLProgram!');
        }

        gl.attachShader(this.mCompiledShader, this.mVertexShader);
        gl.attachShader(this.mCompiledShader, this.mFragmentShader);
        gl.linkProgram(this.mCompiledShader);

        // Step C: Check for error
        if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
            throw new Error('Shader linking failed with [' + vertexShaderPath + ' ' + fragmentShaderPath + ']!');
        }

        // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.getAttribLocation(this.mCompiledShader, 'aVertexPosition');
        if (this.mVertexPositionRef === null) {
            throw new Error('Cannot get WebGL attribute location!');
        }

        // Step E: Gets uniform variable uPixelColor in fragment shader
        this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShader, 'uPixelColor');
        this.mModelMatrixRef = gl.getUniformLocation(this.mCompiledShader, 'uModelXformMatrix');
        this.mCameraMatrixRef = gl.getUniformLocation(this.mCompiledShader, 'uCameraXformMatrix');
    }


    // Activate the shader for rendering
    activate(pixelColor: number[], trsMatrix: mat4, cameraMatrix: mat4) {
        const gl = glSys.get();
        if (!gl) {
            throw new Error('Cannot get GL!');
        }
        gl.useProgram(this.mCompiledShader);

        // bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
        gl.vertexAttribPointer(this.mVertexPositionRef,
            3,              // each element is a 3-float (x,y.z)
            gl.FLOAT,       // data type is FLOAT
            false,          // if the content is normalized vectors
            0,              // number of bytes to skip in between elements
            0);             // offsets to the first element
        gl.enableVertexAttribArray(this.mVertexPositionRef);

        // load uniforms
        gl.uniform4fv(this.mPixelColorRef, pixelColor);
        gl.uniformMatrix4fv(this.mModelMatrixRef, false, trsMatrix);
        gl.uniformMatrix4fv(this.mCameraMatrixRef, false, cameraMatrix);
    }
}


//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------

//
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function compileShader(filePath: string, shaderType: number) {
    let shaderSource: string | null = null;
    let compiledShader: WebGLShader | null = null;

    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }

    // Step A: Access the shader text file
    shaderSource = text.get(filePath) || null;

    if (!shaderSource) {
        throw new Error('WARNING:' + filePath + ' not loaded!');
    }

    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);
    if (!compiledShader) {
        throw new Error('Cannot get compiled shader!');
    }

    // Step C: Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error('Shader ['+ filePath +'] compiling error: ' + gl.getShaderInfoLog(compiledShader + '!'));
    }

    return compiledShader;
}
//-- end of private methods

export default SimpleShader;
