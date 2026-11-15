import big5 from "./big5_model.json";
import yp from "./yp_model.json";

const BIG5_Q = {
    N1: "I get stressed out easily.",
    N6: "I get upset easily.",
    O8: "I use difficult words.",
    O1: "I have a rich vocabulary",
    C8: "I shirk my duties",
    C4: "I make a mess of things",
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