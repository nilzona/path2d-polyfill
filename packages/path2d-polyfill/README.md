# path2d-polyfill

[![CI](https://github.com/nilzona/path2d-polyfill/actions/workflows/ci.yml/badge.svg)](https://github.com/nilzona/path2d-polyfill/actions/workflows/ci.yml)

Polyfills `Path2D` api and `roundRect` for CanvasRenderingContext2D

## Usage

Add this script tag to your page to enable the feature.

```html
<script lang="javascript" src="https://cdn.jsdelivr.net/npm/path2d-polyfill/dist/path2d-polyfill.min.js"></script>
```

This will polyfill the browser's window object with Path2D features and it will also polyfill roundRect if they are missing in both CanvasRenderingContexst and Path2D.

Example of usage

```javascript
ctx.fill(new Path2D("M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z"));
ctx.stroke(new Path2D("M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z"));

// Enhanced roundRect with elliptical corners
const path = new Path2D();
path.roundRect(10, 10, 100, 60, { x: 20, y: 10 }); // Elliptical corners
ctx.stroke(path);

// Mixed corner types
const path2 = new Path2D();
path2.roundRect(10, 10, 100, 60, [{ x: 15, y: 5 }, 10, { x: 5, y: 15 }, 8]);
ctx.stroke(path2);
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
| roundRect()          |    Yes    |

## Enhanced roundRect with Elliptical Corners

The `roundRect` method now supports elliptical corners using `DOMPointInit` objects:

```javascript
// Traditional circular corners (backward compatible)
path.roundRect(x, y, width, height, radius);
path.roundRect(x, y, width, height, [r1, r2, r3, r4]);

// NEW: Elliptical corners
path.roundRect(x, y, width, height, { x: rx, y: ry });
path.roundRect(x, y, width, height, [{ x: rx1, y: ry1 }, r2, { x: rx3, y: ry3 }, r4]);

// Partial DOMPointInit (missing values default to 0)
path.roundRect(x, y, width, height, { x: rx }); // y defaults to 0
path.roundRect(x, y, width, height, { y: ry }); // x defaults to 0
```

When `x !== y` in a `DOMPointInit` object, elliptical corners are created. When `x === y` or using numbers, circular corners are created, maintaining full backward compatibility.

## See it in action

Clone [path2d-polyfill](https://github.com/nilzona/path2d-polyfill)

```shell
pnpm install
pnpm dev
```

open <http://localhost:5173/> to see the example page.

## Contributing

Recommended to use vscode with the prettier extension to keep formatting intact.
