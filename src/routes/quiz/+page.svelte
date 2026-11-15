<script>
  import { goto } from "$app/navigation";
  import { questions } from "#lib/quiz/questions.js";
  import { predict } from "#lib/quiz/predict.js";
  import { quizState } from "#lib/quiz/state.svelte.js";

  let current = $state(0);
  let answers = $state({}); // { E1: 4, Action: 5, ... }

  let question = $derived(questions[current]);

  function handleAnswer(value) {
    answers[question.id] = value; // value is 1–5
    current += 1;

    if (current >= questions.length) {
      const finalAnswers = $state.snapshot(answers); // plain object copy
      quizState.answers = finalAnswers;
      quizState.outcome = predict(finalAnswers);
      goto("/results");
    }
  }

  function goBack() {
    if (current > 0) current -= 1;
  }
</script>

<main class="quiz">
  <h1>Surface Level - Quiz</h1>

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