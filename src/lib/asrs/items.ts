/**
 * The 18 ASRS v1.1 items in official checklist order.
 *
 * Part: official checklist (Part A = items 1–6, the screener).
 * Domain and countsAt: Kessler et al. (2005), Table 1 (asterisks mark the
 * lowest answer that counts as a symptom). Wording lives in src/i18n/.
 */
import type { Item } from "./types";
import { OFTEN, SOMETIMES } from "./types";

export const ITEMS: readonly Item[] = [
  // Part A — screener
  { id: 1, part: "A", domain: "inattention", countsAt: SOMETIMES }, // wrapping up final details
  { id: 2, part: "A", domain: "inattention", countsAt: SOMETIMES }, // getting things in order
  { id: 3, part: "A", domain: "inattention", countsAt: SOMETIMES }, // remembering appointments
  { id: 4, part: "A", domain: "inattention", countsAt: OFTEN }, // avoid/delay tasks needing thought
  { id: 5, part: "A", domain: "hyperactivity-impulsivity", countsAt: OFTEN }, // fidget or squirm
  { id: 6, part: "A", domain: "hyperactivity-impulsivity", countsAt: OFTEN }, // "driven by a motor"

  // Part B
  { id: 7, part: "B", domain: "inattention", countsAt: OFTEN }, // careless mistakes
  { id: 8, part: "B", domain: "inattention", countsAt: OFTEN }, // attention on boring work
  { id: 9, part: "B", domain: "inattention", countsAt: SOMETIMES }, // concentrating on what people say
  { id: 10, part: "B", domain: "inattention", countsAt: OFTEN }, // misplace things
  { id: 11, part: "B", domain: "inattention", countsAt: OFTEN }, // distracted by activity or noise
  { id: 12, part: "B", domain: "hyperactivity-impulsivity", countsAt: SOMETIMES }, // leave seat
  { id: 13, part: "B", domain: "hyperactivity-impulsivity", countsAt: OFTEN }, // restless or fidgety
  { id: 14, part: "B", domain: "hyperactivity-impulsivity", countsAt: OFTEN }, // unwinding and relaxing
  { id: 15, part: "B", domain: "hyperactivity-impulsivity", countsAt: OFTEN }, // talking too much
  { id: 16, part: "B", domain: "hyperactivity-impulsivity", countsAt: SOMETIMES }, // finishing sentences
  { id: 17, part: "B", domain: "hyperactivity-impulsivity", countsAt: OFTEN }, // waiting your turn
  { id: 18, part: "B", domain: "hyperactivity-impulsivity", countsAt: SOMETIMES }, // interrupting others
];
