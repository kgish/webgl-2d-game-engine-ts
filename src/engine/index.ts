/*
 * File: index.ts
 *
 * Serves as central export of the entire engine
 * client programs can simply import this file
 * for all symbols defined in the engine
 *
 */

// Resources
import * as audio from './resources/audio';
import * as text from './resources/text';
import * as xml from './resources/xml';
import * as texture from './resources/texture';
import * as font from './resources/font';
import * as defaultResources from './resources/default_resources';

// General utilities
import * as input from './input';
import Camera from './camera';
import Scene from './scene';
import Transform from './transform';

// Renderables
import Renderable from './renderables/renderable';
import TextureRenderable from './renderables/texture_renderable';
import SpriteRenderable, { eTexCoordArrayIndex } from './renderables/sprite_renderable';
import SpriteAnimateRenderable, { eAnimationType } from './renderables/sprite_animate_renderable';
import FontRenderable from './renderables/font_renderable';

// Local to this file only
import * as glSys from './core/gl';
import * as vertexBuffer from './core/vertex_buffer';
import * as shaderResources from './core/shader_resources';
import * as loop from './core/loop';

// General engine utilities
function init(htmlCanvasID: string) {
    glSys.init(htmlCanvasID);
    vertexBuffer.init();
    input.init();
    audio.init();
    shaderResources.init();
    defaultResources.init();
}

function cleanUp() {
    loop.cleanUp();
    shaderResources.cleanUp();
    defaultResources.cleanUp();
    audio.cleanUp();
    input.cleanUp();
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
    // Resource support
    audio, text, xml, texture, font, defaultResources,

    // Input support
    input,

    // Util classes
    Camera, Scene, Transform,

    // Renderables
    Renderable, TextureRenderable, SpriteRenderable, SpriteAnimateRenderable, FontRenderable,

    // Constants
    eTexCoordArrayIndex, eAnimationType,

    // Functions
    init, cleanUp, clearCanvas
};
