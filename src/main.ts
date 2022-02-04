import {clearCanvas, drawSquare, initWebGL} from './core';

window.onload = function () {
    initWebGL("GLCanvas");     // Binds mGL context to WebGL functionality
    clearCanvas();      // Clears the GL area
    drawSquare();       // Draws one square
};
