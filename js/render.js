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
        project.media.images.forEach(([src, alt], i) => {
            const img = el('img', 'slider-img');
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
        article.dataset.category = project.category;
        article.appendChild(mediaFor(project));

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

    // ---------- music ----------
    const playlist = window.PORTFOLIO_PLAYLIST;
    const music = document.getElementById('music-player');
    if (music && playlist) {
        const load = document.getElementById('music-load');
        const frameHost = document.getElementById('music-frame');
        const link = document.getElementById('music-link');
        if (link) link.href = playlist.url;

        if (load && frameHost) {
            load.addEventListener('click', () => {
                const frame = document.createElement('iframe');
                frame.src = playlist.embedUrl;
                frame.title = 'Spotify playlist: ' + playlist.title;
                frame.width = '100%';
                frame.height = '352';
                frame.loading = 'lazy';
                frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
                frameHost.textContent = '';
                frameHost.appendChild(frame);
                load.hidden = true;
            }, { once: true });
        }
    }
})();
