<script>
  import { scaleLinear } from "d3-scale";
  const yTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const padding = { top: 20, right: 15, bottom: 20, left: 25 };
  /** @type {number | null} */

  let hoveredBar = $state(null);

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
  {#if hoveredBar !== null}
    <div class="tooltip">
      Value: {points[hoveredBar].value}
    </div>
  {/if}
  <svg {width} {height}>
    <!-- 4. Design the bars -->
    <g class="bars">
      {#each points as point, i}
        <rect
          role="img"
          x={xScale(i) + 2}
          y={yScale(point.value)}
          width={barWidth * 0.9}
          height={yScale(0) - yScale(point.value)}
          class:hovered={hoveredBar === i}
          onmouseenter={() => (hoveredBar = i)}
          onmouseleave={() => (hoveredBar = null)}
          class="transition-colors duration-150"
        />
      {/each}
    </g>

    <!-- Design y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
          <line x2="100%" />
          <text y="-4">{tick} Hours </text>
        </g>
      {/each}
    </g>

    <!-- Design x axis -->
    <g class="axis x-axis">
      {#each points as point, i}
        <g class="tick" transform="translate({xScale(i)}, {height})">
          <text x={barWidth / 2} y="-4">
            {width > 380 ? point.label : formatMobile(point.year)}</text
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
    stroke: none;
    transition: fill 150ms ease;
    fill: #ffc400;
  }

  .bars rect.hovered {
    stroke: none;

    fill: #0099ff;
  }
  .tick {
    font-family: Poppins, sans-serif;
    font-size: 0.725em;
    font-weight: 200;
    color: rgb(5, 4, 4);
  }

  .tick text {
    fill: rgb(255, 17, 17);
    text-anchor: start;
    color: rgb(227, 34, 34);
  }

  .tick line {
    stroke: #221b02;
    stroke-dasharray: 2;
    opacity: 1;
  }

  .tick.tick-0 line {
    display: inline-block;
    stroke-dasharray: 0;
  }
</style>
