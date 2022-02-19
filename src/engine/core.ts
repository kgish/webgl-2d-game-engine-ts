/*
 * File: core.ts
 */

// import all symbols that are exported from vertex_buffer.js, as symbols under the module 'vertexBuffer'
//
import * as vertexBuffer from './vertex_buffer';
import {SimpleShader} from './simple_shader';
import {vertexShaderSource} from '../glsl_shaders/simple_vs_glsl';
import {fragmentShaderSource} from '../glsl_shaders/simple_fs_glsl';

// variables
//
// The graphical context to draw to
let mGL: WebGL2RenderingContext | null;

export function getGL() {
    if (mGL) {
        return mGL;
    } else {
        throw Error('WebGL 2 is not supported!');
    }
}

// The shader
let mShader: SimpleShader | null;

function createShader() {
    mShader = new SimpleShader(
        vertexShaderSource,
        fragmentShaderSource);
}

// initialize the WebGL
function initWebGL(htmlCanvasID: string) {
    const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2');

    if (mGL === null) {
        throw Error('WebGL 2 is not supported!');
    }
}

// initialize the WebGL, and the vertex buffer
export function init(htmlCanvasID: string) {
    initWebGL(htmlCanvasID);    // setup mGL
    vertexBuffer.init();        // setup mGLVertexBuffer
    createShader();             // create the shader
}

// Clears the draw area and draws one square
export function clearCanvas(color: GLclampf[]) {
    if (mGL) {
        mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
        mGL.clear(mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
    }
}

// function to draw a square
// two steps to draw: activate the shader, and issue the gl draw command
export function drawSquare(color: number[]) {

    if (mShader && mGL) {
        // Step A: Activate the shader
        mShader.activate(color);

        // Step B: Draw with the currently activated geometry and the activated shader
        mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);
    }
}
