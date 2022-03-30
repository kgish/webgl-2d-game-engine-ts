/*
 * File: gl.ts
 *
 * Handles initialization with gl.
 *
 */

let mCanvas: HTMLCanvasElement;
let mGL: WebGL2RenderingContext | null;

export function get() {
    if (!mGL) {
        throw Error('mGL has not been initialized!');
    }
    return mGL;
}

export function init(htmlCanvasID: string) {
    mCanvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;

    if (mCanvas == null)
        throw new Error('Engine init [' + htmlCanvasID + '] HTML element id not found');

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL.
    mGL = mCanvas.getContext('webgl2') || mCanvas.getContext('experimental-webgl2');

    if (mGL === null) {
        throw Error('WebGL 2 is not supported!');
    }
}
