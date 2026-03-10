<script lang="ts">
	import { T } from '@threlte/core';
	import { TEAMS, milesStatus, pmoStatus } from '$lib/stores';
	import type { AgentState, TeamStatus } from '$lib/types';
	import Workstation from './Workstation.svelte';

	interface Props {
		teamKey: string;
	}

	let { teamKey }: Props = $props();

	const team = $derived(TEAMS.find((t) => t.key === teamKey));
	const agentCount = $derived(team?.agents.length ?? 0);
	const teamStatus: TeamStatus = $derived(teamKey === 'miles' ? $milesStatus : $pmoStatus);

	// Calculate scene width based on agent count
	const sceneWidth = $derived(agentCount * 2.8 + 2);
	const leftEdge = $derived(-(sceneWidth / 2) - 0.5);
	const rightEdge = $derived((sceneWidth / 2) + 0.5);

	function getAgentState(agentId: string): AgentState {
		const status = teamStatus[agentId];
		return (status?.state as AgentState) ?? 'idle';
	}

	function getAgentActivity(agentId: string): string {
		return teamStatus[agentId]?.activity ?? '';
	}
</script>

<!-- Orthographic camera for 2D-like view -->
<T.OrthographicCamera
	makeDefault
	position={[0, 4, 8]}
	zoom={agentCount > 4 ? 48 : 60}
	near={0.1}
	far={100}
	oncreate={(ref) => ref.lookAt(0, 0.7, 0)}
/>

<!-- Lighting -->
<T.AmbientLight intensity={0.5} color="#c0d0e8" />
<T.DirectionalLight position={[5, 12, 8]} intensity={0.6} color="#e8f0ff" castShadow />
<T.DirectionalLight position={[-3, 6, -2]} intensity={0.2} color="#80a0c0" />
<!-- Subtle rim light from behind -->
<T.DirectionalLight position={[0, 4, -8]} intensity={0.15} color="#6080b0" />

<!-- ═══ FLOOR ═══ -->
<T.Mesh rotation.x={-Math.PI / 2} position.y={0} receiveShadow>
	<T.PlaneGeometry args={[sceneWidth + 4, 8]} />
	<T.MeshStandardMaterial color="#1a1f29" roughness={0.9} />
</T.Mesh>

