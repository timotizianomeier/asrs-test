import { describe, expect, test } from "vitest";
import { getMessages } from "../../src/i18n";
import { NEVER, OFTEN, SOMETIMES } from "../../src/lib/asrs";
import { formatResultText } from "../../src/output/resultText";

const t = getMessages("en");
const DATE = new Date(2026, 10, 24); // 24 November 2026, local time
const GOLDEN = [
  SOMETIMES, SOMETIMES, SOMETIMES, OFTEN,
  NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER, NEVER,
  NEVER, NEVER, NEVER, NEVER, NEVER,
];

describe("formatResultText", () => {
  const text = formatResultText(GOLDEN, t, DATE);
  const lines = text.split("\n");

  test("starts with the title and day-precision date, then the disclaimer", () => {
    expect(lines[0]).toBe("ASRS self-check: your result (24 November 2026)");
    expect(lines[2]).toBe(t.notADiagnosis);
  });

  test("golden case: score, band figures, domain counts and both sources", () => {
    expect(text).toContain("Screening score: 4 out of 6");
    expect(text).toContain("68.7%");
    expect(text).toContain("0.5%");
    expect(text).toContain("Inattention: 4 of 9");
    expect(text).toContain("Hyperactivity / impulsivity: 0 of 9");
    expect(text).toContain(`${t.sources["kessler2005-table4"].citation}. https://doi.org/`);
    expect(text).toContain(`${t.sources.kessler2005.citation}. https://doi.org/`);
  });

  test("includes every caveat and limitation shown on the result page", () => {
    for (const line of [...t.domainCaveats, ...t.evidenceLimitations]) {
      expect(text).toContain(`- ${line}`);
    }
  });

  test("appendix lists all 18 questions in official order with the chosen answer", () => {
    const start = lines.indexOf(t.output.answersHeading);
    expect(start).toBeGreaterThan(0);
    const appendix = lines.slice(start + 1, start + 19);
    expect(appendix.map((line) => Number(line.split(".")[0]))).toEqual(
      Array.from({ length: 18 }, (_, i) => i + 1),
    );
    expect(appendix[0]).toBe(`1. ${t.items[1]} — Sometimes`);
    expect(appendix[3]).toBe(`4. ${t.items[4]} — Often`);
    expect(appendix[17]).toBe(`18. ${t.items[18]} — Never`);
  });

  test("no forbidden output: no total, percentiles, severity or type labels", () => {
    const lower = text.toLowerCase();
    for (const word of ["percentile", "very high", "severe", "presentation", "combined type", "out of 72"]) {
      expect(lower, word).not.toContain(word);
    }
  });

  test("rejects invalid answers, like scoreAnswers", () => {
    expect(() => formatResultText(GOLDEN.slice(0, 17), t, DATE)).toThrow("Expected 18 answers");
    expect(() => formatResultText([...GOLDEN.slice(0, 17), 7], t, DATE)).toThrow(/item 18/);
  });
});
