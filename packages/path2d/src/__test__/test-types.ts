/* eslint-disable @typescript-eslint/class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Path2D } from "../path2d.js";
import type { CanvasFillRule, ICanvasRenderingContext2D, IPath2D } from "../types.js";

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

export interface Global {
  CanvasRenderingContext2D: typeof CanvasRenderingContext2DForTest;
  Path2D: typeof Path2D;
}
