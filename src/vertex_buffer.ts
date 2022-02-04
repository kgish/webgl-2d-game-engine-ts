/*
 * File: vertex_buffer.ts
 *  
 * defines the module that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gl context
 * 
 */

import {getGL} from './core';

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer: WebGLBuffer | null;

export function get() {
    if (!mGLVertexBuffer) {
        throw new Error("Cannot get WebGLBuffer!");
    }

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
    const gl = getGL();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    if (!mGLVertexBuffer) {
        throw new Error("Cannot create WebGLBuffer!");
    }

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
}
