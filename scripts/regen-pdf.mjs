#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';

const cwd = process.cwd();
const runsDir = join(cwd, '.ratchet', 'runs');
const runFiles = readdirSync(runsDir).filter(f => f.endsWith('.json'))
  .map(f => ({ name: f, mtime: statSync(join(runsDir, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime);

const data = JSON.parse(readFileSync(join(runsDir, runFiles[0].name), 'utf8'));
const run = data.run;
const beforeScan = data.scoreBefore;
const afterScan = data.scoreAfter;
const clicks = run.clicks || [];
const landed = clicks.filter(c => c.testsPassed);
const rolledBack = clicks.filter(c => !c.testsPassed);

console.log(`Run: ${runFiles[0].name} | Clicks: ${clicks.length} | Score: ${beforeScan.total} → ${afterScan.total}`);

function sanitizeFilePath(f) {
  return f.replace(/`/g, '').replace(/^\/Users\/[^/]+\/[^/]+\/[^/]+\//, '');
}
function sanitizeProposal(raw, fileCount) {
  if (!raw) return 'Fixed issues across ' + fileCount + ' file' + (fileCount !== 1 ? 's' : '');
  // Extract the issue type from the prompt (e.g. "ISSUE: any types")
  const issueMatch = raw.match(/ISSUE:\s*(.+)/i);
  const issueType = issueMatch ? issueMatch[1].trim() : null;
  if (issueType) {
    return 'Replaced ' + issueType + ' across ' + fileCount + ' file' + (fileCount !== 1 ? 's' : '') + ' with proper type annotations';
  }
  return 'Fixed issues across ' + fileCount + ' file' + (fileCount !== 1 ? 's' : '');
}
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function scoreColor(p) { return p >= 0.8 ? '#22c55e' : p >= 0.6 ? '#f59e0b' : '#ef4444'; }
function sevColor(s) { return s === 'high' ? '#ef4444' : s === 'medium' ? '#f59e0b' : '#6b7280'; }
function sevBg(s) { return s === 'high' ? '#2d1215' : s === 'medium' ? '#2d2412' : '#1f1f23'; }

const scoreBefore = beforeScan.total, scoreAfter = afterScan.total;
const scoreDelta = scoreAfter - scoreBefore;
const deltaStr = scoreDelta > 0 ? '+' + scoreDelta : String(scoreDelta);
const deltaColor = scoreDelta > 0 ? '#22c55e' : scoreDelta < 0 ? '#ef4444' : '#9ca3af';
const issuesBefore = beforeScan.totalIssuesFound, issuesAfter = afterScan.totalIssuesFound;
const issuesFixed = issuesBefore - issuesAfter;
const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const beforeMap = {};
(beforeScan.issuesByType || []).forEach(i => { beforeMap[i.description] = { count: i.count, severity: i.severity }; });
const issueDeltaRows = (afterScan.issuesByType || [])
  .map(a => { const b = beforeMap[a.description]; if (!b) return null; return { desc: a.description, severity: a.severity, before: b.count, after: a.count, diff: a.count - b.count }; })
  .filter(Boolean).sort((a, b) => a.diff - b.diff);

const catRows = (afterScan.categories || []).map((a, i) => {
  const b = (beforeScan.categories || [])[i]; if (!b) return null;
  return { name: a.name, emoji: a.emoji, scoreBefore: b.score, scoreAfter: a.score, max: a.max, diff: a.score - b.score };
}).filter(Boolean);

const durationMs = run.finishedAt && run.startedAt ? new Date(run.finishedAt) - new Date(run.startedAt) : 0;
const mins = Math.floor(durationMs / 60000), secs = Math.round((durationMs % 60000) / 1000);
const duration = mins > 0 ? mins + 'm ' + secs + 's' : secs + 's';

const clickCards = clicks.map(c => {
  const icon = c.testsPassed ? '✅' : '↩️';
  const label = c.testsPassed ? 'Landed' : 'Rolled back';
  const lc = c.testsPassed ? '#22c55e' : '#f59e0b';
  const cf = (c.filesModified || []).map(sanitizeFilePath);
  const files = cf.slice(0, 4).map(f => f.split('/').slice(-2).join('/')).join(', ');
  const extra = cf.length > 4 ? ' +' + (cf.length - 4) + ' more' : '';
  const summary = sanitizeProposal(c.proposal || c.analysis || '', cf.length);
  return `<div class="click-row"><div class="click-head"><span class="click-icon">${icon}</span><span class="click-label">Click ${c.number}</span><span style="color:${lc};font-size:12px;font-weight:600;">${label}</span></div>${summary ? `<div class="click-proposal">${esc(summary)}</div>` : ''}${files ? `<div class="click-files" style="margin-top:4px;">${esc(files)}${esc(extra)}</div>` : ''}</div>`;
}).join('');

const html = `<!DOCTYPE html><html><head><style>
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;background:#0a0a0a;color:#fafafa;-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:210mm;padding:40px 52px 24px;position:relative}.section-title{font-size:22px;font-weight:700;margin-bottom:5px}.section-sub{font-size:13px;color:#71717a;margin-bottom:24px}.watermark{position:absolute;bottom:20px;right:52px;font-size:10px;color:#3f3f46}.tag{display:inline-block;background:#1f1a0f;color:#f59e0b;padding:4px 12px;border-radius:14px;font-size:11px;font-weight:600;letter-spacing:.3px;border:1px solid #3d2e0a;margin-bottom:22px}.score-block{background:#151518;border:1px solid #27272a;border-radius:16px;padding:28px 36px;margin-bottom:24px}.score-row{display:flex;align-items:center;justify-content:center;gap:40px;margin-bottom:16px}.score-col{text-align:center}.score-label{font-size:10px;color:#71717a;font-weight:700;letter-spacing:.8px;margin-bottom:8px}.score-num{font-size:56px;font-weight:800;line-height:1}.score-track{width:120px;height:6px;background:#27272a;border-radius:3px;margin:8px auto 0}.score-fill{height:6px;border-radius:3px}.delta-big{font-size:32px;font-weight:800;text-align:center}.stat-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px}.stat-box{background:#151518;border:1px solid #27272a;border-radius:12px;padding:18px;text-align:center}.stat-num{font-size:28px;font-weight:800;margin-bottom:3px}.stat-label{font-size:11px;color:#71717a}table{width:100%;border-collapse:collapse}th{text-align:left;padding:9px 12px;font-size:10px;color:#71717a;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #27272a}td{padding:10px 12px;font-size:13px;border-bottom:1px solid #18181b}.pill{display:inline-block;padding:2px 9px;border-radius:9px;font-size:10px;font-weight:600}.click-row{background:#151518;border:1px solid #27272a;border-radius:10px;padding:14px 18px;margin-bottom:8px}.click-head{display:flex;align-items:center;gap:10px;margin-bottom:4px}.click-icon{font-size:14px}.click-label{font-size:13px;font-weight:600}.click-files{font-size:11px;color:#71717a}.click-proposal{font-size:11px;color:#a1a1aa;line-height:1.5;margin-top:4px}
</style></head><body>

<div class="page">
  <div class="tag">⚙️ RATCHET IMPROVEMENT REPORT · ${dateStr}</div>
  <div class="section-title">Before &amp; After</div>
  <div class="section-sub">Autonomous code improvement run on DeuceDiary</div>
  <div class="score-block">
    <div class="score-row">
      <div class="score-col"><div class="score-label">BEFORE</div><div class="score-num" style="color:${scoreColor(scoreBefore/100)}">${scoreBefore}</div><div class="score-track"><div class="score-fill" style="width:${scoreBefore}%;background:${scoreColor(scoreBefore/100)};"></div></div></div>
      <div class="score-col"><div style="font-size:28px;color:#3f3f46;">→</div><div class="delta-big" style="color:${deltaColor}">${deltaStr}</div><div style="font-size:11px;color:#71717a;margin-top:4px;text-align:center;">points</div></div>
      <div class="score-col"><div class="score-label">AFTER</div><div class="score-num" style="color:${scoreColor(scoreAfter/100)}">${scoreAfter}</div><div class="score-track"><div class="score-fill" style="width:${scoreAfter}%;background:${scoreColor(scoreAfter/100)};"></div></div></div>
    </div>
    <div style="text-align:center;font-size:13px;color:#71717a;">Issues: <strong style="color:#fafafa;">${issuesBefore}</strong> → <strong style="color:#fafafa;">${issuesAfter}</strong>${issuesFixed > 0 ? ` <span style="color:#22c55e;">(${issuesFixed} fixed)</span>` : ''}</div>
  </div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-num" style="color:#f59e0b;">${clicks.length}</div><div class="stat-label">Clicks run</div></div>
    <div class="stat-box"><div class="stat-num" style="color:#22c55e;">${landed.length}</div><div class="stat-label">Landed clean</div></div>
    <div class="stat-box"><div class="stat-num" style="color:${rolledBack.length > 0 ? '#ef4444' : '#71717a'};">${rolledBack.length}</div><div class="stat-label">Rolled back</div></div>
    <div class="stat-box"><div class="stat-num" style="color:#3b82f6;">${duration}</div><div class="stat-label">Total time</div></div>
  </div>
  <div class="section-title" style="margin-top:28px;">Issues Fixed</div>
  <div class="section-sub">All issue types detected — counts before and after the run</div>
  <table><thead><tr><th>Issue</th><th>Severity</th><th style="text-align:right;">Before</th><th style="text-align:right;">After</th><th style="text-align:right;">Change</th></tr></thead><tbody>
  ${issueDeltaRows.map(r => { const ds = r.diff < 0 ? '−'+Math.abs(r.diff) : r.diff > 0 ? '+'+r.diff : '—'; const dc = r.diff < 0 ? '#22c55e' : r.diff > 0 ? '#ef4444' : '#71717a'; return `<tr><td>${esc(r.desc)}</td><td><span class="pill" style="background:${sevBg(r.severity)};color:${sevColor(r.severity)};">${r.severity}</span></td><td style="text-align:right;color:#a1a1aa;">${r.before}</td><td style="text-align:right;font-weight:600;">${r.after}</td><td style="text-align:right;font-weight:700;color:${dc};">${ds}</td></tr>`; }).join('')}
  </tbody></table>
  <div class="section-title" style="margin-top:28px;">Score Breakdown</div>
  <div class="section-sub">Category-by-category improvement</div>
  <table style="margin-bottom:32px;"><thead><tr><th>Category</th><th style="text-align:right;">Before</th><th style="text-align:right;">After</th><th style="text-align:right;">Max</th><th style="text-align:right;">Change</th></tr></thead><tbody>
  ${catRows.map(r => { const ds = r.diff > 0 ? '+'+r.diff : r.diff < 0 ? String(r.diff) : '—'; const dc = r.diff > 0 ? '#22c55e' : r.diff < 0 ? '#ef4444' : '#71717a'; const p = Math.round((r.scoreAfter/r.max)*100); return `<tr><td>${esc(r.emoji)} ${esc(r.name)}</td><td style="text-align:right;color:#a1a1aa;">${r.scoreBefore}</td><td style="text-align:right;font-weight:600;color:${scoreColor(r.scoreAfter/r.max)};">${r.scoreAfter}</td><td style="text-align:right;color:#3f3f46;">${r.max}</td><td style="text-align:right;font-weight:700;color:${dc};">${ds}</td></tr><tr><td colspan="5" style="padding:4px 12px 12px;"><div style="width:100%;height:4px;background:#27272a;border-radius:2px;"><div style="width:${p}%;height:4px;background:${scoreColor(r.scoreAfter/r.max)};border-radius:2px;"></div></div></td></tr>`; }).join('')}
  </tbody></table>
  <div style="text-align:center;margin-top:32px;padding:16px 0;border-top:1px solid #27272a;font-size:10px;color:#3f3f46;">ratchet — autonomous code improvement</div>
</div>

</body></html>`;

const outPath = join(cwd, 'docs', 'improve-report.pdf');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({ path: outPath, width: '210mm', height: '297mm', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' }, preferCSSPageSize: true });
await browser.close();
console.log(`PDF saved: ${outPath} (${Math.round(readFileSync(outPath).length / 1024)} KB)`);
