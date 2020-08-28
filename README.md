# path2d-polyfill

![master](https://github.com/nilzona/path2d-polyfill/workflows/Build,%20Test%20and%20maybe%20Publish/badge.svg)

Polyfills Path2D api for rendering SVG paths in canvas

Use this to enable Path2D features in e.g. Internet Explorer.

## Usage

```
npm install --save path2d-polyfill
```

include directly in html-page

```html
<html>
  <head>
    ...
  </head>
  <body>
    <script
      lang="javascript"
      src="node_modules/path2d-polyfill/path2d-polyfill.js"
    ></script>
  </body>
</html>
```

or import with module bundler e.g. webpack _before_ you try to use the feature

```javascript
require('path2d-polyfill');
```

or if you use transpiler to support es2015+ modules

```javascript
import 'path2d-polyfill';
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
ctx.fill(new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z'));
ctx.stroke(new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z'));
```

## See it in action

Clone this repo and run the following

```
yarn
yarn start
```

open http://localhost:10001 to see the example page.

## Contributing

Recommended to use vscode with the prettier extension and use "format on save" option
