<script lang="ts">
	import { slices, showSuccessModal, successMessage } from '$lib/store';
	import type { Slice } from '$lib/store';
	import { goto } from '$app/navigation';

	type Currency = 'ARS' | 'USD' | 'ETH' | 'BTC' | 'USDC' | 'USDT' | 'DAI' | 'POL';

	let name: string = $state('');
	let currency: Currency = $state('USD');
	let amount: string = $state('');
	let goal: string = $state('');

	const currencies: Currency[] = ['ARS', 'USD', 'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'];

	function createSlice(): void {
		if (!name || !amount || !goal) {
			alert('Por favor completa todos los campos');
			return;
		}

		const newSlice: Slice = {
			id: Date.now().toString(),
			name,
			amount: parseFloat(amount),
			currency,
			goal: parseFloat(goal),
			createdAt: Date.now(),
			transactions: []
		};

		slices.update((s: Slice[]): Slice[] => [...s, newSlice]);
		successMessage.set('Slice creado exitosamente');
		showSuccessModal.set(true);

		setTimeout((): void => {
			showSuccessModal.set(false);
			goto('/inicio');
		}, 2000);
	}
</script>

<div class="min-h-screen p-8" style="background-color: #806CF2;">
	<h1
		style="
			font-size: 36px;
			font-weight: bold;
			color: #F0EE00;
			font-family: 'Stack Sans Text', sans-serif;
			margin-bottom: 24px;
			text-align: center;
		"
	>
		Crear Slice
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
		"
	>
		<label for="name" style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
			Nombre
		</label>
		<input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Nombre del slice"
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

	<!-- Currency Dropdown -->
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
		"
	>
		<label for="currency" style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
			Moneda
		</label>
		<select
			id="currency"
			bind:value={currency}
			style="
				flex: 1;
				border: none;
				outline: none;
				font-family: 'Stack Sans Text', sans-serif;
				font-size: 14px;
				color: #5E2CBA;
				background-color: transparent;
			"
		>
			{#each currencies as curr}
				<option value={curr}>{curr}</option>
			{/each}
		</select>
	</div>

	<!-- Amount Field -->
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
		"
	>
		<label for="amount" style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
			Monto
		</label>
		<input
			id="amount"
			type="number"
			bind:value={amount}
			placeholder="0.00"
			step="0.01"
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
		"
	>
		<label for="goal" style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; min-width: fit-content;">
			Meta
		</label>
		<input
			id="goal"
			type="number"
			bind:value={goal}
			placeholder="0.00"
			step="0.01"
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

	<!-- Create Button -->
	<div class="flex justify-center">
		<button
			onclick={createSlice}
			style="
				background-color: #F0EE00;
				color: #5E2CBA;
				width: 200px;
				height: 50px;
				border-radius: 12px;
				font-size: 18px;
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
</div>
