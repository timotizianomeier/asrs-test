import { describe, expect, test } from "vitest";
import { ITEMS } from "../../src/lib/asrs/items";

describe("ITEMS table", () => {
  test("has 18 items numbered 1 to 18 in order", () => {
    expect(ITEMS.map((item) => item.id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ]);
  });

  test("Part A is exactly items 1–6", () => {
    const partA = ITEMS.filter((item) => item.part === "A").map((item) => item.id);
    expect(partA).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test("each domain has 9 items", () => {
    const count = (domain: string) => ITEMS.filter((item) => item.domain === domain).length;
    expect(count("inattention")).toBe(9);
    expect(count("hyperactivity-impulsivity")).toBe(9);
  });
});
