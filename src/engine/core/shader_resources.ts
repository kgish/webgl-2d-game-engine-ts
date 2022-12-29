/*
 * File: shader_resources.ts
 *
 * Defines drawing system shaders
 *
 */

import SimpleShader from '../shaders/simple_shader';
import TextureShader from '../shaders/texture_shader';
import * as text from '../resources/text';
import * as map from './resource_map';

// Simple Shader
const kSimpleVS = 'glsl_shaders/simple_vs.glsl';  // Path to the VertexShader
const kSimpleFS = 'glsl_shaders/simple_fs.glsl';  // Path to the simple FragmentShader
let mConstColorShader: SimpleShader | null = null;

// Texture Shader
const kTextureVS = 'glsl_shaders/texture_vs.glsl';  // Path to the VertexShader
const kTextureFS = 'glsl_shaders/texture_fs.glsl';  // Path to the texture FragmentShader
let mTextureShader: TextureShader | null = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
}

function init() {
    const loadPromise = new Promise<void>(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve) => {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS),
                text.load(kTextureFS),
                text.load(kTextureVS)
            ]);
            resolve();
        }).then(
        function resolve() {
            createShaders();
        }
    );
    map.pushPromise(loadPromise);
}

function cleanUp() {
    if (mConstColorShader) {
        mConstColorShader.cleanUp();
    }

    if (mTextureShader) {
        mTextureShader.cleanUp();
    }

    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
}

const getConstColorShader = () => mConstColorShader;

function getTextureShader() {
    return mTextureShader;
}

export { init, cleanUp, getConstColorShader, getTextureShader };
