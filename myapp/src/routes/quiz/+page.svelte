<script>
  import { goto } from "$app/navigation";
  import { quiz } from "#lib/quiz/quiz.js";
  import { getResult } from "#lib/quiz/scoring.js";
  import { quizState } from "#lib/quiz/state.svelte.js";

  let current = $state(0);
  // @ts-ignore
  let chosen = $state([]);
  let selected = $state(null);

  let finished = $derived(current >= quiz.questions.length);
  let question = $derived(quiz.questions[current]);
  let outcome = $derived(finished ? getResult(quiz, chosen) : null);

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
      goto("/results");
    }
  }

  // @ts-ignore
  function restart() {
    current = 0;
    chosen = [];
    selected = null;
    quizState.answers = [];
    quizState.outcome = null;
  }
</script>

<main class="quiz">
  <h1>Slop unc detector</h1>
  <p>Question {current + 1} of {quiz.questions.length}</p>
  <h2>{question.text}</h2>
  <div class="answers">
    {#each question.answers as answer (answer.text)}
      <button type="button" onclick={() => handleAnswer(answer)}
        >{answer.text}</button
      >
    {/each}
  </div>
  <!-- {/if} -->
</main>
