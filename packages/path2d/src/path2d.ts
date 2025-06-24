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

/**
 * Represents a point in 2D space with x and y coordinates.
 */
type Point = {
  x: number;
  y: number;
};

/**
 * Rotates a point around the origin (0,0) by a specified angle.
 * Modifies the point in place.
 *
 * @param point - The point to rotate
 * @param angle - The rotation angle in radians
 */
function rotatePoint(point: Point, angle: number) {
  const nx = point.x * Math.cos(angle) - point.y * Math.sin(angle);
  const ny = point.y * Math.cos(angle) + point.x * Math.sin(angle);
  point.x = nx;
  point.y = ny;
}

/**
 * Translates a point by a specified offset.
 * Modifies the point in place.
 *
 * @param point - The point to translate
 * @param dx - The horizontal offset
 * @param dy - The vertical offset
 */
function translatePoint(point: Point, dx: number, dy: number) {
  point.x += dx;
  point.y += dy;
}

/**
 * Scales a point by a specified factor.
 * Modifies the point in place.
 *
 * @param point - The point to scale
 * @param s - The scale factor
 */
function scalePoint(point: Point, s: number) {
  point.x *= s;
  point.y *= s;
}

/**
 * Implements the browser's Path2D API for creating and manipulating 2D paths.
 * This class provides methods for building complex paths using lines, curves, arcs, and shapes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 *
 * @example
 * ```typescript
 * // Create a new path
 * const path = new Path2D();
 * path.moveTo(10, 10);
 * path.lineTo(100, 100);
 * path.arc(50, 50, 20, 0, Math.PI * 2);
 *
 * // Create from SVG path string
 * const svgPath = new Path2D("M10,10 L100,100 Z");
 *
 * // Copy existing path
 * const copiedPath = new Path2D(path);
 * ```
 */
export class Path2D {
  /** Internal storage for path commands */
  #commands: PathCommand[];

  /**
   * Creates a new Path2D object.
   *
   * @param path - Optional path to initialize from. Can be another Path2D object or an SVG path string
   *
   * @example
   * ```typescript
   * // Empty path
   * const path1 = new Path2D();
   *
   * // From SVG path string
   * const path2 = new Path2D("M10,10 L100,100 Z");
   *
   * // Copy from another Path2D
   * const path3 = new Path2D(path1);
   * ```
   */
  constructor(path?: Path2D | string) {
    this.#commands = [];
    if (path && path instanceof Path2D) {
      this.#commands.push(...path.#commands);
    } else if (path) {
      this.#commands = parsePath(path);
    }
  }

  /**
   * Adds a custom command to the path's command list.
   * This is primarily used internally for extending functionality.
   *
   * @param command - The path command to add
   */
  addCustomCommand(command: PathCommand) {
    this.#commands.push(command);
  }

