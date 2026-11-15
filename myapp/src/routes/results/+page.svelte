<script>
  import BarChart from "#lib/component/barchart.svelte";
  import { averageByAge } from "#lib/funcs/avg.js";
  import { screenTimePoints } from "#lib/funcs/format.js";

  let { data } = $props();

  let averages = $derived(
    averageByAge(data.internet_data, "age_group", "19-25"),
  );

  // @ts-ignore
  let chartPoints = $derived(screenTimePoints(averages));
</script>

<BarChart
  title="Average Screen Time: Ages 19-25"
  points={chartPoints}
  color="steelblue"
/>
