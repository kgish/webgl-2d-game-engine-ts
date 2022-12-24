/*
 * File: scene_file_parser.ts
 *
 * Scene file parsing utils
 */

import { vec2 } from 'gl-matrix';

// Engine utility stuff
import engine from '../../engine/index';
import Renderable from '../../engine/renderable';

class SceneFileParser {
    xml: string | null;

    constructor(xml: string | null) {
        this.xml = xml;
    }

    parseCamera() {
        const camElm = getElm(this.xml, 'Camera');
        const cx = Number(camElm[0].getAttribute('CenterX'));
        const cy = Number(camElm[0].getAttribute('CenterY'));
        const w = Number(camElm[0].getAttribute('Width'));
        const viewport = camElm[0].getAttribute('Viewport').split(' ');
        const bgColor = camElm[0].getAttribute('BgColor').split(' ');

        // make sure viewport and color are number
        for (let j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }

        const cam = new engine.Camera(
            vec2.fromValues(cx, cy),  // position of the camera
            w,                        // width of camera
            viewport                  // viewport (orgX, orgY, width, height)
        );
        cam.setBackgroundColor(bgColor);
        return cam;
    }

    parseSquares(sqSet: Renderable[]) {
        const elm = getElm(this.xml, 'Square');
        let i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem('PosX').value);
            y = Number(elm.item(i).attributes.getNamedItem('PosY').value);
            w = Number(elm.item(i).attributes.getNamedItem('Width').value);
            h = Number(elm.item(i).attributes.getNamedItem('Height').value);
            r = Number(elm.item(i).attributes.getNamedItem('Rotation').value);
            c = elm.item(i).attributes.getNamedItem('Color').value.split(' ');
            sq = new engine.Renderable();
            // make sure color array contains numbers
            for (j = 0; j < 4; j++) {
                c[j] = Number(c[j]);
            }
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
}

function getElm(xmlContent, tagElm: string) {
    const theElm = xmlContent.getElementsByTagName(tagElm);
    if (theElm.length === 0) {
        console.error('Warning: Level element:[' + tagElm + ']: is not found!');
    }
    return theElm;
}


export default SceneFileParser;
