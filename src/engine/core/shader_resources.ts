/*
 * File: shader_resources.ts
 *
 * Defines drawing system shaders
 *
 */

import SimpleShader from '../simple_shader';
import * as text from '../resources/text';
import * as map from './resource_map';

// Simple Shader
const kSimpleVS = 'glsl_shaders/simple_vs.glsl';  // Path to the VertexShader
const kSimpleFS = 'glsl_shaders/simple_fs.glsl';  // Path to the simple FragmentShader

let mConstColorShader: SimpleShader | null = null;

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
}

function init() {
    const loadPromise = new Promise<void>(
        // eslint-disable-next-line no-async-promise-executor
        async (resolve) => {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS)
            ]);
            resolve();
        }).then(
        function resolve() {
            createShaders();
        }
    );
    map.pushPromise(loadPromise);
}

const getConstColorShader = () => mConstColorShader;

export { init, getConstColorShader };
