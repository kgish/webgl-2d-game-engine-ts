/* 
 * File: shader_support.ts
 * Support the loading, compiling, and linking of shader code
 * 
 * Notice: although in different files, access to symbols defined in other files
 *         can be established via "import" and "export statements"  
 */

import * as vertexBuffer from "./vertex_buffer";
import {getGL} from './core';  // access symbols defined as "vertexBuffer" module

let mCompiledShader: WebGLProgram | null;
// Reference to the shader program stored in mGL context.
let mVertexPositionRef: number;

// mGL reference to the attribute to be used by the VertexShader

export function init(vertexShaderID: string, fragmentShaderID: string) {
    const gl = getGL();

    // Step A: load and compile vertex and fragment shaders
    const vertexShader = loadAndCompileShader(vertexShaderID, gl.VERTEX_SHADER);
    const fragmentShader = loadAndCompileShader(fragmentShaderID, gl.FRAGMENT_SHADER);

    // Step B: Create and link the shaders into a program.
    mCompiledShader = gl.createProgram();
    if (!mCompiledShader) {
        throw new Error("Failed to create WebGLProgram!");
    }

    gl.attachShader(mCompiledShader, vertexShader);
    gl.attachShader(mCompiledShader, fragmentShader);
    gl.linkProgram(mCompiledShader);

    // Step C: check for error
    if (!gl.getProgramParameter(mCompiledShader, gl.LINK_STATUS)) {
        throw new Error("Error linking shader");
    }

    // Step D: Gets a reference to the aVertexPosition attribute within the shaders.
    mVertexPositionRef = gl.getAttribLocation(mCompiledShader, "aVertexPosition");
}


// Activate the shader for rendering
export function activate() {
    // Step A: access to the webgl context
    const gl = getGL();

    // Step B: identify the compiled shader to use
    gl.useProgram(mCompiledShader);

    // Step C: bind the vertex buffer to the attribute defined in the vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.get());
    gl.vertexAttribPointer(mVertexPositionRef,
        3,              // each element is a 3-float (x,y.z)
        gl.FLOAT,      // data type is FLOAT
        false,          // if the content is normalized vectors
        0,              // number of bytes to skip in between elements
        0);             // offsets to the first element
    gl.enableVertexAttribArray(mVertexPositionRef);
}

//**-----------------------------------
// Private methods not visible outside of this file
// **------------------------------------

// 
// Returns a compiled shader from a shader in the dom.
// The id is the id of the script in the html tag.
function loadAndCompileShader(id: string, shaderType: GLenum) {
    let compiledShader: WebGLShader | null = null;

    // Step A: Get the shader source from index.html
    const shaderText = document.getElementById(id) as HTMLElement;
    if (!shaderText) {
        throw new Error(`Failed to find shader text element with id='${ id }'`);
    }
    if (!shaderText.firstChild) {
        throw new Error("Failed to find shader text element first child!");
    }

    const shaderSource = shaderText.firstChild.textContent;
    if (!shaderSource) {
        throw new Error("Failed to create WebGLShader!");
    }

    const gl = getGL();

    // Step B: Create the shader based on the shader type: vertex or fragment
    compiledShader = gl.createShader(shaderType);
    if (!compiledShader) {
        throw new Error("Failed to create WebGLShader!");
    }

    // Step C: Compile the created shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // Step D: check for errors and return results (null if error)
    // The log info is how shader compilation errors are typically displayed.
    // This is useful for debugging the shaders.
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        throw new Error("A shader compiling error occurred: " + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
}

//
// export the class, the default keyword says importer of this class cannot change the name "SimpleShader"
// for this reason, to import this class, one must issue
//      import SimpleShader from "./simple_shader.js";
// attempt to change name, e.g., 
//      import SimpleShader as MyShaderName from "./simple_shader.js";
// will result in failure
//
