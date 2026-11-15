<script>
  import BarChart from "#lib/component/barchartInt.svelte";
  import Scroll from "#lib/component/scrolly.svelte";

  let {
    title,
    ageGroups,
    allAverages,
    formatPoints,
    color = "steelblue",
  } = $props();

  // Each component instance has its own scroll state
  let scrollIndex = $state(0);

  let currentIndex = $derived(scrollIndex ?? 0);
  let currentGroup = $derived(ageGroups[currentIndex]);

  let chartPoints = $derived(formatPoints(allAverages[currentIndex]));
</script>

<section class="scrolly-section">
  <h2>{title}</h2>

  <div class="scrolly">
    <div class="chart-container">
      <h3>Ages {currentGroup}</h3>
      <BarChart points={chartPoints} {color} />
    </div>

    <div class="scroll-container">
      <Scroll bind:value={scrollIndex} top={100} bottom={100}>
        {#each ageGroups as group, i}
          <section class:active={currentIndex === i}>
            <h3>Ages {group}</h3>
            <p>Average usage for ages {group}.</p>
          </section>
        {/each}
      </Scroll>
    </div>
  </div>
</section>

<style>
  .scrolly-section {
    margin-bottom: 5rem;
  }

  .scrolly {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .chart-container {
    position: sticky;
    top: 20vh;
    min-width: 0;
  }

  .scroll-container section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    opacity: 0.4;
    transition: opacity 0.3s ease;
  }

  .scroll-container section.active {
    opacity: 1;
  }

  @media (max-width: 768px) {
    .scrolly {
      grid-template-columns: 1fr;
    }

    .chart-container {
      top: 0;
      background: white;
      z-index: 10;
    }

    .scroll-container section {
      min-height: 70vh;
    }
  }
</style>
