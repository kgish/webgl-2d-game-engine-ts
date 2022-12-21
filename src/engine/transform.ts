/*
 * File: transform.ts
 *
 * Encapsulates the matrix transformation functionality, meant to work with
 * Renderable
 */

import { mat4, vec2, vec3 } from 'gl-matrix';

class Transform {
    mPosition: vec2;         // this is the translation
    mScale: vec2;            // this is the width (x) and height (y)
    mRotationInRad: number;  // in radians!

    constructor() {
        this.mPosition = vec2.fromValues(0, 0);
        this.mScale = vec2.fromValues(1, 1);
        this.mRotationInRad = 0.0;
    }

    setPosition(xPos: number, yPos: number) {
        this.setXPos(xPos);
        this.setYPos(yPos);
    }

    getPosition = () => this.mPosition;
    getXPos = () => this.mPosition[0];

    setXPos(xPos: number) {
        this.mPosition[0] = xPos;
    }

    incXPosBy(delta: number) {
        this.mPosition[0] += delta;
    }

    getYPos = () => this.mPosition[1];

    setYPos(yPos: number) {
        this.mPosition[1] = yPos;
    }

    incYPosBy(delta: number) {
        this.mPosition[1] += delta;
    }

    setSize(width: number, height: number) {
        this.setWidth(width);
        this.setHeight(height);
    }

    getSize = () => this.mScale;

    incSizeBy(delta: number) {
        this.incWidthBy(delta);
        this.incHeightBy(delta);
    }

    getWidth = () => this.mScale[0];

    setWidth(width: number) {
        this.mScale[0] = width;
    }

    incWidthBy(delta: number) {
        this.mScale[0] += delta;
    }

    getHeight = () => this.mScale[1];

    setHeight(height: number) {
        this.mScale[1] = height;
    }

    incHeightBy(delta: number) {
        this.mScale[1] += delta;
    }

    setRotationInRad(rotationInRadians: number) {
        this.mRotationInRad = rotationInRadians;
        while (this.mRotationInRad > (2 * Math.PI)) {
            this.mRotationInRad -= (2 * Math.PI);
        }
    }

    setRotationInDegree(rotationInDegree: number) {
        this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
    }

    incRotationByDegree(deltaDegree: number) {
        this.incRotationByRad(deltaDegree * Math.PI / 180.0);
    }

    incRotationByRad(deltaRad: number) {
        this.setRotationInRad(this.mRotationInRad + deltaRad);
    }

    getRotationInRad = () => this.mRotationInRad;

    getRotationInDegree = () => this.mRotationInRad * 180.0 / Math.PI;

    // returns the matrix the concatenates the transformations defined
    getTRSMatrix() {
        // Creates a blank identity matrix
        const matrix = mat4.create();

        // The matrices that WebGL uses are transposed, thus the typical matrix
        // operations must be in reverse.

        // Step A: compute translation, for now z is always at 0.0
        mat4.translate(matrix, matrix, vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
        // Step B: concatenate with rotation.
        mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

        return matrix;
    }
}

export default Transform;
