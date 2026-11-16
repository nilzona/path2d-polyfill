import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyPath2DToCanvasRenderingContext,
  applyRoundRectToCanvasRenderingContext2D,
  applyRoundRectToPath2D,
} from "../apply.js";
import { Path2D } from "../path2d.js";
import { CanvasRenderingContext2DForTestWithoutRoundRect } from "./test-types.js";

let ctx: CanvasRenderingContext2DForTestWithoutRoundRect;

describe("roundRect", () => {
  beforeAll(() => {
    // prep some for testing
    // @ts-expect-error testing purpose
    Path2D.prototype.roundRect = undefined;
    applyRoundRectToCanvasRenderingContext2D(CanvasRenderingContext2DForTestWithoutRoundRect);
    applyRoundRectToPath2D(Path2D);
    // @ts-expect-error roundRect has been polyffilled
    applyPath2DToCanvasRenderingContext(CanvasRenderingContext2DForTestWithoutRoundRect);
  });
  beforeEach(() => {
    ctx = new CanvasRenderingContext2DForTestWithoutRoundRect();
    vi.spyOn(ctx, "moveTo");
    vi.spyOn(ctx, "lineTo");
    vi.spyOn(ctx, "closePath");
    vi.spyOn(ctx, "bezierCurveTo");
    vi.spyOn(ctx, "quadraticCurveTo");
    vi.spyOn(ctx, "arc");
    vi.spyOn(ctx, "arcTo");
    vi.spyOn(ctx, "ellipse");
    vi.spyOn(ctx, "rect");
    vi.spyOn(ctx, "translate");
    vi.spyOn(ctx, "scale");
    vi.spyOn(ctx, "rotate");
    vi.spyOn(ctx, "save");
    vi.spyOn(ctx, "restore");
    vi.spyOn(ctx, "clip");
    vi.spyOn(ctx, "fill");
    vi.spyOn(ctx, "stroke");
    vi.spyOn(ctx, "isPointInPath");
  });

  it("with no radius", () => {
    const p = new Path2D();
    p.roundRect(20, 20, 30, 30);
    ctx.stroke(p);
    expect(ctx.rect).toHaveBeenCalledWith(20, 20, 30, 30);
  });

  it("throw error with negative radius", () => {
    const p = new Path2D();
    expect(() => {
      p.roundRect(20, 20, 30, 30, -10);
    }).toThrowError("Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative");
    expect(() => {
      p.roundRect(20, 20, 30, 30, [-10]);
    }).toThrowError("Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative");
    expect(() => {
      p.roundRect(20, 20, 30, 30, [10, -10]);
    }).toThrowError("Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative");
  });

  it("throw error when wrong amount of parameters", () => {
    const p = new Path2D();
    expect(() => {
      p.roundRect(20, 20, 30, 30, []);
    }).toThrowError(
      "Failed to execute 'roundRect' on 'Path2D': 0 radii provided. Between one and four radii are necessary",
    );
    expect(() => {
      p.roundRect(20, 20, 30, 30, [1, 2, 3, 4, 5]);
    }).toThrowError(
      "Failed to execute 'roundRect' on 'Path2D': 5 radii provided. Between one and four radii are necessary",
    );
  });

  it("with wrong radius type", () => {
    const p = new Path2D();
    // @ts-expect-error testing wrong parameter type
    p.roundRect(0, 0, 10, 10, "string");
    ctx.stroke(p);
    expect(ctx.moveTo).not.toHaveBeenCalled();
    expect(ctx.arcTo).not.toHaveBeenCalled();
    expect(ctx.closePath).not.toHaveBeenCalled();
  });

  it("with one radius", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, 1);
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 9);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 1, 0, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 10, 0, 10, 1, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 10, 10, 9, 10, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 10, 0, 9, 1);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with one radius - as array", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, [1]);
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 9);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 1, 0, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 10, 0, 10, 1, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 10, 10, 9, 10, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 10, 0, 9, 1);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with two radiuses", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, [1, 2]);
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 8);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 1, 0, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 10, 0, 10, 2, 2);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 10, 10, 9, 10, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 10, 0, 8, 2);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with three radiuses", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, [1, 2, 3]);
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 8);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 1, 0, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 10, 0, 10, 2, 2);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 10, 10, 7, 10, 3);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 10, 0, 8, 2);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with four radiuses", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, [1, 2, 3, 4]);
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 6);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 1, 0, 1);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 10, 0, 10, 2, 2);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 10, 10, 7, 10, 3);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 10, 0, 6, 4);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with DOMPointInit radius - single elliptical corner", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, { x: 2, y: 1 });
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 9);
    // Each ellipse call results in save/translate/scale/arc/restore sequence
    expect(ctx.save).toHaveBeenCalledTimes(4);
    expect(ctx.restore).toHaveBeenCalledTimes(4);
    // Top-left corner ellipse
    expect(ctx.translate).toHaveBeenNthCalledWith(1, 2, 1);
    expect(ctx.scale).toHaveBeenNthCalledWith(1, 2, 1);
    expect(ctx.arc).toHaveBeenNthCalledWith(1, 0, 0, 1, Math.PI, Math.PI * 1.5, false);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with DOMPointInit radius - array of mixed types", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 20, 20, [{ x: 2, y: 1 }, 3, { x: 1, y: 2 }, 4]);
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 16);
    // Mix of ellipse (save/translate/scale/arc/restore) and arcTo calls
    expect(ctx.save).toHaveBeenCalledTimes(2); // Two elliptical corners
    expect(ctx.restore).toHaveBeenCalledTimes(2);
    expect(ctx.arcTo).toHaveBeenCalledTimes(2); // Two circular corners
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("with DOMPointInit radius - zero values", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, { x: 0, y: 0 });
    ctx.stroke(p);
    expect(ctx.rect).toHaveBeenCalledWith(0, 0, 10, 10);
  });

  it("with DOMPointInit radius - partial values", () => {
    const p = new Path2D();
    p.roundRect(0, 0, 10, 10, { x: 2 });
    ctx.stroke(p);
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 10);
    // All corners are elliptical since y defaults to 0 (different from x)
    expect(ctx.save).toHaveBeenCalledTimes(4);
    expect(ctx.restore).toHaveBeenCalledTimes(4);
    expect(ctx.closePath).toHaveBeenCalled();
  });

  it("throw error with negative DOMPointInit radius", () => {
    const p = new Path2D();
    expect(() => {
      p.roundRect(20, 20, 30, 30, { x: -2, y: 1 });
    }).toThrowError("Failed to execute 'roundRect' on 'Path2D': Radius value -2 is negative");

    expect(() => {
      p.roundRect(20, 20, 30, 30, { x: 2, y: -1 });
    }).toThrowError("Failed to execute 'roundRect' on 'Path2D': Radius value -1 is negative");
  });

  it("scales all radii together instead of clamping each corner", () => {
    // 80 + 10 <= 100, so no scaling is needed and large radii are preserved
    // rather than being clamped to width / 2 (50).
    const p = new Path2D();
    p.roundRect(0, 0, 100, 100, [80, 10]);
    ctx.stroke(p);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 80, 0, 80);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 100, 0, 100, 10, 10);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 100, 100, 20, 100, 80);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 100, 0, 90, 10);
  });

  it("scales oversized radii uniformly keeping circular corners circular", () => {
    // radius 40 on a 100x50 rect scales by 50 / 80 to a circular radius of 25,
    // so arcTo is used rather than 40x25 ellipses.
    const p = new Path2D();
    p.roundRect(0, 0, 100, 50, 40);
    ctx.stroke(p);
    expect(ctx.ellipse).not.toHaveBeenCalled();
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 25, 0, 25);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 100, 0, 100, 25, 25);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 100, 50, 75, 50, 25);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 50, 0, 25, 25);
  });

  it("normalizes negative width without emitting negative radii", () => {
    const p = new Path2D();
    p.roundRect(100, 0, -100, 50, 10);
    ctx.stroke(p);
    expect(ctx.ellipse).not.toHaveBeenCalled();
    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, 40);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(1, 0, 0, 10, 0, 10);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(2, 100, 0, 100, 10, 10);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(3, 100, 50, 90, 50, 10);
    expect(ctx.arcTo).toHaveBeenNthCalledWith(4, 0, 50, 0, 40, 10);
  });
});
