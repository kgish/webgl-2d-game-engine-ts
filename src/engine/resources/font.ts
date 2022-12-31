/*
 * File: font.ts
 *
 * Logics for loading font into the resource_map
 * Note that 'font' consists of two files
 *    => the bitmap font image
 *    => the associated xml descriptor file
 */

import * as texture from './texture.js';
import * as xml from './xml.js';

const kImageExt = '.png';  // extension for the bitmap font image
const kDescExt = '.fnt';   // extension for the bitmap font description

// for convenient communication of per-character information
// all size returned are in normalize unit (range between 0 to 1)
class CharacterInfo {
    // in texture coordinate (0 to 1) maps to the entire image
    mTexCoordLeft = 0;
    mTexCoordRight = 1;
    mTexCoordBottom = 0;
    mTexCoordTop = 0;

    // reference to nominal character size, 1 is 'standard width/height' of a char
    mCharWidth = 1;
    mCharHeight = 1;
    mCharWidthOffset = 0;
    mCharHeightOffset = 0;

    // reference of char width/height ratio
    mCharAspectRatio = 1;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }
}

function imageName(fontName: string) {
    return fontName + kImageExt;
}

function descName(fontName: string) {
    return fontName + kDescExt;
}

function load(fontName: string) {
    texture.load(imageName(fontName));
    xml.load(descName(fontName));
}

// Remove the reference to allow associated memory
// be available for subsequent garbage collection
function unload(fontName: string) {
    texture.unload(imageName(fontName));
    xml.unload(descName(fontName));
}

function has(fontName: string) {
    return texture.has(imageName(fontName)) && xml.has(descName(fontName));
}

function getCharInfo(fontName: string, aChar: number) {
    let returnInfo = null;
    const fontInfo = xml.get(descName(fontName)) as XMLDocument;
    if (!fontInfo) {
        throw new Error('Cannot get font info!');
    }

    const commonPath = 'font/common';
    let commonInfo: Node | XPathResult | null = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    commonInfo = commonInfo.iterateNext();
    if (commonInfo === null) {
        return returnInfo;
    }
    const charHeight = Number((commonInfo as HTMLElement).getAttribute('base'));

    const charPath = 'font/chars/char[@id=' + aChar + ']';
    let charInfo: Element | Node | XPathResult | null = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
    charInfo = charInfo.iterateNext();

    if (charInfo === null) {
        return returnInfo;
    }

    returnInfo = new CharacterInfo();
    const texInfo = texture.get(imageName(fontName)) as {mWidth: number, mHeight: number};
    if (!texInfo) {
        throw new Error('Cannot get texture info!');
    }

    const leftPixel = Number((charInfo as Element).getAttribute('x'));
    const rightPixel = leftPixel + Number((charInfo as Element).getAttribute('width')) - 1;
    const topPixel = (texInfo.mHeight - 1) - Number((charInfo as Element).getAttribute('y'));
    const bottomPixel = topPixel - Number((charInfo as Element).getAttribute('height')) + 1;

    // texture coordinate information
    returnInfo.mTexCoordLeft = leftPixel / (texInfo.mWidth - 1);
    returnInfo.mTexCoordTop = topPixel / (texInfo.mHeight - 1);
    returnInfo.mTexCoordRight = rightPixel / (texInfo.mWidth - 1);
    returnInfo.mTexCoordBottom = bottomPixel / (texInfo.mHeight - 1);

    // relative character size
    const charWidth = Number((charInfo as Element).getAttribute('xadvance'));
    returnInfo.mCharWidth = Number((charInfo as Element).getAttribute('width')) / charWidth;
    returnInfo.mCharHeight = Number((charInfo as Element).getAttribute('height')) / charHeight;
    returnInfo.mCharWidthOffset = Number((charInfo as Element).getAttribute('xoffset')) / charWidth;
    returnInfo.mCharHeightOffset = Number((charInfo as Element).getAttribute('yoffset')) / charHeight;
    returnInfo.mCharAspectRatio = charWidth / charHeight;

    return returnInfo;
}

export {
    has, load, unload,

    imageName, descName,

    CharacterInfo,

    getCharInfo
};
