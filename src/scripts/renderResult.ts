/**
 * Builds the result view (brief 5.1–5.3) from a scored Result.
 * Uses textContent only (never innerHTML), so no text can be read as HTML.
 * Shows nothing that isn't in Result or Messages (brief 2.2, 5.4).
 */
import type { Messages } from "../i18n";
import type { Result, SourceId } from "../lib/asrs";

/** Create an element with optional text: el("p", "Hello") → <p>Hello</p>. */
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  return node;
}

/** "Source: <linked citation>" line. */
function sourceLine(t: Messages, source: SourceId): HTMLParagraphElement {
  const p = el("p");
  p.className = "source";
  const link = el("a", t.sources[source].citation);
  link.href = t.sources[source].url;
  p.append(`${t.result.sourceLabel} `, link);
  return p;
}

export function renderResult(container: HTMLElement, result: Result, t: Messages): void {
  const { screener, band, domains } = result;
  const bandText = t.bands[band.id];

  // 5.2 parts, built first and placed below
  const domainList = el("ul");
  domainList.append(
    el("li", `${t.domainNames.inattention}: ${t.domainCount(domains.inattention)}`),
    el("li", `${t.domainNames["hyperactivity-impulsivity"]}: ${t.domainCount(domains.hyperactivityImpulsivity)}`),
  );

  const caveats = el("ul");
  caveats.append(...t.domainCaveats.map((text) => el("li", text)));

  // 5.3 About the evidence (collapsible)
  const evidence = el("details");
  const limitations = el("ul");
  limitations.append(...t.evidenceLimitations.map((text) => el("li", text)));
  evidence.append(el("summary", t.evidenceHeading), limitations, sourceLine(t, "kessler2005"));

  container.replaceChildren(
    // 5.1 Screener score and its band
    el("h2", t.result.heading),
    el("p", t.screenerHeading(screener)),
    el("h3", bandText.title),
    el("p", bandText.body(band)),
    sourceLine(t, band.source),
    Object.assign(el("p"), { className: "not-a-diagnosis", textContent: t.notADiagnosis }),

    // 5.2 Symptoms by area, always with its caveats
    el("h3", t.domainsHeading),
    domainList,
    caveats,
    sourceLine(t, "kessler2005"),

    evidence,
  );
}
