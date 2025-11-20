<script lang="ts">
	import { slices } from '$lib/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let slice = $derived.by(() => {
		const id = $page.params.id;
		let found = null;
		slices.subscribe(s => {
			found = s.find(sl => sl.id === id);
		})();
		return found;
	});

	let amount = $state('');

	function deposit() {
		if (!amount || parseFloat(amount) <= 0) {
			alert('Ingresa un monto válido');
			return;
		}

		slices.update(s =>
			s.map(sl =>
				sl.id === slice.id
					? {
							...sl,
							amount: sl.amount + parseFloat(amount)
						}
					: sl
			)
		);

		goto(`/info-slice/${slice.id}`);
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
			Ingresar dinero
		</h1>

		<div
			style="
				background-color: white;
				border-radius: 12px;
				padding: 16px;
				margin-bottom: 24px;
				height: 80px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				max-width: 400px;
				margin-left: auto;
				margin-right: auto;
			"
		>
			<div style="display: flex; align-items: center; gap: 12px;">
				<input
					type="number"
					bind:value={amount}
					placeholder="0.00"
					step="0.01"
					style="
						flex: 1;
						border: none;
						outline: none;
						font-family: 'Stack Sans Text', sans-serif;
						font-size: 18px;
						color: #5E2CBA;
					"
				/>
				<span style="font-size: 16px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
					{slice.currency}
				</span>
			</div>
		</div>

		<div style="display: flex; gap: 12px; justify-content: center; max-width: 400px; margin: 0 auto;">
			<button
				onclick={deposit}
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
				Cargar fondos
			</button>
			<button
				onclick={() => goto(`/info-slice/${slice.id}`)}
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
