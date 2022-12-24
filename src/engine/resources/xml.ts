/*
 * File: xml.ts
 *
 * Logics for loading an xml file into the resource_map
 */

import * as map from '../core/resource_map';

// functions from resource_map
const unload = map.unload;
const has = map.has;
const get = map.get;

const mParser = new DOMParser();

const decodeXML = (data: Response) => data.text();

const parseXML = (text: string) => mParser.parseFromString(text, "text/xml");

const load = (path: string) => map.loadDecodeParse(path, decodeXML, parseXML);

export { has, get, load, unload };
