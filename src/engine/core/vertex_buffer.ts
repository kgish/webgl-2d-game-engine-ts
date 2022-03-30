/*
 * File: vertex_buffer.ts
 *
 * Defines the module that supports the loading and using of the buffer that
 * contains vertex positions of a square onto the gl context.
 *
 */

import * as glSys from './gl';

// Reference to the vertex positions for the square in the gl context
let mGLVertexBuffer: WebGLBuffer | null;

export function get() {
    return mGLVertexBuffer;
}

// First: define the vertices for a square
const mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

export function init() {

    const gl = glSys.get();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
}
