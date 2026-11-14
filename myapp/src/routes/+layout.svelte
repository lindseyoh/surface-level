<script lang="ts">
	let { children } = $props();
</script>

<nav>
	<a href="/">home</a>
	<a href="/about">about</a>
	<a href="/facts">fact page</a>
	<a href="/todo">todo</a>
</nav>

{@render children()}
