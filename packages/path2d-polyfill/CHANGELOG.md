# path2d-polyfill

## 3.1.2

### Patch Changes

- 751cc2e: chore: update npm dependencies
- Updated dependencies [751cc2e]
  - path2d@0.2.1

## 3.1.1

### Patch Changes

- 384b9a5: Drop the required node version in package.json `engines` field.

## 3.1.0

### Minor Changes

- 2de6861: Polyfill the CanvasRenderingContext.clip() function

### Patch Changes

- Updated dependencies [2de6861]
  - path2d@0.2.0

## 3.0.1

### Patch Changes

- Updated dependencies [0e6e715]
  - path2d@0.1.2

## 3.0.0

### Major Changes

- a2953fc: Path2D has been moved to it's own package and `path2d-polyfill` is now purely a browser library for applying the polyfill. All node related code has been moved to the `path2d`package.

  ```js
  import { Path2D } from "path2d";
  ```

## 2.1.1

### Patch Changes

- 56d5f7e: Path to make releasing work
- Updated dependencies [56d5f7e]
  - path2d@0.1.1

## 2.1.0

### Minor Changes

- 0290345: Publish and use `path2d` library

### Patch Changes

- Updated dependencies [0290345]
  - path2d@0.1.0
