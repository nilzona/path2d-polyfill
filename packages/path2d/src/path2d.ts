import { parsePath } from "./parse-path.js";
import type {
  ArcCommand,
  ArcPathCommand,
  ArcToCommand,
  Command,
  CurvePathCommand,
  DOMPointInit,
  EllipseCommand,
  HorizontalPathCommand,
  ICanvasRenderingContext2D,
  IPath2D,
  LinePathCommand,
  MovePathCommand,
  PathCommand,
  QuadraticCurvePathCommand,
  RectCommand,
  RoundRectCommand,
  ShortCurvePathCommand,
  ShortQuadraticCurvePathCommand,
  VerticalPathCommand,
} from "./types.js";

type Point = {
  x: number;
  y: number;
};

function rotatePoint(point: Point, angle: number) {
  const nx = point.x * Math.cos(angle) - point.y * Math.sin(angle);
  const ny = point.y * Math.cos(angle) + point.x * Math.sin(angle);
  point.x = nx;
  point.y = ny;
}

function translatePoint(point: Point, dx: number, dy: number) {
  point.x += dx;
  point.y += dy;
}

function scalePoint(point: Point, s: number) {
  point.x *= s;
  point.y *= s;
}

/**
 * Implements a browser's Path2D api
 * https://developer.mozilla.org/en-US/docs/Web/API/Path2D
 */
export class Path2D implements IPath2D {
  #commands: PathCommand[]; // Internal storage for path commands

  constructor(path?: Path2D | string) {
    this.#commands = [];
    if (path && path instanceof Path2D) {
      this.#commands.push(...path.#commands);
    } else if (path) {
      this.#commands = parsePath(path);
    }
  }

  addCustomCommand(command: PathCommand) {
    this.#commands.push(command);
  }

