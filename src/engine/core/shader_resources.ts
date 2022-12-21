/*
 * File: shader_resources.ts
 *
 * Defines drawing system shaders.
 *
 */

// Simple Shader
import SimpleShader from '../simple_shader';

import { kSimpleVS } from '../../glsl_shaders/simple_vs_glsl'; // Path to the VertexShader
import { kSimpleFS } from '../../glsl_shaders/simple_fs_glsl'; // Path to the simple FragmentShader

let mConstColorShader: SimpleShader;

const init = () => createShaders();

const getConstColorShader = () => mConstColorShader;

const createShaders = () => mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);

export { init, getConstColorShader };
