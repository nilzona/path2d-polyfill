---
"path2d": patch
---

fix: parse compact SVG arc flags and scale roundRect radii per spec

- `parsePath`/`new Path2D(svgPath)` now correctly parse elliptical arc commands whose `large-arc-flag` and `sweep-flag` are written without separators (e.g. the compact `a5 5 0 0110 10` produced by SVGO), so compact arcs match their spaced equivalents.
- `roundRect` now scales all corner radii together (per the HTML Canvas spec) instead of clamping each corner to `width / 2` / `height / 2`, and normalizes negative `width`/`height` so no negative radius is passed to `ellipse()`.
