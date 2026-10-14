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
                const span = el('span', cls === 'plain' ? '' : 't-' + cls, text);
                body.appendChild(span);
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
    // A random track from the playlist is chosen on every load and shown in a
    // corner player. Autoplay (muted or not) is not possible with a Spotify
    // embed, so the visitor presses its play button. Nothing starts by itself.
    const playlist = window.PORTFOLIO_PLAYLIST;
    const dock = document.getElementById('music-dock');
    if (dock && playlist && Array.isArray(playlist.tracks) && playlist.tracks.length) {
        const trackHost = document.getElementById('dock-track');
        const listHost = document.getElementById('dock-playlist');
        const titleEl = document.getElementById('dock-title');
        const toggle = document.getElementById('dock-toggle');
        const shuffle = document.getElementById('dock-shuffle');
        const more = dock.querySelector('.dock-more');
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
        }

        // Start collapsed on phones so it never covers the page.
        setOpen(!window.matchMedia('(max-width: 768px)').matches);

        toggle.addEventListener('click', () => setOpen(dock.classList.contains('collapsed')));
        shuffle.addEventListener('click', pick);
        more.addEventListener('toggle', () => {
            if (more.open && !listHost.firstChild) {
                listHost.appendChild(frame(playlist.embedUrl, 'Spotify playlist: ' + playlist.title, 352));
            }
        });

        pick();
        dock.hidden = false;
    }
})();
