const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 680;

const canvas = document.getElementById('GLCanvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2');

if (!gl) {
    const error = 'Failed to get webgl2 context!';
    const el = document.getElementById('GLError');
    if (el) {
        el.classList.remove('hidden');
        el.textContent = error;
    } else {
        alert(error);
    }
} else {
    gl.canvas.height = CANVAS_HEIGHT;
    gl.canvas.width = CANVAS_WIDTH;
    gl.clearColor(0.0, 0.8, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
