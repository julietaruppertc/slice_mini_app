<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Splash from './splash.svelte';

	let showSplash: boolean = $state(true);

	onMount((): (() => void) => {
		const timer: ReturnType<typeof setTimeout> = setTimeout((): void => {
			showSplash = false;
			goto('/inicio');
		}, 2000);

		return () => clearTimeout(timer);
	});
</script>

{#if showSplash}
	<Splash />
{/if}
