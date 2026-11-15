<script>
  import { onMount } from "svelte";

  let {
    root = null,
    top = 0,
    bottom = 0,
    increments = 100,
    value = $bindable(undefined),
    children,
  } = $props();

  // @ts-ignore
  let container;

  // @ts-ignore
  let nodes = [];
  // @ts-ignore
  let intersectionObservers = [];
  // @ts-ignore
  let steps = [];
  // @ts-ignore
  let thresholds = [];

  function mostInView() {
    let maxRatio = 0;
    let maxIndex = 0;

    for (let i = 0; i < steps.length; i++) {
      // @ts-ignore
      if (steps[i] > maxRatio) {
        // @ts-ignore
        maxRatio = steps[i];
        maxIndex = i;
      }
    }

    value = maxRatio > 0 ? maxIndex : undefined;
  }

  // @ts-ignore
  function createObserver(node, index) {
    // @ts-ignore
    const handleIntersect = (entries) => {
      const entry = entries[0];

      steps[index] = entry.intersectionRatio;
      mostInView();
    };

    const rootMargin = `${-top}px 0px ${-bottom}px 0px`;

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      // @ts-ignore
      threshold: thresholds,
    });

    observer.observe(node);
    intersectionObservers[index] = observer;
  }

  function update() {
    // @ts-ignore
    intersectionObservers.forEach((observer) => observer.disconnect());
    intersectionObservers = [];

    if (!nodes.length) return;

    // @ts-ignore
    nodes.forEach(createObserver);
  }

  onMount(() => {
    // @ts-ignore
    nodes = Array.from(container.children);

    return () => {
      // @ts-ignore
      intersectionObservers.forEach((observer) => observer.disconnect());
    };
  });

  $effect(() => {
    // Recreate observers when these props change
    // @ts-ignore
    const currentRoot = root;
    // @ts-ignore
    const currentTop = top;
    // @ts-ignore
    const currentBottom = bottom;
    const currentIncrements = Math.max(1, Math.floor(increments));

    thresholds = Array.from(
      { length: currentIncrements + 1 },
      (_, i) => i / currentIncrements,
    );

    // @ts-ignore
    if (container) {
      nodes = Array.from(container.children);
      update();
    }
  });
</script>

<div bind:this={container}>
  {@render children?.()}
</div>
