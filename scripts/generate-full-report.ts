#!/usr/bin/env npx tsx
/**
 * Generate a consolidated PDF report for the full DD sequential Ratchet run.
 */
import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DOCS = join(process.cwd(), 'docs');

// Gather all individual module reports
const modules = [
  'geocode', 'perf-baseline', 'notifications', 'error-tracker', 
  'webhooks', 'auth', 'bingo', 'king', 'premium', 'helpers',
  'deuces', 'public', 'groups'
];

interface ModuleResult {
  name: string;
  clicks: number;
  landed: number;
  rolledBack: number;
  issuesFixed: string[];
  duration: string;
  scoreBefore: string;
  scoreAfter: string;
}

const results: ModuleResult[] = [];

for (const mod of modules) {
  const reportPath = join(DOCS, `${mod}-ratchet-report.md`);
  if (!existsSync(reportPath)) continue;
  
  const content = readFileSync(reportPath, 'utf-8');
  
  // Parse clicks
  const clicksMatch = content.match(/(\d+) clicks · (\d+) landed · (\d+) rolled back · (.+?)$/m);
  const totalClicks = clicksMatch ? parseInt(clicksMatch[1]) : 0;
  const landed = clicksMatch ? parseInt(clicksMatch[2]) : 0;
  const rolledBack = clicksMatch ? parseInt(clicksMatch[3]) : 0;
  const duration = clicksMatch ? clicksMatch[4] : '?';
  
  // Parse score
  const scoreMatch = content.match(/Score: (\d+) → (\d+)/);
  const scoreBefore = scoreMatch ? scoreMatch[1] : '?';
  const scoreAfter = scoreMatch ? scoreMatch[2] : '?';
  
  // Parse issues fixed
  const issuesFixed: string[] = [];
  const issueLines = content.match(/- ✅ \*\*(.+?)\*\*/g);
  if (issueLines) {
    for (const line of issueLines) {
      const m = line.match(/✅ \*\*(.+?)\*\*/);
      if (m) issuesFixed.push(m[1]);
    }
  }
  
  results.push({ name: mod, clicks: totalClicks, landed, rolledBack, issuesFixed, duration, scoreBefore, scoreAfter });
}

