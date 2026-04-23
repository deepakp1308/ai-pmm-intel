const fs = require('fs');
const path = require('path');

const SITE_DIR = '/Users/dprabhakara/ai_workspace/ai-pmm-intel-site';

const PAGES = [
  {
    slug: 'competitive-intel',
    tabLabel: 'Competitive Intel',
    title: 'AI PMM Competitive Intelligence',
    subtitle: 'A framework-driven benchmarking of QuickBooks, TurboTax, Klaviyo, and Salesforce',
    kicker: 'Research Report',
    mdPath: '/Users/dprabhakara/Desktop/analytics-agent-research/ai-pmm-competitive-intel.md',
    outPath: path.join(SITE_DIR, 'index.html'),
  },
  {
    slug: 'mailchimp-positioning',
    tabLabel: 'Mailchimp Analytics AI Positioning',
    title: 'Mailchimp Analytics AI — GTM & PMM Positioning',
    subtitle: 'Applying the framework to our own newly-GA\'d Analytics Agent',
    kicker: 'Positioning Plan',
    mdPath: '/Users/dprabhakara/Desktop/analytics-agent-research/mailchimp-analytics-ai-positioning.md',
    outPath: path.join(SITE_DIR, 'positioning/index.html'),
  },
];

async function main() {
  const { marked } = require(path.join(SITE_DIR, 'node_modules/marked'));
  const slug = (s) => s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

  for (const page of PAGES) {
    const renderer = new marked.Renderer();
    const tocEntries = [];

    renderer.heading = (text, level, raw) => {
      const plainText = String(raw || text).replace(/<[^>]+>/g, '');
      const id = slug(plainText);
      if (level <= 3) tocEntries.push({ depth: level, text: plainText, id });
      return `<h${level} id="${id}"><a href="#${id}" class="anchor">#</a>${text}</h${level}>\n`;
    };

    renderer.table = (header, body) =>
      `<div class="table-wrap"><table>\n<thead>${header}</thead>\n<tbody>${body}</tbody></table></div>\n`;

    marked.setOptions({ renderer, gfm: true, breaks: false });

    const md = fs.readFileSync(page.mdPath, 'utf-8');
    const body = marked.parse(md);

    const tocHtml = tocEntries.map(e => `<a href="#${e.id}" class="toc-d${e.depth}">${e.text}</a>`).join('\n');

    // Top nav with proper relative hrefs per page
    const topNav = PAGES.map(p => {
      const active = p.slug === page.slug ? ' class="active"' : '';
      let href;
      if (p.slug === page.slug) {
        href = '#';
      } else if (page.slug === 'competitive-intel' && p.slug === 'mailchimp-positioning') {
        href = 'positioning/';
      } else if (page.slug === 'mailchimp-positioning' && p.slug === 'competitive-intel') {
        href = '../';
      } else {
        href = '#';
      }
      return `      <a href="${href}"${active}>${p.tabLabel}</a>`;
    }).join('\n');

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title} — Deepak Prabhakaran</title>
<meta name="description" content="${page.subtitle}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #162251; --navy-2: #1e3a6e; --blue: #0070d2; --blue-soft: #4472c4;
    --teal: #00b9a9; --pink: #f4809b; --green: #1aab68; --red: #d13438;
    --bg: #f0f4f8; --surface: #ffffff; --text: #1a1f36; --text-2: #6b7c93;
    --border: #e8edf5;
    --shadow: 0 1px 4px rgba(26,40,96,.08);
    --shadow-lg: 0 8px 24px rgba(26,40,96,.12);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    font: 15px/1.65 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text); background: var(--bg);
    -webkit-font-smoothing: antialiased;
  }

  .topnav {
    position: sticky; top: 0; z-index: 50;
    background: var(--navy); color: #fff;
    padding: 0 clamp(16px, 4vw, 40px);
    display: flex; align-items: center; gap: 28px;
    border-bottom: 3px solid var(--teal);
    height: 54px; overflow-x: auto;
  }
  .topnav .brand {
    font-weight: 700; font-size: 14px;
    white-space: nowrap; padding-right: 16px;
    border-right: 1px solid rgba(255,255,255,.15);
    color: #fff;
  }
  .topnav a {
    color: rgba(255,255,255,.72); text-decoration: none;
    font-size: 14px; font-weight: 500;
    padding: 18px 4px; white-space: nowrap;
    border-bottom: 3px solid transparent; margin-bottom: -3px;
    transition: color .15s ease, border-color .15s ease;
  }
  .topnav a:hover { color: #fff; }
  .topnav a.active {
    color: #fff; border-bottom-color: var(--teal);
    font-weight: 600;
  }

  .wrap {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    min-height: calc(100vh - 54px);
  }
  aside {
    position: sticky; top: 54px;
    height: calc(100vh - 54px);
    background: #fff; border-right: 1px solid var(--border);
    padding: 28px 20px; overflow-y: auto;
  }
  aside .sidebar-brand {
    font-weight: 700; font-size: 13px; color: var(--navy);
    margin-bottom: 4px;
  }
  aside .sidebar-sub {
    color: var(--text-2); font-size: 12px; margin-bottom: 20px;
  }
  aside nav { display: flex; flex-direction: column; gap: 2px; }
  aside nav a {
    color: var(--text); text-decoration: none;
    font-size: 13px; padding: 5px 10px; border-radius: 6px;
    line-height: 1.4; border-left: 2px solid transparent;
    transition: all .15s ease;
  }
  aside nav a:hover { background: var(--bg); color: var(--blue); border-left-color: var(--blue-soft); }
  aside nav a.toc-d1 { font-weight: 600; margin-top: 10px; color: var(--navy); }
  aside nav a.toc-d2 { padding-left: 22px; color: var(--navy-2); }
  aside nav a.toc-d3 { padding-left: 34px; font-size: 12px; color: var(--text-2); }

  main {
    padding: 40px clamp(24px, 5vw, 80px);
    max-width: 1040px; width: 100%;
  }

  .hero {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%);
    color: #fff; padding: 40px 36px;
    border-radius: 12px; box-shadow: var(--shadow-lg);
    margin-bottom: 40px;
  }
  .hero .kicker {
    text-transform: uppercase; letter-spacing: .12em;
    font-size: 11px; color: rgba(255,255,255,.7);
    margin-bottom: 12px; font-weight: 600;
  }
  .hero h1 {
    font-size: clamp(26px, 3.5vw, 36px); font-weight: 700;
    margin: 0 0 10px 0; line-height: 1.2; color: #fff;
  }
  .hero .sub { color: rgba(255,255,255,.85); font-size: 16px; }
  .hero .meta {
    margin-top: 24px; display: flex; gap: 24px;
    flex-wrap: wrap; font-size: 13px; color: rgba(255,255,255,.7);
  }
  .hero .meta span b { color: #fff; font-weight: 600; }

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
    color: var(--border); text-decoration: none;
    margin-right: 8px; opacity: 0;
    transition: opacity .15s; font-weight: 400; font-size: .8em;
  }
  main h1:hover .anchor, main h2:hover .anchor, main h3:hover .anchor { opacity: 1; }

  main p { margin: 0 0 14px 0; color: var(--text); }
  main strong { font-weight: 600; color: var(--navy); }
  main em { font-style: italic; color: var(--navy-2); }
  main a { color: var(--blue); text-decoration: none; }
  main a:hover { text-decoration: underline; }

  main ul, main ol { padding-left: 24px; margin: 0 0 16px 0; }
  main li { margin-bottom: 6px; }
  main li::marker { color: var(--blue-soft); }

  main blockquote {
    border-left: 4px solid var(--teal);
    background: var(--surface);
    margin: 14px 0; padding: 14px 20px;
    color: var(--navy-2); font-style: italic;
    border-radius: 0 8px 8px 0;
    box-shadow: var(--shadow);
  }
  main blockquote p { margin: 0; }

  main code {
    font: 13px/1.4 'JetBrains Mono', Menlo, monospace;
    background: #eef2f9; color: var(--navy);
    padding: 2px 6px; border-radius: 4px;
  }
  main pre {
    background: var(--navy); color: #d8e2f7;
    padding: 16px 20px; border-radius: 8px;
    overflow-x: auto;
    font: 12px/1.5 'JetBrains Mono', Menlo, monospace;
  }
  main pre code { background: transparent; color: inherit; padding: 0; font-size: inherit; }

  .table-wrap {
    overflow-x: auto; margin: 16px 0 28px 0;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; box-shadow: var(--shadow);
  }
  main table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  main thead tr { background: var(--navy); }
  main th {
    color: #fff; font-weight: 600;
    text-align: left; padding: 12px 14px;
    border-bottom: 1px solid var(--navy-2);
  }
  main td {
    padding: 11px 14px; border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  main tbody tr:nth-child(even) { background: #f7fafc; }
  main tbody tr:hover { background: #eef4fb; }
  main td:first-child { font-weight: 500; color: var(--navy); }

  main hr { border: 0; border-top: 1px solid var(--border); margin: 40px 0; }

  footer {
    margin: 80px 0 40px 0; padding: 24px 0 0 0;
    border-top: 1px solid var(--border);
    color: var(--text-2); font-size: 12px;
  }
  footer a { color: var(--blue); }

  @media (max-width: 900px) {
    .wrap { grid-template-columns: 1fr; }
    aside {
      position: relative; top: auto; height: auto;
      padding: 16px 20px; max-height: 240px;
    }
    main { padding: 24px 20px; }
    .hero { padding: 28px 24px; }
  }

  @media print {
    .topnav, aside { display: none; }
    .wrap { grid-template-columns: 1fr; }
    .hero { background: var(--navy) !important; -webkit-print-color-adjust: exact; }
    main { padding: 0; }
  }
</style>
</head>
<body>
<nav class="topnav">
  <div class="brand">AI PMM · Deepak Prabhakaran</div>
${topNav}
</nav>
<div class="wrap">
  <aside>
    <div class="sidebar-brand">${page.tabLabel}</div>
    <div class="sidebar-sub">Apr 2026 · ${tocEntries.length} sections</div>
    <nav>
${tocHtml}
    </nav>
  </aside>
  <main>
    <div class="hero">
      <div class="kicker">${page.kicker}</div>
      <h1>${page.title}</h1>
      <div class="sub">${page.subtitle}</div>
      <div class="meta">
        <span><b>Prepared by:</b> Deepak Prabhakaran</span>
        <span><b>Team:</b> Mailchimp Reporting &amp; Analytics</span>
        <span><b>Date:</b> April 23, 2026</span>
      </div>
    </div>
${body}
    <footer>
      <p>Sources verified through April 23, 2026.<br>
      Repo: <a href="https://github.com/deepakp1308/ai-pmm-intel">deepakp1308/ai-pmm-intel</a></p>
    </footer>
  </main>
</div>
</body>
</html>
`;

    fs.mkdirSync(path.dirname(page.outPath), { recursive: true });
    fs.writeFileSync(page.outPath, html);
    const kb = Math.round(fs.statSync(page.outPath).size / 1024);
    console.log(`[${page.slug}] wrote ${page.outPath} (${kb} KB, ${tocEntries.length} TOC entries)`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