<!-- Floor grid lines (subtle) -->
{#each Array.from({ length: Math.ceil(sceneWidth / 2) + 3 }) as _, i}
	{@const x = (i - Math.ceil(sceneWidth / 4) - 1) * 2}
	<T.Mesh rotation.x={-Math.PI / 2} position={[x, 0.001, 0]}>
		<T.PlaneGeometry args={[0.01, 8]} />
		<T.MeshBasicMaterial color="#252b35" transparent opacity={0.5} />
	</T.Mesh>
{/each}
<!-- Horizontal grid lines -->
{#each [-2, 0, 2] as z}
	<T.Mesh rotation.x={-Math.PI / 2} position={[0, 0.001, z]}>
		<T.PlaneGeometry args={[sceneWidth + 4, 0.01]} />
		<T.MeshBasicMaterial color="#252b35" transparent opacity={0.3} />
	</T.Mesh>
{/each}

<!-- Back wall -->
<T.Mesh position={[0, 1.5, -2.5]}>
	<T.PlaneGeometry args={[sceneWidth + 4, 3]} />
	<T.MeshStandardMaterial color="#13171e" roughness={0.95} />
</T.Mesh>
<!-- Wall baseboard -->
<T.Mesh position={[0, 0.04, -2.48]}>
	<T.BoxGeometry args={[sceneWidth + 4, 0.08, 0.02]} />
	<T.MeshStandardMaterial color="#1e2535" roughness={0.8} />
</T.Mesh>

<!-- ═══ CEILING STRIP LIGHTS ═══ -->
{#each Array.from({ length: Math.ceil(sceneWidth / 3) + 1 }) as _, i}
	{@const x = (i - Math.ceil(sceneWidth / 6)) * 3}
	<!-- Light fixture -->
	<T.Mesh position={[x, 2.95, 0]}>
		<T.BoxGeometry args={[1.2, 0.03, 0.15]} />
		<T.MeshStandardMaterial color="#ffffff" emissive="#c0d8ff" emissiveIntensity={0.3} transparent opacity={0.6} />
	</T.Mesh>
	<!-- Subtle downlight -->
	<T.PointLight position={[x, 2.8, 0]} color="#d0e0ff" intensity={0.15} distance={4} decay={2} />
{/each}

<!-- ═══ AMBIENT OBJECTS ═══ -->

<!-- Potted plants at the edges -->
<!-- Left plant -->
<T.Group position={[leftEdge, 0, -1.5]}>
	<!-- Pot -->
	<T.Mesh position.y={0.15}>
		<T.CylinderGeometry args={[0.18, 0.14, 0.3, 8]} />
		<T.MeshStandardMaterial color="#3d2e24" roughness={0.8} />
	</T.Mesh>
	<!-- Soil -->
	<T.Mesh position.y={0.28}>
		<T.CylinderGeometry args={[0.16, 0.16, 0.04, 8]} />
		<T.MeshStandardMaterial color="#2a1f15" roughness={1} />
	</T.Mesh>
	<!-- Leaves (stacked spheres) -->
	<T.Mesh position={[0, 0.55, 0]}>
		<T.SphereGeometry args={[0.2, 8, 6]} />
		<T.MeshStandardMaterial color="#1b4a28" roughness={0.8} />
	</T.Mesh>
	<T.Mesh position={[0.08, 0.7, 0.05]}>
		<T.SphereGeometry args={[0.15, 8, 6]} />
		<T.MeshStandardMaterial color="#236b35" roughness={0.8} />
	</T.Mesh>
	<T.Mesh position={[-0.06, 0.65, -0.06]}>
		<T.SphereGeometry args={[0.12, 8, 6]} />
		<T.MeshStandardMaterial color="#1a5a2a" roughness={0.8} />
	</T.Mesh>
</T.Group>

<!-- Right plant -->
<T.Group position={[rightEdge, 0, -1.5]}>
	<T.Mesh position.y={0.15}>
		<T.CylinderGeometry args={[0.18, 0.14, 0.3, 8]} />
		<T.MeshStandardMaterial color="#3d2e24" roughness={0.8} />
	</T.Mesh>
	<T.Mesh position.y={0.28}>
		<T.CylinderGeometry args={[0.16, 0.16, 0.04, 8]} />
		<T.MeshStandardMaterial color="#2a1f15" roughness={1} />
	</T.Mesh>
	<T.Mesh position={[0, 0.55, 0]}>
		<T.SphereGeometry args={[0.2, 8, 6]} />
		<T.MeshStandardMaterial color="#1b4a28" roughness={0.8} />
	</T.Mesh>
	<T.Mesh position={[-0.06, 0.68, 0.05]}>
		<T.SphereGeometry args={[0.14, 8, 6]} />
		<T.MeshStandardMaterial color="#236b35" roughness={0.8} />
	</T.Mesh>
</T.Group>

<!-- Whiteboard on back wall (center) -->
<T.Group position={[0, 1.8, -2.45]}>
	<!-- Board frame -->
	<T.Mesh>
		<T.BoxGeometry args={[2.2, 1.2, 0.04]} />
		<T.MeshStandardMaterial color="#2a3040" roughness={0.6} />
	</T.Mesh>
	<!-- Board surface -->
	<T.Mesh position.z={0.025}>
		<T.PlaneGeometry args={[2.0, 1.0]} />
		<T.MeshStandardMaterial color="#e8eaf0" roughness={0.4} />
	</T.Mesh>
	<!-- Tray -->
	<T.Mesh position={[0, -0.65, 0.06]}>
		<T.BoxGeometry args={[1.4, 0.04, 0.08]} />
		<T.MeshStandardMaterial color="#2a3040" roughness={0.6} />
	</T.Mesh>
	<!-- Marker dots on tray -->
	<T.Mesh position={[-0.3, -0.62, 0.1]}>
		<T.CylinderGeometry args={[0.02, 0.02, 0.08, 6]} />
		<T.MeshStandardMaterial color="#ff4444" />
	</T.Mesh>
	<T.Mesh position={[-0.15, -0.62, 0.1]}>
		<T.CylinderGeometry args={[0.02, 0.02, 0.08, 6]} />
		<T.MeshStandardMaterial color="#44aaff" />
	</T.Mesh>
	<T.Mesh position={[0, -0.62, 0.1]}>
		<T.CylinderGeometry args={[0.02, 0.02, 0.08, 6]} />
		<T.MeshStandardMaterial color="#44dd44" />
	</T.Mesh>
</T.Group>

<!-- Bookshelf on left wall area -->
{#if agentCount > 3}
	<T.Group position={[leftEdge + 0.3, 0, -2.2]}>
		<!-- Shelf frame -->
		<T.Mesh position.y={0.9}>
			<T.BoxGeometry args={[0.8, 1.8, 0.35]} />
			<T.MeshStandardMaterial color="#1e2535" roughness={0.8} />
		</T.Mesh>
		<!-- Shelves -->
		{#each [0.3, 0.7, 1.1, 1.5] as sy}
			<T.Mesh position={[0, sy, 0.02]}>
				<T.BoxGeometry args={[0.76, 0.03, 0.33]} />
				<T.MeshStandardMaterial color="#283040" roughness={0.7} />
			</T.Mesh>
		{/each}
		<!-- Books (colored blocks) -->
		<T.Mesh position={[-0.2, 0.48, 0.05]}>
			<T.BoxGeometry args={[0.08, 0.3, 0.2]} />
			<T.MeshStandardMaterial color="#b71c1c" />
		</T.Mesh>
		<T.Mesh position={[-0.08, 0.46, 0.05]}>
			<T.BoxGeometry args={[0.06, 0.26, 0.2]} />
			<T.MeshStandardMaterial color="#1565c0" />
		</T.Mesh>
		<T.Mesh position={[0.02, 0.48, 0.05]}>
			<T.BoxGeometry args={[0.07, 0.3, 0.2]} />
			<T.MeshStandardMaterial color="#2e7d32" />
		</T.Mesh>
		<T.Mesh position={[0.14, 0.45, 0.05]}>
			<T.BoxGeometry args={[0.1, 0.24, 0.2]} />
			<T.MeshStandardMaterial color="#e65100" />
		</T.Mesh>
		<T.Mesh position={[0.26, 0.47, 0.05]}>
			<T.BoxGeometry args={[0.06, 0.28, 0.2]} />
			<T.MeshStandardMaterial color="#6a1b9a" />
		</T.Mesh>
		<!-- Books on second shelf -->
		<T.Mesh position={[-0.15, 0.88, 0.05]}>
			<T.BoxGeometry args={[0.08, 0.3, 0.2]} />
			<T.MeshStandardMaterial color="#01579b" />
		</T.Mesh>
		<T.Mesh position={[0.0, 0.86, 0.05]}>
			<T.BoxGeometry args={[0.1, 0.26, 0.2]} />
			<T.MeshStandardMaterial color="#bf360c" />
		</T.Mesh>
		<T.Mesh position={[0.15, 0.87, 0.05]}>
			<T.BoxGeometry args={[0.07, 0.28, 0.2]} />
			<T.MeshStandardMaterial color="#004d40" />
		</T.Mesh>
	</T.Group>
{/if}

<!-- Water cooler on right side -->
<T.Group position={[rightEdge - 0.3, 0, -2.0]}>
	<!-- Base -->
	<T.Mesh position.y={0.4}>
		<T.BoxGeometry args={[0.35, 0.8, 0.3]} />
		<T.MeshStandardMaterial color="#c0c8d0" roughness={0.4} metalness={0.2} />
	</T.Mesh>
	<!-- Water bottle -->
	<T.Mesh position.y={1.05}>
		<T.CylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
		<T.MeshStandardMaterial color="#b3e5fc" transparent opacity={0.5} roughness={0.1} />
	</T.Mesh>
	<!-- Cap -->
	<T.Mesh position.y={1.32}>
		<T.CylinderGeometry args={[0.08, 0.12, 0.05, 8]} />
		<T.MeshStandardMaterial color="#90caf9" roughness={0.3} />
	</T.Mesh>
	<!-- Tap -->
	<T.Mesh position={[0, 0.55, 0.16]}>
		<T.BoxGeometry args={[0.04, 0.04, 0.04]} />
		<T.MeshStandardMaterial color="#e0e0e0" metalness={0.6} />
	</T.Mesh>
</T.Group>

<!-- Coffee mug on a random desk (adds life) -->
{#if agentCount > 2}
	{@const mugX = (2 - (agentCount - 1) / 2) * 2.8}
	<T.Group position={[mugX + 0.5, 0.67, 0.15]}>
		<T.Mesh>
			<T.CylinderGeometry args={[0.04, 0.035, 0.08, 8]} />
			<T.MeshStandardMaterial color="#e0e0e0" roughness={0.5} />
		</T.Mesh>
		<!-- Handle -->
		<T.Mesh position={[0.05, 0, 0]} rotation.z={Math.PI / 2}>
			<T.TorusGeometry args={[0.025, 0.008, 4, 8, Math.PI]} />
			<T.MeshStandardMaterial color="#e0e0e0" roughness={0.5} />
		</T.Mesh>
	</T.Group>
{/if}

<!-- ═══ WORKSTATIONS ═══ -->
{#if team}
	{#each team.agents as agent, idx}
		{@const xPos = (idx - (agentCount - 1) / 2) * 2.8}
		<Workstation
			{agent}
			position={[xPos, 0, 0]}
			state={getAgentState(agent.id)}
			activity={getAgentActivity(agent.id)}
		/>
	{/each}
{/if}