  addPath(path: IPath2D) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (path && path instanceof Path2D) {
      this.#commands.push(...path.#commands);
    }
  }

  moveTo(x: number, y: number) {
    this.#commands.push(["M", x, y]);
  }

  lineTo(x: number, y: number) {
    this.#commands.push(["L", x, y]);
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {
    this.#commands.push(["AC", x, y, radius, startAngle, endAngle, !!counterclockwise]);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, r: number) {
    this.#commands.push(["AT", x1, y1, x2, y2, r]);
  }

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
  ) {
    this.#commands.push(["E", x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!counterclockwise]);
  }

  closePath() {
    this.#commands.push(["Z"]);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.#commands.push(["C", cp1x, cp1y, cp2x, cp2y, x, y]);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.#commands.push(["Q", cpx, cpy, x, y]);
  }

  rect(x: number, y: number, width: number, height: number) {
    this.#commands.push(["R", x, y, width, height]);
  }

  roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]) {
    if (typeof radii === "undefined") {
      this.#commands.push(["RR", x, y, w, h, 0]);
    } else {
      this.#commands.push(["RR", x, y, w, h, radii]);
    }
  }

  buildPathInCanvas(ctx: ICanvasRenderingContext2D) {
    let x = 0;
    let y = 0;
    let endAngle: number;
    let startAngle: number;
    let largeArcFlag: boolean;
    let sweepFlag: boolean;
    let endPoint: Point;
    let midPoint: Point;
    let angle: number;
    let lambda: number;
    let t1: number;
    let t2: number;
    let x1: number;
    let y1: number;
    let r: number;
    let rx: number;
    let ry: number;
    let w: number;
    let h: number;
    let pathType: Command;
    let centerPoint: Point;
    let ccw: boolean;
    let radii: number | DOMPointInit | (number | DOMPointInit)[];
    let cpx: null | number = null;
    let cpy: null | number = null;
    let qcpx: null | number = null;
    let qcpy: null | number = null;
    let startPoint: null | Point = null;
    let currentPoint: null | Point = null;

    ctx.beginPath();
    for (let i = 0; i < this.#commands.length; ++i) {
      pathType = this.#commands[i][0];

      // Reset control point if command is not cubic
      if (pathType !== "S" && pathType !== "s" && pathType !== "C" && pathType !== "c") {
        cpx = null;
        cpy = null;
      }

      if (pathType !== "T" && pathType !== "t" && pathType !== "Q" && pathType !== "q") {
        qcpx = null;
        qcpy = null;
      }
      let c;
      switch (pathType) {
        case "m":
        case "M":
          c = this.#commands[i] as MovePathCommand;
          if (pathType === "m") {
            x += c[1];
            y += c[2];
          } else {
            x = c[1];
            y = c[2];
          }

          if (pathType === "M" || !startPoint) {
            startPoint = { x, y };
          }

          ctx.moveTo(x, y);
          break;
        case "l":
          c = this.#commands[i] as LinePathCommand;
          x += c[1];
          y += c[2];
          ctx.lineTo(x, y);
          break;
        case "L":
          c = this.#commands[i] as LinePathCommand;
          x = c[1];
          y = c[2];
          ctx.lineTo(x, y);
          break;
        case "H":
          c = this.#commands[i] as HorizontalPathCommand;
          x = c[1];
          ctx.lineTo(x, y);
          break;
        case "h":
          c = this.#commands[i] as HorizontalPathCommand;
          x += c[1];
          ctx.lineTo(x, y);
          break;
        case "V":
          c = this.#commands[i] as VerticalPathCommand;
          y = c[1];
          ctx.lineTo(x, y);
          break;
        case "v":
          c = this.#commands[i] as VerticalPathCommand;
          y += c[1];
          ctx.lineTo(x, y);
          break;
        case "a":
        case "A":
          c = this.#commands[i] as ArcPathCommand;
          if (currentPoint === null) {
            throw new Error("This should never happen");
          }
          if (pathType === "a") {
            x += c[6];
            y += c[7];
          } else {
            x = c[6];
            y = c[7];
          }

          rx = c[1]; // rx
          ry = c[2]; // ry
          angle = (c[3] * Math.PI) / 180;
          largeArcFlag = !!c[4];
          sweepFlag = !!c[5];
          endPoint = { x, y };

          // https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes

          midPoint = {
            x: (currentPoint.x - endPoint.x) / 2,
            y: (currentPoint.y - endPoint.y) / 2,
          };
          rotatePoint(midPoint, -angle);

          // radius correction
          lambda = (midPoint.x * midPoint.x) / (rx * rx) + (midPoint.y * midPoint.y) / (ry * ry);
          if (lambda > 1) {
            lambda = Math.sqrt(lambda);
            rx *= lambda;
            ry *= lambda;
          }

          centerPoint = {
            x: (rx * midPoint.y) / ry,
            y: -(ry * midPoint.x) / rx,
          };
          t1 = rx * rx * ry * ry;
          t2 = rx * rx * midPoint.y * midPoint.y + ry * ry * midPoint.x * midPoint.x;
          if (sweepFlag !== largeArcFlag) {
            scalePoint(centerPoint, Math.sqrt((t1 - t2) / t2) || 0);
          } else {
            scalePoint(centerPoint, -Math.sqrt((t1 - t2) / t2) || 0);
          }

          startAngle = Math.atan2((midPoint.y - centerPoint.y) / ry, (midPoint.x - centerPoint.x) / rx);
          endAngle = Math.atan2(-(midPoint.y + centerPoint.y) / ry, -(midPoint.x + centerPoint.x) / rx);

          rotatePoint(centerPoint, angle);
          translatePoint(centerPoint, (endPoint.x + currentPoint.x) / 2, (endPoint.y + currentPoint.y) / 2);

          ctx.save();
          ctx.translate(centerPoint.x, centerPoint.y);
          ctx.rotate(angle);
          ctx.scale(rx, ry);
          ctx.arc(0, 0, 1, startAngle, endAngle, !sweepFlag);
          ctx.restore();
          break;
        case "C":
          c = this.#commands[i] as CurvePathCommand;
          cpx = c[3]; // Last control point
          cpy = c[4];
          x = c[5];
          y = c[6];
          ctx.bezierCurveTo(c[1], c[2], cpx, cpy, x, y);
          break;
        case "c":
          c = this.#commands[i] as CurvePathCommand;
          ctx.bezierCurveTo(c[1] + x, c[2] + y, c[3] + x, c[4] + y, c[5] + x, c[6] + y);
          cpx = c[3] + x; // Last control point
          cpy = c[4] + y;
          x += c[5];
          y += c[6];
          break;
        case "S":
          c = this.#commands[i] as ShortCurvePathCommand;
          if (cpx === null || cpy === null) {
            cpx = x;
            cpy = y;
          }

          ctx.bezierCurveTo(2 * x - cpx, 2 * y - cpy, c[1], c[2], c[3], c[4]);
          cpx = c[1]; // last control point
          cpy = c[2];
          x = c[3];
          y = c[4];
          break;
        case "s":
          c = this.#commands[i] as ShortCurvePathCommand;
          if (cpx === null || cpy === null) {
            cpx = x;
            cpy = y;
          }

          ctx.bezierCurveTo(2 * x - cpx, 2 * y - cpy, c[1] + x, c[2] + y, c[3] + x, c[4] + y);
          cpx = c[1] + x; // last control point
          cpy = c[2] + y;
          x += c[3];
          y += c[4];
          break;
        case "Q":
          c = this.#commands[i] as QuadraticCurvePathCommand;
          qcpx = c[1]; // last control point
          qcpy = c[2];
          x = c[3];
          y = c[4];
          ctx.quadraticCurveTo(qcpx, qcpy, x, y);
          break;
        case "q":
          c = this.#commands[i] as QuadraticCurvePathCommand;
          qcpx = c[1] + x; // last control point
          qcpy = c[2] + y;
          x += c[3];
          y += c[4];
          ctx.quadraticCurveTo(qcpx, qcpy, x, y);
          break;
        case "T":
          c = this.#commands[i] as ShortQuadraticCurvePathCommand;
          if (qcpx === null || qcpy === null) {
            qcpx = x;
            qcpy = y;
          }
          qcpx = 2 * x - qcpx; // last control point
          qcpy = 2 * y - qcpy;
          x = c[1];
          y = c[2];
          ctx.quadraticCurveTo(qcpx, qcpy, x, y);
          break;
        case "t":
          c = this.#commands[i] as ShortQuadraticCurvePathCommand;
          if (qcpx === null || qcpy === null) {
            qcpx = x;
            qcpy = y;
          }
          qcpx = 2 * x - qcpx; // last control point
          qcpy = 2 * y - qcpy;
          x += c[1];
          y += c[2];
          ctx.quadraticCurveTo(qcpx, qcpy, x, y);
          break;
        case "z":
        case "Z":
          if (startPoint) {
            x = startPoint.x;
            y = startPoint.y;
          }
          startPoint = null;
          ctx.closePath();
          break;
        case "AC": // arc
          c = this.#commands[i] as ArcCommand;
          x = c[1];
          y = c[2];
          r = c[3];
          startAngle = c[4];
          endAngle = c[5];
          ccw = c[6];
          ctx.arc(x, y, r, startAngle, endAngle, ccw);
          break;
        case "AT": // arcTo
          c = this.#commands[i] as ArcToCommand;
          x1 = c[1];
          y1 = c[2];
          x = c[3];
          y = c[4];
          r = c[5];
          ctx.arcTo(x1, y1, x, y, r);
          break;
        case "E": // ellipse
          c = this.#commands[i] as EllipseCommand;
          x = c[1];
          y = c[2];
          rx = c[3];
          ry = c[4];
          angle = c[5];
          startAngle = c[6];
          endAngle = c[7];
          ccw = c[8];
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.scale(rx, ry);
          ctx.arc(0, 0, 1, startAngle, endAngle, ccw);
          ctx.restore();
          break;
        case "R": // rect
          c = this.#commands[i] as RectCommand;
          x = c[1];
          y = c[2];
          w = c[3];
          h = c[4];
          startPoint = { x, y };
          ctx.rect(x, y, w, h);
          break;
        case "RR": // roundedRect
          c = this.#commands[i] as RoundRectCommand;
          x = c[1];
          y = c[2];
          w = c[3];
          h = c[4];
          radii = c[5];
          startPoint = { x, y };
          ctx.roundRect(x, y, w, h, radii);
          break;
        default:
          throw new Error(`Invalid path command: ${pathType as string}`);
      }

      if (!currentPoint) {
        currentPoint = { x, y };
      } else {
        currentPoint.x = x;
        currentPoint.y = y;
      }
    }
  }
}