  /**
   * Adds the commands from another Path2D object to this path.
   *
   * @param path - The Path2D object whose commands should be added to this path
   *
   * @example
   * ```typescript
   * const path1 = new Path2D("M10,10 L20,20");
   * const path2 = new Path2D("L30,30 Z");
   * path1.addPath(path2); // path1 now contains both sets of commands
   * ```
   */
  addPath(path: Path2D) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (path && path instanceof Path2D) {
      this.#commands.push(...path.#commands);
    }
  }

  /**
   * Moves the starting point of a new sub-path to the specified coordinates.
   *
   * @param x - The x-coordinate of the new starting point
   * @param y - The y-coordinate of the new starting point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(10, 10);
   * ```
   */
  moveTo(x: number, y: number) {
    this.#commands.push(["M", x, y]);
  }

  /**
   * Connects the last point in the current sub-path to the specified coordinates with a straight line.
   *
   * @param x - The x-coordinate of the end point
   * @param y - The y-coordinate of the end point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(10, 10);
   * path.lineTo(100, 100);
   * ```
   */
  lineTo(x: number, y: number) {
    this.#commands.push(["L", x, y]);
  }

  /**
   * Adds a circular arc to the current path.
   *
   * @param x - The x-coordinate of the arc's center
   * @param y - The y-coordinate of the arc's center
   * @param radius - The arc's radius
   * @param startAngle - The starting angle in radians
   * @param endAngle - The ending angle in radians
   * @param counterclockwise - Whether the arc should be drawn counterclockwise (default: false)
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.arc(50, 50, 25, 0, Math.PI * 2); // Full circle
   * path.arc(100, 100, 30, 0, Math.PI, true); // Half circle, counterclockwise
   * ```
   */
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {
    this.#commands.push(["AC", x, y, radius, startAngle, endAngle, !!counterclockwise]);
  }

  /**
   * Adds an arc to the current path with the given control points and radius.
   *
   * @param x1 - The x-coordinate of the first control point
   * @param y1 - The y-coordinate of the first control point
   * @param x2 - The x-coordinate of the second control point
   * @param y2 - The y-coordinate of the second control point
   * @param r - The arc's radius
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(20, 20);
   * path.arcTo(100, 20, 100, 100, 50);
   * ```
   */
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number) {
    this.#commands.push(["AT", x1, y1, x2, y2, r]);
  }

  /**
   * Adds an elliptical arc to the current path.
   *
   * @param x - The x-coordinate of the ellipse's center
   * @param y - The y-coordinate of the ellipse's center
   * @param radiusX - The ellipse's major-axis radius
   * @param radiusY - The ellipse's minor-axis radius
   * @param rotation - The rotation angle of the ellipse in radians
   * @param startAngle - The starting angle in radians
   * @param endAngle - The ending angle in radians
   * @param counterclockwise - Whether the arc should be drawn counterclockwise (default: false)
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.ellipse(50, 50, 30, 20, Math.PI / 4, 0, Math.PI * 2);
   * ```
   */
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

  /**
   * Closes the current sub-path by connecting the last point to the first point with a straight line.
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(10, 10);
   * path.lineTo(100, 10);
   * path.lineTo(100, 100);
   * path.closePath(); // Creates a triangle
   * ```
   */
  closePath() {
    this.#commands.push(["Z"]);
  }

  /**
   * Adds a cubic Bézier curve to the current path.
   *
   * @param cp1x - The x-coordinate of the first control point
   * @param cp1y - The y-coordinate of the first control point
   * @param cp2x - The x-coordinate of the second control point
   * @param cp2y - The y-coordinate of the second control point
   * @param x - The x-coordinate of the end point
   * @param y - The y-coordinate of the end point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(20, 20);
   * path.bezierCurveTo(20, 100, 200, 100, 200, 20);
   * ```
   */
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.#commands.push(["C", cp1x, cp1y, cp2x, cp2y, x, y]);
  }

  /**
   * Adds a quadratic Bézier curve to the current path.
   *
   * @param cpx - The x-coordinate of the control point
   * @param cpy - The y-coordinate of the control point
   * @param x - The x-coordinate of the end point
   * @param y - The y-coordinate of the end point
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.moveTo(20, 20);
   * path.quadraticCurveTo(100, 100, 200, 20);
   * ```
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.#commands.push(["Q", cpx, cpy, x, y]);
  }

  /**
   * Adds a rectangle to the current path.
   *
   * @param x - The x-coordinate of the rectangle's top-left corner
   * @param y - The y-coordinate of the rectangle's top-left corner
   * @param width - The rectangle's width
   * @param height - The rectangle's height
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.rect(10, 10, 100, 50);
   * ```
   */
  rect(x: number, y: number, width: number, height: number) {
    this.#commands.push(["R", x, y, width, height]);
  }

  /**
   * Adds a rounded rectangle to the current path.
   *
   * @param x - The x-coordinate of the rectangle's top-left corner
   * @param y - The y-coordinate of the rectangle's top-left corner
   * @param w - The rectangle's width
   * @param h - The rectangle's height
   * @param radii - The corner radii. Can be a number, DOMPointInit, or array of up to 4 values
   *
   * @example
   * ```typescript
   * const path = new Path2D();
   * path.roundRect(10, 10, 100, 50, 10); // All corners with radius 10
   * path.roundRect(10, 70, 100, 50, [10, 20]); // Different horizontal/vertical radii
   * path.roundRect(10, 130, 100, 50, [5, 10, 15, 20]); // Each corner different
   * ```
   */
  roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]) {
    if (typeof radii === "undefined") {
      this.#commands.push(["RR", x, y, w, h, 0]);
    } else {
      this.#commands.push(["RR", x, y, w, h, radii]);
    }
  }

  /**
   * Builds the path in a canvas rendering context by executing all stored commands.
   * This method translates the internal path commands into actual canvas drawing operations.
   *
   * @param ctx - The canvas rendering context to draw the path in
   *
   * @internal This method is primarily used internally by the polyfill system
   * to render Path2D objects on contexts that don't natively support them.
   */
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
