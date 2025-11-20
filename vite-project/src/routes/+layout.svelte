<script lang="ts">
	import '../app.css';
	import ModalAviso from '$lib/components/modal-aviso.svelte';
	
	let { children } = $props();
</script>

<div class="min-h-screen" style="background-color: #806CF2;">
	{@render children()}
</div>

<!-- Add the success modal component to display globally -->
<ModalAviso />
