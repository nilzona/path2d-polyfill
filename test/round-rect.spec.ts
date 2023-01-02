/* eslint-disable @typescript-eslint/unbound-method */

import * as sinon from "sinon";
import { SinonMock } from "sinon";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import { Path2D, polyfillPath2D } from "../src/path2d";
import { polyfillRoundRect } from "../src/round-rect";
import { type WindowForTest, CanvasRenderingContext2DForTest } from "./test-types";

chai.use(sinonChai);
const expect = chai.expect;

function CanvasRenderingContext2D() {}
let window: WindowForTest;
let ctx: CanvasRenderingContext2DForTest;
let cMock: SinonMock;
let origRoundRect: (x: number, y: number, width: number, height: number, radii: number | number[]) => void;

describe("roundRect", () => {
  before(() => {
    // modify Path2D to polyfill roundRect
    origRoundRect = Path2D.prototype.roundRect;
    // @ts-expect-error needs to set this to undefined for testing polyfill
    Path2D.prototype.roundRect = undefined;
  });

  after(() => {
    Path2D.prototype.roundRect = origRoundRect;
  });

  beforeEach(() => {
    CanvasRenderingContext2D.prototype = {
      fill() {},
      stroke() {},
      isPointInPath() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      arc() {},
      arcTo() {},
      closePath() {},
      bezierCurveTo() {},
      quadraticCurveTo() {},
      rect() {},
      save() {},
      translate() {},
      rotate() {},
      scale() {},
      restore() {},
      strokeStyle: null,
      lineWidth: null,
    };

    window = {
      CanvasRenderingContext2D: CanvasRenderingContext2DForTest,
      Path2D,
    };

    // @ts-expect-error needs to set this to undefined for testing polyfill
    window.Path2D.prototype.roundRect = undefined;
    // @ts-expect-error needs to set this to undefined for testing polyfill
    window.CanvasRenderingContext2D.prototype.roundRect = undefined;
  });

  describe("polyfill", () => {
    it("don't add anything if window is undefined", () => {
      // create a falsy falue
      const fakeWindow = undefined;
      polyfillRoundRect(fakeWindow);
      expect(fakeWindow).to.be.a("undefined");
    });

    it("don't add roundRect if there's nothing to add it to", () => {
      // @ts-expect-error testing exception when CanvasRenderingContext2D is not set
      window.CanvasRenderingContext2D = undefined;
      // @ts-expect-error testing exception when Path2D is not set
      window.Path2D = undefined;
      polyfillRoundRect(window);
      expect(window.CanvasRenderingContext2D).to.be.a("undefined");
      expect(window.Path2D).to.be.a("undefined");
    });

    it("don't add roundRect if already defined", () => {
      // @ts-expect-error testing the case when the polyfilled values are already set
      window.CanvasRenderingContext2D.prototype.roundRect = 1;
      // @ts-expect-error testing the case when the polyfilled values are already set
      window.Path2D.prototype.roundRect = 1;
      polyfillRoundRect(window);
      expect(window.CanvasRenderingContext2D.prototype.roundRect).to.equal(1);
      expect(window.Path2D.prototype.roundRect).to.equal(1);
    });

    it("add roundRect function to CanvasRenderingContext2D and Path2D", () => {
      polyfillRoundRect(window);
      expect(window.Path2D.prototype.roundRect).to.be.a("function");
      expect(window.CanvasRenderingContext2D.prototype.roundRect).to.be.a("function");
    });
  });

  describe("draw a roundRect", () => {
    beforeEach(() => {
      ctx = new window.CanvasRenderingContext2D();
      cMock = sinon.mock(ctx);
      // @ts-expect-error need to polyfill Path2D
      window.Path2D = undefined;
      polyfillPath2D(window);
      polyfillRoundRect(window);
    });

    afterEach(() => {
      cMock.restore();
    });

    it("with no radius", () => {
      cMock.expects("rect").once().withArgs(20, 20, 30, 30);
      const p = new window.Path2D();
      p.roundRect(20, 20, 30, 30);
      ctx.stroke(p);
      cMock.verify();
    });

    it("throw error with negative radius", () => {
      const p = new window.Path2D();
      expect(() => p.roundRect(20, 20, 30, 30, -10)).to.throw(
        RangeError,
        "Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative"
      );
      expect(() => p.roundRect(20, 20, 30, 30, [-10])).to.throw(
        RangeError,
        "Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative"
      );
      expect(() => p.roundRect(20, 20, 30, 30, [10, -10])).to.throw(
        RangeError,
        "Failed to execute 'roundRect' on 'Path2D': Radius value -10 is negative"
      );
    });

    it("throw error when wrong amount of parameters", () => {
      const p = new window.Path2D();
      expect(() => p.roundRect(20, 20, 30, 30, [])).to.throw(
        RangeError,
        "Failed to execute 'roundRect' on 'Path2D': 0 radii provided. Between one and four radii are necessary"
      );
      expect(() => p.roundRect(20, 20, 30, 30, [1, 2, 3, 4, 5])).to.throw(
        RangeError,
        "Failed to execute 'roundRect' on 'Path2D': 5 radii provided. Between one and four radii are necessary"
      );
    });

    it("with wrong radius type", () => {
      cMock.expects("moveTo").never();
      cMock.expects("arcTo").never();
      const p = new window.Path2D();
      // @ts-expect-error testing wrong parameter type
      p.roundRect(0, 0, 10, 10, "string");
      ctx.stroke(p);
      cMock.verify();
    });

    it("with one radius", () => {
      cMock.expects("moveTo").once().withArgs(0, 9);
      cMock.expects("arcTo").once().withArgs(0, 0, 1, 0, 1);
      cMock.expects("arcTo").once().withArgs(10, 0, 10, 1, 1);
      cMock.expects("arcTo").once().withArgs(10, 10, 9, 10, 1);
      cMock.expects("arcTo").once().withArgs(0, 10, 0, 9, 1);
      cMock.expects("moveTo").once().withArgs(0, 0);
      const p = new window.Path2D();
      p.roundRect(0, 0, 10, 10, 1);
      ctx.stroke(p);
      cMock.verify();
    });

    it("with one radius - as array", () => {
      cMock.expects("moveTo").once().withArgs(0, 9);
      cMock.expects("arcTo").once().withArgs(0, 0, 1, 0, 1);
      cMock.expects("arcTo").once().withArgs(10, 0, 10, 1, 1);
      cMock.expects("arcTo").once().withArgs(10, 10, 9, 10, 1);
      cMock.expects("arcTo").once().withArgs(0, 10, 0, 9, 1);
      cMock.expects("moveTo").once().withArgs(0, 0);
      const p = new window.Path2D();
      p.roundRect(0, 0, 10, 10, [1]);
      ctx.stroke(p);
      cMock.verify();
    });

    it("with two radiuses", () => {
      cMock.expects("moveTo").once().withArgs(0, 8);
      cMock.expects("arcTo").once().withArgs(0, 0, 1, 0, 1);
      cMock.expects("arcTo").once().withArgs(10, 0, 10, 2, 2);
      cMock.expects("arcTo").once().withArgs(10, 10, 9, 10, 1);
      cMock.expects("arcTo").once().withArgs(0, 10, 0, 8, 2);
      cMock.expects("moveTo").once().withArgs(0, 0);
      const p = new window.Path2D();
      p.roundRect(0, 0, 10, 10, [1, 2]);
      ctx.stroke(p);
      cMock.verify();
    });

    it("with three radiuses", () => {
      cMock.expects("moveTo").once().withArgs(0, 8);
      cMock.expects("arcTo").once().withArgs(0, 0, 1, 0, 1);
      cMock.expects("arcTo").once().withArgs(10, 0, 10, 2, 2);
      cMock.expects("arcTo").once().withArgs(10, 10, 7, 10, 3);
      cMock.expects("arcTo").once().withArgs(0, 10, 0, 8, 2);
      cMock.expects("moveTo").once().withArgs(0, 0);
      const p = new window.Path2D();
      p.roundRect(0, 0, 10, 10, [1, 2, 3]);
      ctx.stroke(p);
      cMock.verify();
    });

    it("with four radiuses", () => {
      cMock.expects("moveTo").once().withArgs(0, 6);
      cMock.expects("arcTo").once().withArgs(0, 0, 1, 0, 1);
      cMock.expects("arcTo").once().withArgs(10, 0, 10, 2, 2);
      cMock.expects("arcTo").once().withArgs(10, 10, 7, 10, 3);
      cMock.expects("arcTo").once().withArgs(0, 10, 0, 6, 4);
      cMock.expects("moveTo").once().withArgs(0, 0);
      const p = new window.Path2D();
      p.roundRect(0, 0, 10, 10, [1, 2, 3, 4]);
      ctx.stroke(p);
      cMock.verify();
    });
  });
});
