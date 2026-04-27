import { describe, it, expect } from "vitest";
import { entries, keys, values, fromEntries } from "./object";

describe("entries", () => {
  it("returns typed entries for an object", () => {
    const obj = { a: 1, b: "two", c: true };
    const result = entries(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", "two"],
      ["c", true],
    ]);
  });

  it("returns an empty array for an empty object", () => {
    expect(entries({})).toEqual([]);
  });
});

describe("keys", () => {
  it("returns typed keys for an object", () => {
    const obj = { x: 10, y: 20 };
    expect(keys(obj)).toEqual(["x", "y"]);
  });

  it("returns an empty array for an empty object", () => {
    expect(keys({})).toEqual([]);
  });
});

describe("values", () => {
  it("returns typed values for an object", () => {
    const obj = { a: 1, b: 2 };
    expect(values(obj)).toEqual([1, 2]);
  });

  it("returns an empty array for an empty object", () => {
    expect(values({})).toEqual([]);
  });
});

describe("fromEntries", () => {
  it("reconstructs an object from entries", () => {
    const input: [string, number][] = [
      ["a", 1],
      ["b", 2],
    ];
    expect(fromEntries(input)).toEqual({ a: 1, b: 2 });
  });

  it("returns an empty object for an empty array", () => {
    expect(fromEntries([])).toEqual({});
  });
});
