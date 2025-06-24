/**
 * @fileoverview Test helper types and mock implementations for testing Path2D functionality
 *
 * This module provides mock implementations of browser APIs for testing purposes.
 * These classes simulate the behavior of CanvasRenderingContext2D without requiring
 * an actual browser environment or canvas element.
 */

/* eslint-disable @typescript-eslint/class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Path2D } from "../path2d.js";
import type { CanvasFillRule, ICanvasRenderingContext2D } from "../types.js";

/**
 * Mock implementation of CanvasRenderingContext2D for testing purposes.
 *
 * This class implements the ICanvasRenderingContext2D interface with no-op methods,
 * allowing tests to run without requiring an actual canvas element. It includes
 * support for the roundRect method.
 *
 * @example
 * ```typescript
 * const mockContext = new CanvasRenderingContext2DForTest();
 * const path = new Path2D();
 * path.buildPathInCanvas(mockContext); // Won't actually draw anything
 * ```
 */
export class CanvasRenderingContext2DForTest implements ICanvasRenderingContext2D {
  strokeStyle: string | null;
  lineWidth: number | null;

  constructor() {
    this.strokeStyle = null;
    this.lineWidth = null;
  }
  clip(a?: CanvasFillRule | Path2D, b?: CanvasFillRule) {}
  fill(a?: CanvasFillRule | Path2D, b?: CanvasFillRule) {}
  stroke(a?: CanvasFillRule | Path2D) {}
  isPointInPath(a: number | Path2D, b: number, c?: number | CanvasFillRule, d?: number | CanvasFillRule) {
    return false;
  }
  beginPath() {}
  moveTo() {}
  lineTo() {}
  ellipse() {}
  arc() {}
  arcTo() {}
  closePath() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  rect() {}
  roundRect() {}
  save() {}
  translate() {}
  rotate() {}
  scale() {}
  restore() {}
}

/**
 * Mock implementation of CanvasRenderingContext2D without roundRect support.
 *
 * This class simulates older browsers or environments that don't support the
 * roundRect method natively. Used for testing polyfill functionality.
 *
 * @example
 * ```typescript
 * const mockContext = new CanvasRenderingContext2DForTestWithoutRoundRect();
 * // mockContext.roundRect is undefined, simulating older browsers
 * ```
 */
export class CanvasRenderingContext2DForTestWithoutRoundRect {
  strokeStyle: string | null;
  lineWidth: number | null;

  constructor() {
    this.strokeStyle = null;
    this.lineWidth = null;
  }
  clip(a?: CanvasFillRule | Path2D, b?: CanvasFillRule) {}
  fill(a?: CanvasFillRule | Path2D, b?: CanvasFillRule) {}
  stroke(a?: CanvasFillRule | Path2D) {}
  isPointInPath(a: number | Path2D, b: number, c?: number | CanvasFillRule, d?: number | CanvasFillRule) {
    return false;
  }
  beginPath() {}
  moveTo() {}
  lineTo() {}
  ellipse() {}
  arc() {}
  arcTo() {}
  closePath() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  rect() {}
  save() {}
  translate() {}
  rotate() {}
  scale() {}
  restore() {}
}

/**
 * Interface representing the global window object for testing purposes.
 *
 * This interface defines the structure of global objects that polyfills
 * typically interact with, allowing tests to simulate different browser
 * environments and support levels.
 *
 * @example
 * ```typescript
 * const mockGlobal: Global = {
 *   CanvasRenderingContext2D: CanvasRenderingContext2DForTest,
 *   Path2D: Path2D
 * };
 * ```
 */
export interface Global {
  CanvasRenderingContext2D: typeof CanvasRenderingContext2DForTest;
  Path2D: typeof Path2D;
}
