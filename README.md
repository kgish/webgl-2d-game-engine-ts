# webgl-2d-game-engine-ts

My very own JavaScript 2D Game Engine using TypeScript

## Introduction

Implemented my very own game engine using WebGL2 and TypeScript, based on the book [Build Your Own 2D Game Engine and Create Great Web Games](https://link.springer.com/book/10.1007/978-1-4842-7377-7) by Kelvin Sung et al.

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

In order to get the static files loaded correctly, e.g. the GLSL shaders, I needed to install the parcel2 plugin [parcel-plugin-static-files-copy](https://github.com/elwin013/parcel-plugin-static-files-copy).

```
yarn add parcel-plugin-static-files-copy --dev
```

Then I created a new `public` directory in the project root, moved all of the assets there, and modified the `.package.json` file:

```
{
  ...
  "staticFiles": {
    "staticPath": ["public", "src/glsl_shaders"],
    "watcherGlob": "**"
  },
  ...    
```

This results in the `public` and `src/glsl_shaders` being copied to the `dist` directory.

## References

* [Build Your Own 2D Game Engine and Create Great Web Games](https://link.springer.com/book/10.1007/978-1-4842-7377-7).
* [Github Code sources](https://github.com/Apress/build-your-own-2d-game-engine-2e)
* [WebGL2 Fundamentals](https://webgl2fundamentals.org)
* [TypeScript](https://www.typescriptlang.org)
* [EsLint](https://eslint.org)
* [Stylelint](https://stylelint.io)
* [Parcel](https://parceljs.org)
* [parcel-plugin-static-files-copy](https://github.com/elwin013/parcel-plugin-static-files-copy)
