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

function get() {
    return mGLVertexBuffer;
}

function cleanUp() {
    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }

    if (mGLVertexBuffer !== null) {
        gl.deleteBuffer(mGLVertexBuffer);
        mGLVertexBuffer = null;
    }

    if (mGLTextureCoordBuffer !== null) {
        gl.deleteBuffer(mGLTextureCoordBuffer);
        mGLTextureCoordBuffer = null;
    }
}

// First: define the vertices for a square
const mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// reference to the texture coordinates for the square vertices in the gl context
let mGLTextureCoordBuffer: WebGLBuffer | null = null;

function getTexCoord() {
    return mGLTextureCoordBuffer;
}

// Second: define the corresponding texture coordinates
const mTextureCoordinates = [
    1.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
];

function init() {
    const gl = glSys.get();
    if (!gl) {
        throw new Error('Cannot get GL!');
    }

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);

    // Step  D: Allocate and store texture coordinates
    // Create a buffer on the gl context for texture coordinates
    mGLTextureCoordBuffer = gl.createBuffer();

    // Activate texture coordinate buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLTextureCoordBuffer);

    // Loads textureCoordinates into the mGLTextureCoordBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mTextureCoordinates), gl.STATIC_DRAW);
}

export { init, get, cleanUp, getTexCoord };
