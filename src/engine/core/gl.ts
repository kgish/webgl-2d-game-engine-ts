/*
 * File: gl.ts
 *
 * Handles initialization with gl
 *
 */

let mCanvas: HTMLCanvasElement | null = null;
let mGL: WebGL2RenderingContext | null = null;

const get = (): WebGL2RenderingContext | null => mGL;

function init(htmlCanvasID: string): void {
    mCanvas = document.getElementById(htmlCanvasID) as HTMLCanvasElement;
    if (mCanvas == null) {
        throw new Error('Engine init [' + htmlCanvasID + '] HTML element id not found!');
    }

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = mCanvas.getContext('webgl2') || mCanvas.getContext('experimental-webgl2');

    if (mGL === null) {
        document.write('<br><b>WebGL 2 is not supported!</b>');
    }
}

export { init, get };
