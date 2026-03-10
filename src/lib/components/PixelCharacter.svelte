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

<!-- Character (sits behind desk, z-index 1) -->
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
	<!-- Think bubble -->
	<div class="think-bubble">
		<div class="think-cloud">💭</div>
		<div class="think-dot"></div>
		<div class="think-dot"></div>
	</div>
</div>

<!-- Status label BELOW desk -->
<div class="ws-label-bottom">
	<span class="ws-status {agentState}">{agentState}</span>
	{#if activity}
		<span class="ws-activity">{activity}</span>
	{/if}
</div>

<style>
	/* ── Labels above character ── */
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

	/* ── Labels below desk ── */
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
	}
	.ws-status.idle { background: rgba(40, 45, 65, 0.85); color: #8090a8; }
	.ws-status.working { background: rgba(0, 60, 70, 0.85); color: #00e5ff; text-shadow: 0 0 4px rgba(0,229,255,0.4); }
	.ws-status.thinking { background: rgba(50, 30, 80, 0.85); color: #c8a0ff; text-shadow: 0 0 4px rgba(179,136,255,0.4); }
	.ws-status.activating { background: rgba(70, 50, 0, 0.85); color: #ffcc33; text-shadow: 0 0 4px rgba(255,179,0,0.4); }
	.ws-activity {
		font-family: 'Fira Code', monospace;
		font-size: 8px;
		color: #a0a8b8;
		background: rgba(20, 24, 32, 0.75);
		padding: 1px 6px;
		border-radius: 3px;
		max-width: 130px;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
	}

	/* ── Character container (behind desk) ── */
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
		transition: all 0.6s ease;
	}

	.char-wrap .character { --char-y: 0px; }
	.char-wrap.working .character { --char-y: -4px; }
	.char-wrap.thinking .character { --char-y: -20px; }

	/* Torso */
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

	/* Arms */
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

	/* Working: typing */
	.char-wrap.working .char-arm-l { animation: typeL 0.35s ease-in-out infinite alternate; }
	.char-wrap.working .char-arm-r { animation: typeR 0.35s ease-in-out infinite alternate-reverse; }
	@keyframes typeL {
		0% { transform: translateY(var(--char-y, 0)) rotate(20deg) translateY(0); }
		100% { transform: translateY(var(--char-y, 0)) rotate(0deg) translateY(-8px); }
	}
	@keyframes typeR {
		0% { transform: translateY(var(--char-y, 0)) rotate(-20deg) translateY(0); }
		100% { transform: translateY(var(--char-y, 0)) rotate(0deg) translateY(-8px); }
	}
	.char-wrap.working .char-head { animation: workBob 1.2s ease-in-out infinite; }
	@keyframes workBob {
		0%, 100% { transform: translateX(-50%) translateY(var(--char-y, 0)); }
		50% { transform: translateX(-50%) translateY(calc(var(--char-y, 0) - 3px)); }
	}

	/* Thinking */
	.char-wrap.thinking .char-arm-l { transform: translateY(var(--char-y, 0)) rotate(15deg); animation: thinkSway 3s ease-in-out infinite; }
	.char-wrap.thinking .char-arm-r { transform: translateY(var(--char-y, 0)) rotate(-70deg) translateY(-14px); }
	@keyframes thinkSway {
		0%, 100% { transform: translateY(var(--char-y, 0)) rotate(15deg); }
		50% { transform: translateY(var(--char-y, 0)) rotate(10deg); }
	}
	.char-wrap.thinking .char-head { animation: thinkTilt 3s ease-in-out infinite !important; }
	@keyframes thinkTilt {
		0%, 100% { transform: translateX(-50%) translateY(var(--char-y, 0)) rotate(0); }
		50% { transform: translateX(-50%) translateY(var(--char-y, 0)) rotate(5deg); }
	}

	/* Neck */
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

	/* Head */
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

	/* Idle breathing */
	.char-wrap.idle .char-torso { animation: breathe 3s ease-in-out infinite; }
	.char-wrap.idle .char-head { animation: headBob 3s ease-in-out infinite; }
	.char-wrap.idle .char-arm-l { animation: idleArmL 4s ease-in-out infinite; }
	.char-wrap.idle .char-arm-r { animation: idleArmR 4s ease-in-out infinite; }
	@keyframes breathe { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-2px) scaleY(1.04); } }
	@keyframes headBob { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-3px); } }
	@keyframes idleArmL { 0%, 100% { transform: rotate(12deg); } 50% { transform: rotate(8deg); } }
	@keyframes idleArmR { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(-8deg); } }

	/* Eyes */
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
	.char-wrap.working .char-eye { animation: none; }

	/* Mouth */
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

	/* ── Hair Styles ── */
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

	/* ── Accessories ── */
	/* Glasses: two lenses + bridge */
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

	/* ── Think bubble ── */
	.think-bubble {
		position: absolute;
		top: -10px;
		right: -5px;
		z-index: 10;
		opacity: 0;
		transition: opacity 0.5s;
		pointer-events: none;
	}
	.char-wrap.thinking .think-bubble { opacity: 1; }
	.think-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(179, 136, 255, 0.5);
		position: absolute;
	}
	.think-dot:nth-child(2) { bottom: 0; right: 4px; animation: dotFade 2s ease-in-out infinite; }
	.think-dot:nth-child(3) { bottom: 10px; right: 10px; width: 7px; height: 7px; animation: dotFade 2s ease-in-out 0.3s infinite; }
	.think-cloud {
		width: 36px;
		height: 24px;
		background: rgba(179, 136, 255, 0.2);
		border: 1.5px solid rgba(179, 136, 255, 0.35);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		animation: thinkFloat 2.5s ease-in-out infinite;
		box-shadow: 0 0 12px rgba(179, 136, 255, 0.15);
	}
	@keyframes thinkFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
	@keyframes dotFade { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }

	/* Activating */
	.char-wrap.activating .character { animation: standUp 1.2s ease-out forwards; }
	@keyframes standUp {
		0% { transform: translateX(-50%) translateY(0); }
		30% { transform: translateX(-50%) translateY(-18px); }
		50% { transform: translateX(-50%) translateY(-20px); }
		75% { transform: translateX(-50%) translateY(-10px); }
		100% { transform: translateX(-50%) translateY(0); }
	}
</style>
