/*
 * File: index.ts
 *
 * Serves as central export of the entire engine
 * client programs can simply import this file
 * for all symbols defined in the engine
 *
 */

// Resources
import * as xml from './resources/xml';
import * as text from './resources/text';

// General utilities
import * as input from './input';
import Camera from './camera';
import Transform from './transform';
import Renderable from './renderable';
import Scene from './scene';

// Local to this file only
import * as glSys from './core/gl';
import * as vertexBuffer from './core/vertex_buffer';
import * as shaderResources from './core/shader_resources';
import * as loop from './core/loop';

// General engine utilities
function init(htmlCanvasID: string) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    shaderResources.init();
    input.init();
}

function cleanUp() {
    loop.cleanUp();
    input.cleanUp();
    shaderResources.cleanUp();
    vertexBuffer.cleanUp();
    glSys.cleanUp();
}

function clearCanvas(color: number[]) {
    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }

    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}

export default {
    // resource support
    text, xml,

    // input support
    input,

    // Util classes
    Camera, Scene, Transform, Renderable,

    // functions
    init, cleanUp, clearCanvas
};
