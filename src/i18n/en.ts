/**
 * English text.
 *
 * Item wording and answer labels: ASRS-v1.1 Symptom Checklist
 * (© World Health Organization), verbatim, in official checklist order.
 * Instructions: ADAPTED for the web from the checklist ("select the
 * response" instead of "place an X in the box"; paper/appointment
 * references removed), taken from ASRS-self-check-v4.qsf. List this
 * adaptation in the permission request.
 * Result text: Kessler et al. (2005).
 */
import type { Band } from "../lib/asrs";
import type { Messages } from "./messages";

/** 27 → "27.0%", so figures always show as printed in Table 4. */
const pct = (value: number) => `${value.toFixed(1)}%`;

export const en: Messages = {
  siteName: "ASRS self-check",
  skipToContent: "Skip to content",
  footer: {
    help:
      "If attention, restlessness or impulsivity cause you real problems, talk to your doctor " +
      "or a psychologist.",
    asrsCopyright:
      "The Adult ADHD Self-Report Scale (ASRS-v1.1) is © World Health Organization. " +
      "Permission to reproduce it on this site has not yet been granted.",
    codeLink: "Source code on GitHub (MIT licence)",
  },

  instructions:
    "Please answer the questions below, rating yourself on each of the criteria shown. " +
    "As you answer each question, select the response that best describes how you have " +
    "felt and conducted yourself over the past 6 months.",

  items: {
    // Part A
    1: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    2: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    3: "How often do you have problems remembering appointments or obligations?",
    4: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    5: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    6: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    // Part B
    7: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    8: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    9: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    10: "How often do you misplace or have difficulty finding things at home or at work?",
    11: "How often are you distracted by activity or noise around you?",
    12: "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
    13: "How often do you feel restless or fidgety?",
    14: "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
    15: "How often do you find yourself talking too much when you are in social situations?",
    16: "When you’re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?",
    17: "How often do you have difficulty waiting your turn in situations when turn taking is required?",
    18: "How often do you interrupt others when they are busy?",
  },

  answerLabels: { 0: "Never", 1: "Rarely", 2: "Sometimes", 3: "Often", 4: "Very Often" },

  notADiagnosis:
    "This is a screening questionnaire, not a diagnosis. Only a clinician can diagnose ADHD.",

  screenerHeading: (score) => `Screening score: ${score} out of 6`,

  bands: {
    positive: {
      title: "4 to 6: the screener's positive range",
      body: (band: Band) =>
        `In the study that developed this screener, about two thirds (${pct(band.withDiagnosis)}) of people ` +
        `with a clinical ADHD diagnosis scored here, compared with about 1 in 200 (${pct(band.withoutDiagnosis)}) ` +
        `of people without one. A score in this range is a good reason to talk to a doctor or psychologist ` +
        `about a proper assessment.`,
    },
    uncertain: {
      title: "2 to 3: the uncertain middle range",
      body: (band: Band) =>
        `In the study that developed this screener, about a quarter (${pct(band.withDiagnosis)}) of people ` +
        `with a clinical ADHD diagnosis scored here, and about a quarter (${pct(band.withoutDiagnosis)}) of ` +
        `people without one did too, so this score doesn't point either way. The researchers suggest a ` +
        `further assessment only if there are other signs, for example real difficulties at work, at home ` +
        `or in relationships, or similar problems already in childhood.`,
    },
    low: {
      title: "0 to 1: the screener's low range",
      body: (band: Band) =>
        `In the study that developed this screener, only ${pct(band.withDiagnosis)} of people with a clinical ` +
        `ADHD diagnosis scored this low, compared with about three quarters (${pct(band.withoutDiagnosis)}) of ` +
        `people without one. No questionnaire can rule ADHD out completely, so if attention or restlessness ` +
        `causes you real problems, it's still fine to talk to a doctor.`,
    },
  },

  domainsHeading: "Your answers by symptom area",
  domainNames: {
    inattention: "Inattention",
    "hyperactivity-impulsivity": "Hyperactivity / impulsivity",
  },
  domainCount: (count) => `${count} of 9`,
  domainCaveats: [
    "Each of the 18 questions corresponds to one of the 18 ADHD symptoms in the diagnostic manual " +
      "(DSM-IV): 9 about attention and 9 about hyperactivity and impulsivity. A symptom counts here " +
      "when your answer reached the level that best matched clinicians' judgements in the original " +
      "study (\"Sometimes\" for some questions, \"Often\" for others).",
    "A diagnosis needs at least 6 of 9 in one area, plus symptoms since childhood and real impairment " +
      "in daily life, assessed by a clinician.",
    "A self-report count can't establish a diagnosis, and it can't tell which type of ADHD someone has.",
    "In the original study, single questions matched clinicians' ratings only moderately on average " +
      "(Cohen's κ 0.16–0.81), and scoring the two areas separately predicted a diagnosis less well " +
      "than the six-question screener.",
  ],

  evidenceHeading: "About the evidence",
  evidenceLimitations: [
    "The study included 154 adults aged 18 to 44 in the United States.",
    "The clinical interview used as the reference had not itself been validated.",
    "The six screener questions were chosen statistically from this small sample.",
  ],

  sources: {
    "kessler2005-table4":
      "Kessler RC, Adler L, Ames M, et al. (2005). The World Health Organization Adult ADHD " +
      "Self-Report Scale (ASRS): a short screening scale for use in the general population. " +
      "Psychological Medicine, 35(2), 245–256, Table 4. https://doi.org/10.1017/S0033291704002892",
  },
};
