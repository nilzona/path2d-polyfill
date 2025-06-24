import type { Path2D } from "./path2d.js";

/**
 * SVG path commands and custom canvas commands.
 *
 * Standard SVG path commands:
 * - M/m: Move to (absolute/relative)
 * - L/l: Line to (absolute/relative)
 * - H/h: Horizontal line to (absolute/relative)
 * - V/v: Vertical line to (absolute/relative)
 * - A/a: Arc (absolute/relative)
 * - C/c: Cubic Bézier curve (absolute/relative)
 * - S/s: Smooth cubic Bézier curve (absolute/relative)
 * - Q/q: Quadratic Bézier curve (absolute/relative)
 * - T/t: Smooth quadratic Bézier curve (absolute/relative)
 * - Z/z: Close path
 *
 * Custom canvas commands:
 * - AC: Arc (canvas arc method)
 * - AT: Arc to (canvas arcTo method)
 * - E: Ellipse (canvas ellipse method)
 * - R: Rectangle (canvas rect method)
 * - RR: Rounded rectangle (canvas roundRect method)
 */
export type Command =
  | "M"
  | "m"
  | "L"
  | "l"
  | "H"
  | "h"
  | "V"
  | "v"
  | "A"
  | "a"
  | "C"
  | "c"
  | "S"
  | "s"
  | "Q"
  | "q"
  | "T"
  | "t"
  | "Z"
  | "z"
  | "AC"
  | "AT"
  | "E"
  | "R"
  | "RR";

/** Move command: [command, x, y] */
export type MovePathCommand = ["m" | "M", number, number];

/** Line command: [command, x, y] */
export type LinePathCommand = ["l" | "L", number, number];

/** Horizontal line command: [command, x] */
export type HorizontalPathCommand = ["h" | "H", number];

/** Vertical line command: [command, y] */
export type VerticalPathCommand = ["v" | "V", number];

/** Arc command: [command, rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y] */
export type ArcPathCommand = ["a" | "A", number, number, number, boolean, boolean, number, number];

/** Cubic Bézier curve command: [command, x1, y1, x2, y2, x, y] */
export type CurvePathCommand = ["c" | "C", number, number, number, number, number, number];

/** Smooth cubic Bézier curve command: [command, x2, y2, x, y] */
export type ShortCurvePathCommand = ["s" | "S", number, number, number, number];

/** Quadratic Bézier curve command: [command, x1, y1, x, y] */
export type QuadraticCurvePathCommand = ["q" | "Q", number, number, number, number];

/** Smooth quadratic Bézier curve command: [command, x, y] */
export type ShortQuadraticCurvePathCommand = ["t" | "T", number, number];

/** Close path command: [command] */
export type ClosePathCommand = ["z" | "Z"];

/** Canvas arc command: [command, x, y, radius, startAngle, endAngle, counterclockwise] */
export type ArcCommand = ["AC", number, number, number, number, number, boolean];

/** Canvas arcTo command: [command, x1, y1, x2, y2, radius] */
export type ArcToCommand = ["AT", number, number, number, number, number];

/** Canvas ellipse command: [command, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise] */
export type EllipseCommand = ["E", number, number, number, number, number, number, number, boolean];

/** Canvas rectangle command: [command, x, y, width, height] */
export type RectCommand = ["R", number, number, number, number];

/** Canvas rounded rectangle command: [command, x, y, width, height, radii] */
export type RoundRectCommand = [
  "RR",
  number,
  number,
  number,
  number,
  number | DOMPointInit | (number | DOMPointInit)[],
];

/** Generic command for any path operation */
export type GenericCommand = [Command, ...(number | boolean | number[])[]];

/** Canvas fill rule for determining how to fill paths */
export type CanvasFillRule = "nonzero" | "evenodd";

/**
 * Union type representing all possible path commands.
 * This includes both SVG path commands and custom canvas commands.
 */
