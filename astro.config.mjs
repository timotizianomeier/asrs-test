// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Languages the site supports. English is the default and has no URL
  // prefix (/test); later languages get one (/de/test, /fr/test).
  // Keep in sync with the Locale type in src/i18n/index.ts.
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
});
