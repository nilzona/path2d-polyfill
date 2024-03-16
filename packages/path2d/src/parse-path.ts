import type { Command, MovePathCommand, PathCommand } from "./types.js";

type ArgLengthProp = "a" | "c" | "h" | "l" | "m" | "q" | "s" | "t" | "v" | "z";

const ARG_LENGTH = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0,
};

const SEGMENT_PATTERN = /([astvzqmhlc])([^astvzqmhlc]*)/gi;

const NUMBER = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

function parseValues(args: string): number[] {
  const numbers = args.match(NUMBER);
  return numbers ? numbers.map(Number) : [];
}

/**
 * parse an svg path data string. Generates an Array
 * of commands where each command is an Array of the
 * form `[command, arg1, arg2, ...]`
 *
 * https://www.w3.org/TR/SVG/paths.html#PathDataGeneralInformation
 * @ignore
 *
 * @param {string} path
 * @returns {array}
 */
export function parsePath(path: string): PathCommand[] {
  const data: PathCommand[] = [];
  const p = String(path).trim();

  // A path data segment (if there is one) must begin with a "moveto" command
  if (p[0] !== "M" && p[0] !== "m") {
    return data;
  }

  p.replace(SEGMENT_PATTERN, (_, command: string, args: string) => {
    const theArgs = parseValues(args);
    let type = command.toLowerCase() as ArgLengthProp;
    let theCommand = command as Command;
    // overloaded moveTo
    if (type === "m" && theArgs.length > 2) {
      data.push([theCommand, ...theArgs.splice(0, 2)] as MovePathCommand);
      type = "l";
      theCommand = theCommand === "m" ? "l" : "L";
    }

    // Ignore invalid commands
    if (theArgs.length < ARG_LENGTH[type]) {
      return "";
    }

    data.push([theCommand, ...theArgs.splice(0, ARG_LENGTH[type])]);

    // The command letter can be eliminated on subsequent commands if the
    // same command is used multiple times in a row (e.g., you can drop the
    // second "L" in "M 100 200 L 200 100 L -100 -200" and use
    // "M 100 200 L 200 100 -100 -200" instead).
    while (theArgs.length >= ARG_LENGTH[type] && theArgs.length && ARG_LENGTH[type]) {
      data.push([theCommand, ...theArgs.splice(0, ARG_LENGTH[type])]);
    }

    return "";
  });
  return data;
}
