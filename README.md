# ASRS self-check

A free website for taking the **WHO Adult ADHD Self-Report Scale (ASRS-v1.1)**
that shows only what the published research supports.

No business model, no accounts, no cookies, no third-party trackers, and every
figure on the result page is cited. The code is open so anyone can check how
answers are scored.

> **This is not a diagnosis.** The ASRS is a screening questionnaire. Only a
> clinician can diagnose ADHD.

**Status:** in development; the website is not live yet. It goes live only after permission to
reproduce the ASRS has been granted and a privacy review (Swiss FADP / EU GDPR)
is done.

## How scoring works

All scoring runs in the browser, so answers never leave the device unless the
user opts in to share them anonymously. The scoring module is
[`src/lib/asrs/`](src/lib/asrs/): pure TypeScript with no dependencies.

The 18 questions are answered on Never / Rarely / Sometimes / Often / Very Often,
coded 0–4. Each question has a threshold, the lowest answer that counts as a
symptom (Sometimes or Often, per Kessler et al. 2005, Table 1). See
[`items.ts`](src/lib/asrs/items.ts).

**Screener score (main result).** The number of questions 1–6 (Part A) that
reach their threshold, from 0 to 6. See [`score.ts`](src/lib/asrs/score.ts).

| Score | Range | People **with** a clinical ADHD diagnosis who scored here | People **without** one |
|---|---|---|---|
| 4–6 | positive | 68.7% | 0.5% |
| 2–3 | uncertain | 27.0% | 24.7% |
| 0–1 | low | 4.3% | 74.8% |

Source: Kessler et al. (2005), Table 4. See [`bands.ts`](src/lib/asrs/bands.ts).

**Symptoms by area (secondary).** Inattention and hyperactivity-impulsivity,
each 0–9, counting all 18 questions. This count can't establish a diagnosis or
an ADHD type.

**Deliberately not shown:** a 0–72 total, percentiles, severity or type labels,
and comparisons with other users. None of these is supported by the study.

Tests cover all 15,625 possible screener answer combinations and 1,000 random
answer sets for the area counts, each against an independently written copy of
the rule. See [`tests/`](tests/).

## Development

Requires Node 22 or later.

```sh
npm install      # install dependencies
npm run dev      # local site at http://localhost:4321
npm test         # run the tests
npm run check    # type check
npm run build    # build the static site into dist/
```

CI runs the type check, tests and build on every push
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## References

- Kessler RC, Adler L, Ames M, et al. (2005). The World Health Organization
  Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the
  general population. *Psychological Medicine*, 35(2), 245–256.
  https://doi.org/10.1017/S0033291704002892
- World Health Organization / Harvard Medical School. Adult ADHD Self-Report
  Scale (ASRS-v1.1) Symptom Checklist and scoring instructions.
- American Psychiatric Association. *Diagnostic and Statistical Manual of
  Mental Disorders*, 4th ed. (DSM-IV), Criterion A for ADHD (as operationalised
  in Kessler et al. 2005).

## Licence

Code: [MIT](LICENSE). The ASRS-v1.1 wording is © World Health Organization and
**not** covered by the MIT licence; see [LICENSE](LICENSE).
