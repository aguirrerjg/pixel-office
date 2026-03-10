<svelte:head>
	<title>Pixel Office — Your AI Team, Live</title>
	<meta name="description" content="Watch your AI agents work in real time. Pixel Office visualizes multi-agent orchestration with live status, paper toss animations, and zero-latency updates." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="landing">
	<!-- Noise texture overlay -->
	<div class="noise" aria-hidden="true"></div>

	<!-- Nav -->
	<nav class="nav">
		<span class="logo">
			<span class="logo-pixel">PX</span>
			<span class="logo-name">Pixel Office</span>
		</span>
		<a href="/office" class="nav-cta">Open Dashboard →</a>
	</nav>

	<!-- Hero -->
	<section class="hero">
		<div class="hero-badge">Live · Real-time · Multi-agent</div>
		<h1 class="hero-title">
			Your AI team.<br />
			<em>Live.</em>
		</h1>
		<p class="hero-sub">
			Watch 9 autonomous agents across 2 platforms work, think, and delegate —
			all in a pixel-perfect office.
		</p>
		<div class="hero-actions">
			<a href="/office" class="btn-primary">Enter the Office</a>
			<span class="hero-hint">No login required</span>
		</div>

		<!-- Floating status chips -->
		<div class="status-chips" aria-hidden="true">
			<span class="chip chip--active">chief_agent thinking...</span>
			<span class="chip chip--idle">pmo_agent idle</span>
			<span class="chip chip--active">architect_agent working...</span>
			<span class="chip chip--delegating">→ delegating task</span>
		</div>
	</section>

	<!-- Stats bar -->
	<div class="stats-bar">
		<div class="stat">
			<span class="stat-num">2</span>
			<span class="stat-label">Teams</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat">
			<span class="stat-num">9</span>
			<span class="stat-label">Agents</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat">
			<span class="stat-num">2s</span>
			<span class="stat-label">Poll interval</span>
		</div>
		<div class="stat-divider"></div>
		<div class="stat">
			<span class="stat-num">∞</span>
			<span class="stat-label">Parallel tasks</span>
		</div>
	</div>

	<!-- Feature cards -->
	<section class="features">
		<div class="feature-card">
			<div class="feature-icon">◉</div>
			<h3>Live Status</h3>
			<p>Every agent's state updates in real time. Idle, thinking, working, delegating — always visible.</p>
		</div>
		<div class="feature-card feature-card--accent">
			<div class="feature-icon">✈</div>
			<h3>Paper Toss</h3>
			<p>Delegation is visual. Watch animated paper arcs fly between agents when tasks are handed off.</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">⬡</div>
			<h3>Multi-platform</h3>
			<p>Miles on Telegram, PMO on Slack — two teams, one unified office view. Platform icons included.</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">⚡</div>
			<h3>Zero-latency UI</h3>
			<p>SvelteKit 5 with reactive stores. No heavy runtime, no virtual DOM diffing. Just fast.</p>
		</div>
	</section>

	<!-- Quote -->
	<section class="quote-section">
		<blockquote class="quote">
			<p>"The office of the future isn't a place you go.<br />It's a system you observe."</p>
			<cite>— On autonomous work, 2026</cite>
		</blockquote>
	</section>

	<!-- Final CTA -->
	<section class="cta-section">
		<h2 class="cta-title">Ready to watch them work?</h2>
		<a href="/office" class="btn-primary btn-primary--large">Open Pixel Office</a>
	</section>

	<!-- Footer -->
	<footer class="footer">
		<span class="footer-logo">PX</span>
		<span class="footer-copy">Pixel Office · Built with SvelteKit 5 &amp; Claude SDK</span>
	</footer>
</div>

