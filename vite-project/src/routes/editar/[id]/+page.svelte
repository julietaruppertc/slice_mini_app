<script lang="ts">
	import { slices } from '$lib/store';
	import type { Slice } from '$lib/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	const allSlices: Slice[] = get(slices);
	const slice: Slice | undefined = allSlices.find(
		(sl: Slice): boolean => sl.id === $page.params.id
	);

	let name: string = $state(slice?.name || '');
	let goal: string = $state(slice?.goal.toString() || '');

	function edit(event: Event): void {
		event.preventDefault();
		if (!name || !goal || parseFloat(goal) <= 0) {
			alert('Por favor completa todos los campos correctamente');
			return;
		}

		const currentSlices: Slice[] = get(slices);
		slices.set(
			currentSlices.map(
				(sl: Slice): Slice =>
					sl.id === slice?.id
						? {
								...sl,
								name,
								goal: parseFloat(goal)
							}
						: sl
			)
		);

		goto(`/info-slice/${slice?.id}`);
	}
</script>

{#if slice}
	<div class="min-h-screen p-8" style="background-color: #806CF2;">
		<h1
			style="
				font-size: 32px;
				font-weight: bold;
				color: #F0EE00;
				font-family: 'Stack Sans Text', sans-serif;
				margin-bottom: 24px;
				text-align: center;
			"
		>
			Editar Slice
		</h1>

		<!-- Name Field -->
		<div
			style="
				background-color: white;
				border-radius: 12px;
				padding: 12px 16px;
				margin-bottom: 16px;
				height: 60px;
				display: flex;
				align-items: center;
				gap: 16px;
				max-width: 400px;
				margin-left: auto;
				margin-right: auto;
			"
		>
			<label for="name" style="font-size: 16px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
				Nombre
			</label>
			<input
				type="text"
				bind:value={name}
				id="name"
				style="
					flex: 1;
					border: none;
					outline: none;
					font-family: 'Stack Sans Text', sans-serif;
					font-size: 14px;
					color: #5E2CBA;
				"
			/>
		</div>

		<!-- Goal Field -->
		<div
			style="
				background-color: white;
				border-radius: 12px;
				padding: 12px 16px;
				margin-bottom: 24px;
				height: 60px;
				display: flex;
				align-items: center;
				gap: 16px;
				max-width: 400px;
				margin-left: auto;
				margin-right: auto;
			"
		>
			<label for="goal" style="font-size: 16px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
				Meta
			</label>
			<input
				type="number"
				bind:value={goal}
				step="0.01"
				id="goal"
				style="
					flex: 1;
					border: none;
					outline: none;
					font-family: 'Stack Sans Text', sans-serif;
					font-size: 14px;
					color: #5E2CBA;
				"
			/>
			<span style="font-size: 14px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif;">
				{slice.currency}
			</span>
		</div>

		<div style="display: flex; gap: 12px; justify-content: center; max-width: 400px; margin: 0 auto;">
			<button
				onclick={edit}
				style="
					background-color: #F0EE00;
					color: #5E2CBA;
					flex: 1;
					height: 50px;
					border-radius: 12px;
					font-size: 16px;
					font-family: 'Stack Sans Headline', sans-serif;
					font-weight: 600;
					border: none;
					cursor: pointer;
				"
			>
				Guardar cambios
			</button>
			<button
				onclick={() => goto(`/info-slice/${slice?.id}`)}
				style="
					background-color: rgba(255,255,255,0.3);
					color: white;
					flex: 1;
					height: 50px;
					border-radius: 12px;
					font-size: 16px;
					font-family: 'Stack Sans Text', sans-serif;
					border: none;
					cursor: pointer;
				"
			>
				Cancelar
			</button>
		</div>
	</div>
{/if}
