# path2d-polyfill

[![validate](https://github.com/nilzona/path2d-polyfill/actions/workflows/validate.yaml/badge.svg)](https://github.com/nilzona/path2d-polyfill/actions/workflows/validate.yaml)

Polyfills Path2D api for rendering SVG paths in canvas

Use this to enable Path2D features in e.g. Internet Explorer.

## Usage

Load from cdn

```html
<script lang="javascript" src="https://unpkg.com/path2d-polyfill"></script>
```

or install from npm

```shell
npm install --save path2d-polyfill
```

and import with module bundler e.g. webpack _before_ you try to use the feature

```javascript
require("path2d-polyfill");
```

or with es2015+ modules

```javascript
import "path2d-polyfill";
```

## Support table

| Method               | Supported |
| -------------------- | :-------: |
| constructor(SVGPath) |    Yes    |
| addPath()            |    Yes    |
| closePath()          |    Yes    |
| moveTo()             |    Yes    |
| lineTo()             |    Yes    |
| bezierCurveTo()      |    Yes    |
| quadraticCurveTo()   |    Yes    |
| arc()                |    Yes    |
| ellipse()            |    Yes    |
| rect()               |    Yes    |

Example of usage

```javascript
ctx.fill(new Path2D("M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z"));
ctx.stroke(new Path2D("M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z"));
```

## See it in action

Clone this repo and run the following

```shell
yarn
yarn start
```

open <http://localhost:10001> to see the example page.

## Contributing

Recommended to use vscode with the prettier extension and use "format on save" option