<style>
	/* ── Tokens ── */
	:global(body) {
		margin: 0;
		padding: 0;
		background: #07070f;
		color: #e2e0ff;
		font-family: 'Syne', sans-serif;
		overflow-x: hidden;
	}

	:root {
		--bg: #07070f;
		--bg2: #0d0b1a;
		--accent: #6366f1;
		--accent2: #a78bfa;
		--accent-dim: rgba(99, 102, 241, 0.15);
		--text: #e2e0ff;
		--text-muted: #7c7a9e;
		--border: rgba(99, 102, 241, 0.2);
		--mono: 'DM Mono', monospace;
	}

	/* ── Noise ── */
	.noise {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		opacity: 0.035;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 200px;
	}

	/* ── Landing wrapper ── */
	.landing {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* ── Nav ── */
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28px 0;
		border-bottom: 1px solid var(--border);
		animation: fadeDown 0.6s ease both;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo-pixel {
		font-family: var(--mono);
		font-weight: 500;
		font-size: 13px;
		background: var(--accent);
		color: #fff;
		padding: 3px 7px;
		border-radius: 4px;
		letter-spacing: 0.05em;
	}

	.logo-name {
		font-weight: 700;
		font-size: 16px;
		letter-spacing: -0.01em;
		color: var(--text);
	}

	.nav-cta {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--accent2);
		text-decoration: none;
		border: 1px solid var(--border);
		padding: 8px 16px;
		border-radius: 6px;
		transition: background 0.2s, border-color 0.2s;
	}

	.nav-cta:hover {
		background: var(--accent-dim);
		border-color: var(--accent);
	}

	/* ── Hero ── */
	.hero {
		padding: 96px 0 64px;
		max-width: 680px;
		animation: fadeUp 0.7s ease 0.1s both;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--mono);
		font-size: 12px;
		color: var(--accent2);
		border: 1px solid var(--border);
		background: var(--accent-dim);
		padding: 5px 14px;
		border-radius: 20px;
		margin-bottom: 32px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.hero-badge::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #22c55e;
		box-shadow: 0 0 8px #22c55e;
		animation: pulse 2s ease-in-out infinite;
	}

	.hero-title {
		font-size: clamp(52px, 8vw, 88px);
		font-weight: 800;
		line-height: 1.0;
		letter-spacing: -0.03em;
		color: var(--text);
		margin: 0 0 24px;
	}

	.hero-title em {
		font-style: normal;
		color: var(--accent);
		position: relative;
	}

	.hero-title em::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -4px;
		width: 100%;
		height: 3px;
		background: var(--accent);
		border-radius: 2px;
		opacity: 0.5;
	}

	.hero-sub {
		font-size: 18px;
		line-height: 1.7;
		color: var(--text-muted);
		margin: 0 0 40px;
		font-weight: 400;
		max-width: 540px;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.hero-hint {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--text-muted);
	}

	/* ── Floating chips ── */
	.status-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 56px;
	}

	.chip {
		font-family: var(--mono);
		font-size: 11px;
		padding: 5px 12px;
		border-radius: 4px;
		border: 1px solid var(--border);
		letter-spacing: 0.02em;
	}

	.chip--active {
		color: #86efac;
		background: rgba(34, 197, 94, 0.08);
		border-color: rgba(34, 197, 94, 0.2);
		animation: chipFloat 3s ease-in-out infinite;
	}

	.chip--idle {
		color: var(--text-muted);
		background: rgba(255, 255, 255, 0.03);
		animation: chipFloat 3s ease-in-out 0.8s infinite;
	}

	.chip--delegating {
		color: var(--accent2);
		background: var(--accent-dim);
		animation: chipFloat 3s ease-in-out 1.6s infinite;
	}

	/* ── Stats bar ── */
	.stats-bar {
		display: flex;
		align-items: center;
		gap: 40px;
		padding: 32px 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		margin-bottom: 80px;
		animation: fadeUp 0.7s ease 0.3s both;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-num {
		font-size: 36px;
		font-weight: 800;
		color: var(--text);
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.stat-label {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.stat-divider {
		width: 1px;
		height: 40px;
		background: var(--border);
	}

	/* ── Feature cards ── */
	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
		margin-bottom: 96px;
		animation: fadeUp 0.7s ease 0.4s both;
	}

	.feature-card {
		background: var(--bg2);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 32px 28px;
		transition: border-color 0.25s, transform 0.25s;
		position: relative;
		overflow: hidden;
	}

	.feature-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--accent), transparent);
		opacity: 0;
		transition: opacity 0.3s;
	}

	.feature-card:hover {
		border-color: var(--accent);
		transform: translateY(-3px);
	}

	.feature-card:hover::before {
		opacity: 1;
	}

	.feature-card--accent {
		background: linear-gradient(135deg, #0d0b1a 0%, rgba(99, 102, 241, 0.08) 100%);
		border-color: rgba(99, 102, 241, 0.35);
	}

	.feature-icon {
		font-size: 22px;
		margin-bottom: 16px;
		color: var(--accent2);
		line-height: 1;
	}

	.feature-card h3 {
		font-size: 17px;
		font-weight: 700;
		color: var(--text);
		margin: 0 0 10px;
		letter-spacing: -0.01em;
	}

	.feature-card p {
		font-size: 14px;
		line-height: 1.65;
		color: var(--text-muted);
		margin: 0;
	}

	/* ── Quote ── */
	.quote-section {
		padding: 80px 0;
		display: flex;
		justify-content: center;
		animation: fadeUp 0.7s ease 0.5s both;
	}

	.quote {
		max-width: 620px;
		text-align: center;
		margin: 0;
		padding: 48px;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: linear-gradient(135deg, var(--bg2), rgba(99, 102, 241, 0.05));
		position: relative;
	}

	.quote::before {
		content: '"';
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 80px;
		color: var(--accent);
		line-height: 1;
		font-weight: 800;
	}

	.quote p {
		font-size: 22px;
		font-weight: 600;
		line-height: 1.55;
		color: var(--text);
		margin: 0 0 20px;
		letter-spacing: -0.01em;
	}

	.quote cite {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--text-muted);
		font-style: normal;
		letter-spacing: 0.04em;
	}

	/* ── CTA section ── */
	.cta-section {
		text-align: center;
		padding: 80px 0;
		animation: fadeUp 0.7s ease 0.6s both;
	}

	.cta-title {
		font-size: clamp(28px, 4vw, 42px);
		font-weight: 800;
		color: var(--text);
		margin: 0 0 32px;
		letter-spacing: -0.02em;
	}

	/* ── Buttons ── */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--accent);
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		font-size: 15px;
		padding: 14px 28px;
		border-radius: 8px;
		letter-spacing: -0.01em;
		transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
		box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
	}

	.btn-primary:hover {
		background: #7173f4;
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(99, 102, 241, 0.35);
	}

	.btn-primary--large {
		font-size: 17px;
		padding: 16px 36px;
	}

	/* ── Footer ── */
	.footer {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 32px 0;
		border-top: 1px solid var(--border);
		margin-top: 40px;
	}

	.footer-logo {
		font-family: var(--mono);
		font-size: 12px;
		background: var(--accent);
		color: #fff;
		padding: 3px 7px;
		border-radius: 4px;
	}

	.footer-copy {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--text-muted);
	}

	/* ── Animations ── */
	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(24px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	@keyframes fadeDown {
		from { opacity: 0; transform: translateY(-16px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50%       { opacity: 0.5; transform: scale(0.85); }
	}

	@keyframes chipFloat {
		0%, 100% { transform: translateY(0); }
		50%       { transform: translateY(-4px); }
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.hero { padding: 64px 0 40px; }
		.stats-bar { gap: 24px; flex-wrap: wrap; }
		.stat-divider { display: none; }
		.hero-actions { flex-direction: column; align-items: flex-start; }
		.quote { padding: 32px 24px; }
		.quote p { font-size: 18px; }
	}
</style>
