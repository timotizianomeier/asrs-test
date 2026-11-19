import { expect, test } from "vitest";
import { getMessages } from "../../src/i18n";
import { en } from "../../src/i18n/en";

test("getMessages('en') returns the English messages", () => {
  expect(getMessages("en")).toBe(en);
});
