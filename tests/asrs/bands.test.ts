import { describe, expect, test } from "vitest";
import { BANDS, bandFor } from "../../src/lib/asrs/bands";

describe("bandFor", () => {
  test("maps every score 0–6 to the right band (brief 5.1)", () => {
    const expected = ["low", "low", "uncertain", "uncertain", "positive", "positive", "positive"];
    for (let score = 0; score <= 6; score++) {
      expect(bandFor(score).id, `score ${score}`).toBe(expected[score]);
    }
  });

  test("throws for scores that cannot happen", () => {
    for (const bad of [-1, 7, 2.5, NaN]) {
      expect(() => bandFor(bad), `score ${bad}`).toThrow(RangeError);
    }
  });
});

describe("BANDS figures (Kessler 2005, Table 4)", () => {
  test("each percentage column adds up to 100", () => {
    const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
    expect(sum(BANDS.map((b) => b.withDiagnosis))).toBeCloseTo(100, 5);
    expect(sum(BANDS.map((b) => b.withoutDiagnosis))).toBeCloseTo(100, 5);
  });

  test("bands cover 0–6 with no gaps or overlaps", () => {
    const covered = BANDS.flatMap((b) =>
      Array.from({ length: b.max - b.min + 1 }, (_, i) => b.min + i),
    );
    expect(covered.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
