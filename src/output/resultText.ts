/**
 * Plain-text version of a result, shared by the email link and the PDF, so
 * every output says exactly what the result page says (brief §6).
 *
 * Lives outside src/lib/asrs/ because it needs the site text (Messages);
 * the scoring module must not import anything outside its folder.
 */
import type { Messages } from "../i18n";
import { ITEMS, scoreAnswers, type Answer, type SourceId } from "../lib/asrs";

/**
 * Score the answers and format everything as plain text: summary first,
 * then the 18 answers as an appendix (docs/decisions.md #19).
 * Throws, like scoreAnswers, if `answers` isn't 18 valid answer codes.
 * `date` is passed in (not read from the clock) so tests are deterministic.
 */
export function formatResultText(answers: unknown, t: Messages, date: Date): string {
  const { screener, band, domains } = scoreAnswers(answers);
  const valid = answers as Answer[]; // safe: scoreAnswers has validated it
  const source = (id: SourceId) => `${t.result.sourceLabel} ${t.sources[id].citation}. ${t.sources[id].url}`;
  const bullets = (lines: readonly string[]) => lines.map((line) => `- ${line}`);

  const lines = [
    t.output.title(date),
    "",
    t.notADiagnosis,
    "",
    // 5.1 Screener score and its band
    t.screenerHeading(screener),
    t.bands[band.id].title,
    t.bands[band.id].body(band),
    source(band.source),
    "",
    // 5.2 Symptoms by area, always with its caveats
    t.domainsHeading,
    `${t.domainNames.inattention}: ${t.domainCount(domains.inattention)}`,
    `${t.domainNames["hyperactivity-impulsivity"]}: ${t.domainCount(domains.hyperactivityImpulsivity)}`,
    ...bullets(t.domainCaveats),
    source("kessler2005"),
    "",
    // 5.3 About the evidence
    t.evidenceHeading,
    ...bullets(t.evidenceLimitations),
    "",
    // Appendix: the 18 answers in official order
    t.output.answersHeading,
    ...ITEMS.map((item) => `${item.id}. ${t.items[item.id]} — ${t.answerLabels[valid[item.id - 1]]}`),
    "",
    t.footer.asrsCopyright,
  ];
  return lines.join("\n");
}
