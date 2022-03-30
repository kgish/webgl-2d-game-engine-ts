/*
 * File: simple_shader.ts
 *
 * Defines the SimpleShader class.
 *
 */

import * as glSys from './core/gl';
import * as vertexBuffer from './core/vertex_buffer';

export class SimpleShader {

    mCompiledShader: WebGLProgram | null;  // reference to the compiled shader in webgl context
    mVertexPositionRef: GLint; // reference to VertexPosition within the shader
    mVertexShader: WebGLShader | null;
    mFragmentShader: WebGLShader | null;
    mPixelColorRef;

    constructor(vertexShaderSource: string, fragmentShaderSource: string) {

        const gl = glSys.get();

        // Step A: Load and compile vertex and fragment shaders
        this.mVertexShader = loadAndCompileShader(vertexShaderSource, gl.VERTEX_SHADER);
        this.mFragmentShader = loadAndCompileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        this.mPixelColorRef = null;

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
            throw new Error('Shader linking failed with [' + vertexShaderSource + ' ' + fragmentShaderSource + '].');
        }

        // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
        this.mVertexPositionRef = gl.getAttribLocation(this.mCompiledShader, 'aVertexPosition');
        if (this.mVertexPositionRef === null) {
            throw new Error('Cannot get WebGL attribute location!');
        }

        // Step E: Gets uniform variable uPixelColor in fragment shader
        this.mPixelColorRef = gl.getUniformLocation(this.mCompiledShader, 'uPixelColor');
    }


    // Activate the shader for rendering
    activate(pixelColor: number[]) {
        const gl = glSys.get();
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
    }
}

//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------

//
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function loadAndCompileShader(shaderSource: string, shaderType: GLenum) {
    const gl = glSys.get();

    // Step B: Create the shader based on the shader type: vertex or fragment
    const compiledShader = gl.createShader(shaderType);

    if (!compiledShader) {
        throw new Error('Cannot create shader!');
    }

    // Step C: Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error('A shader compiling error occurred: ' + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}

//-- end of private methods


//
// export the class, the default keyword says importer of this class cannot change the name 'SimpleShader'
// for this reason, to import this class, one must issue
//      import SimpleShader from './simple_shader.js';
// attempt to change name, e.g.,
//      import SimpleShader as MyShaderName from './simple_shader.js';
// will result in failure
//
