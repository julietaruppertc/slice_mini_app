<script lang="ts">
	import { slices } from '$lib/store';
	import type { Slice } from '$lib/store';
	import { goto } from '$app/navigation';

	let slicesList: Slice[] = $derived.by(() => {
		let list: Slice[] = [];
		slices.subscribe((value: Slice[]): void => {
			list = value;
		})();
		return list;
	});

	function navigateToCreateSlice(): void {
		goto('/crear-slice');
	}

	function navigateToSliceInfo(slice: Slice): void {
		goto(`/info-slice/${slice.id}`);
	}
</script>

<div class="min-h-screen p-4" style="background-color: #806CF2;">
	<!-- Create Slice Button -->
	<div class="flex justify-center mb-8 mt-4">
		<button
			onclick={navigateToCreateSlice}
			style="
				background-color: #F0EE00;
				color: #5E2CBA;
				width: 200px;
				height: 50px;
				border-radius: 12px;
				font-size: 20px;
				font-family: 'Stack Sans Headline', sans-serif;
				font-weight: 600;
				border: none;
				cursor: pointer;
				transition: transform 0.2s;
			"
			class="hover:scale-105"
		>
			Crear Slice
		</button>
	</div>

	<!-- Slices List -->
	<div
		style="
			display: flex;
			flex-direction: column;
			gap: 16px;
			max-width: 100%;
		"
	>
		{#each slicesList as slice (slice.id)}
			<button
				onclick={() => navigateToSliceInfo(slice)}
				style="
					background-color: white;
					border-radius: 16px;
					width: 100%;
					height: 164px;
					padding: 16px;
					border: none;
					cursor: pointer;
					display: flex;
					flex-direction: row;
					box-shadow: 0 2px 8px rgba(0,0,0,0.1);
					transition: transform 0.2s;
				"
				class="hover:scale-105"
			>
				<div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
					<div style="font-size: 16px; color: #806CF2; font-family: 'Stack Sans Text', sans-serif; font-weight: 500;">
						{slice.name}
					</div>
					<div
						style="
							font-size: 40px;
							color: #5E2CBA;
							font-family: 'Stack Sans Text', sans-serif;
							font-weight: bold;
						"
					>
						{slice.amount} {slice.currency}
					</div>
					<div style="font-size: 12px; color: #806CF2; font-family: 'Stack Sans Serif', sans-serif;">
						{Math.round((slice.amount / slice.goal) * 100)}% de la meta
					</div>
				</div>
				{#if slice.currency !== 'ARS' && slice.currency !== 'USD'}
					<div style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; margin-left: auto; padding-left: 16px;">
						≈ $23,120
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>
