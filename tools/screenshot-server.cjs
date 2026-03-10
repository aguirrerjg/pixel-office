#!/usr/bin/env node
/**
 * MCP Server: Screenshot tool for Pixel Office
 * Takes a Puppeteer screenshot of localhost:5173 and returns the image path.
 * Usage: Add to claude MCP config as a stdio server.
 */
const { Server } = require('@anthropic-ai/sdk/mcp');

// Lightweight approach: just a reusable function
const puppeteer = require('puppeteer');

let browser = null;

async function takeScreenshot(width = 1400, height = 800, wait = 2000) {
	if (!browser) {
		browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
	}
	const page = await browser.newPage();
	await page.setViewport({ width, height });
	try {
		await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 15000 });
		await new Promise(r => setTimeout(r, wait));
		const path = '/tmp/pixel-office-preview.png';
		await page.screenshot({ path, type: 'png' });
		return path;
	} finally {
		await page.close();
	}
}

// If run directly, just take a screenshot
(async () => {
	const path = await takeScreenshot();
	console.log(`Screenshot saved: ${path}`);
	if (browser) await browser.close();
})();
