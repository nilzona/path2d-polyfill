# path2d

## 0.3.5

### Patch Changes

- 2c7ad3c: fix: parse compact SVG arc flags and scale roundRect radii per spec

  - `parsePath`/`new Path2D(svgPath)` now correctly parse elliptical arc commands whose `large-arc-flag` and `sweep-flag` are written without separators (e.g. the compact `a5 5 0 0110 10` produced by SVGO), so compact arcs match their spaced equivalents.
  - `roundRect` now scales all corner radii together (per the HTML Canvas spec) instead of clamping each corner to `width / 2` / `height / 2`, and normalizes negative `width`/`height` so no negative radius is passed to `ellipse()`.

## 0.3.4

### Patch Changes

- d7d8414: chore: update npm dependencies

## 0.3.3

### Patch Changes

- 3cb1dfc: chore: update dependencies

## 0.3.2

### Patch Changes

- 410940c: chore: update npm dependencies

## 0.3.1

### Patch Changes

- c5b97f7: chore: update npm dependencies

## 0.3.0

### Minor Changes

- 7775746: Adds support for using DomPoints as radii in roundRect functions

### Patch Changes

- 7775746: Update of tooling, specifically eslint to support version 9+ and flat configs

## 0.2.2

### Patch Changes

- 29bdc9d: Fix rounded rect bottom-right corner

## 0.2.1

### Patch Changes

- 751cc2e: chore: update npm dependencies

## 0.2.0

### Minor Changes

- 2de6861: Polyfill the CanvasRenderingContext.clip() function

## 0.1.2

### Patch Changes

- 0e6e715: Make types compatible with node-canvas

## 0.1.1

### Patch Changes

- 56d5f7e: Path to make releasing work

## 0.1.0

### Minor Changes

- 0290345: Publish and use `path2d` library
