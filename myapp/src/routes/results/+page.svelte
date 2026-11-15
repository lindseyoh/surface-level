<script>
  import { quizState } from "#lib/quiz/state.svelte.js";
  import { questions } from "#lib/quiz/questions.js";
  import ScrollySection from "#lib/component/scrolnet.svelte";
  import { averageByAge } from "#lib/funcs/avg.js";
  import { screenTimePoints } from "#lib/funcs/format.js";

  let { data } = $props();

  // Quiz results
  let outcome = $derived(quizState.outcome);

  let genderPoints = $derived(
    outcome
      ? [
          { label: "Female-coded", value: outcome.femalePct },
          { label: "Male-coded", value: 100 - outcome.femalePct },
        ]
      : [],
  );

  // User's screen time
  let screenPoints = $derived(
    quizState.answers
      ? [
          {
            label: "Social media",
            value: quizState.answers.social_media_hours ?? 0,
          },
          {
            label: "Work / school",
            value: quizState.answers.work_or_study_hours ?? 0,
          },
          {
            label: "Entertainment",
            value: quizState.answers.entertainment_hours ?? 0,
          },
        ]
      : [],
  );

  let totalHours = $derived(screenPoints.reduce((sum, p) => sum + p.value, 0));

  // Helper functions
  const textOf = (id) => questions.find((q) => q.id === id)?.text ?? id;

  function feetInches(cm) {
    const totalInches = Math.round(cm / 2.54);
    return `${Math.floor(totalInches / 12)}′${totalInches % 12}″`;
  }

  function pushText(reason, up, down) {
    if (!reason || reason.push === 0) return null;

    return `“${textOf(reason.question)}” pushed you toward ${
      reason.push > 0 ? up : down
    }.`;
  }

  // Scrollytelling
  const ageGroups = ["13-18", "19-25", "26-35", "36-45", "46-60", "60+"];

  let allAverages = $derived(
    ageGroups.map((group) =>
      averageByAge(data?.internet_data ?? [], "age_group", group),
    ),
  );
</script>

<main class="results">
  <div class="main-result">
    <h1>Your results</h1>
    <ScrollySection
      title="What are you using your screen time on?"
      {ageGroups}
      {allAverages}
      formatPoints={screenTimePoints}
      color="steelblue"
    />

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
          <p class="why">
            {pushText(outcome.reasons.gender, "female", "male")}
          </p>
        {/if}
        <!-- <BarChart
          title="Gender vibes (%)"
          points={genderPoints}
          color="steelblue"
        /> -->
      </section>

      <span></span>

      <section class="card">
        <h2>Personality age</h2>
        <p class="big">You answer like a {outcome.age}-year-old</p>
        {#if pushText(outcome.reasons?.age, "older", "younger")}
          <p class="why">{pushText(outcome.reasons.age, "older", "younger")}</p>
        {/if}
      </section>

      <span></span>

      {#if outcome.screenAge}
        <section class="card">
          <h2>Screen-time age</h2>
          <p class="big">Your screen habits say you're {outcome.screenAge}</p>
          <p>
            That's about {totalHours.toFixed(1)} hours of screen time a day.
            {#if outcome.age}
              {#if outcome.screenAge < outcome.age}
                Your screens are {outcome.age - outcome.screenAge} years younger
                than your personality.
              {:else if outcome.screenAge > outcome.age}
                Your screens are {outcome.screenAge - outcome.age} years older than
                your personality.
              {:else}
                Your screens and your personality agree!
              {/if}
            {/if}
          </p>
          <!-- <BarChart title="Average Screen Time" points={screenPoints} color="steelblue" /> -->
          <!-- <p class="why">Based on a synthetic internet-usage dataset.</p> -->
        </section>
      {/if}

      {#if outcome.height}
        <span></span>
        <section class="card">
          <h2>Height guess</h2>
          <p class="big">{feetInches(outcome.height)} ({outcome.height} cm)</p>
          {#if pushText(outcome.reasons?.height, "taller", "shorter")}
            <p class="why">
              {pushText(outcome.reasons.height, "taller", "shorter")}
            </p>
          {/if}
        </section>
      {/if}

      <span></span>
      <section class="card">
        <h2>Lefty meter</h2>
        <div class="bar">
          <div class="fill" style="width: {outcome.leftyPct}%"></div>
        </div>
        <p>
          You are:
          {outcome.leftyPct > 50
            ? "More left-handed than most."
            : "More right-handed than most."}
          ({outcome.leftyPct} on a 0–100 lefty scale)
        </p>
        {#if pushText(outcome.reasons?.hand, "left-handed", "right-handed")}
          <p class="why">
            {pushText(outcome.reasons.hand, "left-handed", "right-handed")}
          </p>
        {/if}
      </section>

      <!-- <p class="note">
        Just for fun: these are guesses from patterns in survey data, and they're often wrong.
      </p> -->
      <a href="/quiz"><button>Take it again</button></a>
    {/if}

    <!-- <BarChart
    title="Average Screen Time: Ages 19-25"
    points={genderPoints}
    color="steelblue"
  /> -->
  </div>
</main>

<!-- <style>
  main {
    display: flex;
    justify-content: center;
    background-color: rgb(146, 135, 107);
    border-radius: 25px;
  }
  .main-result {
    background-color: white;
    padding: 3rem;
    margin: 5%;
    border-radius: 35px;
    width: 100%;
    max-width: 1100px;
    min-width: 0;
    box-sizing: border-box;
  }

  span {
    border: solid black 1px;
    /* width: 100%; */
    display: block;
  }
</style>

