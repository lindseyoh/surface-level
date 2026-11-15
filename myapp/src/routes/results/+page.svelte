<script>
  import { quizState } from "#lib/quiz/state.svelte.js";
  import { questions } from "#lib/quiz/questions.js";
  import BarChart from "#lib/component/BarChart.svelte";

  let outcome = $derived(quizState.outcome);

  let genderPoints = $derived(
      outcome ? [
      { label: "Female-coded", value: outcome.femalePct },
      { label: "Male-coded", value: 100 - outcome.femalePct },
    ] : [],
  );

  // Turns a question id like "N8" back into its quiz wording
  const textOf = (id) => questions.find((q) => q.id === id)?.text ?? id;

  // cm → feet and inches
  function feetInches(cm) {
    const totalInches = Math.round(cm / 2.54);
    return `${Math.floor(totalInches / 12)}′${totalInches % 12}″`;
  }

  // Describes which way an answer pushed a guess
  function pushText(reason, up, down) {
    if (!reason || reason.push === 0) return null;
    return `“${textOf(reason.question)}” pushed you toward ${reason.push > 0 ? up : down}.`;
  }
</script>

<main class="results">
  <h1>Your results</h1>

  {#if !outcome}
    <p>No results yet. The results reset if you reload the page.</p>
    <a href="/quiz">Take the quiz</a>
  {:else}
    <section class="card">
      <h2>Gender vibes</h2>
      <div class="bar">
        <div class="fill" style="width: {outcome.femalePct}%"></div>
      </div>
      <p class="split">
        <span>{outcome.femalePct}% female-coded</span>
        <span>{100 - outcome.femalePct}% male-coded</span>
      </p>
      {#if pushText(outcome.reasons?.gender, "female", "male")}
        <p class="why">{pushText(outcome.reasons.gender, "female", "male")}</p>
      {/if}
      <BarChart
    title="Average Screen Time: Ages 19-25"
    points={genderPoints}
    color="steelblue"
  />
    </section>

    <section class="card">
      <h2>Personality age</h2>
      <p class="big">You answer like a {outcome.age}-year-old</p>
      {#if pushText(outcome.reasons?.age, "older", "younger")}
        <p class="why">{pushText(outcome.reasons.age, "older", "younger")}</p>
      {/if}
    </section>

    {#if outcome.height}
      <section class="card">
        <h2>Height guess</h2>
        <p class="big">{feetInches(outcome.height)} ({outcome.height} cm)</p>
        {#if pushText(outcome.reasons?.height, "taller", "shorter")}
          <p class="why">{pushText(outcome.reasons.height, "taller", "shorter")}</p>
        {/if}
      </section>
    {/if}

    <section class="card">
      <h2>Lefty meter</h2>
      <div class="bar">
        <div class="fill" style="width: {outcome.leftyPct}%"></div>
      </div>
      <p>
        {outcome.leftyPct > 50 ? "More lefty than most." : "More righty than most."}
        ({outcome.leftyPct} on a 0–100 lefty scale)
      </p>
      {#if pushText(outcome.reasons?.hand, "left-handed", "right-handed")}
        <p class="why">{pushText(outcome.reasons.hand, "left-handed", "right-handed")}</p>
      {/if}
    </section>

    <p class="note">
      Just for fun: these are guesses from patterns in survey data, and they're often wrong.
    </p>
    <a href="/quiz">Take it again</a>
  {/if}

<!-- <BarChart
  title="Average Screen Time: Ages 19-25"
  points={genderPoints}
  color="steelblue"
/> -->
  
</main>

