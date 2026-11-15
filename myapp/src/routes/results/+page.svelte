<script>
  // @ts-nocheck
  import { scaleLinear } from "d3-scale";
  let { data } = $props();
  let { internet_data, personality_data } = $derived(data);
</script>

{#snippet barChartShow()}

{/snippet}
<p>{internet_data[1]?.age}</p>
