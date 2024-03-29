/*
 * File: scene_file_parser.ts
 *
 * Scene file parsing utils.
 */

import { vec2 } from 'gl-matrix';

// Engine utility stuff
import engine from '../../engine/index';
import Renderable from '../../engine/renderables/renderable';

class SceneFileParser {
    mSceneXml: XMLDocument;

    constructor(sceneFilePath: string) {
        this.mSceneXml = engine.text.get(sceneFilePath) as XMLDocument;
    }

    _getElm(tagElm: string) {
        const theElm = this.mSceneXml.getElementsByTagName(tagElm);
        if (theElm.length === 0) {
            console.error('Warning: Level element:[' + tagElm + ']: is not found!');
        }
        return theElm;
    }

    parseCamera() {
        const camElm = this._getElm('Camera');
        const cx = Number(camElm[0].getAttribute('CenterX'));
        const cy = Number(camElm[0].getAttribute('CenterY'));
        const w = Number(camElm[0].getAttribute('Width'));
        const viewport: string[] | number[] = camElm[0].getAttribute('Viewport')?.split(' ') || [ 0, 0, 0, 0 ];
        const bgColor: string[] | number[] = camElm[0].getAttribute('BgColor')?.split(' ') || [ 0, 0, 0, 0 ];
        // make sure viewport and color are number
        for (let j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }

        const cam = new engine.Camera(
            vec2.fromValues(cx, cy),  // position of the camera
            w,                        // width of camera
            viewport as number[]      // viewport (orgX, orgY, width, height)
        );
        cam.setBackgroundColor(bgColor as number[]);
        return cam;
    }

    parseSquares(sqSet: Renderable[]) {
        const elm = this._getElm('Square');
        let x, y, w, h, r, c, sq;
        for (let i = 0; i < elm.length; i++) {
            x = Number(elm.item(i)?.attributes.getNamedItem('PosX')?.value);
            y = Number(elm.item(i)?.attributes.getNamedItem('PosY')?.value);
            w = Number(elm.item(i)?.attributes.getNamedItem('Width')?.value);
            h = Number(elm.item(i)?.attributes.getNamedItem('Height')?.value);
            r = Number(elm.item(i)?.attributes.getNamedItem('Rotation')?.value);
            c = elm.item(i)?.attributes.getNamedItem('Color')?.value.split(' ') || [ 0, 0, 0, 0 ];
            sq = new engine.Renderable();
            // make sure color array contains numbers
            for (let j = 0; j < 3; j++) {
                c[j] = Number(c[j]);
            }
            sq.setColor(c as number[]);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }


    parseTextureSquares(sqSet: Renderable[]) {
        const elm = this._getElm('TextureSquare');
        let x, y, w, h, r, c, t, sq;
        for (let i = 0; i < elm.length; i++) {
            x = Number(elm.item(i)?.attributes.getNamedItem('PosX')?.value);
            y = Number(elm.item(i)?.attributes.getNamedItem('PosY')?.value);
            w = Number(elm.item(i)?.attributes.getNamedItem('Width')?.value);
            h = Number(elm.item(i)?.attributes.getNamedItem('Height')?.value);
            r = Number(elm.item(i)?.attributes.getNamedItem('Rotation')?.value);
            c = elm.item(i)?.attributes.getNamedItem('Color')?.value.split(' ') || [ 0, 0, 0, 0 ];
            t = elm.item(i)?.attributes.getNamedItem('Texture')?.value || '';
            sq = new engine.TextureRenderable(t);
            // make sure color array contains numbers
            for (let j = 0; j < 4; j++)
                c[j] = Number(c[j]);
            sq.setColor(c as number[]);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
}

export default SceneFileParser;
