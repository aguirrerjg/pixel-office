import { writable, derived } from 'svelte/store';
import type { StatusPayload, TeamStatus, LogEntry, AlertEntry, HealthInfo } from '$lib/types';

/** Raw status payload from API */
export const statusPayload = writable<StatusPayload>({});

/** Per-team derived stores */
export const milesStatus = derived(statusPayload, ($s) => $s.miles ?? {});
export const pmoStatus = derived(statusPayload, ($s) => $s.pmo ?? {});

/** Health info */
export const health = derived(statusPayload, ($s) => $s._health ?? {});

/** Logs */
export const logs = derived(statusPayload, ($s) => $s._logs ?? []);

/** Alerts */
export const alerts = derived(statusPayload, ($s) => $s._alerts ?? []);

/** Polling interval handle */
let pollInterval: ReturnType<typeof setInterval> | null = null;

/** Start polling status from the API */
export function startPolling(url: string, intervalMs = 2000) {
	stopPolling();

	async function poll() {
		try {
			const res = await fetch(`${url}?t=${Date.now()}`);
			if (res.ok) {
				const data: StatusPayload = await res.json();
				statusPayload.set(data);
			}
		} catch {
			// Silently handle fetch errors — dashboard stays on last known state
		}
	}

	poll(); // immediate first fetch
	pollInterval = setInterval(poll, intervalMs);
}

/** Stop polling */
export function stopPolling() {
	if (pollInterval) {
		clearInterval(pollInterval);
		pollInterval = null;
	}
}
