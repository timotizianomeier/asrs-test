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

/** Official question number, 1–18. */
export type ItemId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

/** One row of the item table (official checklist numbering). */
export interface Item {
  readonly id: ItemId;
  readonly part: Part;
  readonly domain: Domain;
  /**
   * Lowest answer that counts as a symptom: the first shaded box on the
   * official checklist (SOMETIMES or OFTEN). An answer counts if
   * answer >= countsAt.
   */
  readonly countsAt: Answer;
}

/** Symptoms counted per DSM-IV area (brief 5.2). Each is 0–9. */
export interface DomainCounts {
  readonly inattention: number;
  readonly hyperactivityImpulsivity: number;
}

/**
 * Everything the site shows about one completed questionnaire.
 * Deliberately no 0–72 total, percentile or type label (brief 5.4).
 */
export interface Result {
  /** Screener score, 0–6 (brief 5.1). */
  readonly screener: number;
  readonly band: Band;
  readonly domains: DomainCounts;
}

/** Sources a result figure can cite. Each one gets a full reference on the site. */
export type SourceId = "kessler2005-table4";

/** The three screener bands. The sentences for each live in src/i18n/. */
export type BandId = "low" | "uncertain" | "positive";

/** One screener band: a score range and the study figures for it. */
export interface Band {
  readonly id: BandId;
  /** Lowest and highest screener score in this band (inclusive). */
  readonly min: number;
  readonly max: number;
  /** % of people WITH a clinical ADHD diagnosis who scored in this band. */
  readonly withDiagnosis: number;
  /** % of people WITHOUT a diagnosis who scored in this band. */
  readonly withoutDiagnosis: number;
  /** Where the two percentages come from. */
  readonly source: SourceId;
}
