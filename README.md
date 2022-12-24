# webgl-2d-game-engine-ts

My very own JavaScript 2D Game Engine.

## Introduction

Implemented my very own game engine using WebGL2 and TypeScript, based on the book [Build Your Own 2D Game Engine and Create Great Web Games](https://link.springer.com/book/10.1007/978-1-4842-7377-7).

![](images/screenshot.png)

## Installation

```bash
git clone https://github.com/kgish/webgl-2d-game-engine-ts.git
cd webgl-2d-game-engine-ts
yarn
```

## Run

```bash
yarn dev
```

Point your favorite browser to `http://localhost:1234` and enjoy!

## Build

```bash
yarn build
```

## Lint

```bash
yarn lint
```

## Test

```bash
yarn test
```

## Static files (assets)

In order to get the static files loaded correctly, e.g. the GLSL shaders, I needed to install the parcel2 plugin [parcel-reporter-multiple-static-file-copier](https://www.npmjs.com/package/parcel-reporter-multiple-static-file-copier).

```
yarn add parcel-reporter-static-files-copy --dev
```

Then I created a new `public` directory in the project root, moved all of the assets there, and modified the `.parcelrc` file to include:

```
{
  "extends": ["@parcel/config-default"],
  "reporters":  ["...", "parcel-reporter-static-files-copy"]
}
```

Finally, I added the following lines to the `package.json` file:

```
{
  ...
  "staticFiles": {
    "staticPath": "public",
    "watcherGlob": "**"
  },
  "multipleStaticFileCopier": [
    {
      "origin": "public",
      "destination": "dist/"
    },
    {
      "origin": "src/glsl_shaders",
      "destination": "public/glsl_shaders"
    }
  ],
  ...    
```

## References

* [Build Your Own 2D Game Engine and Create Great Web Games](https://link.springer.com/book/10.1007/978-1-4842-7377-7).
* [Github Code sources](https://github.com/Apress/build-your-own-2d-game-engine-2e)
* [WebGL2 Fundamentals](https://webgl2fundamentals.org)
* [Parcel](https://parceljs.org)
* [TypeScript](https://www.typescriptlang.org)
* [EsLint](https://eslint.org)
* [Stylelint](https://stylelint.io)
* [parcel-reporter-multiple-static-file-copier](https://www.npmjs.com/package/parcel-reporter-multiple-static-file-copier)
