<script lang="ts">
	import { TEAMS, DELEGATION_MAP, milesStatus, pmoStatus } from '$lib/stores';
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
	const teamStatus: TeamStatus = $derived(teamKey === 'miles' ? $milesStatus : $pmoStatus);

	// Split agents into rows of 3
	const rows = $derived.by(() => {
		if (!team) return [] as typeof team.agents[];
		const result: typeof team.agents[] = [];
		for (let i = 0; i < team.agents.length; i += 3) {
			result.push(team.agents.slice(i, i + 3));
		}
		return result;
	});

	function getRowStyle(rowIdx: number, totalRows: number) {
		// paperTop = vertical % where papers fly (aligned with agent monitor level)
		if (totalRows === 1) return { bottom: 22, scale: 1.45, spread: { start: 22, range: 56 }, paperTop: 62 };
		// 2 rows: back smaller/higher, front bigger/lower
		if (rowIdx === 0) return { bottom: 34, scale: 1.0, spread: { start: 22, range: 56 }, paperTop: 52 };
		return { bottom: 8, scale: 1.3, spread: { start: 22, range: 56 }, paperTop: 78 };
	}

	// Agent position map (id → left %)
	const agentPositions = $derived.by(() => {
		const map: Record<string, number> = {};
		rows.forEach((row, rowIdx) => {
			const style = getRowStyle(rowIdx, rows.length);
			row.forEach((agent, idx) => {
				map[agent.id] = row.length === 1 ? 50 :
					(style.spread.start + idx * (style.spread.range / (row.length - 1)));
			});
		});
		return map;
	});

	// Track which row each agent is in
	const agentRowMap = $derived.by(() => {
		const map: Record<string, number> = {};
		rows.forEach((row, rowIdx) => {
			row.forEach(agent => { map[agent.id] = rowIdx; });
		});
		return map;
	});

	// Detect active delegations by parsing "Esperando a {label1}, {label2}" activity
	const delegations = $derived.by(() => {
		const result: { from: string; to: string; fromPct: number; toPct: number; color: string }[] = [];
		const map = DELEGATION_MAP[teamKey];
		if (!map || !team) return result;

		for (const [agentId, status] of Object.entries(teamStatus)) {
			const activity = status?.activity || '';
			const match = activity.match(/^Esperando a (.+)$/);
			if (match) {
				// Support comma-separated labels: "Esperando a research, community"
				const labels = match[1].split(/,\s*/);
				for (const label of labels) {
					const targetId = map[label.trim()];
					if (targetId && agentPositions[agentId] !== undefined && agentPositions[targetId] !== undefined) {
						const targetAgent = team.agents.find(a => a.id === targetId);
						let fromPct = agentPositions[agentId];
						let toPct = agentPositions[targetId];
						// If same X position (vertical delegation), offset to create visible arc
						if (Math.abs(fromPct - toPct) < 5) {
							fromPct -= 6;
							toPct += 6;
						}
						result.push({
							from: agentId,
							to: targetId,
							fromPct,
							toPct,
							color: targetAgent?.color ?? teamColor,
						});
					}
				}
			}
		}
		return result;
	});

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
					<span class="o-stat"><span class="s-pip working"></span> {working} working</span>
					<span class="o-stat"><span class="s-pip thinking"></span> {thinking} thinking</span>
				{/if}
			</div>
		</div>
	</header>
	<div class="ws-area" style="--office-bg: url('/office-bg-{teamKey}.webp')">
		<!-- BACK WALL -->
		<div class="back-wall">
			<div class="wall-trim-top"></div>
			<!-- Digital Whiteboard (left side) -->
			<div class="whiteboard">
				<div class="wb-frame">
					<div class="wb-surface">
						<!-- Sticky notes -->
						<div class="sticky s1">MVP</div>
						<div class="sticky s2">API</div>
						<div class="sticky s3">Deploy</div>
						<div class="sticky s4">Tests</div>
						<!-- Drawn lines (marker strokes) -->
						<div class="wb-line wl1"></div>
						<div class="wb-line wl2"></div>
						<div class="wb-line wl3"></div>
						<div class="wb-line wl4"></div>
						<!-- Flow arrows -->
						<div class="wb-arrow wa1"></div>
						<div class="wb-arrow wa2"></div>
						<!-- Diagram boxes -->
						<div class="wb-box wb1"></div>
						<div class="wb-box wb2"></div>
						<div class="wb-box wb3"></div>
						<!-- Dots/bullets -->
						<div class="wb-dot wd1"></div>
						<div class="wb-dot wd2"></div>
						<div class="wb-dot wd3"></div>
					</div>
					<div class="wb-tray">
						<div class="wb-marker m-red"></div>
						<div class="wb-marker m-blue"></div>
						<div class="wb-marker m-green"></div>
						<div class="wb-marker m-black"></div>
						<div class="wb-eraser"></div>
					</div>
				</div>
			</div>

			<!-- Window (right side) — different view per team -->
			<div class="window">
				<div class="window-frame">
					<div class="window-pane left">
						<div class="window-sky {teamKey}">
							{#if teamKey === 'miles'}
								<!-- City skyline -->
								<div class="skyline">
									<div class="building b1"></div>
									<div class="building b2"></div>
									<div class="building b3"></div>
									<div class="building b4"></div>
									<div class="building b5"></div>
									<div class="building b6"></div>
									<div class="building b7"></div>
									<div class="building b8"></div>
								</div>
								<div class="trees-line"></div>
							{:else}
								<!-- Mountain landscape -->
								<div class="mountains">
									<div class="mountain m1"></div>
									<div class="mountain m2"></div>
									<div class="mountain m3"></div>
								</div>
								<div class="lake"></div>
								<div class="pine-line"></div>
							{/if}
						</div>
					</div>
					<div class="window-pane right">
						<div class="window-sky {teamKey}">
							{#if teamKey === 'miles'}
								<div class="skyline">
									<div class="building b9"></div>
									<div class="building b10"></div>
									<div class="building b11"></div>
									<div class="building b12"></div>
									<div class="building b13"></div>
									<div class="building b14"></div>
								</div>
								<div class="trees-line"></div>
							{:else}
								<div class="mountains">
									<div class="mountain m4"></div>
									<div class="mountain m5"></div>
								</div>
								<div class="lake"></div>
								<div class="pine-line"></div>
							{/if}
						</div>
					</div>
					<div class="window-divider-v"></div>
					<div class="window-divider-h"></div>
				</div>
			</div>

			<!-- (bookshelves removed — wall space used by whiteboard + window) -->

			<!-- Circuit board pattern (lower wall between bookshelves and desk) -->
			<div class="circuit-panel">
				<div class="circuit-line ch1"></div>
				<div class="circuit-line ch2"></div>
				<div class="circuit-line ch3"></div>
				<div class="circuit-line ch4"></div>
				<div class="circuit-line cv1"></div>
				<div class="circuit-line cv2"></div>
				<div class="circuit-line cv3"></div>
				<div class="circuit-line cv4"></div>
				<div class="circuit-line cv5"></div>
				<div class="circuit-dot cd1"></div>
				<div class="circuit-dot cd2"></div>
				<div class="circuit-dot cd3"></div>
				<div class="circuit-dot cd4"></div>
				<div class="circuit-dot cd5"></div>
				<div class="circuit-dot cd6"></div>
				<div class="circuit-dot cd7"></div>
				<div class="circuit-dot cd8"></div>
				<div class="circuit-chip cp1"></div>
				<div class="circuit-chip cp2"></div>
			</div>
		</div>

		<!-- FLOOR (warm light wood) -->
		<div class="floor">
			<div class="floor-plank p1"></div>
			<div class="floor-plank p2"></div>
			<div class="floor-plank p3"></div>
			<div class="floor-plank p4"></div>
			<div class="floor-plank p5"></div>
			<div class="floor-plank p6"></div>
		</div>

		<!-- PLANTS (tall trees in terracotta pots) -->
		<div class="plant left">
			<div class="pot"></div>
			<div class="trunk"></div>
			<div class="foliage f1"></div>
			<div class="foliage f2"></div>
			<div class="foliage f3"></div>
			<div class="foliage f4"></div>
		</div>
		<div class="plant right">
			<div class="pot"></div>
			<div class="trunk"></div>
			<div class="foliage f1"></div>
			<div class="foliage f2"></div>
			<div class="foliage f3"></div>
			<div class="foliage f4"></div>
		</div>

		<!-- DESK ROWS: each agent has their own individual workstation -->
		{#each rows as row, rowIdx}
			{@const rowStyle = getRowStyle(rowIdx, rows.length)}
			<div class="desk-area" style="bottom:{rowStyle.bottom}%">
				{#each row as agent, idx}
					{@const pct = row.length === 1 ? 50 : (rowStyle.spread.start + idx * (rowStyle.spread.range / (row.length - 1)))}
					{@const agentState = getAgentState(agent.id)}
					<div
						class="workstation-wrap {agentState}"
						style="left:{pct}%;--agent-color:{agent.color};--agent-scale:{rowStyle.scale}"
					>
						<!-- Individual desk -->
						<div class="ind-desk">
							<div class="ind-desk-top"></div>
							<div class="ind-desk-front"></div>
							<div class="ind-desk-leg idl-l"></div>
							<div class="ind-desk-leg idl-r"></div>
						</div>
						<!-- Monitor -->
						<div class="monitor">
							<div class="monitor-screen">
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
							<div class="monitor-stand"></div>
							<div class="monitor-base"></div>
						</div>
						<!-- Work pulse -->
						<div class="work-pulse"></div>
						<!-- Character -->
						<PixelCharacter {agent} agentState={agentState} activity={getAgentActivity(agent.id)} />
						<!-- Name pill (individual) -->
						<div class="name-pill" style="--pill-color:{agent.color}">
							{agent.name}
						</div>
					</div>
				{/each}
			</div>
		{/each}

		<!-- PAPER TOSS: delegation animation -->
		{#each delegations as deleg (deleg.from + deleg.to)}
			{@const minPct = Math.min(deleg.fromPct, deleg.toPct)}
			{@const maxPct = Math.max(deleg.fromPct, deleg.toPct)}
			{@const goingRight = deleg.toPct > deleg.fromPct}
			{@const fromRow = agentRowMap[deleg.from] ?? 0}
			{@const toRow = agentRowMap[deleg.to] ?? 0}
			{@const fromTop = getRowStyle(fromRow, rows.length).paperTop}
			{@const toTop = getRowStyle(toRow, rows.length).paperTop}
			{@const crossRow = toRow !== fromRow}
			{@const toBottom = crossRow ? getRowStyle(toRow, rows.length).bottom : 0}
			<div
				class="paper-toss"
				class:going-left={!goingRight}
				class:cross-row={crossRow}
				style="left:{minPct}%;width:{Math.max(maxPct - minPct, 12)}%;top:{fromTop}%;{crossRow ? `bottom:calc(${toBottom}% + 60px)` : ''}"
			>
				<div class="paper p1" style="--paper-accent:{deleg.color}"><div class="paper-fold"></div></div>
				<div class="paper p2" style="--paper-accent:{deleg.color}"><div class="paper-fold"></div></div>
				<div class="paper p3" style="--paper-accent:{deleg.color}"><div class="paper-fold"></div></div>
			</div>
		{/each}
	</div>
</div>

<style>
	.office-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #0e1218;
		border: 1px solid rgba(100, 120, 160, 0.2);
		border-radius: 8px;
		overflow: hidden;
		min-height: 420px;
	}

	.office-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 16px;
		background: linear-gradient(180deg, #1a2030 0%, #0e1218 100%);
		border-bottom: 1px solid rgba(100, 120, 160, 0.15);
	}
	.header-left { display: flex; align-items: center; gap: 8px; }
	.header-right { display: flex; align-items: center; }
	.team-name {
		font-family: 'Chakra Petch', monospace;
		font-size: 13px; font-weight: 700;
		letter-spacing: 1px; text-transform: uppercase;
	}
	.platform-badge {
		font-family: 'Fira Code', monospace;
		font-size: 9px; color: rgba(255, 220, 160, 0.5);
		background: rgba(255, 200, 100, 0.06);
		padding: 2px 6px; border-radius: 3px;
	}
	.office-stats { display: flex; gap: 14px; font-family: 'Fira Code', monospace; font-size: 10px; }
	.o-stat { display: flex; align-items: center; gap: 5px; color: #8a7a60; }
	.s-pip { width: 5px; height: 5px; border-radius: 50%; display: inline-block; }
	.s-pip.working { background: #00e676; }
	.s-pip.thinking { background: #b388ff; }

	/* ═══ MAIN SCENE ═══ */
	.ws-area {
		flex: 1;
		position: relative;
		overflow: hidden;
		min-height: 380px;
		background: #1a1f29;
		background-image: var(--office-bg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* ═══ BACK WALL (hidden — replaced by background image) ═══ */
	.back-wall {
		display: none;
	}
	/* Horizontal wood plank lines */
	.back-wall::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			repeating-linear-gradient(180deg,
				transparent 0px, transparent 14px,
				rgba(0,0,0,0.06) 14px, rgba(0,0,0,0.06) 15px,
				transparent 15px, transparent 16px
			),
			repeating-linear-gradient(180deg,
				transparent 0px, transparent 7px,
				rgba(0,0,0,0.025) 7px, rgba(0,0,0,0.025) 8px
			);
		z-index: 0;
	}
	/* Lower wall panel (wainscoting - slightly darker) with wood trim molding */
	.back-wall::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 42%;
		background: linear-gradient(180deg, #b89868 0%, #a88a58 100%);
		border-top: 4px solid #d4b888;
		box-shadow: 0 -1px 0 #8a7040, 0 -6px 0 -2px rgba(200,170,120,0.3);
	}

	/* Wall top trim/molding */
	.wall-trim-top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(180deg, #d4b888 0%, #c4a878 50%, #b89868 100%);
		border-bottom: 1px solid #a08858;
		z-index: 4;
	}

	/* ── Digital Whiteboard ── */
	.whiteboard {
		position: absolute;
		top: 3%;
		left: 3%;
		width: 44%;
		height: 80%;
		z-index: 2;
	}
	.wb-frame {
		width: 100%;
		height: 100%;
		background: #e8e8e8;
		border: 4px solid #888;
		border-radius: 3px;
		position: relative;
		box-shadow: 2px 3px 10px rgba(0,0,0,0.3);
		overflow: hidden;
	}
	.wb-surface {
		position: absolute;
		inset: 0;
		bottom: 14px;
		background: linear-gradient(180deg, #f8f8fa 0%, #f0f0f4 100%);
		/* Subtle grid */
		background-image:
			linear-gradient(rgba(180,190,210,0.15) 1px, transparent 1px),
			linear-gradient(90deg, rgba(180,190,210,0.15) 1px, transparent 1px);
		background-size: 16px 16px;
	}
	/* Sticky notes */
	.sticky {
		position: absolute;
		width: 32px;
		height: 28px;
		font-family: 'Chakra Petch', monospace;
		font-size: 6px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 1px;
		box-shadow: 1px 2px 3px rgba(0,0,0,0.15);
		z-index: 2;
	}
	.sticky.s1 { top: 8%; left: 6%; background: #fff176; color: #5d4037; transform: rotate(-3deg); }
	.sticky.s2 { top: 6%; left: 28%; background: #81d4fa; color: #1a237e; transform: rotate(2deg); }
	.sticky.s3 { top: 10%; right: 28%; background: #a5d6a7; color: #1b5e20; transform: rotate(-1deg); }
	.sticky.s4 { top: 7%; right: 8%; background: #ffab91; color: #bf360c; transform: rotate(3deg); }
	/* Marker strokes */
	.wb-line {
		position: absolute;
		border-radius: 2px;
		z-index: 1;
	}
	.wb-line.wl1 { top: 38%; left: 10%; width: 35%; height: 2px; background: #e53935; transform: rotate(-2deg); }
	.wb-line.wl2 { top: 50%; left: 8%; width: 40%; height: 2px; background: #1e88e5; transform: rotate(1deg); }
	.wb-line.wl3 { top: 62%; left: 12%; width: 30%; height: 2px; background: #43a047; }
	.wb-line.wl4 { top: 42%; left: 55%; width: 25%; height: 2px; background: #e53935; transform: rotate(90deg); transform-origin: left; }
	/* Flow arrows */
	.wb-arrow {
		position: absolute;
		width: 0; height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 8px solid #1e88e5;
		z-index: 1;
	}
	.wb-arrow.wa1 { top: 34%; left: 48%; transform: rotate(-90deg); }
	.wb-arrow.wa2 { top: 56%; left: 48%; transform: rotate(-90deg); }
	/* Diagram boxes */
	.wb-box {
		position: absolute;
		border: 2px solid;
		border-radius: 3px;
		z-index: 1;
	}
	.wb-box.wb1 { top: 32%; right: 12%; width: 28%; height: 14%; border-color: #1e88e5; }
	.wb-box.wb2 { top: 50%; right: 18%; width: 22%; height: 12%; border-color: #43a047; }
	.wb-box.wb3 { top: 68%; right: 10%; width: 30%; height: 14%; border-color: #e53935; }
	/* Bullet dots */
	.wb-dot {
		position: absolute;
		width: 4px; height: 4px;
		border-radius: 50%;
		background: #333;
		z-index: 1;
	}
	.wb-dot.wd1 { top: 39%; left: 8%; }
	.wb-dot.wd2 { top: 51%; left: 6%; }
	.wb-dot.wd3 { top: 63%; left: 10%; }
	/* Marker tray at bottom */
	.wb-tray {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 14px;
		background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%);
		border-top: 1px solid #888;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 0 10px;
	}
	.wb-marker {
		width: 18px;
		height: 5px;
		border-radius: 2px;
		box-shadow: 0 1px 2px rgba(0,0,0,0.2);
	}
	.wb-marker.m-red { background: #e53935; }
	.wb-marker.m-blue { background: #1e88e5; }
	.wb-marker.m-green { background: #43a047; }
	.wb-marker.m-black { background: #333; }
	.wb-eraser {
		width: 20px;
		height: 8px;
		background: #f5f5f5;
		border: 1px solid #bbb;
		border-radius: 2px;
	}

	/* ── Window ── */
	.window {
		position: absolute;
		top: 3%;
		right: 3%;
		width: 44%;
		height: 80%;
		z-index: 2;
	}
	.window-frame {
		width: 100%;
		height: 100%;
		background: #7a6540;
		border: 4px solid #6b5530;
		border-radius: 2px;
		position: relative;
		overflow: hidden;
		box-shadow: inset 0 0 12px rgba(0,0,0,0.2), 2px 3px 8px rgba(0,0,0,0.2);
	}
	.window-pane {
		position: absolute;
		top: 4px;
		bottom: 4px;
		overflow: hidden;
	}
	.window-pane.left { left: 4px; right: 52%; }
	.window-pane.right { left: 52%; right: 4px; }
	.window-sky {
		width: 100%;
		height: 100%;
		background: linear-gradient(180deg,
			#87ceeb 0%,
			#a8dce8 35%,
			#b8e8d0 55%,
			#90c87a 70%,
			#70b060 85%,
			#5a9a48 100%
		);
		position: relative;
	}
	/* Miles: warm sunset city sky */
	.window-sky.miles {
		background: linear-gradient(180deg,
			#f0a050 0%,
			#e8c070 20%,
			#d0d8a0 40%,
			#a8c8a0 55%,
			#80b868 70%,
			#60a048 85%,
			#4a8a38 100%
		);
	}
	/* Building skyline silhouettes */
	.skyline {
		position: absolute;
		bottom: 40%;
		left: 0;
		right: 0;
		height: 35%;
	}
	.building {
		position: absolute;
		bottom: 0;
		background: rgba(160, 150, 130, 0.6);
		border-radius: 1px 1px 0 0;
	}
	.building::before {
		content: '';
		position: absolute;
		inset: 2px;
		background:
			repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px),
			repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px);
	}
	/* Left pane buildings */
	.building.b1 { left: 2%; width: 14%; height: 45%; background: rgba(140,130,110,0.65); }
	.building.b2 { left: 14%; width: 10%; height: 70%; background: rgba(150,140,120,0.6); }
	.building.b3 { left: 22%; width: 16%; height: 55%; background: rgba(130,125,105,0.6); }
	.building.b4 { left: 36%; width: 12%; height: 85%; background: rgba(145,135,115,0.65); }
	.building.b5 { left: 46%; width: 14%; height: 40%; background: rgba(155,145,125,0.55); }
	.building.b6 { left: 58%; width: 10%; height: 60%; background: rgba(140,130,110,0.6); }
	.building.b7 { left: 66%; width: 18%; height: 50%; background: rgba(135,128,108,0.6); }
	.building.b8 { left: 82%; width: 16%; height: 65%; background: rgba(150,140,120,0.6); }
	/* Right pane buildings */
	.building.b9 { left: 4%; width: 16%; height: 60%; background: rgba(145,135,115,0.6); }
	.building.b10 { left: 18%; width: 12%; height: 80%; background: rgba(140,130,110,0.65); }
	.building.b11 { left: 28%; width: 18%; height: 45%; background: rgba(150,140,120,0.55); }
	.building.b12 { left: 44%; width: 14%; height: 70%; background: rgba(135,128,108,0.6); }
	.building.b13 { left: 56%; width: 20%; height: 55%; background: rgba(145,135,115,0.6); }
	.building.b14 { left: 74%; width: 22%; height: 50%; background: rgba(140,130,110,0.6); }
	/* Tree line in front of buildings */
	.trees-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 42%;
		background:
			radial-gradient(ellipse 12px 14px at 10% 60%, #5a9a3a 0%, transparent 70%),
			radial-gradient(ellipse 14px 16px at 25% 55%, #4a8a2a 0%, transparent 70%),
			radial-gradient(ellipse 10px 12px at 40% 62%, #5aa03a 0%, transparent 70%),
			radial-gradient(ellipse 16px 14px at 55% 58%, #4a8828 0%, transparent 70%),
			radial-gradient(ellipse 12px 15px at 70% 60%, #58983a 0%, transparent 70%),
			radial-gradient(ellipse 14px 13px at 85% 56%, #4a9030 0%, transparent 70%),
			linear-gradient(180deg, transparent 40%, #4a8a2a 60%, #3a7a20 100%);
	}

	/* ── PMO: Mountain landscape ── */
	.window-sky.pmo {
		background: linear-gradient(180deg,
			#6ba3d6 0%,
			#8cc4e8 30%,
			#b0daf0 50%,
			#d4eef8 60%,
			#7aaa5a 72%,
			#5a9040 85%,
			#4a8030 100%
		);
	}
	.mountains {
		position: absolute;
		bottom: 30%;
		left: 0;
		right: 0;
		height: 50%;
	}
	.mountain {
		position: absolute;
		bottom: 0;
		width: 0; height: 0;
		border-style: solid;
	}
	.mountain.m1 {
		left: 5%;
		border-width: 0 30px 50px 35px;
		border-color: transparent transparent #7a8a70 transparent;
	}
	.mountain.m1::after {
		content: '';
		position: absolute;
		top: -2px; left: -8px;
		border-width: 0 10px 14px 12px;
		border-style: solid;
		border-color: transparent transparent #e8e8f0 transparent;
	}
	.mountain.m2 {
		left: 25%;
		border-width: 0 40px 70px 45px;
		border-color: transparent transparent #6a7a60 transparent;
	}
	.mountain.m2::after {
		content: '';
		position: absolute;
		top: -2px; left: -12px;
		border-width: 0 14px 18px 16px;
		border-style: solid;
		border-color: transparent transparent #dde0e8 transparent;
	}
	.mountain.m3 {
		right: 5%;
		border-width: 0 35px 55px 30px;
		border-color: transparent transparent #8a9a78 transparent;
	}
	.mountain.m3::after {
		content: '';
		position: absolute;
		top: -2px; left: -10px;
		border-width: 0 12px 15px 10px;
		border-style: solid;
		border-color: transparent transparent #e0e4ec transparent;
	}
	.mountain.m4 {
		left: 10%;
		border-width: 0 35px 60px 40px;
		border-color: transparent transparent #6a7860 transparent;
	}
	.mountain.m4::after {
		content: '';
		position: absolute;
		top: -2px; left: -10px;
		border-width: 0 12px 16px 14px;
		border-style: solid;
		border-color: transparent transparent #dde0e8 transparent;
	}
	.mountain.m5 {
		right: 10%;
		border-width: 0 30px 48px 35px;
		border-color: transparent transparent #7a8870 transparent;
	}
	.mountain.m5::after {
		content: '';
		position: absolute;
		top: -2px; left: -8px;
		border-width: 0 10px 13px 11px;
		border-style: solid;
		border-color: transparent transparent #e2e6ee transparent;
	}
	.lake {
		position: absolute;
		bottom: 14%;
		left: 10%;
		right: 10%;
		height: 18%;
		background: linear-gradient(180deg,
			#6aaccf 0%,
			#5a9abf 40%,
			#4a8aaf 100%
		);
		border-radius: 50% 50% 40% 40%;
		opacity: 0.7;
	}
	.pine-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 35%;
		background:
			/* Pine tree silhouettes using triangles */
			conic-gradient(from 210deg at 8% 65%, #2d5a20 0deg, transparent 40deg),
			conic-gradient(from 210deg at 18% 60%, #3a6a2a 0deg, transparent 35deg),
			conic-gradient(from 210deg at 30% 68%, #2a5518 0deg, transparent 38deg),
			conic-gradient(from 210deg at 42% 62%, #356528 0deg, transparent 36deg),
			conic-gradient(from 210deg at 55% 66%, #2d5a20 0deg, transparent 40deg),
			conic-gradient(from 210deg at 68% 60%, #3a6a2a 0deg, transparent 34deg),
			conic-gradient(from 210deg at 80% 64%, #2a5518 0deg, transparent 38deg),
			conic-gradient(from 210deg at 92% 62%, #356528 0deg, transparent 36deg),
			linear-gradient(180deg, transparent 50%, #3a6a2a 70%, #2a5518 100%);
	}

	.window-divider-v {
		position: absolute;
		top: 0; bottom: 0;
		left: 50%; width: 5px;
		transform: translateX(-50%);
		background: #6b5530;
		z-index: 1;
	}
	.window-divider-h {
		position: absolute;
		left: 0; right: 0;
		top: 50%; height: 4px;
		transform: translateY(-50%);
		background: #6b5530;
		z-index: 1;
	}

	/* ── Bookshelves (wall-mounted with brackets) ── */
	.bookshelf {
		position: absolute;
		height: 38px;
		z-index: 3;
	}
	.bookshelf.left { bottom: 22%; left: 4%; width: 22%; }
	.bookshelf.right { bottom: 22%; right: 5%; width: 18%; }
	.shelf-board {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 5px;
		background: linear-gradient(180deg, #8a7050 0%, #6b5540 100%);
		border-radius: 1px;
		box-shadow: 0 3px 6px rgba(0,0,0,0.3);
		z-index: 1;
	}
	.shelf-bracket {
		position: absolute;
		bottom: -10px;
		width: 4px;
		height: 12px;
		background: #5a4530;
		border-radius: 0 0 1px 1px;
		z-index: 0;
	}
	.shelf-bracket.bl { left: 15%; }
	.shelf-bracket.br { right: 15%; }
	.book {
		position: absolute;
		bottom: 5px;
		border-radius: 1px 1px 0 0;
		z-index: 2;
	}
	/* Left shelf books */
	.bookshelf.left .book.b1 { left: 4%; width: 8px; height: 22px; background: #c62828; }
	.bookshelf.left .book.b2 { left: 16%; width: 10px; height: 24px; background: #1565c0; }
	.bookshelf.left .book.b3 { left: 30%; width: 7px; height: 19px; background: #2e7d32; }
	.bookshelf.left .book.b4 { left: 42%; width: 11px; height: 26px; background: #e65100; }
	.bookshelf.left .book.b5 { left: 60%; width: 9px; height: 20px; background: #6a1b9a; }
	.bookshelf.left .book.b6 { left: 76%; width: 8px; height: 23px; background: #00695c; }
	/* Right shelf books */
	.bookshelf.right .book.b1 { left: 6%; width: 9px; height: 22px; background: #ad1457; }
	.bookshelf.right .book.b2 { left: 24%; width: 11px; height: 25px; background: #0277bd; }
	.bookshelf.right .book.b3 { left: 44%; width: 8px; height: 19px; background: #ef6c00; }
	.bookshelf.right .book.b4 { left: 60%; width: 10px; height: 24px; background: #283593; }
	.bookshelf.right .book.b5 { left: 78%; width: 7px; height: 21px; background: #558b2f; }

	/* ── Circuit Board Pattern ── */
	.circuit-panel {
		position: absolute;
		bottom: 0%;
		left: 5%;
		right: 5%;
		height: 55%;
		z-index: 1;
	}
	.circuit-line {
		position: absolute;
		background: rgba(140, 120, 80, 0.4);
	}
	/* Horizontal traces */
	.circuit-line.ch1 { top: 20%; left: 5%; width: 90%; height: 2px; }
	.circuit-line.ch2 { top: 40%; left: 10%; width: 80%; height: 2px; }
	.circuit-line.ch3 { top: 60%; left: 3%; width: 94%; height: 2px; }
	.circuit-line.ch4 { top: 80%; left: 8%; width: 84%; height: 2px; }
	/* Vertical traces */
	.circuit-line.cv1 { top: 10%; left: 15%; width: 2px; height: 80%; }
	.circuit-line.cv2 { top: 15%; left: 35%; width: 2px; height: 70%; }
	.circuit-line.cv3 { top: 5%; left: 50%; width: 2px; height: 90%; }
	.circuit-line.cv4 { top: 12%; left: 68%; width: 2px; height: 75%; }
	.circuit-line.cv5 { top: 8%; left: 85%; width: 2px; height: 82%; }
	/* Solder dots at intersections */
	.circuit-dot {
		position: absolute;
		width: 6px; height: 6px;
		border-radius: 50%;
		background: rgba(160, 140, 90, 0.55);
		border: 1px solid rgba(140, 120, 70, 0.4);
	}
	.circuit-dot.cd1 { top: 18%; left: 14%; }
	.circuit-dot.cd2 { top: 38%; left: 34%; }
	.circuit-dot.cd3 { top: 58%; left: 49%; }
	.circuit-dot.cd4 { top: 78%; left: 67%; }
	.circuit-dot.cd5 { top: 18%; left: 49%; }
	.circuit-dot.cd6 { top: 58%; left: 14%; }
	.circuit-dot.cd7 { top: 38%; left: 84%; }
	.circuit-dot.cd8 { top: 78%; left: 34%; }
	/* IC chips */
	.circuit-chip {
		position: absolute;
		width: 16px;
		height: 10px;
		background: rgba(100, 85, 55, 0.5);
		border: 1px solid rgba(120, 100, 65, 0.45);
		border-radius: 1px;
	}
	.circuit-chip.cp1 { top: 30%; left: 42%; }
	.circuit-chip.cp2 { top: 65%; left: 72%; }

	/* ═══ FLOOR (warm light wood) ═══ */
	/* Floor hidden — replaced by background image */
	.floor {
		display: none;
	}
	.floor-plank {
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: rgba(160, 130, 80, 0.35);
	}
	.floor-plank.p1 { top: 10%; }
	.floor-plank.p2 { top: 25%; }
	.floor-plank.p3 { top: 40%; }
	.floor-plank.p4 { top: 55%; }
	.floor-plank.p5 { top: 70%; }
	.floor-plank.p6 { top: 85%; }
	.floor::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			repeating-linear-gradient(90deg, transparent 0px, transparent 55px, rgba(160,130,80,0.15) 55px, rgba(160,130,80,0.15) 56px);
	}
	/* Subtle shadow under desk */
	.floor::after {
		content: '';
		position: absolute;
		top: 0;
		left: 10%;
		right: 10%;
		height: 40px;
		background: radial-gradient(ellipse 100% 100%, rgba(0,0,0,0.12) 0%, transparent 70%);
	}

	/* ═══ DESK AREA (anchor for characters + desk) ═══ */
	.desk-area {
		position: absolute;
		left: 6%;
		right: 6%;
		height: 120px;
		z-index: 5;
	}
	/* Individual desk per agent */
	.ind-desk {
		position: absolute;
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 90px;
		height: 48px;
		z-index: 8;
	}
	.ind-desk-top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(180deg, #c8cdd5 0%, #b8bfc9 100%);
		border-radius: 3px 3px 0 0;
		border: 1px solid rgba(100, 120, 150, 0.25);
		border-bottom: none;
		box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
	}
	.ind-desk-front {
		position: absolute;
		top: 6px;
		left: 2px;
		right: 2px;
		height: 30px;
		background: linear-gradient(180deg, #b0b8c4 0%, #9aa4b0 100%);
		border-radius: 0 0 4px 4px;
		border: 1px solid rgba(180, 190, 200, 0.4);
		border-top: none;
	}
	.ind-desk-leg {
		position: absolute;
		bottom: 0;
		width: 4px;
		height: 12px;
		background: #9aa4b0;
		border-radius: 0 0 2px 2px;
	}
	.ind-desk-leg.idl-l { left: 8px; }
	.ind-desk-leg.idl-r { right: 8px; }

	.desk-surface {
		display: none;
	}
	/* Subtle desk edge highlight */
	.desk-surface::before {
		content: '';
		position: absolute;
		top: 2px;
		left: 10%;
		right: 10%;
		height: 2px;
		background: rgba(255,255,255,0.2);
		border-radius: 50%;
	}
	.desk-front-panel {
		display: none;
	}
	/* Wood grain on front panel */
	.desk-front-panel::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background:
			repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 5px);
	}
	.desk-leg {
		display: none;
	}
	.desk-leg.dl { left: 12%; }
	.desk-leg.dr { right: 12%; }

	/* ── Name pills on desk front ── */
	.name-pill {
		position: absolute;
		bottom: -22px;
		left: 50%;
		transform: translateX(-50%);
		background: color-mix(in srgb, var(--pill-color, #4caf50) 70%, #1a1a2e 30%);
		color: #fff;
		font-family: 'Chakra Petch', monospace;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.5px;
		padding: 2px 10px;
		border-radius: 10px;
		white-space: nowrap;
		box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
		z-index: 12;
		text-shadow: 0 1px 1px rgba(0,0,0,0.3);
	}

	/* ── Coffee mug ── */
	.coffee-mug {
		display: none;
	}
	.mug-body {
		width: 10px;
		height: 10px;
		background: linear-gradient(180deg, #e8e0d0 0%, #d0c8b8 100%);
		border-radius: 1px 1px 3px 3px;
		border: 1px solid #b0a890;
	}
	.mug-handle {
		position: absolute;
		top: 2px;
		right: -5px;
		width: 5px;
		height: 6px;
		border: 2px solid #d0c8b8;
		border-left: none;
		border-radius: 0 4px 4px 0;
	}
	.mug-steam {
		position: absolute;
		width: 2px;
		background: rgba(255,255,255,0.4);
		border-radius: 2px;
		animation: steam 2s ease-in-out infinite;
	}
	.mug-steam.s1 { top: -8px; left: 2px; height: 6px; animation-delay: 0s; }
	.mug-steam.s2 { top: -10px; left: 6px; height: 8px; animation-delay: 0.5s; }
	@keyframes steam {
		0% { opacity: 0.2; transform: translateY(0) scaleX(1); }
		50% { opacity: 0.5; transform: translateY(-4px) scaleX(1.3); }
		100% { opacity: 0; transform: translateY(-8px) scaleX(0.8); }
	}

	/* Plants hidden — replaced by background image */
	.plant {
		display: none;
	}
	.plant.left { left: 1%; }
	.plant.right { right: 1%; }
	.pot {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 28px;
		height: 26px;
		background: linear-gradient(180deg, #c0683a 0%, #a05228 50%, #8a4420 100%);
		border-radius: 3px 3px 6px 6px;
		border: 1px solid #804018;
		clip-path: polygon(5% 0%, 95% 0%, 85% 100%, 15% 100%);
	}
	.pot::after {
		content: '';
		position: absolute;
		top: -4px;
		left: -3px;
		right: -3px;
		height: 6px;
		background: #a05228;
		border-radius: 3px;
		border: 1px solid #804018;
	}
	.trunk {
		position: absolute;
		bottom: 22px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 50px;
		background: linear-gradient(180deg, #6d4c35 0%, #8b6245 50%, #7a5438 100%);
		border-radius: 3px;
	}
	.foliage {
		position: absolute;
		border-radius: 50%;
	}
	.foliage.f1 {
		bottom: 60px;
		left: 50%;
		transform: translateX(-50%);
		width: 44px;
		height: 40px;
		background: radial-gradient(ellipse, #5cb85c 10%, #3d8b3d 50%, #2d7a2d 90%);
	}
	.foliage.f2 {
		bottom: 80px;
		left: 50%;
		transform: translateX(-65%);
		width: 34px;
		height: 32px;
		background: radial-gradient(ellipse, #6cc86c 10%, #4a9a4a 60%);
	}
	.foliage.f3 {
		bottom: 78px;
		left: 50%;
		transform: translateX(-15%);
		width: 30px;
		height: 28px;
		background: radial-gradient(ellipse, #5ab85a 10%, #3a8a3a 60%);
	}
	.foliage.f4 {
		bottom: 96px;
		left: 50%;
		transform: translateX(-45%);
		width: 26px;
		height: 24px;
		background: radial-gradient(ellipse, #68c468 10%, #48a048 60%);
	}

	/* ═══ WORKSTATION WRAP ═══ */
	.workstation-wrap {
		position: absolute;
		bottom: 30px;
		width: 120px;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: all 0.5s ease;
		z-index: 6;
		transform: translateX(-50%) scale(var(--agent-scale, 1.25));
		transform-origin: bottom center;
	}
	/* Hide default PixelCharacter labels — names are on desk pills, status below desk */
	.workstation-wrap :global(.ws-label-top) {
		display: none !important;
	}
	.workstation-wrap :global(.ws-label-bottom) {
		bottom: -42px;
		z-index: 20;
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
	.workstation-wrap.working::before { opacity: 0.25; }
	.workstation-wrap.thinking::before { opacity: 0.15; background: #b388ff; }

	/* ── Monitor (larger desktop style) ── */
	.monitor {
		position: absolute;
		bottom: 4px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9;
	}
	.monitor-screen {
		width: 40px;
		height: 28px;
		background: #1a1f2e;
		border: 3px solid #c0c5cc;
		border-radius: 3px 3px 0 0;
		overflow: hidden;
		position: relative;
		box-shadow: 0 0 8px rgba(0,0,0,0.4);
	}
	.monitor-stand {
		width: 10px;
		height: 7px;
		background: #b0b5bc;
		margin: 0 auto;
	}
	.monitor-base {
		width: 22px;
		height: 3px;
		background: #c0c5cc;
		border-radius: 1px;
		margin: 0 auto;
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
	/* Idle: screensaver glow */
	.workstation-wrap.idle .screen-glow {
		background: linear-gradient(135deg, rgba(20,35,60,0.3) 0%, rgba(15,25,50,0.1) 50%, rgba(30,20,55,0.2) 100%);
		background-size: 300% 300%;
		animation: screensaver 10s ease-in-out infinite;
	}
	@keyframes screensaver {
		0%, 100% { background-position: 0% 0%; }
		33% { background-position: 100% 50%; }
		66% { background-position: 50% 100%; }
	}
	.screen-lines {
		position: absolute; inset: 3px;
		display: flex; flex-direction: column;
		gap: 2px; padding: 1px;
	}
	.screen-lines :global(.screen-line) { height: 2px; border-radius: 1px; opacity: 0.12; }
	.workstation-wrap.working .screen-lines :global(.screen-line) { animation: typeLine 1s ease-in-out infinite; opacity: 0.7; }
	.workstation-wrap.thinking .screen-lines :global(.screen-line) { animation: typeLine 3s ease-in-out infinite; opacity: 0.4; }
	@keyframes typeLine { 0% { width: 0; } 30% { width: 100%; } 60% { width: 40%; } 100% { width: 80%; } }

	/* Monitor glow on desk */
	.workstation-wrap.working .monitor::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 14px;
		border-radius: 50%;
		background: var(--agent-color);
		opacity: 0.2;
		filter: blur(8px);
		animation: deskGlow 1.5s ease-in-out infinite;
	}
	.workstation-wrap.thinking .monitor::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px;
		height: 14px;
		border-radius: 50%;
		background: #b388ff;
		opacity: 0.15;
		filter: blur(8px);
		animation: deskGlow 2.5s ease-in-out infinite;
	}
	@keyframes deskGlow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.25; } }

	/* Work pulse */
	.work-pulse {
		position: absolute;
		bottom: 42px;
		left: 50%;
		transform: translateX(-50%);
		width: 50px; height: 50px;
		border-radius: 50%;
		border: 1px solid var(--agent-color);
		opacity: 0;
		z-index: 0;
		pointer-events: none;
	}
	.workstation-wrap.working .work-pulse { animation: pulseRing 2s ease-out infinite; }
	@keyframes pulseRing { 0% { opacity: 0.5; transform: translateX(-50%) scale(0.6); } 100% { opacity: 0; transform: translateX(-50%) scale(2); } }

	/* ═══ PAPER TOSS (delegation animation) ═══ */
	.paper-toss {
		position: absolute;
		height: 60px;
		pointer-events: none;
		z-index: 50;
	}
	.paper-toss.cross-row {
		height: auto; /* height set by top + bottom from inline style */
	}
	.paper {
		position: absolute;
		bottom: 0;
		left: 0%;
		width: 28px;
		height: 34px;
		background: linear-gradient(180deg, color-mix(in srgb, var(--paper-accent, #aaa) 15%, #f5f0e8) 0%, color-mix(in srgb, var(--paper-accent, #aaa) 20%, #e8e0d0) 100%);
		border: 1.5px solid var(--paper-accent, #c0b8a0);
		border-radius: 2px;
		opacity: 0;
		animation: flyRight 1.8s ease-in-out infinite;
		transform-origin: center;
		box-shadow: 2px 3px 8px rgba(0,0,0,0.35);
	}
	.going-left .paper { animation-name: flyLeft; }
	.cross-row .paper {
		bottom: auto;
		top: 0;
		animation-name: flyCrossRight;
	}
	.cross-row.going-left .paper {
		animation-name: flyCrossLeft;
	}
	.paper.p2 { animation-delay: 0.5s; }
	.paper.p3 { animation-delay: 1.0s; }

	/* Text lines on paper */
	.paper::before {
		content: '';
		position: absolute;
		top: 5px;
		left: 3px;
		right: 3px;
		height: 10px;
		background: repeating-linear-gradient(
			180deg,
			var(--paper-accent, #aaa) 0px,
			var(--paper-accent, #aaa) 1px,
			transparent 1px,
			transparent 3px
		);
		opacity: 0.6;
		border-radius: 0.5px;
	}
	/* Folded corner */
	.paper-fold {
		position: absolute;
		top: 0;
		right: 0;
		width: 6px;
		height: 6px;
		background: var(--paper-accent, #8a8070);
		clip-path: polygon(100% 0, 0 100%, 100% 100%);
	}

	/* Same-row: high arc that clears characters */
	@keyframes flyRight {
		0% { left: 0%; transform: translateY(0) rotate(-10deg) scale(0.8); opacity: 0; }
		8% { opacity: 1; }
		50% { left: 50%; transform: translateY(-120px) rotate(180deg) scale(1.1); opacity: 1; }
		92% { opacity: 0.7; }
		100% { left: 100%; transform: translateY(0) rotate(360deg) scale(0.8); opacity: 0; }
	}
	@keyframes flyLeft {
		0% { left: 100%; transform: translateY(0) rotate(10deg) scale(0.8); opacity: 0; }
		8% { opacity: 1; }
		50% { left: 50%; transform: translateY(-120px) rotate(-180deg) scale(1.1); opacity: 1; }
		92% { opacity: 0.7; }
		100% { left: 0%; transform: translateY(0) rotate(-360deg) scale(0.8); opacity: 0; }
	}
	/* Cross-row: diagonal descent using top % (container spans both rows) */
	@keyframes flyCrossRight {
		0% { left: 0%; top: 0%; transform: rotate(-5deg) scale(0.9); opacity: 0; }
		5% { opacity: 1; }
		40% { left: 40%; top: 35%; transform: rotate(90deg) scale(1); opacity: 1; }
		75% { left: 80%; top: 75%; transform: rotate(250deg) scale(1); opacity: 1; }
		95% { left: 98%; top: 95%; transform: rotate(340deg) scale(0.9); opacity: 0.8; }
		100% { left: 100%; top: 100%; transform: rotate(360deg) scale(0.85); opacity: 0; }
	}
	@keyframes flyCrossLeft {
		0% { left: 100%; top: 0%; transform: rotate(5deg) scale(0.9); opacity: 0; }
		5% { opacity: 1; }
		40% { left: 60%; top: 35%; transform: rotate(-90deg) scale(1); opacity: 1; }
		75% { left: 20%; top: 75%; transform: rotate(-250deg) scale(1); opacity: 1; }
		95% { left: 2%; top: 95%; transform: rotate(-340deg) scale(0.9); opacity: 0.8; }
		100% { left: 0%; top: 100%; transform: rotate(-360deg) scale(0.85); opacity: 0; }
	}
</style>
