<script lang="ts">
	import { showSuccessModal, successMessage } from '$lib/store';
</script>

{#if $showSuccessModal}
	<div
		style="
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1000;
		"
	>
		<div
			style="
				background-color: white;
				border-radius: 16px;
				padding: 32px;
				text-align: center;
				box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
				max-width: 300px;
				animation: slideUp 0.3s ease-out;
			"
		>
			<div
				style="
					font-size: 48px;
					margin-bottom: 16px;
				"
			>
				✓
			</div>
			<h2
				style="
					font-size: 24px;
					color: #5E2CBA;
					font-family: 'Stack Sans Headline', sans-serif;
					font-weight: bold;
					margin-bottom: 8px;
				"
			>
				¡Éxito!
			</h2>
			<p
				style="
					font-size: 16px;
					color: #806CF2;
					font-family: 'Stack Sans Text', sans-serif;
				"
			>
				{$successMessage}
			</p>
		</div>
	</div>

	<style>
		@keyframes slideUp {
			from {
				transform: translateY(20px);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}
	</style>
{/if}
