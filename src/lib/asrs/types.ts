/**
 * Core types for the ASRS v1.1 scoring module.
 *
 * Source for every value below: Kessler et al. (2005), Psychological
 * Medicine 35(2), 245–256, Table 1, and the official ASRS v1.1 checklist.
 */

/** One answer, coded 0–4: Never, Rarely, Sometimes, Often, Very often. */
export type Answer = 0 | 1 | 2 | 3 | 4;

/** Named answer codes, so code reads like the questionnaire. */
export const NEVER: Answer = 0;
export const RARELY: Answer = 1;
export const SOMETIMES: Answer = 2;
export const OFTEN: Answer = 3;
export const VERY_OFTEN: Answer = 4;

/** Part A = the six screener questions (1–6); Part B = questions 7–18. */
export type Part = "A" | "B";

/** The DSM-IV symptom area a question belongs to. */
export type Domain = "inattention" | "hyperactivity-impulsivity";

/** One row of the item table (official checklist numbering). */
export interface Item {
  /** Official question number, 1–18. */
  readonly id: number;
  readonly part: Part;
  readonly domain: Domain;
  /**
   * Lowest answer that counts as a symptom: the first shaded box on the
   * official checklist (SOMETIMES or OFTEN). An answer counts if
   * answer >= countsAt.
   */
  readonly countsAt: Answer;
}
