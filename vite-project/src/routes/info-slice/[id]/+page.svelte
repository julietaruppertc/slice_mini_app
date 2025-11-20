<script lang="ts">
	import { slices } from '$lib/store';
	import type { Slice, Transaction } from '$lib/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let slice: Slice | undefined | null = $derived.by(() => {
		const id: string = $page.params.id;
		let found: Slice | undefined | null = null;
		slices.subscribe((s: Slice[]): void => {
			found = s.find((sl: Slice): boolean => sl.id === id);
		})();
		return found;
	});

	function navigateToDeposit(): void {
		if (slice) goto(`/depositar/${slice.id}`);
	}

	function navigateToWithdraw(): void {
		if (slice) goto(`/retirar/${slice.id}`);
	}

	function navigateToEdit(): void {
		if (slice) goto(`/editar/${slice.id}`);
	}

	function formatDate(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleDateString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

{#if slice}
	<div class="min-h-screen p-4" style="background-color: #806CF2;">
		<!-- Info Container -->
		<div
			style="
				background-color: white;
				border-radius: 16px;
				padding: 20px;
				margin-bottom: 16px;
				box-shadow: 0 2px 8px rgba(0,0,0,0.1);
			"
		>
			<div style="font-size: 18px; color: #806CF2; font-family: 'Stack Sans Text', sans-serif; margin-bottom: 8px;">
				{slice.name}
			</div>
			<div style="font-size: 36px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif; font-weight: bold;">
				{slice.amount} {slice.currency}
			</div>
		</div>

		<!-- Goal Progress Container -->
		<div
			style="
				background-color: white;
				border-radius: 16px;
				padding: 16px;
				margin-bottom: 24px;
				box-shadow: 0 2px 8px rgba(0,0,0,0.1);
			"
		>
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
				<div style="font-size: 18px; color: #806CF2; font-family: 'Stack Sans Text', sans-serif; font-weight: 600;">
					{Math.round((slice.amount / slice.goal) * 100)}%
				</div>
				<div style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Text', sans-serif;">
					Meta: {slice.goal} {slice.currency}
				</div>
			</div>
			<div
				style="
					background-color: #E8E8E8;
					border-radius: 8px;
					height: 8px;
					overflow: hidden;
				"
			>
				<div
					style="
						background-color: #5E2CBA;
						height: 100%;
						width: {Math.min((slice.amount / slice.goal) * 100, 100)}%;
						transition: width 0.3s;
					"
				></div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 24px;">
			<button
				onclick={navigateToDeposit}
				style="
					background-color: #F0EE00;
					width: 60px;
					height: 60px;
					border-radius: 50%;
					border: none;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28px;
					transition: transform 0.2s;
				"
				class="hover:scale-110"
				title="Ingresar dinero"
			>
				⬇️
			</button>
			<button
				onclick={navigateToWithdraw}
				style="
					background-color: white;
					width: 60px;
					height: 60px;
					border-radius: 50%;
					border: none;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28px;
					transition: transform 0.2s;
				"
				class="hover:scale-110"
				title="Retirar dinero"
			>
				⬆️
			</button>
			<button
				onclick={navigateToEdit}
				style="
					background-color: white;
					width: 60px;
					height: 60px;
					border-radius: 50%;
					border: none;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28px;
					transition: transform 0.2s;
				"
				class="hover:scale-110"
				title="Editar"
			>
				✏️
			</button>
		</div>

		<!-- Transaction history section -->
		<div
			style="
				background-color: white;
				border-radius: 16px;
				padding: 16px;
				margin-bottom: 16px;
				box-shadow: 0 2px 8px rgba(0,0,0,0.1);
				max-height: 300px;
				overflow-y: auto;
			"
		>
			<div style="font-size: 18px; color: #5E2CBA; font-family: 'Stack Sans Headline', sans-serif; font-weight: 600; margin-bottom: 12px;">
				Historial de Transacciones
			</div>

			{#if slice.transactions && slice.transactions.length > 0}
				<div style="display: flex; flex-direction: column; gap: 8px;">
					{#each slice.transactions as transaction (transaction.id)}
						<div
							style="
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding: 12px;
								background-color: #F5F5F5;
								border-radius: 8px;
								border-left: 4px solid {transaction.type === 'deposit' ? '#5E2CBA' : '#F0EE00'};
							"
						>
							<div style="flex: 1;">
								<div style="font-size: 14px; color: #5E2CBA; font-family: 'Stack Sans Headline', sans-serif; font-weight: 600;">
									{transaction.type === 'deposit' ? '➕ Ingreso' : '➖ Retiro'}
								</div>
								<div style="font-size: 12px; color: #806CF2; font-family: 'Stack Sans Text', sans-serif; margin-top: 4px;">
									{formatDate(transaction.date)}
								</div>
							</div>
							<div
								style="
									font-size: 16px;
									color: {transaction.type === 'deposit' ? '#5E2CBA' : '#F0EE00'};
									font-family: 'Stack Sans Headline', sans-serif;
									font-weight: bold;
									text-align: right;
								"
							>
								{transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} {slice.currency}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div style="text-align: center; color: #806CF2; font-family: 'Stack Sans Text', sans-serif; padding: 20px 0;">
					No hay transacciones registradas
				</div>
			{/if}
		</div>

		<div style="text-align: center; margin-top: 24px;">
			<button
				onclick={() => goto('/inicio')}
				style="
					background-color: rgba(255,255,255,0.3);
					color: white;
					padding: 10px 20px;
					border: none;
					border-radius: 8px;
					cursor: pointer;
					font-family: 'Stack Sans Text', sans-serif;
				"
			>
				Volver
			</button>
		</div>
	</div>
{/if}
