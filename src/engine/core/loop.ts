/*
 * File: loop.ts
 *
 * interfaces with HTML5 to implement looping functionality, supports start/end loop
 *
 */

interface IScene {
    load: () => void;
    draw: () => void;
    update: () => void;
    init: () => void;
}

const kUPS = 60; // Updates per second
const kMPF = 1000 / kUPS; // Milliseconds per update.

// Variables for timing game loop.
let mPrevTime: number;
let mLagTime: number;

// The current loop state (running or should stop)
let mLoopRunning = false;
let mCurrentScene: IScene | null = null;
let mFrameID = -1;

import * as map from './resource_map';
import * as input from '../input';

// This function loops over draw/update once
function loopOnce() {
    if (mLoopRunning) {
        // Step A: set up for next call to loopOnce
        mFrameID = requestAnimationFrame(loopOnce);

        // Step B: now let's draw
        //         draw() MUST be called before update()
        //         as update() may stop the loop!
        mCurrentScene?.draw();

        // Step C: compute how much time has elapsed since  last loopOnce was executed
        const currentTime = performance.now();
        const elapsedTime = currentTime - mPrevTime;
        mPrevTime = currentTime;
        mLagTime += elapsedTime;

        // Step D: Make sure we update the game the appropriate number of times.
        //      Update only every kMPF (1/60 of a second)
        //      If lag larger then update frames, update until caught up.
        while ((mLagTime >= kMPF) && mLoopRunning) {
            input.update();
            mCurrentScene?.update();
            mLagTime -= kMPF;
        }
    }
}

async function start(scene: IScene) {
    if (mLoopRunning) {
        throw new Error('loop already running!');
    }

    mCurrentScene = scene;
    mCurrentScene.load();

    // Wait for any async requests before game-load
    await map.waitOnPromises();

    mCurrentScene.init();

    mPrevTime = performance.now();
    mLagTime = 0.0;
    mLoopRunning = true;
    mFrameID = requestAnimationFrame(loopOnce);
}

function stop() {
    mLoopRunning = false;
    // make sure no more animation frames
    cancelAnimationFrame(mFrameID);
}

export { start, stop };
