/*
 * File: index.ts
 *
 * Serves as central export of the entire engine client programs can simply import this file
 * for all symbols defined in the engine.
 *
 */

// Local to this file only
import * as glSys from './core/gl';
import * as vertexBuffer from './core/vertex_buffer';
import * as shaderResources from './core/shader_resources';

import Renderable from './renderable';

// General engine utilities
export function init(htmlCanvasID: string) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    shaderResources.init();
}

export function clearCanvas(color: GLclampf[]) {
    const gl = glSys.get();
    gl.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT);      // clear to the color previously set
}

export { Renderable };
