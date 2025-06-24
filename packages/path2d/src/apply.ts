import { Path2D } from "./path2d.js";
import { roundRect } from "./round-rect.js";
import type { CanvasFillRule, ICanvasRenderingContext2D, MakeOptional, Prototype } from "./types.js";

/**
 * Type definition for the original canvas fill function.
 * Used to preserve the original functionality when overriding canvas methods.
 */
type FillFn = (fillRule?: CanvasFillRule) => void;

/**
 * Type definition for the original canvas stroke function.
 * Used to preserve the original functionality when overriding canvas methods.
 */
type StrokeFn = () => void;

/**
 * Type definition for the original canvas isPointInPath function.
 * Used to preserve the original functionality when overriding canvas methods.
 */
type IsPointInPathFn = (x: number, y: number, fillRule?: CanvasFillRule) => boolean;

/**
 * Enhances CanvasRenderingContext2D with Path2D support for stroke, fill, clip, and isPointInPath methods.
 *
 * This function modifies the prototype of CanvasRenderingContext2D to accept Path2D objects
 * as parameters in addition to the standard path operations. It preserves the original
 * functionality while adding Path2D compatibility.
 *
 * Modified methods:
 * - `fill()`: Can now accept a Path2D object as first parameter
 * - `stroke()`: Can now accept a Path2D object as parameter
 * - `clip()`: Can now accept a Path2D object as first parameter
 * - `isPointInPath()`: Can now accept a Path2D object as first parameter
 *
 * @param CanvasRenderingContext2D - The CanvasRenderingContext2D constructor object to enhance
 *
 * @example
 * ```typescript
 * // Apply Path2D support to canvas context
 * applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D);
 *
 * // Now you can use Path2D objects with canvas methods
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * const path = new Path2D('M10,10 L50,50 Z');
 *
 * ctx.fill(path); // Fill the Path2D object
 * ctx.stroke(path); // Stroke the Path2D object
 * ctx.clip(path); // Use Path2D object as clipping region
 * const isInside = ctx.isPointInPath(path, 25, 25); // Test point against Path2D
 * ```
 */
export function applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D?: Prototype<ICanvasRenderingContext2D>) {
  if (!CanvasRenderingContext2D) return;

  // setting unbound functions here. Make sure this is set in function call later
  const cClip: FillFn = CanvasRenderingContext2D.prototype.clip;
  const cFill: FillFn = CanvasRenderingContext2D.prototype.fill;
  const cStroke: StrokeFn = CanvasRenderingContext2D.prototype.stroke;
  const cIsPointInPath: IsPointInPathFn = CanvasRenderingContext2D.prototype.isPointInPath;

  /**
   * Enhanced clip method that supports Path2D objects.
   * Creates a clipping region from the current path or a specified Path2D object.
   */
  CanvasRenderingContext2D.prototype.clip = function clip(...args: unknown[]) {
    if (args[0] instanceof Path2D) {
      const path = args[0];
      const fillRule = args[1] !== undefined ? (args[1] as CanvasFillRule) : "nonzero";
      path.buildPathInCanvas(this as ICanvasRenderingContext2D);
      cClip.apply(this, [fillRule]);
      return;
    }
    const fillRule = args[0] !== undefined ? (args[0] as CanvasFillRule) : "nonzero";
    cClip.apply(this, [fillRule]);
  };

  /**
   * Enhanced fill method that supports Path2D objects.
   * Fills the current path or a specified Path2D object with the current fill style.
   */
  CanvasRenderingContext2D.prototype.fill = function fill(...args: unknown[]) {
    if (args[0] instanceof Path2D) {
      const path = args[0];
      const fillRule = args[1] !== undefined ? (args[1] as CanvasFillRule) : "nonzero";
      path.buildPathInCanvas(this as ICanvasRenderingContext2D);
      cFill.apply(this, [fillRule]);
      return;
    }
    const fillRule = args[0] !== undefined ? (args[0] as CanvasFillRule) : "nonzero";
    cFill.apply(this, [fillRule]);
  };

  /**
   * Enhanced stroke method that supports Path2D objects.
   * Strokes the current path or a specified Path2D object with the current stroke style.
   */
  CanvasRenderingContext2D.prototype.stroke = function stroke(path?: Path2D) {
    if (path) {
      path.buildPathInCanvas(this as ICanvasRenderingContext2D);
    }
    cStroke.apply(this);
  };

  /**
   * Enhanced isPointInPath method that supports Path2D objects.
   * Determines whether a specified point is inside the current path or a specified Path2D object.
   */
  CanvasRenderingContext2D.prototype.isPointInPath = function isPointInPath(...args: unknown[]) {
    if (args[0] instanceof Path2D) {
      // first argument is a Path2D object
      const path = args[0];
      const x = args[1] as number;
      const y = args[2] as number;
      const fillRule = args[3] !== undefined ? (args[3] as CanvasFillRule) : "nonzero";
      path.buildPathInCanvas(this as ICanvasRenderingContext2D);
      return cIsPointInPath.apply(this, [x, y, fillRule]);
    }
    return cIsPointInPath.apply(this, args as [x: number, y: number, fillRule: CanvasFillRule]);
  };
}

/**
 * Polyfills the roundRect method on CanvasRenderingContext2D for browsers that don't support it natively.
 *
 * The roundRect method adds a rounded rectangle to the current path. This polyfill ensures
 * compatibility with browsers like Firefox that may not have native roundRect support.
 *
 * @param CanvasRenderingContext2D - The CanvasRenderingContext2D constructor object to polyfill
 *
 * @example
 * ```typescript
 * // Apply roundRect polyfill
 * applyRoundRectToCanvasRenderingContext2D(CanvasRenderingContext2D);
 *
 * // Now roundRect is available even in unsupported browsers
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * ctx.roundRect(10, 10, 100, 50, 10); // Works in all browsers
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect} MDN roundRect Documentation
 */
export function applyRoundRectToCanvasRenderingContext2D(
  CanvasRenderingContext2D?: Prototype<MakeOptional<ICanvasRenderingContext2D, "roundRect">>,
) {
  // Only add roundRect if it doesn't already exist (polyfill for browsers like Firefox)
  // See: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect#browser_compatibility
  if (CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = roundRect;
  }
}

/**
 * Polyfills the roundRect method on Path2D for browsers that don't support it natively.
 *
 * The roundRect method adds a rounded rectangle to a Path2D object. This polyfill ensures
 * compatibility with browsers that may not have native roundRect support on Path2D objects.
 *
 * @param P2D - The Path2D constructor object to polyfill
 *
 * @example
 * ```typescript
 * // Apply roundRect polyfill to Path2D
 * applyRoundRectToPath2D(Path2D);
 *
 * // Now roundRect is available on Path2D objects
 * const path = new Path2D();
 * path.roundRect(10, 10, 100, 50, [10, 20]); // Works in all browsers
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 */
export function applyRoundRectToPath2D(P2D?: Prototype<MakeOptional<Path2D, "roundRect">>) {
  // Only add roundRect if it doesn't already exist (polyfill for browsers that lack support)
  // See: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect#browser_compatibility
  if (P2D && !P2D.prototype.roundRect) {
    P2D.prototype.roundRect = roundRect;
  }
}
