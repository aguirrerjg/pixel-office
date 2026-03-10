/** Agent state as reported by the backend */
export type AgentState = 'idle' | 'working' | 'thinking' | 'activating';

/** Single agent status from the status API */
export interface AgentStatus {
	state: AgentState;
	activity: string;
	since: string;
}

/** Team status map: agent_id → status */
export type TeamStatus = Record<string, AgentStatus>;

/** Full status payload from /api/status.json */
export interface StatusPayload {
	miles?: TeamStatus;
	pmo?: TeamStatus;
	_health?: Record<string, HealthInfo>;
	_logs?: LogEntry[];
	_alerts?: AlertEntry[];
}

export interface HealthInfo {
	connected: boolean;
	last_check: string;
	last_event?: string;
	uptime_since: string;
}

export interface LogEntry {
	ts: string;
	team: string;
	level: 'info' | 'warn' | 'error';
	msg: string;
}

export interface AlertEntry {
	ts: string;
	team: string;
	level: string;
	msg: string;
}

/** Agent definition (visual + metadata) */
export interface AgentDef {
	id: string;
	name: string;
	role: string;
	color: string;
	hair: string;
	hairColor: string;
	capColor?: string;
	beretColor?: string;
	skinColor: string;
	jacket: string;
	shirt: string;
	acc: string;
}

/** Team definition */
export interface TeamDef {
	key: string;
	name: string;
	platform: string;
	color: string;
	agents: AgentDef[];
}
