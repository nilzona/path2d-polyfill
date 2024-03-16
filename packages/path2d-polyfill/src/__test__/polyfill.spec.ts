import { Path2D } from "path2d";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { polyfillPath2D } from "../polyfill";
import { CanvasRenderingContext2DForTest } from "./test-types";

describe("polyfill", () => {
  window.CanvasRenderingContext2D =
    CanvasRenderingContext2DForTest as unknown as typeof window.CanvasRenderingContext2D;
  window.Path2D = Path2D as unknown as typeof window.Path2D;

  let globalCTX: typeof window.CanvasRenderingContext2D;
  let globalPath2D: typeof window.Path2D;
  let CTXRoundRect: typeof window.CanvasRenderingContext2D.prototype.roundRect;
  let Path2DRoundRect: typeof window.Path2D.prototype.roundRect;

  beforeAll(() => {
    globalCTX = window.CanvasRenderingContext2D;
    globalPath2D = window.Path2D;
    CTXRoundRect = window.CanvasRenderingContext2D.prototype.roundRect;
    Path2DRoundRect = window.Path2D.prototype.roundRect;
  });
  afterEach(() => {
    window.CanvasRenderingContext2D = globalCTX;
    window.Path2D = globalPath2D;
    window.CanvasRenderingContext2D.prototype.roundRect = CTXRoundRect;
    window.Path2D.prototype.roundRect = Path2DRoundRect;
  });

  it("should not add Path2D if window.CanvasRenderingContext2D is undefined", () => {
    // @ts-expect-error for testing purpose
    window.CanvasRenderingContext2D = undefined;
    // @ts-expect-error for testing purpose
    window.Path2D = undefined;
    polyfillPath2D();
    expect(window.Path2D).toBeUndefined();
  });

  it("should add Path2D constructor to window object", () => {
    // @ts-expect-error for testing purpose
    window.Path2D = undefined;
    polyfillPath2D();
    const P2D = new window.Path2D();
    expect(P2D).toBeInstanceOf(Path2D);
  });

  it("should add a roundRect to CanvasRenderingContext", () => {
    // @ts-expect-error for testing purpose
    window.CanvasRenderingContext2D.prototype.roundRect = undefined;
    // @ts-expect-error for testing purpose
    window.Path2D.prototype.roundRect = undefined;
    polyfillPath2D();
    expect(window.CanvasRenderingContext2D.prototype.roundRect).toBeTypeOf("function");
    expect(window.Path2D.prototype.roundRect).toBeTypeOf("function");
  });
});
