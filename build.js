const fs = require('fs');
const path = require('path');

const MD_PATH = '/Users/dprabhakara/Desktop/analytics-agent-research/ai-pmm-competitive-intel.md';
const OUT_PATH = '/Users/dprabhakara/ai_workspace/ai-pmm-intel-site/index.html';

async function main() {
const { marked } = require('/Users/dprabhakara/ai_workspace/ai-pmm-intel-site/node_modules/marked');

// Configure marked to add anchor IDs to headings
const renderer = new marked.Renderer();
const slug = (s) => s.toLowerCase()
  .replace(/[^\w\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

const tocEntries = [];
// marked v12 API: heading(text, level, raw)
renderer.heading = (text, level, raw) => {
  const plainText = String(raw || text).replace(/<[^>]+>/g, '');
  const id = slug(plainText);
  if (level <= 3) tocEntries.push({ depth: level, text: plainText, id });
  return `<h${level} id="${id}"><a href="#${id}" class="anchor">#</a>${text}</h${level}>\n`;
};

// marked v12 API: table(header, body) where both are pre-rendered HTML strings
renderer.table = (header, body) => {
  return `<div class="table-wrap"><table>\n<thead>${header}</thead>\n<tbody>${body}</tbody></table></div>\n`;
};

marked.setOptions({ renderer, gfm: true, breaks: false });

const md = fs.readFileSync(MD_PATH, 'utf-8');
const body = marked.parse(md);

// Build sidebar TOC HTML
const tocHtml = tocEntries.map(e => {
  return `<a href="#${e.id}" class="toc-d${e.depth}">${e.text}</a>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI PMM Competitive Intel — Deepak Prabhakaran</title>
<meta name="description" content="Framework-driven benchmarking of AI product marketing and go-to-market positioning at QuickBooks, TurboTax, Klaviyo, and Salesforce.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #162251;
    --navy-2: #1e3a6e;
    --blue: #0070d2;
    --blue-soft: #4472c4;
    --teal: #00b9a9;
    --pink: #f4809b;
    --green: #1aab68;
    --red: #d13438;
    --bg: #f0f4f8;
    --surface: #ffffff;
    --text: #1a1f36;
    --text-2: #6b7c93;
    --border: #e8edf5;
    --shadow: 0 1px 4px rgba(26,40,96,.08);
    --shadow-lg: 0 8px 24px rgba(26,40,96,.12);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    font: 15px/1.65 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text);
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
  }

  /* Layout */
  .wrap {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    min-height: 100vh;
  }
  aside {
    position: sticky;
    top: 0;
    height: 100vh;
    background: var(--navy);
    color: #fff;
    padding: 28px 20px;
    overflow-y: auto;
  }
  aside .brand {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 4px;
  }
  aside .brand-sub {
    color: rgba(255,255,255,.55);
    font-size: 12px;
    margin-bottom: 28px;
  }
  aside nav { display: flex; flex-direction: column; gap: 2px; }
  aside nav a {
    color: rgba(255,255,255,.82);
    text-decoration: none;
    font-size: 13px;
    padding: 5px 10px;
    border-radius: 6px;
    line-height: 1.4;
    border-left: 2px solid transparent;
    transition: all .15s ease;
  }
  aside nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
  aside nav a.toc-d1 { font-weight: 600; margin-top: 14px; color: #fff; }
  aside nav a.toc-d2 { padding-left: 22px; }
  aside nav a.toc-d3 { padding-left: 34px; font-size: 12px; color: rgba(255,255,255,.62); }

  main {
    padding: 40px clamp(24px, 5vw, 80px);
    max-width: 1040px;
    width: 100%;
  }

  /* Header banner */
  .hero {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
    color: #fff;
    padding: 40px 36px;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    margin-bottom: 40px;
  }
  .hero .kicker {
    text-transform: uppercase;
    letter-spacing: .12em;
    font-size: 11px;
    color: rgba(255,255,255,.7);
    margin-bottom: 12px;
    font-weight: 600;
  }
  .hero h1 {
    font-size: clamp(26px, 3.5vw, 36px);
    font-weight: 700;
    margin: 0 0 10px 0;
    line-height: 1.2;
    color: #fff;
  }
  .hero .sub {
    color: rgba(255,255,255,.85);
    font-size: 16px;
    font-weight: 400;
  }
  .hero .meta {
    margin-top: 24px;
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    font-size: 13px;
    color: rgba(255,255,255,.7);
  }
  .hero .meta span b { color: #fff; font-weight: 600; }

  /* Typography for rendered markdown */
  main h1:not(.hero h1) {
    font-size: 28px; font-weight: 700; color: var(--navy);
    margin: 56px 0 20px 0; padding-bottom: 10px;
    border-bottom: 2px solid var(--navy);
  }
  main h2 {
    font-size: 22px; font-weight: 600; color: var(--navy-2);
    margin: 44px 0 16px 0;
  }
  main h3 {
    font-size: 17px; font-weight: 600; color: var(--blue);
    margin: 30px 0 10px 0;
  }
  main h4 {
    font-size: 15px; font-weight: 600; color: var(--text);
    margin: 20px 0 8px 0;
  }
  main .anchor {
    color: var(--border);
    text-decoration: none;
    margin-right: 8px;
    opacity: 0;
    transition: opacity .15s;
    font-weight: 400;
    font-size: .8em;
  }
  main h1:hover .anchor, main h2:hover .anchor, main h3:hover .anchor { opacity: 1; }

  main p { margin: 0 0 14px 0; color: var(--text); }
  main strong { font-weight: 600; color: var(--navy); }
  main em { font-style: italic; color: var(--navy-2); }
  main a { color: var(--blue); text-decoration: none; }
  main a:hover { text-decoration: underline; }

  /* Lists */
  main ul, main ol { padding-left: 24px; margin: 0 0 16px 0; }
  main li { margin-bottom: 6px; }
  main li::marker { color: var(--blue-soft); }

  /* Blockquotes (verbatim quotes) */
  main blockquote {
    border-left: 4px solid var(--teal);
    background: var(--surface);
    margin: 14px 0;
    padding: 14px 20px;
    color: var(--navy-2);
    font-style: italic;
    border-radius: 0 8px 8px 0;
    box-shadow: var(--shadow);
  }
  main blockquote p { margin: 0; }

  /* Inline code */
  main code {
    font: 13px/1.4 'JetBrains Mono', Menlo, monospace;
    background: #eef2f9;
    color: var(--navy);
    padding: 2px 6px;
    border-radius: 4px;
  }
  main pre {
    background: var(--navy);
    color: #d8e2f7;
    padding: 16px 20px;
    border-radius: 8px;
    overflow-x: auto;
    font: 13px/1.5 'JetBrains Mono', Menlo, monospace;
  }
  main pre code { background: transparent; color: inherit; padding: 0; }

  /* Tables */
  .table-wrap {
    overflow-x: auto;
    margin: 16px 0 28px 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    box-shadow: var(--shadow);
  }
  main table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  main thead tr { background: var(--navy); }
  main th {
    color: #fff; font-weight: 600;
    text-align: left; padding: 12px 14px;
    border-bottom: 1px solid var(--navy-2);
  }
  main td {
    padding: 11px 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  main tbody tr:nth-child(even) { background: #f7fafc; }
  main tbody tr:hover { background: #eef4fb; }
  main td:first-child { font-weight: 500; color: var(--navy); }

  /* HR */
  main hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 40px 0;
  }

  /* Footer */
  footer {
    margin: 80px 0 40px 0;
    padding: 24px 0 0 0;
    border-top: 1px solid var(--border);
    color: var(--text-2);
    font-size: 12px;
  }
  footer a { color: var(--blue); }

  /* Mobile */
  @media (max-width: 900px) {
    .wrap { grid-template-columns: 1fr; }
    aside {
      position: relative;
      height: auto;
      padding: 20px;
    }
    aside nav { flex-direction: row; flex-wrap: wrap; gap: 8px; max-height: 180px; overflow-y: auto; }
    aside nav a.toc-d3 { display: none; }
    main { padding: 24px 20px; }
    .hero { padding: 28px 24px; }
  }

  /* Print */
  @media print {
    aside { display: none; }
    .wrap { grid-template-columns: 1fr; }
    .hero { background: var(--navy) !important; -webkit-print-color-adjust: exact; }
    main { padding: 0; }
  }
</style>
</head>
<body>
<div class="wrap">
  <aside>
    <div class="brand">AI PMM Competitive Intel</div>
    <div class="brand-sub">Deepak Prabhakaran · Apr 2026</div>
    <nav>
${tocHtml}
    </nav>
  </aside>
  <main>
    <div class="hero">
      <div class="kicker">Research Report</div>
      <h1>AI Product Marketing &amp; GTM Competitive Intelligence</h1>
      <div class="sub">A framework-driven benchmarking of QuickBooks, TurboTax, Klaviyo, and Salesforce</div>
      <div class="meta">
        <span><b>Prepared by:</b> Deepak Prabhakaran</span>
        <span><b>Team:</b> Mailchimp Reporting &amp; Analytics</span>
        <span><b>Date:</b> April 23, 2026</span>
      </div>
    </div>
${body}
    <footer>
      <p>Sources verified through April 23, 2026 — see Appendix for primary URLs.<br>
      Word version: <code>AI-PMM-Competitive-Intel.docx</code> &middot; Repo: <a href="https://github.com/deepakp1308/ai-pmm-intel">deepakp1308/ai-pmm-intel</a></p>
    </footer>
  </main>
</div>
</body>
</html>
`;

fs.writeFileSync(OUT_PATH, html);
console.log('Wrote', OUT_PATH, '(' + Math.round(fs.statSync(OUT_PATH).size / 1024) + ' KB)');
console.log('TOC entries:', tocEntries.length);
}
main().catch(e => { console.error(e); process.exit(1); });