export type PathCommand =
  | MovePathCommand
  | LinePathCommand
  | HorizontalPathCommand
  | VerticalPathCommand
  | ArcPathCommand
  | CurvePathCommand
  | ShortCurvePathCommand
  | QuadraticCurvePathCommand
  | ShortQuadraticCurvePathCommand
  | ClosePathCommand
  | ArcCommand
  | ArcToCommand
  | EllipseCommand
  | RectCommand
  | RoundRectCommand
  | GenericCommand;

/**
 * Represents a point in 2D or 3D space.
 * Used for specifying rounded rectangle corner radii and other geometric operations.
 */
export type DOMPointInit = {
  /** The w (perspective) coordinate */
  w?: number;
  /** The x coordinate */
  x?: number;
  /** The y coordinate */
  y?: number;
  /** The z coordinate */
  z?: number;
};

/**
 * Interface representing the CanvasRenderingContext2D API methods used by Path2D.
 * This interface includes both standard canvas methods and Path2D-enhanced methods.
 */
export interface ICanvasRenderingContext2D {
  /** Starts a new path by emptying the list of sub-paths */
  beginPath: () => void;
  /** Saves the current drawing state */
  save: () => void;
  /** Adds a translation transformation to the current matrix */
  translate: (x: number, y: number) => void;
  /** Adds a rotation transformation to the current matrix */
  rotate: (angle: number) => void;
  /** Adds a scaling transformation to the current matrix */
  scale: (x: number, y: number) => void;
  /** Restores the most recently saved drawing state */
  restore: () => void;
  /** Moves the starting point of a new sub-path to the specified coordinates */
  moveTo: (x: number, y: number) => void;
  /** Connects the last point in the current sub-path to the specified coordinates with a straight line */
  lineTo: (x: number, y: number) => void;
  /** Adds a circular arc to the current path */
  arc: (x: number, y: number, r: number, start: number, end: number, ccw: boolean) => void;
  /** Adds an arc to the current path with the given control points and radius */
  arcTo: (x1: number, y1: number, x2: number, y2: number, r: number) => void;
  /** Adds an elliptical arc to the current path */
  ellipse: (
    x: number,
    y: number,
    rx: number,
    ry: number,
    angle: number,
    start: number,
    end: number,
    ccw: boolean,
  ) => void;
  /** Closes the current sub-path by connecting the last point to the first point with a straight line */
  closePath: () => void;
  /** Adds a cubic Bézier curve to the current path */
  bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void;
  /** Adds a quadratic Bézier curve to the current path */
  quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void;
  /** Adds a rectangle to the current path */
  rect: (x: number, y: number, width: number, height: number) => void;
  /** Determines if a point is inside the current path or a specified Path2D object */
  isPointInPath: {
    (x: number, y: number, fillRule?: CanvasFillRule): boolean;
    (path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
  };
  /** Creates a clipping region from the current path or a specified Path2D object */
  clip: {
    (fillRule?: CanvasFillRule): void;
    (path: Path2D, fillRule?: CanvasFillRule): void;
  };
  /** Fills the current path or a specified Path2D object */
  fill: {
    (fillRule?: CanvasFillRule): void;
    (path: Path2D, fillRule?: CanvasFillRule): void;
  };
  /** Strokes the current path or a specified Path2D object */
  stroke: (path?: Path2D) => void;
  /** Adds a rounded rectangle to the current path */
  roundRect: (
    x: number,
    y: number,
    width: number,
    height: number,
    radii?: number | DOMPointInit | (number | DOMPointInit)[],
  ) => void;
}

/**
 * Utility type representing a constructor function with a prototype.
 * Used for typing constructor objects that can be modified with polyfills.
 */
export type Prototype<T> = {
  prototype: T;
  new (): T;
};

/**
 * Utility type that makes specific properties of T optional.
 * Used for creating flexible interfaces where some methods might not be available.
 *
 * @template T - The base type
 * @template K - The keys to make optional
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
