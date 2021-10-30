const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const polyfillPath2D = require("../src/path2d-polyfill");

chai.use(sinonChai);
const expect = chai.expect;

function CanvasRenderingContext2D() {}
let window;
let ctx;
let cMock;

describe("Canvas path", () => {
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
      CanvasRenderingContext2D,
      document: {
        createElement: () => {
          const el = {};
          el.getContext = () => new CanvasRenderingContext2D();
          return el;
        },
      },
    };
  });

  describe("Polyfill", () => {
    it("should not add Path2D if window is undefined", () => {
      window = undefined;
      polyfillPath2D(window);
      expect(window).to.be.an("undefined");
    });

    it("should not add Path2D if window.CanvasRenderingContext2D is undefined", () => {
      window.CanvasRenderingContext2D = undefined;
      polyfillPath2D(window);
      expect(window.Path2D).to.be.an("undefined");
    });

    it("should add Path2D constructor to window object", () => {
      polyfillPath2D(window);
      expect(new window.Path2D()).to.be.an.instanceOf(window.Path2D);
    });

    it("should add Path2D constructor to window object if Svg Path as argument is not supported", () => {
      polyfillPath2D(window);
      const orgPath = window.Path2D;

      CanvasRenderingContext2D.prototype.getImageData = function getImageData() {
        return { data: [123] };
      };

      polyfillPath2D(window);
      // Expected Path2D to be replaced with a new instance based failure
      // on supportsSvgPathArgument() call
      expect(window.Path2D).to.not.equal(orgPath);
      expect(new window.Path2D()).to.be.an.instanceOf(window.Path2D);
    });

    it("should not add Path2D constructor to window object if Svg Path as argument is supported", () => {
      polyfillPath2D(window);
      const orgPath = window.Path2D;

      CanvasRenderingContext2D.prototype.getImageData = function getImageData() {
        return { data: [255] };
      };

      polyfillPath2D(window);
      expect(window.Path2D).to.equal(orgPath);
      expect(new window.Path2D()).to.be.an.instanceOf(window.Path2D);
    });
  });

  describe("stroke/fill", () => {
    let stroke;
    let fill;
    beforeEach(() => {
      stroke = sinon.fake();
      fill = sinon.fake();
      sinon.replace(window.CanvasRenderingContext2D.prototype, "stroke", stroke);
      sinon.replace(window.CanvasRenderingContext2D.prototype, "fill", fill);
      ctx = new window.CanvasRenderingContext2D();
      polyfillPath2D(window);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("fill - no arguments", () => {
      ctx.fill();
      expect(fill).to.have.been.calledOnceWith();
    });

    it("fill - with fillrule", () => {
      ctx.fill("evenodd");
      expect(fill).to.have.been.calledOnceWith("evenodd");
    });

    it("fill - with just path defaults to nonzero", () => {
      const p = new window.Path2D("M 0 0 L 10 0 L 10 10 Z");
      ctx.fill(p);
      expect(fill).to.have.been.calledOnceWith("nonzero");
    });

    it("fill - with path and fillrule", () => {
      const p = new window.Path2D("M 0 0 L 10 0 L 10 10 Z");
      ctx.fill(p, "evenodd");
      expect(fill).to.have.been.calledOnceWith("evenodd");
    });

    it("stroke - no arguments", () => {
      ctx.stroke();
      expect(stroke).to.have.been.calledOnceWith();
    });
  });

  describe("isPointInPath", () => {
    let isPointInPath;
    beforeEach(() => {
      isPointInPath = sinon.fake();
      sinon.replace(window.CanvasRenderingContext2D.prototype, "isPointInPath", isPointInPath);
      ctx = new window.CanvasRenderingContext2D();
      cMock = sinon.mock(ctx);
      polyfillPath2D(window);
    });

    afterEach(() => {
      sinon.restore();
    });

    it("isPointInPath - with two arguments x, y", () => {
      const x = 20;
      const y = 30;
      ctx.isPointInPath(x, y);
      expect(isPointInPath).to.have.been.calledOnceWith(x, y);
    });

    it("isPointInPath - with three arguments x, y, fillRule", () => {
      const x = 20;
      const y = 30;
      const fillRule = "nonzero";
      ctx.isPointInPath(x, y, fillRule);
      expect(isPointInPath).to.have.been.calledOnceWith(x, y, fillRule);
    });

    it("isPointInPath - with Path2D as first argument", () => {
      var region = new window.Path2D("M 30 90 L 110 20 L 240 130 L 60 130 L 190 20 L 270 90 Z");
      const x = 30;
      const y = 20;
      cMock.expects("moveTo").once().withArgs(30, 90);
      cMock.expects("lineTo").exactly(5);
      cMock.expects("closePath").once();
      ctx.isPointInPath(region, x, y);
      cMock.verify();
      expect(isPointInPath).to.have.been.calledOnceWith(x, y, "nonzero");
    });

    it("isPointInPath - with Path2D as first argument and fillRule", () => {
      var region = new window.Path2D("M 30 90 L 110 20 L 240 130 L 60 130 L 190 20 L 270 90 Z");
      const x = 30;
      const y = 20;
      const fillRule = "evenodd";
      cMock.expects("moveTo").once().withArgs(30, 90);
      cMock.expects("lineTo").exactly(5);
      cMock.expects("closePath").once();
      ctx.isPointInPath(region, x, y, fillRule);
      cMock.verify();
      expect(isPointInPath).to.have.been.calledOnceWith(x, y, fillRule);
    });
  });

  describe("Render path", () => {
    beforeEach(() => {
      ctx = new window.CanvasRenderingContext2D();
      cMock = sinon.mock(ctx);
      polyfillPath2D(window);
    });

    afterEach(() => {
      cMock.restore();
    });

    describe("with Path2D methods", () => {
      it("constructor with another Path2D object", () => {
        cMock.expects("lineTo").once().withArgs(10, 0);
        cMock.expects("lineTo").once().withArgs(10, 10);
        cMock.expects("closePath").once();
        const p = new window.Path2D("M 0 0 L 10 0 L 10 10 Z");
        const p2 = new window.Path2D(p);
        ctx.stroke(p2);
        cMock.verify();
      });
      it("addPath", () => {
        cMock.expects("lineTo").once().withArgs(10, 0);
        cMock.expects("lineTo").once().withArgs(10, 10);
        cMock.expects("closePath").once();
        const p = new window.Path2D("M 0 0 L 10 0 L 10 10 Z");
        const p2 = new window.Path2D();
        p2.addPath(p);
        ctx.stroke(p2);
        cMock.verify();
      });
      it("moveTo", () => {
        cMock.expects("moveTo").once().withArgs(10, 10);
        const p = new window.Path2D();
        p.moveTo(10, 10);
        ctx.stroke(p);
        cMock.verify();
      });
      it("lineTo and closePath", () => {
        cMock.expects("lineTo").once().withArgs(10, 0);
        cMock.expects("lineTo").once().withArgs(10, 10);
        cMock.expects("closePath").once();
        const p = new window.Path2D();
        p.lineTo(10, 0);
        p.lineTo(10, 10);
        p.closePath();
        ctx.stroke(p);
        cMock.verify();
      });
      it("bezierCurveTo", () => {
        cMock.expects("bezierCurveTo").once().withArgs(10, 10, 20, 20, 30, 30);
        const p = new window.Path2D();
        p.bezierCurveTo(10, 10, 20, 20, 30, 30);
        ctx.stroke(p);
        cMock.verify();
      });
      it("quadraticCurveTo", () => {
        cMock.expects("quadraticCurveTo").once().withArgs(20, 20, 30, 30);
        const p = new window.Path2D();
        p.quadraticCurveTo(20, 20, 30, 30);
        ctx.stroke(p);
        cMock.verify();
      });
      it("arc", () => {
        cMock.expects("arc").once().withArgs(20, 20, 30, 0, 40, true);
        const p = new window.Path2D();
        p.arc(20, 20, 30, 0, 40, true);
        ctx.stroke(p);
        cMock.verify();
      });
      it("arcTo", () => {
        cMock.expects("arcTo").once().withArgs(20, 20, 30, 30, 40);
        const p = new window.Path2D();
        p.arcTo(20, 20, 30, 30, 40);
        ctx.stroke(p);
        cMock.verify();
      });
      it("ellipse", () => {
        cMock.expects("translate").once().withArgs(100, 150);
        cMock.expects("scale").once().withArgs(20, 40);
        cMock.expects("arc").once().withArgs(0, 0, 1, 0, Math.PI, true);
        const p = new window.Path2D();
        p.ellipse(100, 150, 20, 40, 0, 0, Math.PI, true);
        ctx.stroke(p);
        cMock.verify();
      });
      it("rect", () => {
        cMock.expects("rect").once().withArgs(20, 20, 30, 30);
        const p = new window.Path2D();
        p.rect(20, 20, 30, 30);
        ctx.stroke(p);
        cMock.verify();
      });
    });

    describe("moveTo", () => {
      it("M/m", () => {
        cMock.expects("moveTo").once().withArgs(10, 10);
        cMock.expects("moveTo").once().withArgs(15, 15);
        cMock.expects("moveTo").once().withArgs(10, 20);
        ctx.stroke(new window.Path2D("M 10 10 m 5 5 m -5 5"));
        cMock.verify();
      });
    });

    describe("lineTo", () => {
      it("L", () => {
        cMock.expects("moveTo").once().withExactArgs(10, 10);
        cMock.expects("lineTo").once().withExactArgs(20, 20);
        ctx.stroke(new window.Path2D("M 10 10 L 20 20"));
        cMock.verify();
      });

      it("l", () => {
        cMock.expects("moveTo").once().withArgs(10, 10);
        cMock.expects("lineTo").once().withArgs(15, 15);
        cMock.expects("lineTo").once().withArgs(10, 20);
        ctx.stroke(new window.Path2D("M 10 10 l 5 5 l -5 5"));
        cMock.verify();
      });

      it("H", () => {
        cMock.expects("lineTo").once().withExactArgs(20, 0);
        ctx.stroke(new window.Path2D("M 10 0 H 20"));
        cMock.verify();
      });

      it("h", () => {
        cMock.expects("lineTo").once().withExactArgs(20, 0);
        ctx.stroke(new window.Path2D("M 10 0 h 10"));
        cMock.verify();
      });

      it("V", () => {
        cMock.expects("lineTo").once().withExactArgs(0, 20);
        ctx.stroke(new window.Path2D("M 0 10 V 20"));
        cMock.verify();
      });

      it("v", () => {
        cMock.expects("lineTo").once().withExactArgs(0, 20);
        ctx.stroke(new window.Path2D("M 0 10 v 10"));
        cMock.verify();
      });

      it("multiple l & m", () => {
        cMock.expects("moveTo").twice();
        cMock.expects("lineTo").twice();
        ctx.stroke(new window.Path2D("M 10 10 l 20 5 m 5 10 l -20 -10"));
        cMock.verify();
      });
    });

    describe("arc", () => {
      it("A", () => {
        cMock.expects("moveTo").once().withArgs(80, 80);
        cMock.expects("translate").once().withArgs(125, 80);
        cMock.expects("scale").once().withArgs(45, 45);
        cMock.expects("rotate").once().withArgs(0);
        cMock
          .expects("arc")
          .once()
          .withArgs(0, 0, 1, Math.PI, Math.PI / 2, true);
        cMock.expects("lineTo").once().withArgs(125, 80);
        cMock.expects("closePath").once();
        ctx.stroke(new window.Path2D("M80 80A 45 45 0 0 0 125 125L 125 80 Z"));
        cMock.verify();
      });

      it("a - with correction", () => {
        cMock.expects("translate").once().withArgs(40, 20);
        cMock.expects("scale").once().withArgs(20, 20);
        cMock.expects("rotate").once().withArgs(0);
        cMock
          .expects("arc")
          .once()
          .withArgs(0, 0, 1, -Math.PI / 2, Math.PI / 2, true);
        ctx.stroke(new window.Path2D("M40 0a 1 1 0 0 0 0 40L 0 20 Z"));
        cMock.verify();
      });

      it("a - with sweep flag arc", () => {
        cMock.expects("translate").once().withArgs(230, 275);
        cMock.expects("scale").once().withArgs(45, 45);
        cMock.expects("rotate").once().withArgs(0);
        cMock
          .expects("arc")
          .once()
          .withArgs(0, 0, 1, -Math.PI / 2, -0, true);
        ctx.stroke(new window.Path2D("M230 230a 45 45 0 1 0 45 45L 275 230 Z"));
        cMock.verify();
      });

      it("a - with sweep flag and large flag arc", () => {
        cMock.expects("translate").once().withArgs(275, 230);
        cMock.expects("scale").once().withArgs(45, 45);
        cMock
          .expects("rotate")
          .once()
          .withArgs(-Math.PI / 4);
        cMock
          .expects("arc")
          .once()
          .withArgs(0, 0, 1, (-3 * Math.PI) / 4, (3 * Math.PI) / 4, false);
        ctx.stroke(new window.Path2D("M230 230a 45 45 -45 1 1 45 45L 275 230 Z"));
        cMock.verify();
      });

      it("a - elliptical", () => {
        cMock.expects("translate").once().withArgs(250, 230);
        cMock.expects("scale").once().withArgs(20, 40);
        cMock.expects("arc").once().withArgs(0, 0, 1, Math.PI, -0, false);
        ctx.stroke(new window.Path2D("M230 230a 20 40 0 1 1 40 0L 275 230 Z"));
        cMock.verify();
      });
    });

    describe("closePath", () => {
      it("Z and stroke", () => {
        cMock.expects("closePath").once();
        ctx.stroke(new window.Path2D("M 16 90 L13 37 L3 14 Z"));
        cMock.verify();
      });

      it("z and fill", () => {
        cMock.expects("closePath").once();
        ctx.fill(new window.Path2D("M 16 90 L13 37 L3 14 z"));
        cMock.verify();
      });
    });

    describe("cubic bezier curve", () => {
      it("C", () => {
        cMock.expects("bezierCurveTo").once().withExactArgs(1, 2, 3, 4, 5, 6);
        ctx.stroke(new window.Path2D("M0 0, C1 2, 3 4, 5 6"));
        cMock.verify();
      });

      it("c", () => {
        cMock.expects("bezierCurveTo").once().withExactArgs(11, 102, 13, 104, 15, 106);
        ctx.stroke(new window.Path2D("M10 100, c1 2, 3 4, 5 6"));
        cMock.verify();
      });

      it("S - with previous cubic command", () => {
        cMock.expects("bezierCurveTo").withArgs(1, 2, 3, 4, 5, 6);
        cMock.expects("bezierCurveTo").withArgs(7, 8, 10, 20, 30, 40);
        ctx.stroke(new window.Path2D("M0 0, C1 2, 3 4, 5 6, S10 20, 30 40"));
        cMock.verify();
      });

      it("S - without previous cubic command", () => {
        cMock.expects("bezierCurveTo").withArgs(1, 2, 3, 4, 5, 6);
        ctx.stroke(new window.Path2D("M1 2 S3 4, 5 6"));
        cMock.verify();
      });

      it("S - with break between cubic command", () => {
        cMock.expects("bezierCurveTo").withArgs(1, 2, 3, 4, 5, 6);
        cMock.expects("bezierCurveTo").withArgs(10, 12, 10, 20, 30, 40);
        ctx.stroke(new window.Path2D("M0 0, C1 2, 3 4, 5 6, M10 12, S10 20, 30 40"));
        cMock.verify();
      });

      it("s - with previous cubic command", () => {
        cMock.expects("bezierCurveTo").withArgs(1, 2, 3, 4, 5, 6);
        cMock.expects("bezierCurveTo").withArgs(7, 8, 15, 26, 35, 46);
        ctx.stroke(new window.Path2D("M0 0, C1 2 3 4 5 6, s10 20 30 40"));
        cMock.verify();
      });

      it("s - without previous cubic command", () => {
        cMock.expects("bezierCurveTo").withArgs(1, 2, 11, 22, 31, 42);
        ctx.stroke(new window.Path2D("M1 2, s10 20 30 40"));
        cMock.verify();
      });

      it("s - with break between cubic command", () => {
        cMock.expects("bezierCurveTo").withArgs(1, 2, 3, 4, 5, 6);
        cMock.expects("bezierCurveTo").withArgs(10, 12, 20, 32, 40, 52);
        ctx.stroke(new window.Path2D("M0 0, C1 2 3 4 5 6, M10 12, s10 20 30 40"));
        cMock.verify();
      });
    });

    describe("quad bezier curve", () => {
      it("Q", () => {
        cMock.expects("quadraticCurveTo").once().withExactArgs(1, 2, 3, 4);
        ctx.stroke(new window.Path2D("M0 0, Q1 2, 3 4"));
        cMock.verify();
      });

      it("q", () => {
        cMock.expects("quadraticCurveTo").once().withExactArgs(11, 102, 13, 104);
        ctx.stroke(new window.Path2D("M10 100, q1 2, 3 4"));
        cMock.verify();
      });

      it("T - with previous quad command", () => {
        cMock.expects("quadraticCurveTo").withArgs(1, 2, 3, 4);
        cMock.expects("quadraticCurveTo").withArgs(5, 6, 10, 100);
        ctx.stroke(new window.Path2D("M10 10, Q1 2,3 4 T10 100"));
        cMock.verify();
      });

      it("T - without previous quad command", () => {
        cMock.expects("quadraticCurveTo").withArgs(10, 100, 1, 2);
        ctx.stroke(new window.Path2D("M10 100, T1 2"));
        cMock.verify();
      });

      it("T - with break between quad command", () => {
        cMock.expects("quadraticCurveTo").withArgs(1, 2, 3, 4);
        cMock.expects("quadraticCurveTo").withArgs(10, 12, 10, 100);
        ctx.stroke(new window.Path2D("M10 10, Q1 2,3 4, M10 12, T10 100"));
        cMock.verify();
      });

      it("t - with previous quad command", () => {
        cMock.expects("quadraticCurveTo").withArgs(0, 5, 10, 15);
        cMock.expects("quadraticCurveTo").withArgs(20, 25, 11, 17);
        ctx.stroke(new window.Path2D("M0 0, Q0 5, 10 15 t1 2"));
        cMock.verify();
      });

      it("t - without previous quad command", () => {
        cMock.expects("quadraticCurveTo").withArgs(10, 100, 11, 102);
        ctx.stroke(new window.Path2D("M10 100, t1 2"));
        cMock.verify();
      });

      it("t - with break between quad command", () => {
        cMock.expects("quadraticCurveTo").withArgs(0, 5, 10, 15);
        cMock.expects("quadraticCurveTo").withArgs(10, 12, 11, 14);
        ctx.stroke(new window.Path2D("M0 0, Q0 5, 10 15, M10 12, t1 2"));
        cMock.verify();
      });
    });
  });
});
