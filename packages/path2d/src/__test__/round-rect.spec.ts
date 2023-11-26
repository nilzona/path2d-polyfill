/* eslint-disable @typescript-eslint/unbound-method */
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyPath2DToCanvasRenderingContext,
  applyRoundRectToCanvasRenderingContext2D,
  applyRoundRectToPath2D,
} from "../apply.js";
import { Path2D } from "../path2d.js";
import { CanvasRenderingContext2DForTestWithoutRoundRect } from "./test-types.js";

vi.mock("./test-types.js");

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
  });

  it("with no radius", () => {
    const p = new Path2D();
    p.roundRect(20, 20, 30, 30);
    ctx.stroke(p);
    expect(ctx.rect).toHaveBeenCalledWith(20, 20, 30, 30);
  });

  it("throw error with negative radius", () => {
    const p = new Path2D();
    expect(() => p.roundRect(20, 20, 30, 30, -10)).to.throw(
      RangeError,
      "Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative",
    );
    expect(() => p.roundRect(20, 20, 30, 30, [-10])).to.throw(
      RangeError,
      "Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative",
    );
    expect(() => p.roundRect(20, 20, 30, 30, [10, -10])).to.throw(
      RangeError,
      "Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative",
    );
  });

  it("throw error when wrong amount of parameters", () => {
    const p = new Path2D();
    expect(() => p.roundRect(20, 20, 30, 30, [])).to.throw(
      RangeError,
      "Failed to execute 'roundRect' on 'Path2D': 0 radii provided. Between one and four radii are necessary",
    );
    expect(() => p.roundRect(20, 20, 30, 30, [1, 2, 3, 4, 5])).to.throw(
      RangeError,
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
    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
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
    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
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
    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
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
    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
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
    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
  });
});
