/*
 * File: index.ts
 *
 * serves as central export of the entire engine
 * client programs can simply import this file
 * for all symbols defined in the engine
 *
 */

// general utilities
import Camera from './camera';
import Transform from './transform';
import Renderable from './renderable';

// local to this file only
import * as glSys from './core/gl';
import * as vertexBuffer from './core/vertex_buffer';
import * as shaderResources from './core/shader_resources';

// general engine utilities
function init(htmlCanvasID: string) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    shaderResources.init();
}

function clearCanvas(color: number[]) {
    const gl = glSys.get();
    if (!gl) {
        throw new Error("Cannot get GL!");
    }


    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}


export default {
    // Util classes
    Camera, Transform, Renderable,

    // functions
    init, clearCanvas
};
