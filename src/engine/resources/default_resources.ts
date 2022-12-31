/*
 * File: default_resources.ts
 *
 * Central storage of all engine-wide shared resources, e.g., fonts.
 */

import * as font from './font';
import * as map from '../core/resource_map';

// Default font
const kDefaultFont = 'assets/fonts/system_default_font';

// unload all resources
function cleanUp() {
    font.unload(kDefaultFont);
}

function init() {
    const loadPromise = new Promise(
        // eslint-disable-next-line no-async-promise-executor
        async function (resolve) {
            await Promise.all([
                font.load(kDefaultFont)
            ]);
            resolve('');
        }).then(
        function resolve() { /* nothing to do for font */
        }
    );
    map.pushPromise(loadPromise);
}

// font
function getDefaultFontName() {
    return kDefaultFont;
}

export {
    init, cleanUp,

    // default system font name: this is guaranteed to be loaded
    getDefaultFontName
};
