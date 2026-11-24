# Decisions

Key architectural and product decisions, with the reasons behind them.
One entry per decision, newest at the bottom. When a decision changes, don't
edit the old entry: mark it `superseded by #N` and add a new one.

Format: **Decision** (what we do) · **Why** · **Alternatives** (considered and
rejected) · **Consequences** (what follows, and how it's enforced).

---

## 1. Astro + TypeScript + Vitest
- Date: 2026-11-13 · Status: accepted
- **Decision:** Build the site with Astro (static output) in strict TypeScript, with Vitest for unit tests.
- **Why:** Scoring has to run in the browser (#2), so TypeScript is needed anyway. Astro produces plain static pages with almost no JavaScript, has built-in i18n routing, and its layouts map closely onto Jinja templates (familiar from Flask).
- **Alternatives:** Flask/Jinja frozen to static HTML plus a separate TypeScript scoring module (two languages, two test runners); plain Vite + TypeScript (layouts, i18n and routing by hand); SvelteKit (more concepts and more JavaScript than a mostly-text site needs).
- **Consequences:** One language for pages, scoring and output text. Static hosting is enough for the pages.

## 2. Score in the browser, in a dependency-free module
- Date: 2026-11-13 · Status: accepted
- **Decision:** All scoring happens client-side in `src/lib/asrs/`: pure functions with no I/O and no imports from outside the folder.
- **Why:** The answers are health-related. If they never reach a server, there is nothing to leak, log or protect. A small pure module is easy to test and to audit.
- **Alternatives:** Server-side scoring (every user's answers would reach the server); Python in the browser via Pyodide (about 10 MB download, slow on phones).
- **Consequences:** Pages, PDF and email all call the same `scoreAnswers`. CI fails if `src/lib/asrs/` imports anything outside `./`.

## 3. Answers coded 0–4, with named constants
- Date: 2026-11-13 · Status: accepted
- **Decision:** Never … Very Often are coded 0–4 (`NEVER` … `VERY_OFTEN`). Thresholds are written as `SOMETIMES` / `OFTEN`, never as bare numbers.
- **Why:** The brief specifies 0–4, matching the Qualtrics recode. Names read the same on any scale.
- **Alternatives:** The 1–5 scale used on paper and in some papers.
- **Consequences:** Thresholds on the 1–5 scale are ours + 1 (Sometimes = 3, Often = 4).

## 4. The item table is the single source of truth; tests use independent copies
- Date: 2026-11-13 · Status: accepted
- **Decision:** `items.ts` alone defines each item's part, domain and threshold. Tests check scoring against thresholds typed in again from the brief, not read from `items.ts`.
- **Why:** If the tests read the code's own table, a typo would pass them. Typing it twice means a mistake has to be made identically in both places to slip through.
- **Alternatives:** Tests derived from `items.ts`.
- **Consequences:** The screener is tested exhaustively (all 15,625 Part A combinations); domain counts with 1,000 seeded random answer sets.

## 5. Every figure cites a source; sentences take numbers from the data
- Date: 2026-11-19 · Status: accepted
- **Decision:** Each `Band` carries a `SourceId`, and every `SourceId` must have a full reference in each language file. Band sentences insert their percentages from `BANDS` rather than repeating them as text.
- **Why:** The brief requires every claim on the result page to be cited. The types make an uncited figure a compile error, and the text can't drift from the data.
- **Alternatives:** Citations as free text next to hand-written figures.
- **Consequences:** Adding a figure from a new source means adding a `SourceId` and its reference. `"kessler2005"` (whole paper) and `"kessler2005-table4"` exist so far.

## 6. Official ASRS-v1.1 checklist wording; instructions adapted for the web
- Date: 2026-11-19 · Status: accepted
- **Decision:** Item wording and answer labels are verbatim from the official ASRS-v1.1 Symptom Checklist (including "Very Often" and the curly apostrophe in item 16). The instruction text is the web adaptation from the Qualtrics survey ("select the response" instead of "place an X in the box"; paper and appointment references removed).
- **Why:** The permission covers the official instrument. The Qualtrics wording followed Kessler 2005 Table 1 and differed in items 1, 5, 15, 16 and 17. The paper instructions don't make sense on a screen.
- **Alternatives:** Qualtrics wording throughout; the paper instructions verbatim.
- **Consequences:** The adaptation must be listed in the permission request. The wording was checked against a mirror of the checklist PDF; re-check against Harvard's copy.

## 7. Typed i18n contract
- Date: 2026-11-19 · Status: accepted
- **Decision:** All site text lives in `src/i18n/<locale>.ts` and implements the `Messages` type. `Record<ItemId, …>`, `Record<Answer, …>`, `Record<BandId, …>`, `Record<SourceId, …>` and `Record<Locale, Messages>` make every item, label, band, source and language mandatory. Pages get text only through `getMessages(locale)`.
- **Why:** German and French are likely later. A missing translation should fail the build, not show a blank on the live site.
- **Alternatives:** An i18n library; untyped JSON files.
- **Consequences:** Adding a language means adding it to `astro.config.mjs`, to the `Locale` type and as a new language file. The compiler enforces the last two.

## 8. No total score, percentiles, severity or type labels
- Date: 2026-11-13 · Status: accepted
- **Decision:** The result is exactly `{ screener, band, domains }`.
- **Why:** None of these is supported by the study (brief 2.2 and 5.4). They are what makes other ADHD test sites misleading.
- **Alternatives:** —
- **Consequences:** Enforced by tests: `Result` has exactly three fields, and the English text contains none of "percentile", "very high", "severe", "presentation", "combined type".

## 9. Show the result in place; store nothing
- Date: 2026-11-19 · Status: accepted
- **Decision:** The questionnaire and the result are one page (`/test`). Answers exist only in the page's memory.
- **Why:** It gives the strongest privacy promise: answers are not stored anywhere, not even in the browser.
- **Alternatives:** `sessionStorage` with a separate result page (survives a reload, but is browser storage); answers in the URL (end up in browser history and the host's access logs).
- **Consequences:** Reloading means starting over. Enforced by the end-to-end test: no URL parameters, no network request after submit.

## 10. The browser never submits the form
- Date: 2026-11-19 · Status: accepted
- **Decision:** The `<form>` has no `action`. The submit button starts disabled and is enabled only by the page script, which always calls `preventDefault()`.
- **Why:** A native HTML submit would put the answers into the URL (`/test?q1=2&…`).
- **Alternatives:** A form that posts to a server.
- **Consequences:** Without JavaScript the questions can be answered but no result is shown; a `<noscript>` note explains why. The end-to-end test fails if the guard is removed.

## 11. One question per screen on every device
- Date: 2026-11-19 · Status: accepted
- **Decision:** The script shows one question at a time with progress, Back/Next and Enter-to-advance, on mobile and desktop alike.
- **Why:** The brief asks for it on mobile. Using the same flow everywhere means one code path and less to test.
- **Alternatives:** All 18 questions on one page for desktop.
- **Consequences:** The script only hides fieldsets, so if it fails the full form is still there.

## 12. No CSS framework, system fonts, no third-party requests
- Date: 2026-11-19 · Status: accepted
- **Decision:** One small self-hosted stylesheet, the device's own fonts, no CDNs.
- **Why:** The brief rules out third-party trackers and requires self-hosted assets. The site is small enough not to need a framework.
- **Alternatives:** Bootstrap from a CDN (as in earlier projects); web fonts.
- **Consequences:** Colours are defined once as variables, with a dark mode. WCAG AA contrast was computed for every text/background pair.

## 13. Browser tests and a WCAG 2.2 AA scan in CI
- Date: 2026-11-19 · Status: accepted
- **Decision:** Playwright runs the built site in headless Chromium at desktop and phone size; axe-core scans the home page, the questionnaire and the result.
- **Why:** The questionnaire and the privacy guarantees only exist in the browser, so they can only be verified there. The brief requires an accessibility check in CI.
- **Alternatives:** Manual testing only.
- **Consequences:** Automated scans catch only part of accessibility problems; a manual keyboard and screen-reader pass is still planned (milestone 5).

## 14. At most one server function, with two routes
- Date: 2026-11-13 · Status: accepted
- **Decision:** All server-side code is one function: `/stats` (opt-in anonymous answers) and, optionally, `/send` (email the result to yourself).
- **Why:** The brief allows at most one serverless function. One function shares the IP-stripping and no-logging code.
- **Alternatives:** A separate function per route; no server-side email.
- **Consequences:** Milestones 1–3 need no server at all.

## 15. Hosting: Cloudflare Pages now, Scaleway (EU) for the server function
- Date: 2026-11-24 · Status: accepted; the "behind Cloudflare Access" part is superseded by #18
- **Decision:** The static site goes on Cloudflare Pages behind Cloudflare Access (only Timo can open it) until go-live. The stats function (milestone 4) is planned on Scaleway, an EU company with EU data centres.
- **Why:** Cloudflare is free and the only free option found with a genuinely private test site. The static pages receive no answers, so US hosting is acceptable there if the privacy page names the host. The function receives health-related answers, so it should be with an EU company, outside the reach of US law such as the CLOUD Act; Scaleway's free function allowance covers this site.
- **Alternatives:** GitHub Pages (always public on the free plan, no server functions); Netlify (password protection is paid); Infomaniak 🇨🇭 (about CHF 11/month); Bunny.net 🇪🇺 (about $1/month); a Hetzner server 🇪🇺 (about €6/month, self-maintained). Prices as checked on 2026-11-24.
- **Consequences:** Security headers (CSP, `noindex` until go-live) are set via `public/_headers`. Moving the static pages elsewhere later is easy; they are just a folder.

## 16. Public repo before permission, including the WHO wording
- Date: 2026-11-19 · Status: accepted (risk accepted by Timo)
- **Decision:** The GitHub repo is public now, including the ASRS-v1.1 wording in `src/i18n/`.
- **Why:** Timo's choice. Open code is a goal of the project, and the checklist is widely distributed for free.
- **Alternatives:** Keeping the repo private until permission arrives; keeping the wording out of git.
- **Consequences:** `LICENSE` and the site footer state that the wording is © WHO, is not covered by MIT, and that permission has not yet been granted. Update both when it is. The website itself stays private until permission (#15).

## 17. A strict Content-Security-Policy enforces "no third parties"
- Date: 2026-11-24 · Status: accepted
- **Decision:** `public/_headers` sends a CSP that allows scripts, styles, images, fonts and connections only from the site itself (`'self'`), with no `'unsafe-inline'`. CSS is always a separate file (`build.inlineStylesheets: 'never'`) so styles don't need an exception. Also `noindex` (until go-live), `Referrer-Policy: no-referrer` and standard hardening headers.
- **Why:** Turns the promise "no third-party trackers or CDNs" into something the browser enforces, even if a third-party script were added by mistake. `no-referrer` stops linked sites from learning a visitor came from an ADHD test.
- **Alternatives:** No CSP (the promise rests on code review alone); `style-src 'unsafe-inline'` to allow Astro's inlined CSS (weaker).
- **Consequences:** The milestone 4 stats endpoint must be added to `connect-src`. `noindex` must be removed at go-live. `e2e/headers.e2e.ts` applies the headers locally and fails if the policy blocks anything the site needs.

## 18. Test site is public, without access control
- Date: 2026-11-24 · Status: accepted (risk accepted by Timo) · Supersedes the Access part of #15
- **Decision:** `asrs-test.pages.dev` is publicly reachable before the ASRS permission and the privacy review. Every page shows a "Test version: not yet meant for use, not a diagnosis" banner. `noindex` stays on.
- **Why:** Cloudflare Zero Trust Access requires a payment card even on its free plan. The code and the WHO wording are already public in the repo (#16), and the site sends no answers anywhere, so the added risk is judged low.
- **Alternatives:** Cloudflare Access with a card on file; an HTTP Basic Auth password gate as a Pages Function (no card, but staging-only code to remove later); leaving it public without a banner.
- **Consequences:** This deviates from the brief ("build and test only on a private/staging URL"). Strangers who find the URL (it matches the repo name) can use the tool, and Cloudflare logs visitors' IP addresses while no privacy page exists yet. Revisit before milestone 4 (stats), when answers can leave the browser. Remove the banner and `noindex` at go-live.

## 19. Email and PDF include the 18 answers as an appendix
- Date: 2026-11-24 · Status: accepted
- **Decision:** The email and PDF output starts with exactly what the result page shows (screener score and band with figures, domain counts with caveats, evidence limitations, sources, not-a-diagnosis). Then comes an appendix "Your answers" listing all 18 questions in official order with the chosen answer.
- **Why:** The official checklist is meant to be given to a healthcare professional. The individual answers show which symptoms were rated how, which the score alone doesn't. The output only ever exists on the user's own device or in their own email.
- **Alternatives:** Summary only (the list in brief §6; less useful to a clinician); an opt-in checkbox for the answers (more UI and testing).
- **Consequences:** A forwarded email or shared PDF reveals every answer. One function, `formatResultText` in `src/output/`, produces this text for every output, so they can't diverge. It scores the answers itself, so the summary and the appendix always match. It lives outside `src/lib/asrs/` because it needs the site text (#2).

## 20. No print button
- Date: 2026-11-24 · Status: accepted · Deviates from brief §6
- **Decision:** The result offers "Open in my email app" and "Download PDF", but no "Print".
- **Why:** The PDF can be printed and is cleaner than a printed web page. A print button would need its own print stylesheet and extra handling, such as opening collapsed sections for paper.
- **Alternatives:** Print via the browser dialog (`window.print()`) with a print stylesheet, as in the brief.
- **Consequences:** Browsers can still print the page from their own menu, unstyled for paper.
