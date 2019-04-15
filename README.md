# path2d-polyfill

[![CircleCI](https://circleci.com/gh/nilzona/path2d-polyfill/tree/master.svg?style=svg&circle-token=912100b3186daf870257a302f7509b0c92f18ae1)](https://circleci.com/gh/nilzona/path2d-polyfill/tree/master)

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
    <script lang="javascript" src='node_modules/path2d-polyfill/path2d-polyfill.js'></script>
  </body>
</html>
```
or import with module bundler e.g. webpack *before* you try to use the feature
```javascript
require('path2d-polyfill');
```
or if you use transpiler to support es2015+ modules
```javascript
import 'path2d-polyfill';
```

## Support table
| Method        | Supported     |
| ------------- |:-------------:|
| constructor(SVGPath) | Yes |
| addPath()      | Yes  |
| closePath()    | Yes |
| moveTo()       | Yes |
| lineTo()       | Yes |
| bezierCurveTo() | Yes |
| quadraticCurveTo() | Yes |
| arc()       | Yes |
| ellipse()       | Yes |
| rect()       | Yes |

You can render SVG paths like this
```javascript
ctx.fill(new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z'));
ctx.stroke(new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z'));
```


## See it in action

Clone this repo and run the following
```
npm install
npm start
```
open http://localhost:8080 to see the example page.
