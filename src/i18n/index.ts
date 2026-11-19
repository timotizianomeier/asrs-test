/**
 * Front door for all site text. Pages call getMessages(locale) and never
 * import a language file directly.
 */
import { en } from "./en";
import type { Messages } from "./messages";

/** Languages the site supports. Keep in sync with astro.config.mjs. */
export type Locale = "en";

/** One complete Messages object per Locale; a missing language fails the type check. */
const MESSAGES: Record<Locale, Messages> = { en };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}

export type { Messages };
