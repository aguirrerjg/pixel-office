<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import type { AgentDef, AgentState } from '$lib/types';
	import PixelCharacter from './PixelCharacter.svelte';

	interface Props {
		agent: AgentDef;
		position?: [number, number, number];
		state?: AgentState;
		activity?: string;
	}

	let { agent, position = [0, 0, 0], state = 'idle', activity = '' }: Props = $props();

	// Screen glow intensity based on state
	const screenEmissive = $derived(
		state === 'working' ? 1.2 :
		state === 'thinking' ? 0.8 :
		0.3
	);

	const screenColor = $derived(
		state === 'working' ? agent.color :
		state === 'thinking' ? '#b388ff' :
		'#1a3050'
	);
</script>

<T.Group position={position}>
	<!-- ═══ DESK ═══ -->
	<!-- Desktop surface -->
	<T.Mesh position={[0, 0.6, 0]} castShadow receiveShadow>
		<T.BoxGeometry args={[1.8, 0.06, 0.8]} />
		<T.MeshStandardMaterial color="#2d3a5c" roughness={0.7} />
	</T.Mesh>
	<!-- Front edge highlight -->
	<T.Mesh position={[0, 0.6, 0.4]}>
		<T.BoxGeometry args={[1.8, 0.06, 0.02]} />
		<T.MeshStandardMaterial color="#3a4a6c" roughness={0.6} />
	</T.Mesh>
	<!-- Desk legs -->
	<T.Mesh position={[-0.75, 0.3, 0.3]}>
		<T.BoxGeometry args={[0.06, 0.6, 0.06]} />
		<T.MeshStandardMaterial color="#21262d" />
	</T.Mesh>
	<T.Mesh position={[0.75, 0.3, 0.3]}>
		<T.BoxGeometry args={[0.06, 0.6, 0.06]} />
		<T.MeshStandardMaterial color="#21262d" />
	</T.Mesh>
	<T.Mesh position={[-0.75, 0.3, -0.3]}>
		<T.BoxGeometry args={[0.06, 0.6, 0.06]} />
		<T.MeshStandardMaterial color="#21262d" />
	</T.Mesh>
	<T.Mesh position={[0.75, 0.3, -0.3]}>
		<T.BoxGeometry args={[0.06, 0.6, 0.06]} />
		<T.MeshStandardMaterial color="#21262d" />
	</T.Mesh>

	<!-- ═══ CHAIR ═══ -->
	<!-- Seat -->
	<T.Mesh position={[0, 0.45, 0.7]}>
		<T.BoxGeometry args={[0.5, 0.06, 0.45]} />
		<T.MeshStandardMaterial color="#1e2845" />
	</T.Mesh>
	<!-- Backrest -->
	<T.Mesh position={[0, 0.75, 0.92]}>
		<T.BoxGeometry args={[0.45, 0.55, 0.06]} />
		<T.MeshStandardMaterial color="#252e4a" />
	</T.Mesh>
	<!-- Chair base/stem -->
	<T.Mesh position={[0, 0.22, 0.7]}>
		<T.CylinderGeometry args={[0.03, 0.03, 0.44, 6]} />
		<T.MeshStandardMaterial color="#1a1f29" metalness={0.4} />
	</T.Mesh>

	<!-- ═══ LAPTOP ═══ -->
	<!-- Base -->
	<T.Mesh position={[0, 0.655, 0]}>
		<T.BoxGeometry args={[0.6, 0.03, 0.4]} />
		<T.MeshStandardMaterial color="#333e5c" metalness={0.3} roughness={0.5} />
	</T.Mesh>
	<!-- Screen -->
	<T.Mesh position={[0, 0.92, -0.18]}>
		<T.BoxGeometry args={[0.55, 0.5, 0.02]} />
		<T.MeshStandardMaterial color="#0a0f1e" />
	</T.Mesh>
	<!-- Screen glow surface -->
	<T.Mesh position={[0, 0.92, -0.165]}>
		<T.BoxGeometry args={[0.48, 0.42, 0.005]} />
		<T.MeshStandardMaterial
			color={screenColor}
			emissive={screenColor}
			emissiveIntensity={screenEmissive}
			transparent
			opacity={0.9}
		/>
	</T.Mesh>
	<!-- Screen light casting on desk -->
	<T.PointLight
		position={[0, 0.8, -0.1]}
		color={screenColor}
		intensity={state === 'working' ? 0.4 : 0.1}
		distance={2}
		decay={2}
	/>

	<!-- ═══ CSS PIXEL CHARACTER (HTML overlay) ═══ -->
	<HTML position={[0, 1.2, 0.65]} transform center pointerEvents="none" sprite>
		<div style="transform: scale(0.04);">
			<PixelCharacter {agent} agentState={state} />
		</div>
	</HTML>

	<!-- ═══ STATUS INDICATOR ═══ -->
	{#if state === 'working'}
		<T.PointLight
			position={[0, 0.1, 0.65]}
			color={agent.color}
			intensity={0.3}
			distance={2.5}
			decay={2}
		/>
	{/if}
</T.Group>
