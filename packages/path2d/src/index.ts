/**
 * @fileoverview Path2D Implementation - A complete implementation of the Path2D API with roundRect support
 *
 * This package provides a full implementation of the browser's Path2D API along with the roundRect functionality.
 * It can be used standalone or as a foundation for polyfills.
 *
 * Key features:
 * - Complete Path2D class implementation with all standard methods
 * - SVG path string parsing support
 * - Canvas integration functions for enhanced drawing capabilities
 * - roundRect implementation for both Path2D and CanvasRenderingContext2D
 * - TypeScript support with comprehensive type definitions
 *
 * @example
 * ```typescript
 * import { Path2D, applyPath2DToCanvasRenderingContext } from 'path2d';
 *
 * // Use Path2D directly
 * const path = new Path2D('M10,10 L50,50 Z');
 * path.roundRect(60, 10, 100, 50, 10);
 *
 * // Enhance canvas context with Path2D support
 * applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D);
 *
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * ctx.fill(path); // Now supports Path2D objects
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 */

export * from "./apply.js";
export * from "./parse-path.js";
export * from "./path2d.js";
export * from "./round-rect.js";
export type * from "./types.js";
