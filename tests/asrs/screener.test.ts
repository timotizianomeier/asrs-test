import { describe, expect, test } from "vitest";
import { screenerScore } from "../../src/lib/asrs/score";
import type { Answer } from "../../src/lib/asrs/types";
import { NEVER, OFTEN, RARELY, SOMETIMES, VERY_OFTEN } from "../../src/lib/asrs/types";

// Independent reference, typed in from the brief / Kessler 2005 Table 1 —
// deliberately NOT read from items.ts, so a wrong countsAt there is caught.
// Items 1–3 count at Sometimes (2), items 4–6 at Often (3).
const REFERENCE_THRESHOLDS = [2, 2, 2, 3, 3, 3];

const ALL_ANSWERS: Answer[] = [NEVER, RARELY, SOMETIMES, OFTEN, VERY_OFTEN];

/** Every possible list of 6 answers: 5^6 = 15,625 lists. */
function allPartACombinations(): Answer[][] {
  const combinations: Answer[][] = [];
  for (let n = 0; n < 5 ** 6; n++) {
    // Read n as a 6-digit number in base 5; each digit is one answer.
    const combo: Answer[] = [];
    let rest = n;
    for (let i = 0; i < 6; i++) {
      combo.push(ALL_ANSWERS[rest % 5]);
      rest = Math.floor(rest / 5);
    }
    combinations.push(combo);
  }
  return combinations;
}

describe("screenerScore", () => {
  test("matches the reference rule for all 15,625 Part A combinations", () => {
    const combinations = allPartACombinations();
    expect(combinations).toHaveLength(15_625);

    for (const partA of combinations) {
      const expected = partA.filter((answer, i) => answer >= REFERENCE_THRESHOLDS[i]).length;
      // Part B set to the maximum: it must not change the screener score.
      const answers = [...partA, ...Array<Answer>(12).fill(VERY_OFTEN)];
      expect(screenerScore(answers), `Part A = ${partA.join(",")}`).toBe(expected);
    }
  });

  test("golden: items 1–3 Sometimes, item 4 Often, rest Never gives 4", () => {
    const answers: Answer[] = [
      SOMETIMES, SOMETIMES, SOMETIMES, OFTEN,
      NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER,
      NEVER, NEVER, NEVER, NEVER, NEVER,
    ];
    expect(answers).toHaveLength(18);
    expect(screenerScore(answers)).toBe(4);
  });
});
