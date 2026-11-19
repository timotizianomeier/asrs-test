/**
 * ASRS v1.1 scoring. Pure functions: no I/O, no dependencies.
 *
 * `answers` is always the 18 answers in official order:
 * answers[0] is item 1, answers[17] is item 18.
 */
import { ITEMS } from "./items";
import { bandFor } from "./bands";
import type { Answer, Domain, DomainCounts, Item, Result } from "./types";

/** True if this answer reaches the item's threshold (Kessler 2005, Table 1). */
export function countsAsSymptom(item: Item, answer: Answer): boolean {
  return answer >= item.countsAt;
}

/**
 * Screener score (brief 5.1): how many of the six Part A items reach their
 * threshold. Returns 0–6.
 */
export function screenerScore(answers: readonly Answer[]): number {
  const partA = ITEMS.filter((item) => item.part === "A");
  return partA.filter((item) => countsAsSymptom(item, answers[item.id - 1])).length;
}

/**
 * Symptoms by area (brief 5.2): how many of the 9 items in each DSM-IV
 * domain reach their threshold. Uses all 18 items.
 */
export function domainCounts(answers: readonly Answer[]): DomainCounts {
  const countIn = (domain: Domain) =>
    ITEMS.filter((item) => item.domain === domain && countsAsSymptom(item, answers[item.id - 1])).length;

  return {
    inattention: countIn("inattention"),
    hyperactivityImpulsivity: countIn("hyperactivity-impulsivity"),
  };
}

/** True if `value` is a valid answer code: a whole number from 0 to 4. */
export function isAnswer(value: unknown): value is Answer {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 4;
}

/**
 * The front door: validate 18 answers, then compute everything the site
 * shows. Pages, PDF and email all call this, never the parts directly.
 * Throws if the input isn't exactly 18 valid answers.
 */
export function scoreAnswers(answers: unknown): Result {
  if (!Array.isArray(answers)) {
    throw new TypeError("Answers must be a list");
  }
  if (answers.length !== ITEMS.length) {
    throw new RangeError(`Expected ${ITEMS.length} answers, got ${answers.length}`);
  }
  answers.forEach((value, i) => {
    if (!isAnswer(value)) {
      throw new RangeError(`Answer to item ${i + 1} must be a whole number from 0 to 4, got ${String(value)}`);
    }
  });

  const valid = answers as Answer[];
  const screener = screenerScore(valid);
  return {
    screener,
    band: bandFor(screener),
    domains: domainCounts(valid),
  };
}
