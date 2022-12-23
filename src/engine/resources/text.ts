/*
 * File: text.ts
 *
 * Logics for loading a text file into the resource_map
 */

import * as map from '../core/resource_map';

// functions from resource_map
const unload = map.unload;
const has = map.has;
const get = map.get;

const decodeText = (data: Response) => data.text();

const parseText = (text: string) => text;

const load = (path: string) => map.loadDecodeParse(path, decodeText, parseText);

export { has, get, load, unload };
