import big5 from "./big5_model.json";
import yp from "./yp_model.json";
import screen from "./screen_model.json";

const BIG5_Q = {
    N1: "I get stressed out easily.",
    N6: "I get upset easily.",
    O8: "I use difficult words.",
    O1: "I have a rich vocabulary",
    C8: "I shirk my duties",
    C4: "I make a mess of things",
};

// Screen-time section: answers are hours, not 1–5
const SCREEN = {
  social_media_hours: {
    text: "About how many hours a day do you spend on social media?",
    labels: ["Under 30 min", "30 min–1 hr", "1–2 hrs", "2–3 hrs", "3+ hrs"],
    values: [0.25, 0.75, 1.5, 2.5, 3.5],
  },
  work_or_study_hours: {
    text: "About how many hours a day are you on a screen for work or school?",
    labels: ["Under 2 hrs", "2–4 hrs", "4–6 hrs", "6–8 hrs", "8+ hrs"],
    values: [1, 3, 5, 7, 9],
  },
  entertainment_hours: {
    text: "About how many hours a day do you spend on streaming, gaming or videos?",
    labels: ["Under 1 hr", "1–2 hrs", "2–3 hrs", "3–4 hrs", "4+ hrs"],
    values: [0.5, 1.5, 2.5, 3.5, 4.5],
  },
};

const YP_TEXT = yp.text ?? {};
const AGREE = ["Disagree", "Slightly disagree", "Neutral", "Slightly agree", "Agree"];
const AMOUNT = ["Not at all", "A little", "Somewhat", "A lot", "Totally"];



function idsOf(model) {
    return [
        ...new Set(
            Object.values(model)
            .filter((trait) => trait.questions)
            .flatMap((trait) => trait.questions),
        ),
    ];
}

const big5Questions = idsOf(big5).map((id) => ({ id, text: BIG5_Q[id] ?? id, labels: AGREE }));
const ypQuestions = idsOf(yp).map((id) => ({ id, text: YP_TEXT[id] ?? id, labels: AMOUNT }));

export const questions = [];
for (let i = 0; i < Math.max(big5Questions.length, ypQuestions.length); i++) {
    if (big5Questions[i]) questions.push(big5Questions[i]);
    if (ypQuestions[i]) questions.push(ypQuestions[i]);
}

for (const id of screen.age.questions) {
  questions.push({ id, ...SCREEN[id] });
}