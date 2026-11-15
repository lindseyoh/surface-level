<script>
  import ScrollySection from "#lib/component/scrolnet.svelte";
  import { averageByAge } from "#lib/funcs/avgInt.js";
  import { screenTimePoints } from "#lib/funcs/formatInt.js";

  let { data } = $props();

  const ageGroups = ["13-18", "19-25", "26-35", "36-45", "46-60", "60+"];

  let allAverages = $derived(
    ageGroups.map((group) =>
      averageByAge(data.internet_data, "age_group", group),
    ),
  );
</script>

<h1>Your Results</h1>

<ScrollySection
  title="What are you using your screen time on?"
  {ageGroups}
  {allAverages}
  formatPoints={screenTimePoints}
  color="steelblue"
/>

<div>s</div>
