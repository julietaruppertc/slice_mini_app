<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Splash from './splash.svelte';

	let showSplash = $state(true);

	onMount(() => {
		const timer = setTimeout(() => {
			showSplash = false;
			goto('/inicio');
		}, 2000);

		return () => clearTimeout(timer);
	});
</script>

{#if showSplash}
	<Splash />
{/if}
