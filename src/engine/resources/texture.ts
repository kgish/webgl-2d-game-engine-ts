/*
 * File: texture.ts
 *
 * Defines the logic for loading and interacting with file texture resources
 * (load into the resource_map)
 *
 */

import * as glSys from '../core/gl';
import * as map from '../core/resource_map';

// functions from resource_map
const has = map.has;
const get = map.get;

class TextureInfo {
    mWidth = 0;
    mHeight = 0;
    mGLTexID = 0;

    constructor(w: number, h: number, id: number) {
        this.mWidth = w;
        this.mHeight = h;
        this.mGLTexID = id;
    }
}

/*
 * This converts an image to the webGL texture format.
 * This should only be called once the texture is loaded.
 */
function processLoadedImage(path: string, image: HTMLImageElement) {
    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }

    // Generate a texture reference to the webGL context
    const textureID = gl.createTexture();

    // bind the texture reference with the current texture functionality in the webGL
    gl.bindTexture(gl.TEXTURE_2D, textureID);

    // Load the texture into the texture data structure with descriptive info.
    // Parameters:
    //  1: Which "binding point" or target the texture is being loaded to.
    //  2: Level of detail. Used for mipmapping. 0 is base texture level.
    //  3: Internal format. The composition of each element. i.e. pixels.
    //  4: Format of texel data. Must match internal format.
    //  5: The data type of the texel data.
    //  6: Texture Data.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Creates a mipmap for this texture.
    gl.generateMipmap(gl.TEXTURE_2D);

    // Tells WebGL that we are done manipulating data at the mGL.TEXTURE_2D target.
    gl.bindTexture(gl.TEXTURE_2D, null);

    const texInfo = new TextureInfo(image.naturalWidth, image.naturalHeight, textureID as number);
    map.set(path, texInfo);
}

// Loads an texture so that it can be drawn.
function load(textureName: string) {
    let texturePromise = null;
    if (map.has(textureName)) {
        map.incRef(textureName);
    } else {
        map.loadRequested(textureName);
        const image = new Image();
        texturePromise = new Promise(
            function (resolve) {
                image.onload = resolve;
                image.src = textureName;
            }).then(
            function resolve() {
                processLoadedImage(textureName, image);
            }
        );
        map.pushPromise(texturePromise);
    }
    return texturePromise;
}

// Remove the reference to allow associated memory
// be available for subsequent garbage collection
function unload(textureName: string) {
    const texInfo = get(textureName) as TextureInfo;
    if (texInfo) {
        if (map.unload(textureName)) {
            const gl = glSys.get();
            if (!gl) {
                throw new Error('Cannot get GL!');
            }
            gl.deleteTexture(texInfo.mGLTexID);
        }
    }
}

function activate(textureName: string) {
    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }
    const texInfo = get(textureName) as TextureInfo;

    // Binds our texture reference to the current webGL texture functionality
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

    // To prevent texture wrappings
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Handles how magnification and minimization filters will work.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    // For pixel-graphics where you want the texture to look "sharp" do the following:
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}

function deactivate() {
    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
}


export {
    has, get, load, unload,

    TextureInfo,

    activate, deactivate
};
