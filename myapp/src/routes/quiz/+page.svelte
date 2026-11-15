<script>
  import { goto } from "$app/navigation";
  import { questions } from "#lib/quiz/questions.js";
  import { predict } from "#lib/quiz/predict.js";
  import { quizState } from "#lib/quiz/state.svelte.js";

  let current = $state(0);
<<<<<<< HEAD
  // @ts-ignore
  let chosen = $state([]);
  let selected = $state(null);
=======
  let answers = $state({}); // { E1: 4, Action: 5, ... }
>>>>>>> bdd9307a74e04470d6cd1275ebb96d79943b2473

  let question = $derived(questions[current]);

<<<<<<< HEAD
  let featured = $derived(
    outcome
      ? outcome.ranking.find((r) => r.name === (selected ?? outcome.name))
      : null,
  );
  // @ts-ignore
  let others = $derived(
    // @ts-ignore
    outcome ? outcome.ranking.filter((r) => r.name !== featured.name) : [],
  );
  // @ts-ignore
  let info = $derived(featured ? quiz.results[featured.name] : null);

  // @ts-ignore
  function handleAnswer(answer) {
    chosen = [...chosen, answer];
    current = current + 1;

    // share the answers/result with the rest of the app (e.g. /results)
    // @ts-ignore
    quizState.answers = chosen;
    if (current >= quiz.questions.length) {
      // @ts-ignore
      quizState.outcome = getResult(quiz, chosen);
=======
  function handleAnswer(value) {
    answers[question.id] = value; // value is 1–5
    current += 1;

    if (current >= questions.length) {
      const finalAnswers = $state.snapshot(answers); // plain object copy
      quizState.answers = finalAnswers;
      quizState.outcome = predict(finalAnswers);
>>>>>>> bdd9307a74e04470d6cd1275ebb96d79943b2473
      goto("/results");
    }
  }

<<<<<<< HEAD
  // @ts-ignore
  function restart() {
    current = 0;
    chosen = [];
    selected = null;
    quizState.answers = [];
    quizState.outcome = null;
=======
  function goBack() {
    if (current > 0) current -= 1;
>>>>>>> bdd9307a74e04470d6cd1275ebb96d79943b2473
  }
</script>

<main class="quiz">
  <h1>Slop unc detector</h1>

  {#if question}
    <p>Question {current + 1} of {questions.length}</p>
    <h2>{question.text}</h2>

    <div class="answers">
      {#each question.labels as label, i (label)}
        <button type="button" onclick={() => handleAnswer(i + 1)}>{label}</button>
      {/each}
    </div>

    {#if current > 0}
      <button type="button" class="back" onclick={goBack}>← Back</button>
    {/if}
  {/if}
</main>