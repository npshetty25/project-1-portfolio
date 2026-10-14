/*
 * Scroll motion for the projects section. Two ideas, both progressive:
 *   1. each project's media is unmasked as the card enters,
 *   2. media eases from a slight zoom to rest as the card crosses the screen.
 * Nothing here is needed to read the content; it is skipped entirely under
 * prefers-reduced-motion, and the rules only apply once the class below is set.
 */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    root.classList.add('js-motion');

    const cards = [...document.querySelectorAll('.project-card')];
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
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    requestTick();
})();
