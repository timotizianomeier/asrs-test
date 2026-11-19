import { describe, expect, test } from "vitest";
import { domainCounts } from "../../src/lib/asrs/score";
import type { Answer } from "../../src/lib/asrs/types";
import { NEVER, VERY_OFTEN } from "../../src/lib/asrs/types";

// Independent reference for all 18 items, typed in from the brief's item
// table (Kessler 2005, Table 1) — deliberately NOT read from items.ts.
// Index 0 = item 1. I = inattention, H = hyperactivity-impulsivity.
//                            1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18
const REFERENCE_THRESHOLDS = [2, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 2];
const REFERENCE_DOMAINS    = "I  I  I  I  H  H  I  I  I  I  I  H  H  H  H  H  H  H".split(/\s+/);

/**
 * Tiny seeded random number generator (mulberry32). Same seed → same
 * sequence every run, so a failing case can be reproduced.
 * Returns a function that gives a number in [0, 1), like Python's random().
 */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function referenceCounts(answers: Answer[]) {
  let inattention = 0;
  let hyperactivityImpulsivity = 0;
  answers.forEach((answer, i) => {
    if (answer >= REFERENCE_THRESHOLDS[i]) {
      if (REFERENCE_DOMAINS[i] === "I") inattention++;
      else hyperactivityImpulsivity++;
    }
  });
  return { inattention, hyperactivityImpulsivity };
}

describe("domainCounts", () => {
  test("reference table has 9 items per domain", () => {
    expect(REFERENCE_DOMAINS.filter((d) => d === "I")).toHaveLength(9);
    expect(REFERENCE_DOMAINS.filter((d) => d === "H")).toHaveLength(9);
  });

  test("matches the reference for 1,000 random answer sets", () => {
    const random = seededRandom(42);
    for (let run = 0; run < 1000; run++) {
      const answers = Array.from({ length: 18 }, () => Math.floor(random() * 5) as Answer);
      expect(domainCounts(answers), `answers = ${answers.join(",")}`).toEqual(referenceCounts(answers));
    }
  });

  test("all Never gives 0 and 0; all Very often gives 9 and 9", () => {
    expect(domainCounts(Array<Answer>(18).fill(NEVER))).toEqual({ inattention: 0, hyperactivityImpulsivity: 0 });
    expect(domainCounts(Array<Answer>(18).fill(VERY_OFTEN))).toEqual({ inattention: 9, hyperactivityImpulsivity: 9 });
  });
});
