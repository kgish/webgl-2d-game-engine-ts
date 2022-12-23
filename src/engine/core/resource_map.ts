/*
 * File: resource_map.ts
 *
 * Base module for managing storage and synchronization of all resources
 *
 */

class MapEntry {
    mData: string | null;
    mRefCount: number;

    constructor(data: string | null) {
        this.mData = data;
        this.mRefCount = 1;
    }

    decRef() {
        this.mRefCount--;
    }

    incRef() {
        this.mRefCount++;
    }

    set(data: string) {
        this.mData = data;
    }

    data = () => this.mData;

    canRemove = () => this.mRefCount === 0;
}

const mMap = new Map<string, MapEntry>();
let mOutstandingPromises: Array<Promise<string>> = [];

function has(path: string) {
    return mMap.has(path);
}

function set(key: string, value: string) {
    const entry = mMap.get(key);
    if (entry) {
        entry.set(value);
    }
}

function loadRequested(path: string) {
    mMap.set(path, new MapEntry(null));
}

function incRef(path: string) {
    const entry = mMap.get(path);
    if (entry) {
        entry.incRef();
    }
}

// returns the resource of path. An error to if path is not found
function get(path: string) {
    if (!has(path)) {
        throw new Error('Error [' + path + ']: not loaded!');
    }
    return mMap.get(path)?.data();
}

// generic loading function,
//   Step 1: fetch from server
//   Step 2: decodeResource on the loaded package
//   Step 3: parseResource on the decodedResource
//   Step 4: store result into the map
// Push the promised operation into an array
function loadDecodeParse(path: string, decodeResource: { (data: { text: () => string }): string; (arg0: Response): string; }, parseResource: { (text: string): string; (arg0: string): string; }) {
    let fetchPromise: Promise<string> | null = null;
    if (!has(path)) {
        loadRequested(path);
        fetchPromise = fetch(path)
            .then(res => decodeResource(res))
            .then(data => parseResource(data))
            .then(data => {
                set(path, data);
                return data;
            })
            .catch(err => {
                throw err;
            });
        pushPromise(fetchPromise);
    } else {
        incRef(path);  // increase reference count
    }
    return fetchPromise;
}

// returns true if unload is successful
function unload(path: string) {
    const entry = mMap.get(path);
    if (entry) {
        entry.decRef();
        if (entry.canRemove()) {
            mMap.delete(path);
        }
        return entry.canRemove();
    } else {
        return false;
    }
}

function pushPromise(promise: Promise<string>) {
    mOutstandingPromises.push(promise);
}

// will block, wait for all outstanding promises complete
// before continue
async function waitOnPromises() {
    await Promise.all(mOutstandingPromises);
    mOutstandingPromises = []; // remove all
}

export { has, get, set, loadRequested, incRef, loadDecodeParse, unload, pushPromise, waitOnPromises };
