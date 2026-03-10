<script lang="ts">
	import { T } from '@threlte/core';
	import { TEAMS } from '$lib/stores';

	interface Props {
		teamKey: string;
	}

	let { teamKey }: Props = $props();

	const team = $derived(TEAMS.find((t) => t.key === teamKey));
	const agentCount = $derived(team?.agents.length ?? 0);
</script>

<!-- Orthographic camera (2D look) -->
<T.OrthographicCamera
	makeDefault
	position={[0, 5, 10]}
	zoom={40}
	near={0.1}
	far={100}
>
	<T.DirectionalLight position={[5, 10, 5]} intensity={0.6} />
</T.OrthographicCamera>

<!-- Ambient light -->
<T.AmbientLight intensity={0.4} />

<!-- Floor plane -->
<T.Mesh rotation.x={-Math.PI / 2} position.y={0}>
	<T.PlaneGeometry args={[agentCount * 4 + 4, 6]} />
	<T.MeshStandardMaterial color="#1a1f29" />
</T.Mesh>

<!-- Placeholder desk per agent -->
{#if team}
	{#each team.agents as agent, idx}
		{@const xPos = (idx - (agentCount - 1) / 2) * 3.5}
		<!-- Desk -->
		<T.Mesh position={[xPos, 0.6, 0]}>
			<T.BoxGeometry args={[2, 0.1, 1]} />
			<T.MeshStandardMaterial color="#2d3a5c" />
		</T.Mesh>
		<!-- Desk legs -->
		<T.Mesh position={[xPos - 0.8, 0.3, 0]}>
			<T.BoxGeometry args={[0.08, 0.6, 0.08]} />
			<T.MeshStandardMaterial color="#21262d" />
		</T.Mesh>
		<T.Mesh position={[xPos + 0.8, 0.3, 0]}>
			<T.BoxGeometry args={[0.08, 0.6, 0.08]} />
			<T.MeshStandardMaterial color="#21262d" />
		</T.Mesh>
		<!-- Agent body placeholder (capsule) -->
		<T.Mesh position={[xPos, 1.2, 0.6]}>
			<T.CapsuleGeometry args={[0.2, 0.5, 4, 8]} />
			<T.MeshStandardMaterial color={agent.jacket} />
		</T.Mesh>
		<!-- Head -->
		<T.Mesh position={[xPos, 1.8, 0.6]}>
			<T.SphereGeometry args={[0.22, 8, 8]} />
			<T.MeshStandardMaterial color={agent.skinColor} />
		</T.Mesh>
		<!-- Name label (will be HTML overlay later) -->
	{/each}
{/if}
