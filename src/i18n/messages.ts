/**
 * The shape every language file must have. A language that misses a key
 * (or one of the 18 items, 5 answer labels, 3 bands) fails the type check.
 */
import type { Answer, Band, BandId, Domain, ItemId, SourceId } from "../lib/asrs";

export interface Messages {
  /** Official instruction text shown above the questions. */
  readonly instructions: string;
  /** Official item wording, keyed by official item number. */
  readonly items: Readonly<Record<ItemId, string>>;
  /** Labels for the five answer codes. */
  readonly answerLabels: Readonly<Record<Answer, string>>;

  /** Shown before the test, on the result and in the email (brief 2.1). */
  readonly notADiagnosis: string;

  /** Result 5.1: heading for the screener score. */
  readonly screenerHeading: (score: number) => string;
  /** Result 5.1: one title + text per band. Figures come from the Band data. */
  readonly bands: Readonly<Record<BandId, { readonly title: string; readonly body: (band: Band) => string }>>;

  /** Result 5.2: area names, count line and the caveats always shown with it. */
  readonly domainsHeading: string;
  readonly domainNames: Readonly<Record<Domain, string>>;
  readonly domainCount: (count: number) => string;
  readonly domainCaveats: readonly string[];

  /** Result 5.3: "About the evidence" (collapsible). */
  readonly evidenceHeading: string;
  readonly evidenceLimitations: readonly string[];

  /** Full reference for each source a figure can cite. */
  readonly sources: Readonly<Record<SourceId, string>>;
}
