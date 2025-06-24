import type { Command, MovePathCommand, PathCommand } from "./types.js";

/**
 * Valid SVG path command letters that can have arguments.
 * Used for type safety when determining argument counts.
 */
type ArgLengthProp = "a" | "c" | "h" | "l" | "m" | "q" | "s" | "t" | "v" | "z";

/**
 * Defines the number of arguments required for each SVG path command.
 * This mapping is used to validate and parse path command arguments correctly.
 *
 * @example
 * - 'a' (arc): requires 7 arguments (rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y)
 * - 'c' (cubic curve): requires 6 arguments (x1, y1, x2, y2, x, y)
 * - 'm' (move): requires 2 arguments (x, y)
 */
const ARG_LENGTH = {
  a: 7, // arc: rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y
  c: 6, // cubic curve: x1, y1, x2, y2, x, y
  h: 1, // horizontal line: x
  l: 2, // line: x, y
  m: 2, // move: x, y
  q: 4, // quadratic curve: x1, y1, x, y
  s: 4, // smooth cubic curve: x2, y2, x, y
  t: 2, // smooth quadratic curve: x, y
  v: 1, // vertical line: y
  z: 0, // close path: no arguments
};

/**
 * Regular expression pattern to match SVG path command segments.
 * Captures the command letter and all following arguments until the next command.
 */
const SEGMENT_PATTERN = /([astvzqmhlc])([^astvzqmhlc]*)/gi;

/**
 * Regular expression pattern to match numeric values in SVG path strings.
 * Supports integers, decimals, and scientific notation (e.g., 1e-5).
 */
const NUMBER = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

/**
 * Parses numeric arguments from a string containing SVG path command arguments.
 *
 * @param args - String containing space or comma-separated numeric values
 * @returns Array of parsed numbers, or empty array if no valid numbers found
 *
 * @example
 * ```typescript
 * parseValues("10 20 30.5") // returns [10, 20, 30.5]
 * parseValues("1e-5,2.5 -10") // returns [0.00001, 2.5, -10]
 * parseValues("invalid") // returns []
 * ```
 */
function parseValues(args: string): number[] {
  const numbers = args.match(NUMBER);
  return numbers ? numbers.map(Number) : [];
}

/**
 * Parses an SVG path data string into an array of path commands.
 *
 * Each command is represented as an array where the first element is the command letter
 * and subsequent elements are the numeric arguments for that command.
 *
 * Supports all standard SVG path commands:
 *
 * @param path - The SVG path data string to parse
 * @returns Array of path commands, each as [command, ...args]
 *
 * @see {@link https://www.w3.org/TR/SVG/paths.html#PathDataGeneralInformation} SVG Path Specification
 *
 * @example
 * ```typescript
 * // Simple path with move and line commands
 * parsePath("M10,10 L20,20 Z")
 * // Returns: [["M", 10, 10], ["L", 20, 20], ["Z"]]
 *
 * // Complex path with curves and arcs
 * parsePath("M10,10 C20,20 30,30 40,40 A5,5 0 0,1 50,50")
 * // Returns: [["M", 10, 10], ["C", 20, 20, 30, 30, 40, 40], ["A", 5, 5, 0, false, true, 50, 50]]
 *
 * // Relative commands
 * parsePath("m10,10 l10,0 l0,10 z")
 * // Returns: [["m", 10, 10], ["l", 10, 0], ["l", 0, 10], ["z"]]
 * ```
 */
export function parsePath(path: string): PathCommand[] {
  const data: PathCommand[] = [];
  const p = String(path).trim();

  // According to SVG specification, a path data segment must begin with a "moveto" command
  // Return empty array if path doesn't start with M or m
  if (p[0] !== "M" && p[0] !== "m") {
    return data;
  }

  p.replace(SEGMENT_PATTERN, (_, command: string, args: string) => {
    const theArgs = parseValues(args);
    let type = command.toLowerCase() as ArgLengthProp;
    let theCommand = command as Command;

    // Special handling for moveTo command with multiple coordinate pairs
    // After the first moveTo, subsequent coordinate pairs are treated as lineTo commands
    if (type === "m" && theArgs.length > 2) {
      data.push([theCommand, ...theArgs.splice(0, 2)] as MovePathCommand);
      type = "l";
      theCommand = theCommand === "m" ? "l" : "L";
    }

    // Skip commands that don't have enough arguments to be valid
    if (theArgs.length < ARG_LENGTH[type]) {
      return "";
    }

    // Add the first command with its required arguments
    data.push([theCommand, ...theArgs.splice(0, ARG_LENGTH[type])]);

    // Handle implicit repetition of commands
    // The SVG specification allows omitting repeated command letters
    // e.g., "M 100 200 L 200 100 -100 -200" is equivalent to "M 100 200 L 200 100 L -100 -200"
    while (theArgs.length >= ARG_LENGTH[type] && theArgs.length && ARG_LENGTH[type]) {
      data.push([theCommand, ...theArgs.splice(0, ARG_LENGTH[type])]);
    }

    return "";
  });
  return data;
}
