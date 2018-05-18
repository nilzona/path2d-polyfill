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

## See it in action

Clone this repo and run the following
```
npm install
npm run example
```
open http://localhost:3000 to see the example page.