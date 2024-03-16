/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-redundant-type-constituents */
import { type CanvasFillRule, type ICanvasRenderingContext2D, type Path2D } from "path2d";

export class CanvasRenderingContext2DForTest implements ICanvasRenderingContext2D {
  strokeStyle: string | null;
  lineWidth: number | null;
  constructor() {
    this.strokeStyle = null;
    this.lineWidth = null;
  }
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

export type IPrototype<T> = {
  prototype: T;
  new (): T;
};

export interface Global {
  CanvasRenderingContext2D: typeof CanvasRenderingContext2DForTest;
  Path2D: typeof Path2D;
}
