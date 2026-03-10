<script lang="ts">
	import { TEAMS, milesStatus, pmoStatus } from '$lib/stores';
	import type { AgentState, TeamStatus } from '$lib/types';
	import PixelCharacter from './PixelCharacter.svelte';

	interface Props {
		teamKey: string;
		teamName: string;
		teamColor: string;
		platform: string;
	}

	let { teamKey, teamName, teamColor, platform }: Props = $props();

	const team = $derived(TEAMS.find((t) => t.key === teamKey));
	const agentCount = $derived(team?.agents.length ?? 0);
	const teamStatus: TeamStatus = $derived(teamKey === 'miles' ? $milesStatus : $pmoStatus);

	function getAgentState(agentId: string): AgentState {
		const status = teamStatus[agentId];
		return (status?.state as AgentState) ?? 'idle';
	}

	function getAgentActivity(agentId: string): string {
		return teamStatus[agentId]?.activity ?? '';
	}
</script>

<div class="office-panel">
	<header class="office-header">
		<div class="header-left">
			<span class="team-name" style="color: {teamColor}">{teamName}</span>
			<span class="platform-badge">{platform}</span>
		</div>
		<div class="header-right">
			<div class="office-stats">
				{#if team}
					{@const working = team.agents.filter(a => getAgentState(a.id) === 'working').length}
					{@const thinking = team.agents.filter(a => getAgentState(a.id) === 'thinking').length}
					<span class="o-stat"><span class="s-pip" style="background:#00e676"></span> {working} working</span>
					<span class="o-stat"><span class="s-pip" style="background:#b388ff"></span> {thinking} thinking</span>
				{/if}
			</div>
		</div>
	</header>
	<div class="ws-area">
		{#if team}
			{#each team.agents as agent, idx}
				{@const pct = agentCount === 1 ? 50 : (10 + idx * (80 / (agentCount - 1)))}
				{@const agentState = getAgentState(agent.id)}
				<div
					class="workstation-wrap {agentState}"
					style="left:{pct}%;--agent-color:{agent.color}"
				>
					<!-- Desk legs -->
					<div class="desk-leg-l"></div>
					<div class="desk-leg-r"></div>
					<!-- Desk -->
					<div class="desk"></div>
					<!-- Chair -->
					<div class="chair">
						<div class="chair-back"></div>
						<div class="chair-seat"></div>
					</div>
					<!-- Laptop -->
					<div class="laptop">
						<div class="laptop-screen">
							<div class="screen-glow"></div>
							<div class="screen-lines">
								{#each Array(5) as _, i}
									<div
										class="screen-line"
										style="width:{40+Math.random()*50}%;background:{agent.color};animation-delay:{i*0.15}s"
									></div>
								{/each}
							</div>
						</div>
						<div class="laptop-base"></div>
					</div>
					<!-- Work pulse -->
					<div class="work-pulse"></div>
					<!-- Character -->
					<PixelCharacter {agent} agentState={agentState} />
				</div>
			{/each}
		{/if}
		<!-- Back wall -->
		<div class="back-wall"></div>
		<!-- Ambient details -->
		<div class="ambient-plant left"></div>
		<div class="ambient-plant right"></div>
		{#if agentCount > 3}
			<div class="ambient-cooler"></div>
		{/if}
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

	.header-right {
		display: flex;
		align-items: center;
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

	.office-stats {
		display: flex;
		gap: 14px;
		font-family: 'Fira Code', monospace;
		font-size: 10px;
	}

	.o-stat {
		display: flex;
		align-items: center;
		gap: 5px;
		color: #6b7394;
	}

	.s-pip {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		display: inline-block;
	}

	/* ═══ SHARED OFFICE SCENE ═══ */
	.ws-area {
		flex: 1;
		position: relative;
		overflow: hidden;
		min-height: 220px;
		background:
			linear-gradient(180deg, #0d1117 0%, #131920 40%, #161b22 100%),
			radial-gradient(circle at 20% 80%, rgba(0, 229, 255, 0.02) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(179, 136, 255, 0.015) 0%, transparent 50%);
	}
	/* Shared floor */
	.ws-area::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 45%;
		background: linear-gradient(180deg, #1a1f29 0%, #171c26 50%, #13171e 100%);
		border-top: 1px solid rgba(100, 120, 180, 0.08);
		z-index: 0;
	}
	/* Ambient ceiling light */
	.ws-area::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, transparent 5%, rgba(255, 255, 255, 0.02) 20%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 80%, transparent 95%);
		z-index: 1;
	}

	/* ═══ WORKSTATION WRAP ═══ */
	.workstation-wrap {
		position: absolute;
		bottom: 38%;
		width: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 0.5s ease;
		z-index: 2;
		transform: translateX(-50%);
	}
	.workstation-wrap::before {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 20px;
		border-radius: 50%;
		background: var(--agent-color);
		opacity: 0;
		filter: blur(15px);
		transition: opacity 0.5s;
		z-index: -1;
	}
	.workstation-wrap.working::before { opacity: 0.15; }
	.workstation-wrap.thinking::before { opacity: 0.1; background: #b388ff; }

	/* ── Desk ── */
	.desk {
		position: absolute;
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%);
		width: 90px;
		height: 10px;
		background: linear-gradient(180deg, #2d3a5c 0%, #232f4f 100%);
		border-radius: 3px 3px 0 0;
		border: 1px solid rgba(100, 120, 180, 0.15);
		border-bottom: none;
	}

	.desk-leg-l, .desk-leg-r {
		position: absolute;
		bottom: 14px;
		width: 4px;
		height: 18px;
		background: linear-gradient(180deg, #2d3a5c, #1e2845);
		border-radius: 0 0 2px 2px;
	}
	.desk-leg-l { left: calc(50% - 38px); }
	.desk-leg-r { left: calc(50% + 34px); }

	/* ── Chair ── */
	.chair {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
	}
	.chair-seat {
		width: 40px;
		height: 6px;
		background: #1e2845;
		border-radius: 3px;
		border: 1px solid rgba(100, 120, 180, 0.1);
	}
	.chair-back {
		position: absolute;
		bottom: 6px;
		left: 50%;
		transform: translateX(-50%);
		width: 36px;
		height: 30px;
		background: linear-gradient(180deg, #252e4a 0%, #1e2845 100%);
		border-radius: 6px 6px 2px 2px;
		border: 1px solid rgba(100, 120, 180, 0.1);
	}

	/* ── Laptop ── */
	.laptop {
		position: absolute;
		bottom: 38px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 3;
	}
	.laptop-base {
		width: 36px;
		height: 4px;
		background: #333e5c;
		border-radius: 1px;
		border: 1px solid rgba(120, 140, 200, 0.15);
	}
	.laptop-screen {
		position: absolute;
		bottom: 4px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 22px;
		background: #0a0f1e;
		border: 1.5px solid #3a4568;
		border-radius: 2px 2px 0 0;
		overflow: hidden;
	}
	.screen-glow {
		position: absolute;
		inset: 2px;
		background: linear-gradient(180deg, rgba(50, 80, 140, 0.3) 0%, rgba(30, 50, 100, 0.15) 100%);
		border-radius: 1px;
	}
	.workstation-wrap.working .screen-glow {
		background: linear-gradient(180deg, color-mix(in srgb, var(--agent-color) 60%, transparent) 0%, color-mix(in srgb, var(--agent-color) 25%, transparent) 100%);
		animation: screenFlicker 1.5s ease-in-out infinite;
	}
	.workstation-wrap.thinking .screen-glow {
		background: linear-gradient(180deg, rgba(179, 136, 255, 0.4) 0%, rgba(179, 136, 255, 0.15) 100%);
		animation: screenFlicker 2.5s ease-in-out infinite;
	}
	@keyframes screenFlicker { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

	/* Screen text lines */
	.screen-lines {
		position: absolute;
		inset: 3px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 1px;
	}
	.screen-lines :global(.screen-line) {
		height: 1.5px;
		border-radius: 1px;
		opacity: 0.3;
	}
	.workstation-wrap.working .screen-lines :global(.screen-line) { animation: typeLine 1s ease-in-out infinite; opacity: 0.7; }
	.workstation-wrap.thinking .screen-lines :global(.screen-line) { animation: typeLine 3s ease-in-out infinite; opacity: 0.4; }
	@keyframes typeLine { 0% { width: 0; } 30% { width: 100%; } 60% { width: 40%; } 100% { width: 80%; } }

	/* Laptop glow on desk */
	.workstation-wrap.working .laptop::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 12px;
		border-radius: 50%;
		background: var(--agent-color);
		opacity: 0.15;
		filter: blur(6px);
		animation: deskGlow 1.5s ease-in-out infinite;
	}
	.workstation-wrap.thinking .laptop::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 12px;
		border-radius: 50%;
		background: #b388ff;
		opacity: 0.12;
		filter: blur(6px);
		animation: deskGlow 2.5s ease-in-out infinite;
	}
	@keyframes deskGlow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.25; } }

	/* Work pulse */
	.work-pulse {
		position: absolute;
		bottom: 38px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1px solid var(--agent-color);
		opacity: 0;
		z-index: 0;
		pointer-events: none;
	}
	.workstation-wrap.working .work-pulse { animation: pulseRing 2s ease-out infinite; }
	@keyframes pulseRing { 0% { opacity: 0.5; transform: translateX(-50%) scale(0.6); } 100% { opacity: 0; transform: translateX(-50%) scale(2); } }

	/* ═══ BACK WALL ═══ */
	.back-wall {
		position: absolute;
		bottom: 45%;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(100, 120, 180, 0.08);
		z-index: 0;
	}

	/* ═══ AMBIENT OBJECTS ═══ */
	.ambient-plant {
		position: absolute;
		bottom: 38%;
		width: 20px;
		height: 35px;
		z-index: 1;
	}
	.ambient-plant::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 14px;
		height: 12px;
		background: #3d2e24;
		border-radius: 2px 2px 4px 4px;
	}
	.ambient-plant::after {
		content: '';
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: 24px;
		height: 28px;
		background: radial-gradient(ellipse, #2d6b3a 30%, #1b4a28 70%);
		border-radius: 50% 50% 30% 30%;
	}
	.ambient-plant.left { left: 8px; }
	.ambient-plant.right { right: 8px; }

	.ambient-cooler {
		position: absolute;
		bottom: 38%;
		right: 35px;
		width: 16px;
		height: 40px;
		background: linear-gradient(180deg, #90caf9 0% 30%, #c0c8d0 30% 100%);
		border-radius: 4px 4px 2px 2px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		z-index: 1;
	}
	.ambient-cooler::after {
		content: '';
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 4px;
		height: 3px;
		background: #e0e0e0;
		border-radius: 1px;
	}
</style>
