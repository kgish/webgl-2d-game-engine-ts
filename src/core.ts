/*
 * File: core.ts
 *
 * The inner most core of the engine we will build
 */

// import all symbols that are exported from vertex_buffer.js, as symbols under the module "vertexBuffer"
//
import * as vertexBuffer from "./vertex_buffer";
import * as simpleShader from "./shader_support";

// variables
// 
// The graphical context to draw to
let mGL: WebGL2RenderingContext | null;

// Convention: variable in a module: mName
export function getGL() {
    if (!mGL) {
       throw new Error("Failed to get WebGL2RenderingContext!");
    }

    return mGL;
}

// initialize the WebGL
export function initWebGL(htmlCanvasID: string) {
    const canvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;

    if (!canvas) {
        throw new Error(`Cannot find canvas element with id='${htmlCanvasID}'`);
    }

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (!mGL) {
        throw new Error("WebGL2 is not supported!");
    }

    mGL.clearColor(0.0, 0.8, 0.0, 1.0);  // set the color to be cleared

    // 1. initialize the buffer with the vertex positions for the unit square
    vertexBuffer.init(); // This function is defined in the vertex_buffer.js file

    // 2. now load and compile the vertex and fragment shaders
    simpleShader.init("VertexShader", "FragmentShader");
    // the two shaders are defined in the index.html file
    // init() function is defined in shader_support.js file
}

// Clears the draw area and draws one square
export function drawSquare() {
    if (mGL) {
        // Step A: Activate the shader
        simpleShader.activate();

        // Step B. draw with the above settings
        mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);
    }
}

// Clears the canvas area
export function clearCanvas() {
    if (mGL) {
        mGL.clear(mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
    }
}
