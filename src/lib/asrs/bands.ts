/**
 * Screener bands (brief 5.1). Figures: Kessler et al. (2005), Table 4.
 */
import type { Band } from "./types";

export const BANDS: readonly Band[] = [
  { id: "low", min: 0, max: 1, withDiagnosis: 4.3, withoutDiagnosis: 74.8, source: "kessler2005-table4" },
  { id: "uncertain", min: 2, max: 3, withDiagnosis: 27.0, withoutDiagnosis: 24.7, source: "kessler2005-table4" },
  { id: "positive", min: 4, max: 6, withDiagnosis: 68.7, withoutDiagnosis: 0.5, source: "kessler2005-table4" },
];

/** The band a screener score (whole number 0–6) falls in. */
export function bandFor(score: number): Band {
  const band = BANDS.find((b) => score >= b.min && score <= b.max);
  if (!Number.isInteger(score) || band === undefined) {
    throw new RangeError(`Screener score must be a whole number from 0 to 6, got ${score}`);
  }
  return band;
}
