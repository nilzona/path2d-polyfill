import { beforeEach, describe, expect, test } from "vitest";
import { parsePath } from "../parse-path.js";

describe("parse-path", () => {
  // https://www.w3.org/TR/SVG/paths.html#PathDataGeneralInformation
  let path = "";
  let ary;

  beforeEach(() => {
    path = "";
    ary = [];
  });

  test("path data segement must begin with a moveTo command", () => {
    path = "L3 4 L5 6";
    ary = parsePath(path);
    expect(ary).to.deep.equal([]);
  });

  test(" should join multiple commands", () => {
    path = "M1 2 L3 4 Q5 6 7 8 Z";
    ary = parsePath(path);
    expect(ary).to.deep.equal([["M", 1, 2], ["L", 3, 4], ["Q", 5, 6, 7, 8], ["Z"]]);
  });

  test("should be possible to chain command parameters", () => {
    path = "M0 0 L 1 2 3 4";
    ary = parsePath(path);
    expect(ary).to.deep.equal([
      ["M", 0, 0],
      ["L", 1, 2],
      ["L", 3, 4],
    ]);

    path = "M0 0 L 1 2 3 4 5"; // Only accept pairs
    ary = parsePath(path);
    expect(ary).to.deep.equal([
      ["M", 0, 0],
      ["L", 1, 2],
      ["L", 3, 4],
    ]);
  });

  test("superfluous white space and separators such as commas can be eliminated", () => {
    path = "M0 0 L ,1 ,2";
    ary = parsePath(path);
    expect(ary).to.deep.equal([
      ["M", 0, 0],
      ["L", 1, 2],
    ]);

    path = "M0 0 L    1    2";
    ary = parsePath(path);
    expect(ary).to.deep.equal([
      ["M", 0, 0],
      ["L", 1, 2],
    ]);
  });

  test("should discard invalid commands", () => {
    path = "M 0 0 L 1 2, M3 4 Ö5, L 7 8";
    ary = parsePath(path);
    expect(ary).to.deep.equal([
      ["M", 0, 0],
      ["L", 1, 2],
      ["M", 3, 4],
      ["L", 7, 8],
    ]);

    path = "M 0 0 L1 2, L3 4 Ö5 6, L7 8";
    ary = parsePath(path);
    expect(ary).to.deep.equal([
      ["M", 0, 0],
      ["L", 1, 2],
      ["L", 3, 4],
      ["L", 5, 6], // Should not do this and instead ignore this command as well?
      ["L", 7, 8],
    ]);
  });

  describe("moveTo", () => {
    test("M", () => {
      path = "M123 456";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 123, 456]]);
    });

    test("m", () => {
      path = "m123 456";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["m", 123, 456]]);
    });

    test("subsequent pairs are treated as implicit lineTo commands", () => {
      path = "M1 2 3 4";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 1, 2],
        ["L", 3, 4],
      ]);

      path = "m1 2 3 4";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["m", 1, 2],
        ["l", 3, 4],
      ]);

      path = "m1 2 3"; // Invalid length on subsequnt paramaters
      ary = parsePath(path);
      expect(ary).to.deep.equal([["m", 1, 2]]);
    });

    test("exceed max parameters", () => {
      path = "M 1 2 3";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 1, 2]]);
    });

    test("below parameter limit", () => {
      path = "M 1";
      ary = parsePath(path);
      expect(ary).to.deep.equal([]);
    });
  });

  describe("lineTo", () => {
    test("L", () => {
      path = "M0 0 L123 456 L 987 6";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["L", 123, 456],
        ["L", 987, 6],
      ]);
    });

    test("l", () => {
      path = "M0 0 l123 456 l 987 6";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["l", 123, 456],
        ["l", 987, 6],
      ]);
    });

    test("V", () => {
      path = "M0 0 V1 V2";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["V", 1],
        ["V", 2],
      ]);
    });

    test("v", () => {
      path = "M0 0 v1 v2";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["v", 1],
        ["v", 2],
      ]);
    });

    test("H", () => {
      path = "M0 0 H1 H2";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["H", 1],
        ["H", 2],
      ]);
    });

    test("h", () => {
      path = "M0 0 h1 h2";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["h", 1],
        ["h", 2],
      ]);
    });

    test("exceed max parameters", () => {
      path = "M0 0 L 1 2 3";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["L", 1, 2],
      ]);
    });

    test("L - below parameter limit", () => {
      path = "M0 0 L 1";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });

    test("V - below parameter limit", () => {
      path = "M0 0 V";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });

    test("H - below parameter limit", () => {
      path = "M0 0 H";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });
  });

  describe("closePath", () => {
    test("z", () => {
      path = "M0 0 Z";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0], ["Z"]]);
    });

    test("z", () => {
      path = "M0 0 z";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0], ["z"]]);
    });

    test("exceed max parameters", () => {
      path = "M0 0 Z 1";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0], ["Z"]]);
    });
  });

  describe("cubic Bézier curve", () => {
    test("C", () => {
      path = "M 0 0 C 1 2 3 4 5 6";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["C", 1, 2, 3, 4, 5, 6],
      ]);
    });

    test("c", () => {
      path = "M0 0 c 1 2 3 4 5 6";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["c", 1, 2, 3, 4, 5, 6],
      ]);
    });

    test("S", () => {
      path = "M0 0 S 1 2 3 4";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["S", 1, 2, 3, 4],
      ]);
    });

    test("s", () => {
      path = "M0 0 s 1 2 3 4";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["s", 1, 2, 3, 4],
      ]);
    });

    test("C - exceed max parameters", () => {
      path = "M0 0 C 1 2 3 4 5 6 7";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["C", 1, 2, 3, 4, 5, 6],
      ]);
    });

    test("S - exceed max parameters", () => {
      path = "M0 0 S 1 2 3 4 5";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["S", 1, 2, 3, 4],
      ]);
    });

    test("C - below parameter limit", () => {
      path = "M0 0 C 1 2 3 4 5";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });

    test("S - below parameter limit", () => {
      path = "M0 0 S 1 2 3";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });
  });

  describe("quadratic Bézier curve", () => {
    test("Q", () => {
      path = "M0 0 Q 1 2 3 4";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["Q", 1, 2, 3, 4],
      ]);
    });

    test("q", () => {
      path = "M0 0 q 1 2 3 4";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["q", 1, 2, 3, 4],
      ]);
    });

    test("T", () => {
      path = "M0 0 T 1 2";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["T", 1, 2],
      ]);
    });

    test("t", () => {
      path = "M0 0 t 1 2";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["t", 1, 2],
      ]);
    });

    test("Q - exceed max parameters", () => {
      path = "M0 0 Q 1 2 3 4 5";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["Q", 1, 2, 3, 4],
      ]);
    });

    test("T - exceed max parameters", () => {
      path = "M0 0 T 1 2 3";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["T", 1, 2],
      ]);
    });

    test("Q - below parameter limit", () => {
      path = "M0 0 Q 1 2 3";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });

    test("T - below parameter limit", () => {
      path = "M0 0 T 1";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });
  });

  describe("elliptical arc curve", () => {
    test("A", () => {
      path = "M0 0 A 1 2 3 4 5 6 7";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["A", 1, 2, 3, 4, 5, 6, 7],
      ]);
    });

    test("a", () => {
      path = "M0 0 a 1 2 3 4 5 6 7";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["a", 1, 2, 3, 4, 5, 6, 7],
      ]);
    });

    test("exceed max parameters", () => {
      path = "M0 0 A 1 2 3 4 5 6 7 8";
      ary = parsePath(path);
      expect(ary).to.deep.equal([
        ["M", 0, 0],
        ["A", 1, 2, 3, 4, 5, 6, 7],
      ]);
    });

    test("below parameter limit", () => {
      path = "M0 0 A 1 2 3 4 5 6";
      ary = parsePath(path);
      expect(ary).to.deep.equal([["M", 0, 0]]);
    });
  });
});
