import { describe, expect, test } from "vitest";
import { BANDS, ITEMS } from "../../src/lib/asrs";
import { en } from "../../src/i18n/en";

describe("English messages", () => {
  test("has wording for exactly the 18 items in ITEMS", () => {
    const wordingIds = Object.keys(en.items).map(Number);
    expect(wordingIds).toEqual(ITEMS.map((item) => item.id));
  });

  test("every item is a non-empty question", () => {
    for (const text of Object.values(en.items)) {
      expect(text.trim()).toMatch(/\?$/);
    }
  });

  test("band texts show the Table 4 figures from BANDS, to one decimal", () => {
    for (const band of BANDS) {
      const body = en.bands[band.id].body(band);
      expect(body).toContain(`${band.withDiagnosis.toFixed(1)}%`);
      expect(body).toContain(`${band.withoutDiagnosis.toFixed(1)}%`);
    }
  });

  test("no forbidden output: no percentiles, severity labels or type labels (brief 2.2)", () => {
    const allText = JSON.stringify(en, (_key, value) =>
      typeof value === "function" ? value(BANDS[0]) : value,
    ).toLowerCase();
    for (const word of ["percentile", "very high", "severe", "presentation", "combined type"]) {
      expect(allText, word).not.toContain(word);
    }
  });
});
