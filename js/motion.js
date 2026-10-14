/*
 * Scroll motion for the projects section. Three ideas, all progressive:
 *   1. a kinetic type band whose rows slide in opposite directions as the
 *      section scrolls past,
 *   2. each project's media is unmasked as the card enters,
 *   3. media eases from a slight zoom to rest as the card crosses the screen.
 * Nothing here is needed to read the content; it is skipped entirely under
 * prefers-reduced-motion, and the rules only apply once the class below is set.
 */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.classList.add('js-motion');

    const cards = [...document.querySelectorAll('.project-card')];
    const rows = [...document.querySelectorAll('.kinetic-row')];
    const band = document.querySelector('.kinetic');
    const visible = new Set();

    // ----- unmask on enter -----
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    visible.add(entry.target);
                } else {
                    visible.delete(entry.target);
                }
            });
            requestTick();
        }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
        cards.forEach(c => io.observe(c));
    } else {
        cards.forEach(c => c.classList.add('in'));
    }

    // ----- scroll-linked values (one rAF per frame, only for what is near) -----
    let ticking = false;
    function requestTick() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    function update() {
        ticking = false;
        const vh = window.innerHeight;

        visible.forEach((card) => {
            const r = card.getBoundingClientRect();
            const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
            card.style.setProperty('--p', p.toFixed(3));
        });

        if (band) {
            const r = band.getBoundingClientRect();
            if (r.bottom > -200 && r.top < vh + 200) {
                const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
                rows.forEach((row) => {
                    const dir = Number(row.dataset.dir) || -1;
                    const travel = Math.max(0, row.scrollWidth - band.clientWidth);
                    const x = dir < 0 ? -p * travel : -(1 - p) * travel;
                    row.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
                });
            }
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    requestTick();
})();
