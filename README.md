# path2d-polyfill
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
| addPath()      | No  |
| closePath()    | Yes |
| moveTo()       | Yes |
| lineTo()       | Yes |
| bezierCurveTo() | Yes |
| quadraticCurveTo() | Yes |
| arc()       | Yes |
| ellipse()       | No |
| rect()       | Yes |

You can render SVG paths like this
```javascript
ctx.fill(new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z'));
ctx.stroke(new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z'));
```

<aside class="notice">
Unfortunately Internet Explorer does not support the `ellipse()` function so Arc commands in SVG Paths will always be circular and default to the first radius parameter (and because of that ignore the rotation). That can cause undesirable behaviour.
</aside>


## See it in action

Clone this repo and run the following
```
npm install
npm run example
```
open http://localhost:3000 to see the example page.