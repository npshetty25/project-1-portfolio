/*
 * Renders data-driven sections (projects, music) from js/data/*.js.
 * Loaded before script.js so the markup exists when scroll-reveal and the
 * sliders initialise. All text goes through textContent, never innerHTML.
 */
(function () {
    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // ---------- media ----------
    function terminal(media) {
        const wrap = el('div', 'project-terminal');
        wrap.setAttribute('role', 'img');
        wrap.setAttribute('aria-label', media.title + '. ' + media.label + '.');

        const bar = el('div', 'terminal-bar');
        ['term-red', 'term-amber', 'term-green'].forEach(c => bar.appendChild(el('span', 'term-dot ' + c)));
        bar.appendChild(el('span', 'terminal-title', media.title));
        wrap.appendChild(bar);

        const body = el('pre', 'terminal-body');
        body.setAttribute('aria-hidden', 'true');
        media.lines.forEach((segments, i) => {
            segments.forEach(([cls, text]) => {
                body.appendChild(cls === 'plain'
                    ? document.createTextNode(text)
                    : el('span', 't-' + cls, text));
            });
            if (i < media.lines.length - 1) body.appendChild(document.createTextNode('\n'));
        });
        wrap.appendChild(body);

        const caption = el('p', 'media-caption', media.label);
        const frag = document.createDocumentFragment();
        frag.appendChild(wrap);
        frag.appendChild(caption);
        return frag;
    }

    function slider(project) {
        const id = 'slider-' + project.id;
        const wrap = el('div', 'project-slider');
        wrap.id = id;
        wrap.setAttribute('role', 'group');
        wrap.setAttribute('aria-roledescription', 'carousel');
        wrap.setAttribute('aria-label', project.title + ' screenshots');

        const track = el('div', 'slider-track');
        const dots = el('div', 'slider-dots');
        project.media.images.forEach(([src, alt, fit], i) => {
            const img = el('img', 'slider-img' + (fit === 'contain' ? ' slider-img--contain' : ''));
            img.src = src;
            img.alt = alt;
            img.loading = 'lazy';
            img.decoding = 'async';
            track.appendChild(img);

            const dot = el('button', 'dot' + (i === 0 ? ' active' : ''));
            dot.type = 'button';
            dot.dataset.index = String(i);
            dot.setAttribute('aria-label', 'Show screenshot ' + (i + 1) + ' of ' + project.media.images.length);
            dots.appendChild(dot);
        });
        wrap.appendChild(track);
        wrap.appendChild(dots);
        return wrap;
    }

    function image(media) {
        const img = el('img', 'project-img');
        img.src = media.src;
        img.alt = media.alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        return img;
    }

    function mediaFor(project) {
        switch (project.media.type) {
            case 'terminal': return terminal(project.media);
            case 'slider': return slider(project);
            case 'image': return image(project.media);
            default: return document.createDocumentFragment();
        }
    }

    // ---------- project card ----------
    function card(project) {
        const article = el('article', 'project-card');
        article.dataset.groups = project.groups.join(' ');
        if (project.featured) article.classList.add('project-card--featured');
        const media = el('div', 'project-media');
        media.appendChild(mediaFor(project));
        article.appendChild(media);

        const body = el('div', 'project-content');
        body.appendChild(el('p', 'project-category', project.category));
        body.appendChild(el('h3', '', project.title));
        body.appendChild(el('p', 'project-summary', project.summary));

        const details = el('details', 'project-details');
        details.appendChild(el('summary', '', 'How it works'));
        details.appendChild(el('p', '', project.description));
        const list = el('ul', 'project-highlights');
        project.highlights.forEach(h => list.appendChild(el('li', '', h)));
        details.appendChild(list);
        body.appendChild(details);

        const tags = el('div', 'tags');
        project.tags.forEach(t => tags.appendChild(el('span', 'tag', t)));
        body.appendChild(tags);

        if (project.links.length) {
            const links = el('div', 'project-links');
            project.links.forEach(l => {
                const a = el('a', 'project-link', l.label);
                a.href = l.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                links.appendChild(a);
            });
            body.appendChild(links);
        }
        if (project.note) body.appendChild(el('p', 'project-note', project.note));

        article.appendChild(body);
        return article;
    }

    const projects = window.PORTFOLIO_PROJECTS;
    const grid = document.getElementById('projects-grid');
    if (grid && Array.isArray(projects)) {
        grid.textContent = '';
        projects.forEach(p => grid.appendChild(card(p)));
    }

    // ---------- filters ----------
    const filterBar = document.getElementById('project-filters');
    if (grid && filterBar && Array.isArray(projects) && projects.length >= 6) {
        const groups = [['all', 'All'], ['ai', 'AI'], ['realtime', 'Real-time'], ['web', 'Web'], ['data', 'Data']];
        groups.forEach(([key, label], i) => {
            const b = el('button', 'filter-chip', label);
            b.type = 'button';
            b.dataset.filter = key;
            b.setAttribute('aria-pressed', String(i === 0));
            b.addEventListener('click', () => {
                filterBar.querySelectorAll('.filter-chip').forEach(c => c.setAttribute('aria-pressed', String(c === b)));
                grid.querySelectorAll('.project-card').forEach(card => {
                    const show = key === 'all' || card.dataset.groups.split(' ').includes(key);
                    card.hidden = !show;
                });
            });
            filterBar.appendChild(b);
        });
        filterBar.hidden = false;
    }

    // ---------- music dock ----------
    // A random track from the playlist is chosen on every load. Spotify embeds
    // cannot autoplay (muted or otherwise), so the visitor presses play.
    // The dock can be dragged anywhere (grip, or the title area), nudged with
    // the arrow keys, and minimised. It deliberately has no close button.
    const playlist = window.PORTFOLIO_PLAYLIST;
    const dock = document.getElementById('music-dock');
    if (dock && playlist && Array.isArray(playlist.tracks) && playlist.tracks.length) {
        const trackHost = document.getElementById('dock-track');
        const titleEl = document.getElementById('dock-title');
        const toggle = document.getElementById('dock-toggle');
        const shuffle = document.getElementById('dock-shuffle');
        const bar = document.getElementById('dock-bar');
        const grip = document.getElementById('dock-grip');
        const POS_KEY = 'dock-pos';
        let current = -1;

        function frame(src, title, height) {
            const f = document.createElement('iframe');
            f.src = src;
            f.title = title;
            f.width = '100%';
            f.height = String(height);
            f.loading = 'lazy';
            f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            return f;
        }

        function pick() {
            const n = playlist.tracks.length;
            let i = Math.floor(Math.random() * n);
            if (n > 1 && i === current) i = (i + 1) % n;
            current = i;
            const t = playlist.tracks[i];
            titleEl.textContent = t.title + ' \u2014 ' + t.artist;
            trackHost.textContent = '';
            trackHost.appendChild(frame(
                'https://open.spotify.com/embed/track/' + t.id,
                'Spotify player: ' + t.title + ' by ' + t.artist, 152));
        }

        function setOpen(open) {
            dock.classList.toggle('collapsed', !open);
            toggle.setAttribute('aria-expanded', String(open));
            const label = open ? 'Minimize player' : 'Expand player';
            toggle.setAttribute('aria-label', label);
            toggle.title = label.replace(' player', '');
        }

        // ----- position -----
        function clamp(x, y) {
            const w = dock.offsetWidth, h = dock.offsetHeight;
            return [
                Math.min(Math.max(8, x), Math.max(8, window.innerWidth - w - 8)),
                Math.min(Math.max(8, y), Math.max(8, window.innerHeight - h - 8))
            ];
        }
        function place(x, y) {
            const [cx, cy] = clamp(x, y);
            dock.style.left = cx + 'px';
            dock.style.top = cy + 'px';
            dock.style.right = 'auto';
            dock.style.bottom = 'auto';
            return [cx, cy];
        }
        function savePos(x, y) {
            try { sessionStorage.setItem(POS_KEY, JSON.stringify([x, y])); } catch (e) { /* optional */ }
        }
        function restorePos() {
            try {
                const p = JSON.parse(sessionStorage.getItem(POS_KEY));
                if (Array.isArray(p)) place(p[0], p[1]);
            } catch (e) { /* optional */ }
        }

        let drag = null;
        let moved = false;
        bar.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.dock-btn')) return;
            const rect = dock.getBoundingClientRect();
            drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top, sx: e.clientX, sy: e.clientY };
            moved = false;
            bar.setPointerCapture(e.pointerId);
        });
        bar.addEventListener('pointermove', (e) => {
            if (!drag) return;
            if (!moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 4) return;
            moved = true;
            dock.classList.add('dragging');
            place(e.clientX - drag.dx, e.clientY - drag.dy);
        });
        function endDrag() {
            if (!drag) return;
            drag = null;
            dock.classList.remove('dragging');
            if (moved) {
                const rect = dock.getBoundingClientRect();
                savePos(rect.left, rect.top);
            }
        }
        bar.addEventListener('pointerup', endDrag);
        bar.addEventListener('pointercancel', endDrag);

        // Keyboard alternative to dragging.
        grip.addEventListener('keydown', (e) => {
            const step = e.shiftKey ? 80 : 20;
            const dir = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
            if (!dir) return;
            e.preventDefault();
            const rect = dock.getBoundingClientRect();
            const [x, y] = place(rect.left + dir[0], rect.top + dir[1]);
            savePos(x, y);
        });

        window.addEventListener('resize', () => {
            if (dock.style.left) {
                const rect = dock.getBoundingClientRect();
                place(rect.left, rect.top);
            }
        }, { passive: true });

        // Start collapsed on phones so it never covers the page.
        setOpen(!window.matchMedia('(max-width: 768px)').matches);

        toggle.addEventListener('click', () => {
            setOpen(dock.classList.contains('collapsed'));
            if (dock.style.left) {
                const rect = dock.getBoundingClientRect();
                place(rect.left, rect.top);
            }
        });
        shuffle.addEventListener('click', pick);

        pick();
        dock.hidden = false;
        restorePos();
    }
})();
