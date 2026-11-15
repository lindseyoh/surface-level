// Turns quiz answers into guesses, using the weights exported from Colab.
// answers looks like: { E1: 4, N8: 2, Action: 5, ... }  (each answer is 1–5)
import big5 from "./big5_model.json";
import yp from "./yp_model.json";

// If a question somehow wasn't answered, treat it as neutral (3)
const answerOf = (answers, q) => answers[q] ?? 3;

// intercept + weight1*answer1 + weight2*answer2 + ...
function score(trait, answers) {
  let total = trait.intercept;
  trait.questions.forEach((q, i) => {
    total += trait.weights[i] * answerOf(answers, q);
  });
  return total;
}

// Turns a logistic regression score into a 0–100 percentage
const toPercent = (s) => 100 / (1 + Math.exp(-s));

// Race: one score per group → percentages that add up to ~100, best first
function groupChances(trait, answers) {
  const scores = trait.groups.map((_, k) => {
    let s = trait.intercepts[k];
    trait.questions.forEach((q, i) => {
      s += trait.weights[k][i] * answerOf(answers, q);
    });
    return s;
  });
  const max = Math.max(...scores); // subtracting the max keeps Math.exp from overflowing
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return trait.groups
    .map((group, k) => ({ group, pct: Math.round((100 * exps[k]) / sum) }))
    .sort((a, b) => b.pct - a.pct);
}

// Which answer pushed this trait the most, compared with answering "neutral".
// push > 0 means it pushed toward female / left-handed / older / taller.
function biggestPush(trait, answers) {
  let best = null;
  trait.questions.forEach((q, i) => {
    const push = trait.weights[i] * (answerOf(answers, q) - 3);
    if (!best || Math.abs(push) > Math.abs(best.push)) best = { question: q, push };
  });
  return best;
}

// Of two "biggest pushes", keep the bigger one
const bigger = (a, b) => (Math.abs(a.push) >= Math.abs(b.push) ? a : b);

// Average the guesses from whichever model files actually have this trait
function averageOf(trait, convert = (s) => s) {
  const found = [big5[trait], yp[trait]].filter(Boolean);
  if (found.length === 0) return null;
  return found.reduce((sum, t) => sum + convert(score(t, answersNow)), 0) / found.length;
}

// The single biggest push for this trait across both files
function reasonFor(trait) {
  const found = [big5[trait], yp[trait]].filter(Boolean);
  if (found.length === 0) return null;
  return found.map((t) => biggestPush(t, answersNow)).reduce(bigger);
}

let answersNow = {};

export function predict(answers) {
  answersNow = answers;
  const round = (x) => (x === null ? null : Math.round(x));
  return {
    femalePct: round(averageOf("gender", toPercent)),
    leftyPct: round(averageOf("hand", toPercent)),
    age: round(averageOf("age")),
    height: round(averageOf("height")),
    race: big5.race ? groupChances(big5.race, answers) : null,
    reasons: {
      gender: reasonFor("gender"),
      hand: reasonFor("hand"),
      age: reasonFor("age"),
      height: reasonFor("height"),
    },
  };
}
