import { describe, expect, test } from "vitest";
import { NEVER, OFTEN, SOMETIMES, scoreAnswers } from "../../src/lib/asrs";

const GOLDEN = [
  SOMETIMES, SOMETIMES, SOMETIMES, OFTEN,
  NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER,
  NEVER, NEVER, NEVER, NEVER, NEVER,
];

describe("scoreAnswers", () => {
  test("golden case end to end: screener 4, positive band, domain counts", () => {
    const result = scoreAnswers(GOLDEN);
    expect(result.screener).toBe(4);
    expect(result.band.id).toBe("positive");
    // Items 1–4 are all inattention and all reach their threshold.
    expect(result.domains).toEqual({ inattention: 4, hyperactivityImpulsivity: 0 });
  });

  test("result has exactly screener, band and domains: no total (brief 5.4)", () => {
    expect(Object.keys(scoreAnswers(GOLDEN)).sort()).toEqual(["band", "domains", "screener"]);
  });

  test("rejects input that is not a list", () => {
    for (const bad of [undefined, null, "0,1,2", 3, { length: 18 }]) {
      expect(() => scoreAnswers(bad), `input ${String(bad)}`).toThrow(TypeError);
    }
  });

  test("rejects the wrong number of answers", () => {
    expect(() => scoreAnswers(GOLDEN.slice(0, 17))).toThrow("Expected 18 answers, got 17");
    expect(() => scoreAnswers([...GOLDEN, NEVER])).toThrow("Expected 18 answers, got 19");
    expect(() => scoreAnswers([])).toThrow("Expected 18 answers, got 0");
  });

  test("rejects invalid answer values and names the item", () => {
    for (const bad of [5, -1, 2.5, "2", null, undefined, NaN]) {
      const answers: unknown[] = [...GOLDEN];
      answers[6] = bad; // item 7
      expect(() => scoreAnswers(answers), `value ${String(bad)}`).toThrow(/item 7/);
    }
  });
});
