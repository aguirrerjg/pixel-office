<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Header, OfficeScene } from '$lib/components';
	import { TEAMS, startPolling, stopPolling } from '$lib/stores';

	const STATUS_URL = import.meta.env.VITE_STATUS_URL || '/api/status.json';

	onMount(() => {
		startPolling(STATUS_URL);
	});

	onDestroy(() => {
		stopPolling();
	});
</script>

<svelte:head>
	<title>Pixel Office — Control Center</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Fira+Code:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
</svelte:head>

<div class="app">
	<Header />
	<main class="offices">
		{#each TEAMS as team}
			<OfficeScene
				teamKey={team.key}
				teamName={team.name}
				teamColor={team.color}
				platform={team.platform}
			/>
		{/each}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #0a0e14;
		color: #e6edf3;
		font-family: 'Outfit', sans-serif;
		overflow: hidden;
		height: 100vh;
	}

	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.offices {
		flex: 1;
		display: flex;
		gap: 1px;
		padding: 8px;
		min-height: 0;
	}
</style>