const totalLanded = results.reduce((s, r) => s + r.landed, 0);
const totalRolledBack = results.reduce((s, r) => s + r.rolledBack, 0);
const totalClicks = results.reduce((s, r) => s + r.clicks, 0);
const allIssues = results.flatMap(r => r.issuesFixed);
const startScore = results[0]?.scoreBefore ?? '59';
const endScore = results[results.length - 1]?.scoreAfter ?? '60';

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 20mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; background: #fff; line-height: 1.5; }
  
  .hero { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 48px 40px; border-radius: 16px; margin-bottom: 32px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -50%; right: -30%; width: 60%; height: 200%; background: rgba(255,255,255,0.05); transform: rotate(15deg); }
  .hero h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
  .hero .subtitle { font-size: 16px; opacity: 0.9; }
  
  .score-hero { display: flex; gap: 24px; margin: 24px 0; align-items: center; }
  .score-box { background: rgba(255,255,255,0.2); border-radius: 12px; padding: 16px 24px; text-align: center; }
  .score-box .label { font-size: 12px; text-transform: uppercase; opacity: 0.8; }
  .score-box .value { font-size: 48px; font-weight: 800; }
  .score-arrow { font-size: 36px; }
  
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat { background: #fef3c7; border-radius: 12px; padding: 20px; text-align: center; }
  .stat .number { font-size: 32px; font-weight: 800; color: #d97706; }
  .stat .label { font-size: 13px; color: #92400e; margin-top: 4px; }
  
  h2 { font-size: 22px; font-weight: 700; margin: 28px 0 16px; padding-bottom: 8px; border-bottom: 3px solid #f59e0b; }
  
  .module-grid { display: grid; gap: 12px; }
  .module { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
  .module.perfect { border-left: 4px solid #22c55e; }
  .module.mixed { border-left: 4px solid #f59e0b; }
  .module.rough { border-left: 4px solid #ef4444; }
  .module .name { font-weight: 700; font-size: 15px; }
  .module .meta { font-size: 13px; color: #78716c; }
  .module .clicks { display: flex; gap: 6px; align-items: center; }
  .module .dot { width: 10px; height: 10px; border-radius: 50%; }
  .module .dot.landed { background: #22c55e; }
  .module .dot.rolled { background: #ef4444; }
  
  .issues { margin: 16px 0; }
  .issue { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f5f5f4; }
  .issue .check { color: #22c55e; font-weight: bold; }
  
  .timeline { position: relative; padding-left: 24px; border-left: 3px solid #f59e0b; margin: 16px 0; }
  .timeline .event { padding: 12px 0 12px 20px; position: relative; }
  .timeline .event::before { content: ''; position: absolute; left: -32px; top: 18px; width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; border: 3px solid #fff; box-shadow: 0 0 0 2px #f59e0b; }
  .timeline .event .time { font-size: 12px; color: #a8a29e; font-weight: 600; }
  .timeline .event .desc { font-size: 14px; }
  
  .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e7e5e4; text-align: center; font-size: 12px; color: #a8a29e; }
  .footer a { color: #d97706; }
</style>
</head>
<body>

<div class="hero">
  <h1>Deuce Diary - Sequential Ratchet Run</h1>
  <div class="subtitle">Full codebase improvement sweep &middot; 13 modules &middot; ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
  <div class="score-hero">
    <div class="score-box">
      <div class="label">Before</div>
      <div class="value">${startScore}</div>
    </div>
    <div class="score-arrow" style="font-family: Arial, sans-serif;">&#x2192;</div>
    <div class="score-box">
      <div class="label">After</div>
      <div class="value">${endScore}</div>
    </div>
    <div class="score-box" style="margin-left: auto;">
      <div class="label">Issues Fixed</div>
      <div class="value">${allIssues.length}</div>
    </div>
  </div>
</div>

<div class="stats">
  <div class="stat">
    <div class="number">${totalClicks}</div>
    <div class="label">Total Clicks</div>
  </div>
  <div class="stat">
    <div class="number">${totalLanded}</div>
    <div class="label">Landed</div>
  </div>
  <div class="stat">
    <div class="number">${totalRolledBack}</div>
    <div class="label">Rolled Back</div>
  </div>
  <div class="stat">
    <div class="number">${Math.round(totalLanded / totalClicks * 100)}%</div>
    <div class="label">Success Rate</div>
  </div>
</div>

<h2>Module Results</h2>
<div class="module-grid">
${results.map(r => {
  const cls = r.rolledBack === 0 ? 'perfect' : r.landed > r.rolledBack ? 'mixed' : 'rough';
  const dots = Array(r.landed).fill('<span class="dot landed"></span>').concat(
    Array(r.rolledBack).fill('<span class="dot rolled"></span>')
  ).join('');
  return `<div class="module ${cls}">
    <div>
      <div class="name">${r.name}</div>
      <div class="meta">${r.duration} | ${r.issuesFixed.length ? r.issuesFixed.join(', ') : 'structural improvements'}</div>
    </div>
    <div class="clicks">${dots}</div>
  </div>`;
}).join('\n')}
</div>

<h2>Issues Fixed</h2>
<div class="issues">
${allIssues.length > 0 ? allIssues.map(i => `<div class="issue"><span class="check" style="font-family: Arial, sans-serif;">&#x2713;</span> ${i}</div>`).join('\n') : '<div class="issue">Structural improvements - refactoring, deduplication, error handling</div>'}
</div>

<h2>Current Score Breakdown</h2>
<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
<tr style="background: #fef3c7;">
  <th style="text-align: left; padding: 10px;">Category</th>
  <th style="text-align: center; padding: 10px;">Score</th>
  <th style="text-align: center; padding: 10px;">Max</th>
</tr>
<tr><td style="padding: 8px 10px;">Testing</td><td style="text-align: center;">17</td><td style="text-align: center;">20</td></tr>
<tr style="background:#fafaf9;"><td style="padding: 8px 10px;">Security</td><td style="text-align: center;">14</td><td style="text-align: center;">16</td></tr>
<tr><td style="padding: 8px 10px;">Type Safety</td><td style="text-align: center;">8</td><td style="text-align: center;">12</td></tr>
<tr style="background:#fafaf9;"><td style="padding: 8px 10px;">Error Handling</td><td style="text-align: center;">7</td><td style="text-align: center;">14</td></tr>
<tr><td style="padding: 8px 10px;">Performance</td><td style="text-align: center;">5</td><td style="text-align: center;">14</td></tr>
<tr style="background:#fafaf9;"><td style="padding: 8px 10px;">Code Quality</td><td style="text-align: center;">9</td><td style="text-align: center;">24</td></tr>
<tr style="background:#f59e0b; color: white; font-weight: bold;">
  <td style="padding: 10px;">TOTAL</td>
  <td style="text-align: center;">60</td>
  <td style="text-align: center;">100</td>
</tr>
</table>

<h2>Top Remaining Issues</h2>
<div class="issues">
  <div class="issue"><span style="color:#ef4444;font-weight:bold;">!</span> 117 source files without tests (Coverage)</div>
  <div class="issue"><span style="color:#ef4444;font-weight:bold;">!</span> 688 repeated code lines (Duplication)</div>
  <div class="issue"><span style="color:#f59e0b;font-weight:bold;">!</span> 462 long lines > 120 chars</div>
  <div class="issue"><span style="color:#f59e0b;font-weight:bold;">!</span> 181 any types</div>
  <div class="issue"><span style="color:#f59e0b;font-weight:bold;">!</span> 64 functions > 50 lines</div>
  <div class="issue"><span style="color:#f59e0b;font-weight:bold;">!</span> 42 async functions without error handling</div>
  <div class="issue"><span style="color:#f59e0b;font-weight:bold;">!</span> 37 console.log calls</div>
  <div class="issue"><span style="color:#f59e0b;font-weight:bold;">!</span> 3 empty catch blocks</div>
</div>

<div class="footer">
  <p>Generated by <strong>Ratchet</strong> | ${new Date().toISOString()}</p>
  <p style="margin-top: 4px;">13 modules | ${totalClicks} clicks | ${totalLanded} landed | Score ${startScore} to ${endScore}</p>
</div>

</body>
</html>`;

async function main() {
  const outDir = join(process.cwd(), 'docs');
  mkdirSync(outDir, { recursive: true });
  
  const htmlPath = join(outDir, 'dd-sequential-report.html');
  writeFileSync(htmlPath, html);
  
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfPath = join(outDir, 'dd-sequential-run-report.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  });
  
  await browser.close();
  console.log(`✅ PDF generated: ${pdfPath}`);
}

main().catch(console.error);
