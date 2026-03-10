import { writable } from 'svelte/store';
import type { AgentState } from '$lib/types';

/** Per-agent visual state tracked by the office renderer */
export interface AgentVisualState {
	state: AgentState;
	prevState: AgentState;
	activity: string;
	stateChangedAt: number;
}

/** Map of teamKey-agentId → visual state */
export const agentVisuals = writable<Record<string, AgentVisualState>>({});

/** Update an agent's visual state, tracking transitions */
export function updateAgentVisual(teamKey: string, agentId: string, state: AgentState, activity: string) {
	agentVisuals.update((map) => {
		const key = `${teamKey}-${agentId}`;
		const prev = map[key];
		const prevState = prev?.state ?? 'idle';

		// Only update if state or activity changed
		if (prev && prev.state === state && prev.activity === activity) return map;

		return {
			...map,
			[key]: {
				state,
				prevState,
				activity,
				stateChangedAt: prevState !== state ? Date.now() : (prev?.stateChangedAt ?? Date.now()),
			},
		};
	});
}
