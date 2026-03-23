<script lang="ts">
	import { health } from '$lib/stores';

	let clock = $state(new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

	$effect(() => {
		const interval = setInterval(() => {
			clock = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		}, 1000);
		return () => clearInterval(interval);
	});

	const milesConnected = $derived($health?.miles?.connected ?? false);
	const pmoConnected = $derived($health?.pmo?.connected ?? false);
</script>

<header class="header">
	<div class="brand">
		<h1>Agent Squad</h1>
		<span class="tag">CONTROL CENTER</span>
	</div>
	<div class="header-right">
		<div class="bots">
			<div class="bot-indicator">
				<span class="dot" class:on={milesConnected}></span>
				<span class="bot-name miles">MILES</span>
			</div>
			<div class="bot-indicator">
				<span class="dot" class:on={pmoConnected}></span>
				<span class="bot-name pmo">PMO</span>
			</div>
		</div>
		<span class="clock">{clock}</span>
	</div>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 20px;
		background: rgba(13, 17, 23, 0.95);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(12px);
	}

	.brand {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	h1 {
		font-family: 'Chakra Petch', monospace;
		font-size: 16px;
		font-weight: 700;
		color: #e6edf3;
		letter-spacing: 2px;
		text-transform: uppercase;
		margin: 0;
	}

	.tag {
		font-family: 'Fira Code', monospace;
		font-size: 8px;
		color: #00e5ff;
		background: rgba(0, 229, 255, 0.08);
		padding: 2px 6px;
		border-radius: 3px;
		letter-spacing: 1.5px;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.bots {
		display: flex;
		gap: 12px;
	}

	.bot-indicator {
		display: flex;
		align-items: center;
		gap: 5px;
		font-family: 'Fira Code', monospace;
		font-size: 10px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #ff1744;
	}

	.dot.on {
		background: #00e676;
		box-shadow: 0 0 6px rgba(0, 230, 118, 0.5);
	}

	.bot-name.miles { color: #00e5ff; }
	.bot-name.pmo { color: #ffb300; }

	.clock {
		font-family: 'Fira Code', monospace;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
	}
</style>
