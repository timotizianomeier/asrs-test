/**
 * ASRS v1.1 scoring. Pure functions: no I/O, no dependencies.
 *
 * `answers` is always the 18 answers in official order:
 * answers[0] is item 1, answers[17] is item 18.
 */
import { ITEMS } from "./items";
import type { Answer, Item } from "./types";

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
