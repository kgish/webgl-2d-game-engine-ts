const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 680;

let mGL: WebGL2RenderingContext | null;

export const getGL = () => mGL;

export function initWebGL() {
    const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
    mGL = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2');

    if (mGL) {
        mGL.canvas.height = CANVAS_HEIGHT;
        mGL.canvas.width = CANVAS_WIDTH;
        mGL.clearColor(0.0, 0.8, 0.0, 1.0);
    } else {
        handleError();
    }
}

export function clearCanvas() {
    mGL && mGL.clear(mGL.COLOR_BUFFER_BIT);
}

function handleError() {
    const error = 'WebGL2 is not supported!';
    const el = document.getElementsByTagName('span')[0] as HTMLSpanElement;
    if (el) {
        el.textContent = error;
        el.classList.remove('hidden');
    } else {
        alert(error);
    }
}
