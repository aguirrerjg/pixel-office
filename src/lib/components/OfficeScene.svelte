<script lang="ts">
	import { Canvas } from '@threlte/core';
	import OfficeWorld from './OfficeWorld.svelte';

	interface Props {
		teamKey: string;
		teamName: string;
		teamColor: string;
		platform: string;
	}

	let { teamKey, teamName, teamColor, platform }: Props = $props();
</script>

<div class="office-panel">
	<header class="office-header">
		<div class="header-left">
			<span class="team-name" style="color: {teamColor}">{teamName}</span>
			<span class="platform-badge">{platform}</span>
		</div>
	</header>
	<div class="canvas-container">
		<Canvas>
			<OfficeWorld {teamKey} />
		</Canvas>
	</div>
</div>

<style>
	.office-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #0d1117;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 8px;
		overflow: hidden;
		min-height: 280px;
	}

	.office-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.team-name {
		font-family: 'Chakra Petch', monospace;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 1px;
		text-transform: uppercase;
	}

	.platform-badge {
		font-family: 'Fira Code', monospace;
		font-size: 9px;
		color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.04);
		padding: 2px 6px;
		border-radius: 3px;
		letter-spacing: 0.5px;
	}

	.canvas-container {
		flex: 1;
		min-height: 240px;
	}
</style>
