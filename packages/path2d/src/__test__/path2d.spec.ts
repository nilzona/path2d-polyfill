import { beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { applyPath2DToCanvasRenderingContext } from "../apply.js";
import { Path2D } from "../path2d.js";
import type { CanvasFillRule } from "../types.js";
import { CanvasRenderingContext2DForTest } from "./test-types.js";

vi.mock("./test-types.js");

type MockedClip = MockInstance<(a?: CanvasFillRule | Path2D, b?: CanvasFillRule) => void>;
type MockedFill = MockInstance<(a?: CanvasFillRule | Path2D, b?: CanvasFillRule) => void>;
type MockedStroke = MockInstance<(a?: CanvasFillRule | Path2D) => void>;
type MockedIsPointInPath = MockInstance<() => string | number>;

let ctx: CanvasRenderingContext2DForTest;
let cStrokeSpy: MockedStroke;
let cFillSpy: MockedFill;
let cClipSpy: MockedClip;
let cIsPointInPathSpy: MockedIsPointInPath;

describe("Path2D", () => {
  beforeAll(() => {
    // prep some for testing, create spies on original CanvasRenderingContext methods
    cStrokeSpy = CanvasRenderingContext2DForTest.prototype.stroke as unknown as MockedStroke;
    cFillSpy = CanvasRenderingContext2DForTest.prototype.fill as unknown as MockedFill;
    cClipSpy = CanvasRenderingContext2DForTest.prototype.clip as unknown as MockedClip;
    cIsPointInPathSpy = CanvasRenderingContext2DForTest.prototype.isPointInPath as unknown as MockedIsPointInPath;
    applyPath2DToCanvasRenderingContext(CanvasRenderingContext2DForTest);
  });
  beforeEach(() => {
    ctx = new CanvasRenderingContext2DForTest();
    cStrokeSpy.mockReset();
    cFillSpy.mockReset();
    cClipSpy.mockReset();
    cIsPointInPathSpy.mockReset();
  });

  describe("stroke/fill/clip", () => {
    it("clip - no arguments, defaults to nonzero", () => {
      ctx.clip();
      expect(cClipSpy).toHaveBeenCalledOnce();
      expect(cClipSpy).toHaveBeenCalledWith("nonzero");
    });

    it("clip - with fillrule", () => {
      ctx.clip("evenodd");
      expect(cClipSpy).toHaveBeenCalledOnce();
      expect(cClipSpy).toHaveBeenCalledWith("evenodd");
    });

    it("clip - with just path defaults to nonzero", () => {
      const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
      ctx.clip(p);
      expect(cClipSpy).toHaveBeenCalledOnce();
      expect(cClipSpy).toHaveBeenCalledWith("nonzero");
    });

    it("clip - with path and fillrule", () => {
      const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
      ctx.clip(p, "evenodd");
      expect(cClipSpy).toHaveBeenCalledOnce();
      expect(cClipSpy).toHaveBeenCalledWith("evenodd");
    });

    it("fill - no arguments, defaults to nonzero", () => {
      ctx.fill();
      expect(cFillSpy).toHaveBeenCalledOnce();
      expect(cFillSpy).toHaveBeenCalledWith("nonzero");
    });

    it("fill - with fillrule", () => {
      ctx.fill("evenodd");
      expect(cFillSpy).toHaveBeenCalledOnce();
      expect(cFillSpy).toHaveBeenCalledWith("evenodd");
    });

    it("fill - with just path defaults to nonzero", () => {
      const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
      ctx.fill(p);
      expect(cFillSpy).toHaveBeenCalledOnce();
      expect(cFillSpy).toHaveBeenCalledWith("nonzero");
    });

    it("fill - with path and fillrule", () => {
      const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
      ctx.fill(p, "evenodd");
      expect(cFillSpy).toHaveBeenCalledOnce();
      expect(cFillSpy).toHaveBeenCalledWith("evenodd");
    });

    it("stroke - no arguments", () => {
      ctx.stroke();
      expect(cStrokeSpy).toHaveBeenCalledOnce();
      expect(cStrokeSpy).toHaveBeenCalledWith();
    });

    it("should throw error when an arc command has been added without a starting point", () => {
      const p = new Path2D();
      p.addCustomCommand(["A", 45, 45, 0, 0, 0]);
      expect(() => {
        ctx.stroke(p);
      }).toThrowError("This should never happen");
    });

    it("should throw error with an unknown path command", () => {
      const p = new Path2D();
      // @ts-expect-error testing wrong parameter type
      p.addCustomCommand(["unknown", 10, 20]);
      expect(() => {
        ctx.stroke(p);
      }).toThrowError("Invalid path command: unknown");
    });
  });

  describe("isPointInPath", () => {
    it("isPointInPath - with two arguments x, y", () => {
      const x = 20;
      const y = 30;
      ctx.isPointInPath(x, y);
      expect(cIsPointInPathSpy).toHaveBeenCalledOnce();
      expect(cIsPointInPathSpy).toHaveBeenCalledWith(x, y);
    });

    it("isPointInPath - with three arguments x, y, fillRule", () => {
      const x = 20;
      const y = 30;
      const fillRule = "nonzero";
      ctx.isPointInPath(x, y, fillRule);
      expect(cIsPointInPathSpy).toHaveBeenCalledOnce();
      expect(cIsPointInPathSpy).toHaveBeenCalledWith(x, y, fillRule);
    });

    it("isPointInPath - with Path2D as first argument", () => {
      const region = new Path2D("M 30 90 L 110 20 L 240 130 L 60 130 L 190 20 L 270 90 Z");
      const x = 30;
      const y = 20;
      ctx.isPointInPath(region, x, y);
      expect(ctx.moveTo).toHaveBeenCalledWith(30, 90);
      expect(ctx.lineTo).toHaveBeenCalledTimes(5);
      expect(ctx.closePath).toHaveBeenCalledOnce();
      expect(cIsPointInPathSpy).toHaveBeenCalledWith(x, y, "nonzero");
    });

    it("isPointInPath - with Path2D as first argument and fillRule", () => {
      const region = new Path2D("M 30 90 L 110 20 L 240 130 L 60 130 L 190 20 L 270 90 Z");
      const x = 30;
      const y = 20;
      const fillRule = "evenodd";
      ctx.isPointInPath(region, x, y, fillRule);
      expect(ctx.moveTo).toHaveBeenCalledWith(30, 90);
      expect(ctx.lineTo).toHaveBeenCalledTimes(5);
      expect(ctx.closePath).toHaveBeenCalledOnce();
      expect(cIsPointInPathSpy).toHaveBeenCalledWith(x, y, fillRule);
    });
  });

  describe("render path", () => {
    describe("with Path2D methods", () => {
      it("constructor with another Path2D object", () => {
        const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
        const p2 = new Path2D(p);
        ctx.stroke(p2);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 10, 0);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, 10);
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
      it("addPath", () => {
        const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
        const p2 = new Path2D();
        p2.addPath(p);
        ctx.stroke(p2);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 10, 0);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, 10);
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
      it("addPath with falsy parameter", () => {
        const p = new Path2D("M 0 0 L 10 0 L 10 10 Z");
        const p2 = "this is not a Path2D object";
        // @ts-expect-error testing a falsy parameter
        p.addPath(p2);
        ctx.stroke(p);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 10, 0);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, 10);
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
      it("moveTo", () => {
        const p = new Path2D();
        p.moveTo(10, 10);
        ctx.stroke(p);
        expect(ctx.moveTo).toHaveBeenCalledWith(10, 10);
      });
      it("lineTo and closePath", () => {
        const p = new Path2D();
        p.lineTo(10, 0);
        p.lineTo(10, 10);
        p.closePath();
        ctx.stroke(p);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 10, 0);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, 10);
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
      it("bezierCurveTo", () => {
        const p = new Path2D();
        p.bezierCurveTo(10, 10, 20, 20, 30, 30);
        ctx.stroke(p);
        expect(ctx.bezierCurveTo).toHaveBeenCalledWith(10, 10, 20, 20, 30, 30);
      });
      it("quadraticCurveTo", () => {
        const p = new Path2D();
        p.quadraticCurveTo(20, 20, 30, 30);
        ctx.stroke(p);
        expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(20, 20, 30, 30);
      });
      it("arc", () => {
        const p = new Path2D();
        p.arc(20, 20, 30, 0, 40, true);
        ctx.stroke(p);
        expect(ctx.arc).toHaveBeenCalledWith(20, 20, 30, 0, 40, true);
      });
      it("arcTo", () => {
        const p = new Path2D();
        p.arcTo(20, 20, 30, 30, 40);
        ctx.stroke(p);
        expect(ctx.arcTo).toHaveBeenCalledWith(20, 20, 30, 30, 40);
      });
      it("ellipse", () => {
        const p = new Path2D();
        p.ellipse(100, 150, 20, 40, 0, 0, Math.PI, true);
        ctx.stroke(p);
        expect(ctx.translate).toHaveBeenCalledWith(100, 150);
        expect(ctx.scale).toHaveBeenCalledWith(20, 40);
        expect(ctx.arc).toHaveBeenCalledWith(0, 0, 1, 0, Math.PI, true);
      });
      it("rect", () => {
        const p = new Path2D();
        p.rect(20, 20, 30, 30);
        ctx.stroke(p);
        expect(ctx.rect).toHaveBeenCalledWith(20, 20, 30, 30);
      });
      it("roundRect", () => {
        const p = new Path2D();
        p.roundRect(20, 20, 30, 30, 10);
        ctx.stroke(p);
        expect(ctx.roundRect).toHaveBeenCalledWith(20, 20, 30, 30, 10);
      });
      it("roundRect2", () => {
        const p = new Path2D();
        p.roundRect(20, 20, 30, 30);
        ctx.stroke(p);
        expect(ctx.roundRect).toHaveBeenCalledWith(20, 20, 30, 30, 0);
      });
    });
    describe("moveTo", () => {
      it("M/m", () => {
        ctx.stroke(new Path2D("M 10 10 m 5 5 m -5 5"));
        expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 10, 10);
        expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 15, 15);
        expect(ctx.moveTo).toHaveBeenNthCalledWith(3, 10, 20);
      });
    });
    describe("lineTo", () => {
      it("L", () => {
        ctx.stroke(new Path2D("M 10 10 L 20 20"));
        expect(ctx.moveTo).toHaveBeenCalledWith(10, 10);
        expect(ctx.lineTo).toHaveBeenCalledWith(20, 20);
      });
      it("l", () => {
        ctx.stroke(new Path2D("M 10 10 l 5 5 l -5 5"));
        expect(ctx.moveTo).toHaveBeenCalledWith(10, 10);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 15, 15);
        expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, 20);
      });
      it("H", () => {
        ctx.stroke(new Path2D("M 10 0 H 20"));
        expect(ctx.lineTo).toHaveBeenCalledWith(20, 0);
      });
      it("h", () => {
        ctx.stroke(new Path2D("M 10 0 h 10"));
        expect(ctx.lineTo).toHaveBeenCalledWith(20, 0);
      });
      it("V", () => {
        ctx.stroke(new Path2D("M 0 10 V 20"));
        expect(ctx.lineTo).toHaveBeenCalledWith(0, 20);
      });
      it("v", () => {
        ctx.stroke(new Path2D("M 0 10 v 10"));
        expect(ctx.lineTo).toHaveBeenCalledWith(0, 20);
      });
      it("multiple l & m", () => {
        ctx.stroke(new Path2D("M 10 10 l 20 5 m 5 10 l -20 -10"));
        expect(ctx.moveTo).toHaveBeenCalledTimes(2);
        expect(ctx.lineTo).toHaveBeenCalledTimes(2);
      });
    });
    describe("arc", () => {
      it("A", () => {
        ctx.stroke(new Path2D("M80 80A 45 45 0 0 0 125 125L 125 80 Z"));
        expect(ctx.moveTo).toHaveBeenCalledWith(80, 80);
        expect(ctx.translate).toHaveBeenCalledWith(125, 80);
        expect(ctx.scale).toHaveBeenCalledWith(45, 45);
        expect(ctx.rotate).toHaveBeenCalledWith(0);
        expect(ctx.arc).toHaveBeenCalledWith(0, 0, 1, Math.PI, Math.PI / 2, true);
        expect(ctx.lineTo).toHaveBeenCalledWith(125, 80);
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
      it("a - with correction", () => {
        ctx.stroke(new Path2D("M40 0a 1 1 0 0 0 0 40L 0 20 Z"));
        expect(ctx.translate).toHaveBeenCalledWith(40, 20);
        expect(ctx.scale).toHaveBeenCalledWith(20, 20);
        expect(ctx.rotate).toHaveBeenCalledWith(0);
        expect(ctx.arc).toHaveBeenCalledWith(0, 0, 1, -Math.PI / 2, Math.PI / 2, true);
      });
      it("a - with sweep flag arc", () => {
        ctx.stroke(new Path2D("M230 230a 45 45 0 1 0 45 45L 275 230 Z"));
        expect(ctx.translate).toHaveBeenCalledWith(230, 275);
        expect(ctx.scale).toHaveBeenCalledWith(45, 45);
        expect(ctx.rotate).toHaveBeenCalledWith(0);
        expect(ctx.arc).toHaveBeenCalledWith(0, 0, 1, -Math.PI / 2, -0, true);
      });
      it("a - with sweep flag and large flag arc", () => {
        ctx.stroke(new Path2D("M230 230a 45 45 -45 1 1 45 45L 275 230 Z"));
        expect(ctx.translate).toHaveBeenCalledWith(275, 230);
        expect(ctx.scale).toHaveBeenCalledWith(45, 45);
        expect(ctx.rotate).toHaveBeenCalledWith(-Math.PI / 4);
        expect(ctx.arc).toHaveBeenCalledWith(0, 0, 1, (-3 * Math.PI) / 4, (3 * Math.PI) / 4, false);
      });
      it("a - elliptical", () => {
        ctx.stroke(new Path2D("M230 230a 20 40 0 1 1 40 0L 275 230 Z"));
        expect(ctx.translate).toHaveBeenCalledWith(250, 230);
        expect(ctx.scale).toHaveBeenCalledWith(20, 40);
        expect(ctx.arc).toHaveBeenCalledWith(0, 0, 1, Math.PI, -0, false);
      });
    });
    describe("closePath", () => {
      it("Z and stroke", () => {
        ctx.stroke(new Path2D("M 16 90 L13 37 L3 14 Z"));
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
      it("z and fill", () => {
        ctx.fill(new Path2D("M 16 90 L13 37 L3 14 z"));
        expect(ctx.closePath).toHaveBeenCalledOnce();
      });
    });
    describe("cubic bezier curve", () => {
      it("C", () => {
        ctx.stroke(new Path2D("M0 0, C1 2, 3 4, 5 6"));
        expect(ctx.bezierCurveTo).toHaveBeenCalledWith(1, 2, 3, 4, 5, 6);
      });
      it("c", () => {
        ctx.stroke(new Path2D("M10 100, c1 2, 3 4, 5 6"));
        expect(ctx.bezierCurveTo).toHaveBeenCalledWith(11, 102, 13, 104, 15, 106);
      });
      it("S - with previous cubic command", () => {
        ctx.stroke(new Path2D("M0 0, C1 2, 3 4, 5 6, S10 20, 30 40"));
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(1, 1, 2, 3, 4, 5, 6);
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(2, 7, 8, 10, 20, 30, 40);
      });
      it("S - without previous cubic command", () => {
        ctx.stroke(new Path2D("M1 2 S3 4, 5 6"));
        expect(ctx.bezierCurveTo).toHaveBeenCalledWith(1, 2, 3, 4, 5, 6);
      });
      it("S - with break between cubic command", () => {
        ctx.stroke(new Path2D("M0 0, C1 2, 3 4, 5 6, M10 12, S10 20, 30 40"));
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(1, 1, 2, 3, 4, 5, 6);
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(2, 10, 12, 10, 20, 30, 40);
      });
      it("s - with previous cubic command", () => {
        ctx.stroke(new Path2D("M0 0, C1 2 3 4 5 6, s10 20 30 40"));
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(1, 1, 2, 3, 4, 5, 6);
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(2, 7, 8, 15, 26, 35, 46);
      });
      it("s - without previous cubic command", () => {
        ctx.stroke(new Path2D("M1 2, s10 20 30 40"));
        expect(ctx.bezierCurveTo).toHaveBeenCalledWith(1, 2, 11, 22, 31, 42);
      });
      it("s - with break between cubic command", () => {
        ctx.stroke(new Path2D("M0 0, C1 2 3 4 5 6, M10 12, s10 20 30 40"));
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(1, 1, 2, 3, 4, 5, 6);
        expect(ctx.bezierCurveTo).toHaveBeenNthCalledWith(2, 10, 12, 20, 32, 40, 52);
      });
    });
    describe("quad bezier curve", () => {
      it("Q", () => {
        ctx.stroke(new Path2D("M0 0, Q1 2, 3 4"));
        expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(1, 2, 3, 4);
      });
      it("q", () => {
        ctx.stroke(new Path2D("M10 100, q1 2, 3 4"));
        expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(11, 102, 13, 104);
      });
      it("T - with previous quad command", () => {
        ctx.stroke(new Path2D("M10 10, Q1 2,3 4 T10 100"));
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(1, 1, 2, 3, 4);
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(2, 5, 6, 10, 100);
      });
      it("T - without previous quad command", () => {
        ctx.stroke(new Path2D("M10 100, T1 2"));
        expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(10, 100, 1, 2);
      });
      it("T - with break between quad command", () => {
        ctx.stroke(new Path2D("M10 10, Q1 2,3 4, M10 12, T10 100"));
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(1, 1, 2, 3, 4);
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(2, 10, 12, 10, 100);
      });
      it("t - with previous quad command", () => {
        ctx.stroke(new Path2D("M0 0, Q0 5, 10 15 t1 2"));
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(1, 0, 5, 10, 15);
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(2, 20, 25, 11, 17);
      });
      it("t - without previous quad command", () => {
        ctx.stroke(new Path2D("M10 100, t1 2"));
        expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(10, 100, 11, 102);
      });
      it("t - with break between quad command", () => {
        ctx.stroke(new Path2D("M0 0, Q0 5, 10 15, M10 12, t1 2"));
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(1, 0, 5, 10, 15);
        expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(2, 10, 12, 11, 14);
      });
    });
  });
});
