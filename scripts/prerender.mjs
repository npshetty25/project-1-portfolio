/*
 * Pre-renders the project cards from js/data/projects.js into
 * index_portfolio.html, between the PRERENDER markers.
 *
 * Why: js/render.js builds the cards in the browser, so anything that does
 * not run JavaScript (AI search summaries, link previewers, some recruiter
 * and ATS tools) would otherwise see an empty projects section. This writes
 * the same markup into the HTML so it is there before any script runs.
 * render.js still replaces it on load, so interactivity is unchanged.
 *
 * Run after editing js/data/projects.js:   node scripts/prerender.mjs
 * There is no build step on Vercel; the output is committed.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index_portfolio.html');

const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, 'js/data/projects.js'), 'utf8'), sandbox);
const projects = sandbox.window.PORTFOLIO_PROJECTS;
if (!Array.isArray(projects) || !projects.length) throw new Error('No projects found');

const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function terminal(m) {
    const body = m.lines
        .map(segs => segs.map(([c, t]) => (c === 'plain' ? esc(t) : `<span class="t-${c}">${esc(t)}</span>`)).join(''))
        .join('\n');
    return `<div class="project-terminal" role="img" aria-label="${esc(m.title + '. ' + m.label + '.')}">` +
        `<div class="terminal-bar"><span class="term-dot term-red"></span><span class="term-dot term-amber"></span>` +
        `<span class="term-dot term-green"></span><span class="terminal-title">${esc(m.title)}</span></div>` +
        `<pre class="terminal-body" aria-hidden="true">${body}</pre></div>` +
        `<p class="media-caption">${esc(m.label)}</p>`;
}

function slider(p) {
    const imgs = p.media.images.map(([src, alt, fit]) =>
        `<img class="slider-img${fit === 'contain' ? ' slider-img--contain' : ''}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`).join('');
    const dots = p.media.images.map((_, i) =>
        `<button class="dot${i === 0 ? ' active' : ''}" type="button" data-index="${i}" aria-label="Show screenshot ${i + 1} of ${p.media.images.length}"></button>`).join('');
    return `<div class="project-slider" id="slider-${esc(p.id)}" role="group" aria-roledescription="carousel" aria-label="${esc(p.title)} screenshots">` +
        `<div class="slider-track">${imgs}</div><div class="slider-dots">${dots}</div></div>`;
}

function media(p) {
    switch (p.media.type) {
        case 'terminal': return terminal(p.media);
        case 'slider': return slider(p);
        case 'image': return `<img class="project-img" src="${esc(p.media.src)}" alt="${esc(p.media.alt)}" loading="lazy" decoding="async">`;
        default: return '';
    }
}

function card(p) {
    const links = p.links.length
        ? `<div class="project-links">${p.links.map(l =>
            `<a class="project-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`).join('')}</div>`
        : '';
    return `<article class="project-card${p.featured ? ' project-card--featured' : ''}" data-groups="${esc(p.groups.join(' '))}">` +
        `<div class="project-media">${media(p)}</div>` +
        `<div class="project-content">` +
        `<p class="project-category">${esc(p.category)}</p>` +
        `<h3>${esc(p.title)}</h3>` +
        `<p class="project-summary">${esc(p.summary)}</p>` +
        `<details class="project-details"><summary>How it works</summary><p>${esc(p.description)}</p>` +
        `<ul class="project-highlights">${p.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul></details>` +
        `<div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` +
        links +
        (p.note ? `<p class="project-note">${esc(p.note)}</p>` : '') +
        `</div></article>`;
}

const START = '<!-- PRERENDER:PROJECTS:START -->';
const END = '<!-- PRERENDER:PROJECTS:END -->';
const html = readFileSync(htmlPath, 'utf8');
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a === -1 || b === -1 || b < a) throw new Error('PRERENDER markers not found in index_portfolio.html');

const indent = '                    ';
const out = html.slice(0, a + START.length) + '\n' +
    projects.map(p => indent + card(p)).join('\n') + '\n' + indent + html.slice(b);
writeFileSync(htmlPath, out, 'utf8');
console.log(`Pre-rendered ${projects.length} projects into index_portfolio.html`);
