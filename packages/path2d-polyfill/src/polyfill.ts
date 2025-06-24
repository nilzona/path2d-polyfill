/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  Path2D,
  applyPath2DToCanvasRenderingContext,
  applyRoundRectToCanvasRenderingContext2D,
  applyRoundRectToPath2D,
} from "path2d";

/**
 * Polyfills Path2D API and roundRect functionality for browsers that don't support them natively.
 *
 * This function automatically detects what polyfills are needed and applies them:
 * 1. If Path2D is not supported, adds Path2D class and enhances CanvasRenderingContext2D
 * 2. If roundRect is not supported on Path2D, adds the roundRect method
 * 3. If roundRect is not supported on CanvasRenderingContext2D, adds the roundRect method
 *
 * The polyfill is safe to call multiple times and will only add missing functionality.
 *
 * Browser support added:
 * - Path2D API (missing in older browsers)
 * - Path2D support for canvas fill(), stroke(), clip(), and isPointInPath() methods
 * - roundRect method on both CanvasRenderingContext2D and Path2D (missing in Firefox and older browsers)
 *
 * @example
 * ```typescript
 * // Apply all necessary polyfills
 * polyfillPath2D();
 *
 * // Now Path2D and roundRect work in all browsers
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * const path = new Path2D('M10,10 L50,50 Z');
 *
 * ctx.fill(path); // Works even in browsers without native Path2D support
 * ctx.roundRect(10, 10, 100, 50, 10); // Works even in Firefox
 * path.roundRect(120, 10, 100, 50, [5, 10]); // Works everywhere
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect} MDN roundRect Documentation
 */
export function polyfillPath2D() {
  if (window) {
    // Check if Path2D is missing and CanvasRenderingContext2D is available
    if (window.CanvasRenderingContext2D && !window.Path2D) {
      // Add Path2D to the global window object
      // @ts-expect-error polyfilling - intentionally adding to global scope
      window.Path2D = Path2D;
      // Enhance CanvasRenderingContext2D to support Path2D objects
      applyPath2DToCanvasRenderingContext(window.CanvasRenderingContext2D);
    }

    // Always check for roundRect support, regardless of Path2D availability
    // This ensures roundRect works even when Path2D is natively supported
    // @ts-expect-error polyfilling
    applyRoundRectToPath2D(window.Path2D);
    applyRoundRectToCanvasRenderingContext2D(window.CanvasRenderingContext2D);
  }
}
