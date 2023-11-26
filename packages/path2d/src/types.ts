import type { Path2D } from "./path2d.js";

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

export type MovePathCommand = ["m" | "M", number, number];
export type LinePathCommand = ["l" | "L", number, number];
export type HorizontalPathCommand = ["h" | "H", number];
export type VerticalPathCommand = ["v" | "V", number];
export type ArcPathCommand = ["a" | "A", number, number, number, boolean, boolean, number, number];
export type CurvePathCommand = ["c" | "C", number, number, number, number, number, number];
export type ShortCurvePathCommand = ["s" | "S", number, number, number, number];
export type QuadraticCurvePathCommand = ["q" | "Q", number, number, number, number];
export type ShortQuadraticCurvePathCommand = ["t" | "T", number, number];
export type ClosePathCommand = ["z" | "Z"];
export type ArcCommand = ["AC", number, number, number, number, number, boolean];
export type ArcToCommand = ["AT", number, number, number, number, number];
export type EllipseCommand = ["E", number, number, number, number, number, number, number, boolean];
export type RectCommand = ["R", number, number, number, number];
export type RoundRectCommand = ["RR", number, number, number, number, number | number[]];
export type GenericCommand = [Command, ...(number | boolean | number[])[]];
export type CanvasFillRule = "nonzero" | "evenodd";

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

export interface IPath2D {
  addPath(path: IPath2D): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(x: number, y: number, r: number, start: number, end: number, ccw: boolean): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void;
  ellipse(x: number, y: number, rx: number, ry: number, angle: number, start: number, end: number, ccw: boolean): void;
  closePath(): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  rect(x: number, y: number, width: number, height: number): void;
  roundRect(x: number, y: number, width: number, height: number, radii: number | number[]): void;
}

export interface ICanvasRenderingContext2D {
  beginPath(): void;
  save(): void;
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  scale(x: number, y: number): void;
  restore(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(x: number, y: number, r: number, start: number, end: number, ccw: boolean): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void;
  ellipse(x: number, y: number, rx: number, ry: number, angle: number, start: number, end: number, ccw: boolean): void;
  closePath(): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  rect(x: number, y: number, width: number, height: number): void;
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
  isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
  fill(fillRule?: CanvasFillRule): void;
  fill(path: Path2D, fillRule?: CanvasFillRule): void;
  stroke(): void;
  stroke(path: Path2D): void;
  roundRect(x: number, y: number, width: number, height: number, radii: number | number[]): void;
}

export type IPrototype<T> = {
  prototype: T;
  new (): T;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };
