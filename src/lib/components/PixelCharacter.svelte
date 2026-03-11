<script lang="ts">
	import type { AgentDef, AgentState } from '$lib/types';

	interface Props {
		agent: AgentDef;
		agentState?: AgentState;
		activity?: string;
	}

	let { agent, agentState = 'idle', activity = '' }: Props = $props();

	const hairClass = $derived(`hair-${agent.hair}`);
	const accClass = $derived(agent.acc ? `acc-${agent.acc}` : '');
</script>

<!-- Name label ABOVE character -->
<div class="ws-label-top">
	<span class="ws-name" style="color:{agent.color}">{agent.name}</span>
	<span class="ws-role">{agent.role}</span>
</div>

<!-- Character -->
<div class="char-wrap {agentState}">
	<div class="character" style="--jacket-color:{agent.jacket};--shirt-color:{agent.shirt};--skin-color:{agent.skinColor}">
		<div class="char-torso"></div>
		<div class="char-arm-l"></div>
		<div class="char-arm-r"></div>
		<div class="char-neck-part"></div>
		<div class="char-head {hairClass} {accClass}"
			style="--skin-color:{agent.skinColor};--hair-color:{agent.hairColor};{agent.capColor ? '--cap-color:'+agent.capColor+';' : ''}{agent.beretColor ? '--beret-color:'+agent.beretColor+';' : ''}">
			<div class="char-hair"></div>
			<div class="char-eyes"><div class="char-eye"></div><div class="char-eye"></div></div>
			<div class="char-mouth-part"></div>
		</div>
	</div>
	<!-- Think bubble — CSS pure -->
	<div class="think-bubble">
		<div class="think-cloud">
			<span class="td"></span><span class="td"></span><span class="td"></span>
		</div>
		<div class="think-trail t1"></div>
		<div class="think-trail t2"></div>
	</div>
</div>

<!-- Status label BELOW desk -->
<div class="ws-label-bottom">
	{#if activity && (agentState === 'working' || agentState === 'thinking')}
		<span class="ws-status-active {agentState}" title={activity}>
			<span class="si"></span>
			{activity}
		</span>
	{:else}
		<span class="ws-status {agentState}">
			{#if agentState === 'working' || agentState === 'thinking'}
				<span class="si"></span>
			{/if}
			{agentState}
		</span>
	{/if}
</div>

<style>
	/* ═══ LABELS ═══ */
	.ws-label-top {
		position: absolute;
		bottom: 115px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		z-index: 10;
		white-space: nowrap;
	}
	.ws-name {
		font-family: 'Chakra Petch', monospace;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.5px;
	}
	.ws-role {
		font-family: 'Fira Code', monospace;
		font-size: 7px;
		color: #4d5570;
		letter-spacing: 0.3px;
	}
	.ws-label-bottom {
		position: absolute;
		bottom: -22px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		z-index: 10;
		white-space: nowrap;
	}
	.ws-status {
		font-family: 'Fira Code', monospace;
		font-size: 9px;
		font-weight: 700;
		padding: 2px 8px;
		border-radius: 4px;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.ws-status.idle { background: rgba(40, 45, 65, 0.85); color: #8090a8; }
	.ws-status.working { background: rgba(0, 40, 50, 0.95); color: #00e5ff; text-shadow: 0 0 4px rgba(0,229,255,0.4); }
	.ws-status.thinking { background: rgba(35, 20, 60, 0.95); color: #c8a0ff; text-shadow: 0 0 4px rgba(179,136,255,0.4); }
	.ws-status.activating { background: rgba(70, 50, 0, 0.85); color: #ffcc33; text-shadow: 0 0 4px rgba(255,179,0,0.4); }

	/* Combined status+activity pill for active states */
	.ws-status-active {
		font-family: 'Fira Code', monospace;
		font-size: 9px;
		font-weight: 600;
		padding: 4px 8px;
		border-radius: 5px;
		display: flex;
		align-items: flex-start;
		gap: 5px;
		max-width: 150px;
		white-space: normal;
		line-height: 1.3;
		text-align: left;
	}
	.ws-status-active.working {
		background: rgba(0, 30, 40, 0.95);
		color: #00e5ff;
		text-shadow: 0 0 6px rgba(0,229,255,0.5);
		box-shadow: 0 0 10px rgba(0,229,255,0.3);
		border: 1px solid rgba(0,229,255,0.35);
	}
	.ws-status-active.thinking {
		background: rgba(30, 15, 55, 0.95);
		color: #c8a0ff;
		text-shadow: 0 0 6px rgba(179,136,255,0.5);
		box-shadow: 0 0 10px rgba(179,136,255,0.3);
		border: 1px solid rgba(179,136,255,0.35);
	}

	/* Status indicator dot */
	.si {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}
	.ws-status.working .si, .ws-status-active.working .si {
		background: #00e5ff;
		box-shadow: 0 0 6px #00e5ff;
		animation: siPulse 1s ease-in-out infinite;
	}
	.ws-status.thinking .si, .ws-status-active.thinking .si {
		background: #c8a0ff;
		box-shadow: 0 0 6px #c8a0ff;
		animation: siPulse 2s ease-in-out infinite;
	}
	@keyframes siPulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.3; transform: scale(0.5); }
	}

	.ws-activity {
		font-family: 'Fira Code', monospace;
		font-size: 9px;
		color: #d0d8e8;
		background: rgba(10, 14, 24, 0.92);
		padding: 2px 8px;
		border-radius: 3px;
		max-width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		border: 1px solid rgba(255,255,255,0.08);
	}

	/* ═══ CHARACTER CONTAINER ═══ */
	.char-wrap {
		position: absolute;
		bottom: 2px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 80px;
		z-index: 1;
	}
	.character {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
	}
	.char-wrap .character { --char-y: 0px; }
	.char-wrap.working .character { --char-y: -4px; }
	.char-wrap.thinking .character { --char-y: -20px; }

	/* ═══ BODY PARTS ═══ */
	.char-torso {
		position: relative;
		width: 30px;
		height: 28px;
		background: var(--jacket-color);
		border-radius: 8px 8px 2px 2px;
		transform: translateY(var(--char-y, 0));
		transition: transform 0.6s ease;
	}
	.char-torso::before {
		content: '';
		position: absolute;
		top: 3px;
		left: 50%;
		transform: translateX(-50%);
		width: 12px;
		height: 18px;
		background: var(--shirt-color);
		border-radius: 3px 3px 0 0;
		clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);
	}

	.char-arm-l, .char-arm-r {
		position: absolute;
		top: 4px;
		width: 8px;
		height: 22px;
		background: var(--jacket-color);
		border-radius: 4px;
		transform-origin: top center;
		transition: all 0.4s ease;
		z-index: 4;
	}
	.char-arm-l { left: -6px; transform: translateY(var(--char-y, 0)) rotate(12deg); }
	.char-arm-r { right: -6px; transform: translateY(var(--char-y, 0)) rotate(-12deg); }
	.char-arm-l::after, .char-arm-r::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--skin-color);
	}

	.char-neck-part {
		position: absolute;
		top: -6px;
		left: 50%;
		transform: translateX(-50%) translateY(var(--char-y, 0));
		width: 10px;
		height: 8px;
		background: var(--skin-color);
		border-radius: 2px;
		transition: transform 0.6s ease;
	}

	.char-head {
		position: absolute;
		top: -36px;
		left: 50%;
		transform: translateX(-50%) translateY(var(--char-y, 0));
		width: 26px;
		height: 28px;
		background: var(--skin-color);
		border-radius: 50% 50% 45% 45%;
		transition: transform 0.6s ease;
		z-index: 5;
	}

	/* ═══ IDLE STATE ═══ */
	/* Breathing — asymmetric for natural feel */
	.char-wrap.idle .char-torso { animation: breathe 4s ease-in-out infinite; }
	@keyframes breathe {
		0%, 100% { transform: translateY(var(--char-y, 0)) scaleY(1); }
		40% { transform: translateY(calc(var(--char-y, 0) - 2px)) scaleY(1.04); }
		70% { transform: translateY(calc(var(--char-y, 0) - 1px)) scaleY(1.02); }
	}

	/* Head — subtle wander with tilts */
	.char-wrap.idle .char-head { animation: idleHead 8s ease-in-out infinite; }
	@keyframes idleHead {
		0%, 100% { transform: translateX(-50%) translateY(var(--char-y, 0)) rotate(0); }
		20% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 2px)) rotate(0); }
		45% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 1px)) rotate(2deg); }
		65% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 3px)) rotate(-1.5deg); }
		85% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 1px)) rotate(0.5deg); }
	}

	/* Arms — gentle sway, different timing */
	.char-wrap.idle .char-arm-l { animation: idleArmL 5s ease-in-out infinite; }
	.char-wrap.idle .char-arm-r { animation: idleArmR 6s ease-in-out infinite; }
	@keyframes idleArmL {
		0%, 100% { transform: translateY(var(--char-y, 0)) rotate(12deg); }
		35% { transform: translateY(var(--char-y, 0)) rotate(7deg); }
		65% { transform: translateY(var(--char-y, 0)) rotate(14deg); }
	}
	@keyframes idleArmR {
		0%, 100% { transform: translateY(var(--char-y, 0)) rotate(-12deg); }
		40% { transform: translateY(var(--char-y, 0)) rotate(-7deg); }
		75% { transform: translateY(var(--char-y, 0)) rotate(-15deg); }
	}

	/* ═══ WORKING STATE ═══ */
	/* Typing — bursts with natural pauses */
	.char-wrap.working .char-arm-l { animation: typeL 3s ease-in-out infinite; }
	.char-wrap.working .char-arm-r { animation: typeR 3s ease-in-out infinite 0.08s; }
	@keyframes typeL {
		0% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		5% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		10% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		15% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		20% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		25% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		30% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		/* pause — reading/thinking */
		35%, 50% { transform: translateY(var(--char-y, 0)) rotate(14deg) translateY(-2px); }
		/* burst 2 */
		55% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		60% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		65% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		70% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		75% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		80% { transform: translateY(var(--char-y, 0)) rotate(18deg); }
		85% { transform: translateY(var(--char-y, 0)) rotate(2deg) translateY(-6px); }
		/* settle */
		92%, 100% { transform: translateY(var(--char-y, 0)) rotate(16deg); }
	}
	@keyframes typeR {
		0% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		5% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		10% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		15% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		20% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		25% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		30% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		/* pause */
		35%, 50% { transform: translateY(var(--char-y, 0)) rotate(-14deg) translateY(-2px); }
		/* burst 2 */
		55% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		60% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		65% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		70% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		75% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		80% { transform: translateY(var(--char-y, 0)) rotate(-18deg); }
		85% { transform: translateY(var(--char-y, 0)) rotate(-2deg) translateY(-6px); }
		/* settle */
		92%, 100% { transform: translateY(var(--char-y, 0)) rotate(-16deg); }
	}

	/* Head — focused bob */
	.char-wrap.working .char-head { animation: workHead 2s ease-in-out infinite; }
	@keyframes workHead {
		0%, 100% { transform: translateX(-50%) translateY(var(--char-y, 0)); }
		40% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 2px)); }
		60% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 3px)); }
	}

	/* ═══ THINKING STATE ═══ */
	/* Left arm — gentle sway */
	.char-wrap.thinking .char-arm-l { animation: thinkSwayL 4s ease-in-out infinite; }
	@keyframes thinkSwayL {
		0%, 100% { transform: translateY(var(--char-y, 0)) rotate(15deg); }
		50% { transform: translateY(var(--char-y, 0)) rotate(8deg); }
	}

	/* Right arm — chin rest with subtle wobble */
	.char-wrap.thinking .char-arm-r { animation: chinRest 5s ease-in-out infinite; }
	@keyframes chinRest {
		0%, 100% { transform: translateY(var(--char-y, 0)) rotate(-70deg) translateY(-14px); }
		30% { transform: translateY(var(--char-y, 0)) rotate(-65deg) translateY(-13px); }
		70% { transform: translateY(var(--char-y, 0)) rotate(-72deg) translateY(-14px); }
	}

	/* Head — tilt with nod */
	.char-wrap.thinking .char-head { animation: thinkHead 4s ease-in-out infinite !important; }
	@keyframes thinkHead {
		0%, 100% { transform: translateX(-50%) translateY(var(--char-y, 0)) rotate(0); }
		30% { transform: translateX(-50%) translateY(var(--char-y, 0)) rotate(6deg); }
		60% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 2px)) rotate(3deg); }
		80% { transform: translateX(-50%) translateY(var(--char-y, 0)) rotate(5deg); }
	}

	/* ═══ EYES ═══ */
	.char-eyes {
		position: absolute;
		top: 13px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 6px;
		z-index: 8;
	}
	.char-eye {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #1a1a2e;
		position: relative;
		animation: blink 5s ease-in-out infinite;
	}
	.char-eye:last-child { animation-delay: 0.05s; }
	.char-eye::before {
		content: '';
		position: absolute;
		top: 0.5px;
		left: 1.5px;
		width: 2px;
		height: 2px;
		border-radius: 50%;
		background: #fff;
		opacity: 0.9;
	}
	@keyframes blink {
		0%, 44%, 50%, 100% { transform: scaleY(1); }
		46%, 48% { transform: scaleY(0.1); }
	}

	/* Idle: eyes look around via highlight shift */
	.char-wrap.idle .char-eye::before {
		animation: eyeGaze 10s ease-in-out infinite;
	}
	@keyframes eyeGaze {
		0%, 28% { left: 1.5px; top: 0.5px; }
		32%, 38% { left: 3px; top: 0.5px; }
		42%, 68% { left: 1.5px; top: 0.5px; }
		72%, 78% { left: 0px; top: 0.5px; }
		82%, 100% { left: 1.5px; top: 0.5px; }
	}

	/* Working: focused, no blink */
	.char-wrap.working .char-eye { animation: none; }

	/* Thinking: eyes drift up, slower blink */
	.char-wrap.thinking .char-eye { animation: blink 7s ease-in-out infinite; }
	.char-wrap.thinking .char-eye::before {
		animation: eyeUp 5s ease-in-out infinite;
	}
	@keyframes eyeUp {
		0%, 100% { top: 0px; left: 1.5px; }
		40% { top: -0.5px; left: 2px; }
		70% { top: 0px; left: 1px; }
	}

	/* ═══ MOUTH ═══ */
	.char-mouth-part {
		position: absolute;
		bottom: 5px;
		left: 50%;
		transform: translateX(-50%);
		width: 5px;
		height: 1.5px;
		background: rgba(0, 0, 0, 0.12);
		border-radius: 1px;
		transition: all 0.3s;
		z-index: 8;
	}
	.char-wrap.working .char-mouth-part { width: 4px; height: 2px; border-radius: 0 0 2px 2px; background: rgba(0, 0, 0, 0.08); }
	.char-wrap.thinking .char-mouth-part { width: 3px; height: 3px; border-radius: 50%; background: rgba(0, 0, 0, 0.06); }

	/* ═══ HAIR STYLES ═══ */
	.char-hair {
		position: absolute;
		top: -2px;
		left: -2px;
		right: -2px;
		height: 16px;
		background: var(--hair-color);
		border-radius: 50% 50% 30% 30%;
		z-index: 6;
	}
	.hair-messy-cap .char-hair { border-radius: 40% 40% 20% 20%; }
	.hair-messy-cap .char-hair::before {
		content: '';
		position: absolute;
		top: -3px;
		left: -1px;
		right: -1px;
		height: 13px;
		background: var(--cap-color, #4a5568);
		border-radius: 50% 50% 15% 15%;
	}
	.hair-messy-cap .char-hair::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: -3px;
		width: 7px;
		height: 9px;
		background: var(--hair-color);
		border-radius: 2px;
		z-index: 1;
	}
	.hair-messy-long .char-hair { height: 14px; border-radius: 45% 45% 20% 20%; }
	.hair-messy-long .char-hair::before {
		content: '';
		position: absolute;
		top: 8px;
		left: -4px;
		width: 8px;
		height: 16px;
		background: var(--hair-color);
		border-radius: 3px;
		z-index: -1;
	}
	.hair-messy-long .char-hair::after {
		content: '';
		position: absolute;
		top: 8px;
		right: -4px;
		width: 7px;
		height: 14px;
		background: var(--hair-color);
		border-radius: 3px;
		z-index: -1;
	}
	.hair-neat-side .char-hair { border-radius: 50% 50% 35% 35%; }
	.hair-neat-side .char-hair::before {
		content: '';
		position: absolute;
		top: 4px;
		left: -3px;
		width: 6px;
		height: 10px;
		background: var(--hair-color);
		border-radius: 2px;
	}
	.hair-short-textured .char-hair { height: 13px; border-radius: 50% 50% 40% 40%; }
	.hair-wavy-beret .char-hair { height: 18px; border-radius: 45% 45% 20% 20%; }
	.hair-wavy-beret .char-hair::before {
		content: '';
		position: absolute;
		top: -4px;
		left: 2px;
		right: -3px;
		height: 14px;
		background: var(--beret-color, #b71c1c);
		border-radius: 60% 60% 20% 20%;
	}
	.hair-wavy-beret .char-hair::after {
		content: '';
		position: absolute;
		top: 6px;
		left: -3px;
		width: 8px;
		height: 13px;
		background: var(--hair-color);
		border-radius: 3px;
	}

	/* ═══ ACCESSORIES ═══ */
	.acc-glasses .char-eyes::after {
		content: '';
		position: absolute;
		top: -1px;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 8px;
		border: 2px solid #a0b0c8;
		border-radius: 4px;
		background: rgba(160, 200, 255, 0.12);
		z-index: 9;
		box-shadow: 0 0 2px rgba(160, 200, 255, 0.3);
	}
	.acc-headphones .char-head::after {
		content: '';
		position: absolute;
		top: -2px;
		left: -4px;
		right: -4px;
		height: 20px;
		border: 2px solid #444;
		border-bottom: none;
		border-radius: 50% 50% 0 0;
		z-index: 7;
	}
	.acc-dogtags .char-torso::after {
		content: '';
		position: absolute;
		top: 1px;
		left: 50%;
		transform: translateX(-50%);
		width: 5px;
		height: 7px;
		background: #9e9e9e;
		border-radius: 1.5px;
		box-shadow: 0 0 0 0.5px #bdbdbd;
		z-index: 7;
	}

	/* ═══ THINK BUBBLE (CSS pure) ═══ */
	.think-bubble {
		position: absolute;
		top: -14px;
		right: -8px;
		z-index: 10;
		opacity: 0;
		transition: opacity 0.5s;
		pointer-events: none;
	}
	.char-wrap.thinking .think-bubble { opacity: 1; }
	.think-cloud {
		display: flex;
		gap: 3px;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 22px;
		background: rgba(179, 136, 255, 0.15);
		border: 1.5px solid rgba(179, 136, 255, 0.3);
		border-radius: 12px;
		animation: thinkFloat 2.5s ease-in-out infinite;
		box-shadow: 0 0 12px rgba(179, 136, 255, 0.15);
	}
	.td {
		display: block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(179, 136, 255, 0.8);
		animation: dotBounce 1.4s ease-in-out infinite;
	}
	.td:nth-child(2) { animation-delay: 0.15s; }
	.td:nth-child(3) { animation-delay: 0.3s; }
	@keyframes dotBounce {
		0%, 100% { transform: translateY(0); opacity: 0.4; }
		50% { transform: translateY(-3px); opacity: 1; }
	}

	/* Trail circles */
	.think-trail {
		position: absolute;
		border-radius: 50%;
		background: rgba(179, 136, 255, 0.25);
		animation: trailFade 2s ease-in-out infinite;
	}
	.think-trail.t1 { width: 6px; height: 6px; bottom: -6px; right: 6px; }
	.think-trail.t2 { width: 4px; height: 4px; bottom: -10px; right: 2px; animation-delay: 0.3s; }
	@keyframes trailFade {
		0%, 100% { opacity: 0.3; transform: scale(0.8); }
		50% { opacity: 0.7; transform: scale(1.1); }
	}
	@keyframes thinkFloat {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-6px); }
	}

	/* ═══ ACTIVATING ═══ */
	.char-wrap.activating .character { animation: standUp 1.2s ease-out forwards; }
	@keyframes standUp {
		0% { transform: translateX(-50%) translateY(0); }
		30% { transform: translateX(-50%) translateY(-18px); }
		50% { transform: translateX(-50%) translateY(-20px); }
		75% { transform: translateX(-50%) translateY(-10px); }
		100% { transform: translateX(-50%) translateY(0); }
	}
</style>
