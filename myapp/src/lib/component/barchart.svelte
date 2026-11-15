<script>
  import { scaleLinear } from "d3-scale";

  let { title = "", points = [], color = "steelblue" } = $props();

  const padding = {
    top: 20,
    right: 15,
    bottom: 65,
    left: 35,
  };

  let width = $state(500);
  const height = 350;

  const yTicks = [0, 2, 4, 6, 8, 10, 12, 14];

  let innerWidth = $derived(Math.max(0, width - padding.left - padding.right));

  let barWidth = $derived(innerWidth / Math.max(points.length, 1));

  let xScale = $derived(
    scaleLinear()
      .domain([0, Math.max(points.length, 1)])
      .range([padding.left, width - padding.right]),
  );

  let yScale = scaleLinear()
    .domain([0, 14])
    .range([height - padding.bottom, padding.top]);

  // @ts-ignore
  function numericValue(value) {
    return Number(value) || 0;
  }
</script>

{#if title}
  <h2>{title}</h2>
{/if}

<div class="chart" bind:clientWidth={width}>
  <svg
    width="100%"
    {height}
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-label={title || "Average screen time bar chart"}
  >
    <!-- Horizontal grid lines and Y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick" transform={`translate(0, ${yScale(tick)})`}>
          <line x1={padding.left} x2={width - padding.right} />

          <text x={padding.left - 8} y="4" text-anchor="end">
            {tick}
          </text>
        </g>
      {/each}
    </g>

    <!-- Bars -->
    <g class="bars">
      {#each points as point, i}
        <rect
          x={xScale(i) + barWidth * 0.1}
          y={yScale(numericValue(point.value))}
          width={barWidth * 0.8}
          height={Math.max(0, yScale(0) - yScale(numericValue(point.value)))}
          fill={color}
        >
          <title
            >{point.label}: {numericValue(point.value).toFixed(2)} hours</title
          >
        </rect>
      {/each}
    </g>

    <!-- X axis labels -->
    <g class="axis x-axis">
      {#each points as point, i}
        <g
          class="tick"
          transform={`translate(${xScale(i) + barWidth / 2}, ${height - padding.bottom})`}
        >
          <text x="0" y="18" text-anchor="middle">
            {point.label}
          </text>
        </g>
      {/each}
    </g>
  </svg>
</div>

<style>
  .chart {
    width: 100%;
    min-width: 0;
  }

  svg {
    display: block;
    overflow: visible;
  }

  .bars rect {
    stroke: none;
    transition:
      y 0.4s ease,
      height 0.4s ease,
      fill 0.3s ease;
  }

  .bars rect:hover {
    opacity: 0.75;
  }

  .tick {
    font-family: Poppins, sans-serif;
    font-size: 12px;
    font-weight: 400;
  }

  .tick text {
    fill: #333;
  }

  .y-axis line {
    stroke: #ddd;
    stroke-dasharray: 3 3;
  }

  .x-axis text {
    font-size: 11px;
  }
</style>
