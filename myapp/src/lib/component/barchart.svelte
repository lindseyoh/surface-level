<script>
  import { scaleLinear } from "d3-scale";
  const yTicks = [0, 2, 4, 6, 8, 10, 12, 14];
  const padding = { top: 20, right: 15, bottom: 20, left: 25 };

  let width = $state(500);
  let height = 350;
  let { title = "", points = [], color = "red" } = $props();

  let xScale = $derived(
    scaleLinear()
      .domain([0, points.length])
      .range([padding.left, width - padding.right]),
  );

  let yScale = scaleLinear()
    .domain([0, Math.max.apply(null, yTicks)])
    .range([height - padding.bottom, padding.top]);

  let innerWidth = $derived(width - (padding.left + padding.right));
  let barWidth = $derived(innerWidth / points.length);

  // @ts-ignore
  function formatMobile(tick) {
    return "'" + tick.toString().slice(-2);
  }
</script>

<h1>{title}</h1>
<div class="chart" bind:clientWidth={width}>
  <svg {width} {height}>
    <!-- 4. Design the bars -->
    <g class="bars">
      {#each points as point, i}
        <rect
          x={xScale(i) + 2}
          y={yScale(point.value)}
          width={barWidth * 0.9}
          height={yScale(0) - yScale(point.value)}
        />
      {/each}
    </g>
    <!-- Design y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
          <line x2="100%" />
          <text y="-4">{tick} asdfasfd </text>
        </g>
      {/each}
    </g>

    <!-- Design x axis -->
    <g class="axis x-axis">
      {#each points as point, i}
        <g class="tick" transform="translate({xScale(i)}, {height})">
          <text x={barWidth / 2} y="-4">
            {width > 380 ? point.year : formatMobile(point.year)}</text
          >
        </g>
      {/each}
    </g>
  </svg>
</div>

<style>
  .x-axis .tick text {
    text-anchor: middle;
    color: rgb(255, 0, 0);
  }

  .bars rect {
    fill: #000082;
    stroke: none;
  }

  .tick {
    font-family: Poppins, sans-serif;
    font-size: 0.725em;
    font-weight: 200;
    color: white;
  }

  .tick text {
    fill: white;
    text-anchor: start;
    color: white;
  }

  .tick line {
    stroke: #fcd34d;
    stroke-dasharray: 2;
    opacity: 1;
  }

  .tick.tick-0 line {
    display: inline-block;
    stroke-dasharray: 0;
  }
</style>
