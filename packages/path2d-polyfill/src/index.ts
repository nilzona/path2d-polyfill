/**
 * @fileoverview Path2D Polyfill - Automatic polyfill for Path2D API and roundRect functionality
 *
 * This package automatically polyfills Path2D API and roundRect functionality when imported.
 * Simply import this package and all necessary polyfills will be applied automatically.
 *
 * @example
 * ```typescript
 * // Just import to apply all polyfills
 * import 'path2d-polyfill';
 *
 * // Now Path2D and roundRect work in all browsers
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * const path = new Path2D('M10,10 L50,50 Z');
 *
 * ctx.fill(path); // Works even without native Path2D support
 * ctx.roundRect(10, 10, 100, 50, 10); // Works even in Firefox
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect} MDN roundRect Documentation
 */

import { polyfillPath2D } from "./polyfill";

// Automatically invoke polyfill upon loading this module
// This ensures all necessary functionality is available as soon as the package is imported
polyfillPath2D();
