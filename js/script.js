document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Storage can throw (private mode, blocked site data). One uncaught throw
    // here would halt the script before the reveal observer runs and leave the
    // whole page at opacity 0, so every access goes through these.
    const store = {
        get(key) {
            try { return localStorage.getItem(key); } catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* non-fatal */ }
        },
        remove(key) {
            try { localStorage.removeItem(key); } catch (e) { /* non-fatal */ }
        }
    };

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = store.get('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        store.set('theme', newTheme);
    });

    // ===== MOBILE NAV =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinksEl = document.getElementById('nav-links');

    const closeNav = () => {
        navLinksEl.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
    };

    navToggle.addEventListener('click', () => {
        const willOpen = !navLinksEl.classList.contains('open');
        navLinksEl.classList.toggle('open', willOpen);
        navToggle.classList.toggle('open', willOpen);
        navToggle.setAttribute('aria-expanded', String(willOpen));
        navToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close after picking a destination, and on Escape
    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    // ===== SCROLL REVEAL =====
    // threshold 0: a ratio threshold can never be met by an element taller than
    // ~10x the viewport (long project grids on phones), and any bottom inset
    // would strand elements at the very end of the page.
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0 };
    // Old WebViews and in-app browsers may lack IntersectionObserver; without
    // this guard the script would throw and leave every section hidden.
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.hidden').forEach(el => el.classList.add('show'));
        document.documentElement.classList.add('reveal-all');
    }
    const observer = !('IntersectionObserver' in window) ? null : new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (observer) document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // ===== ANIMATED STAT COUNTERS =====
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) {
            el.textContent = target + suffix;
            return;
        }
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            // ease-out so it settles rather than stopping abruptly
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl && 'IntersectionObserver' in window) {
        // The HTML carries the real numbers so readers without JavaScript see
        // them; start the count-up from zero only where it will actually run.
        if (!reduceMotion) {
            statsEl.querySelectorAll('.stat-num').forEach(el => { el.textContent = '0'; });
        }
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-num').forEach(animateCount);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        statObserver.observe(statsEl);
    }

    // ===== ROTATING ROLE TEXT =====
    const rotator = document.getElementById('role-rotator');
    const roles = [
        'full-stack web apps.',
        'AI agents that self-heal.',
        'test automation platforms.',
        'production ERP systems.'
    ];

    if (rotator) {
        if (reduceMotion) {
            rotator.textContent = roles[0];
        } else {
            let roleIndex = 0;
            let charIndex = 0;
            let deleting = false;

            const type = () => {
                const current = roles[roleIndex];
                charIndex += deleting ? -1 : 1;
                rotator.textContent = current.slice(0, charIndex);

                let delay = deleting ? 35 : 70;
                if (!deleting && charIndex === current.length) {
                    delay = 1800;           // hold the finished phrase
                    deleting = true;
                } else if (deleting && charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    delay = 350;
                }
                setTimeout(type, delay);
            };
            type();
        }
    }

    // ===== SCROLL PROGRESS + ACTIVE NAV + BACK TO TOP =====
    const progressBar = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section, footer[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const onScroll = () => {
        const scrollY = window.scrollY;

        // progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';

        // back to top
        backToTop.classList.toggle('visible', scrollY > 600);

        // active nav — track the last section whose top has passed the header
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 120) current = section.id;
        });
        navLinks.forEach(link => {
            // exact match: `includes` marked every link active when current was ''
            const isActive = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    // ===== FOOTER YEAR =====
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ===== IMAGE SLIDERS =====
    function initSlider(sliderId) {
        const sliderEl = document.getElementById(sliderId);
        if (!sliderEl) return;

        const track = sliderEl.querySelector('.slider-track');
        const dots = sliderEl.querySelectorAll('.dot');
        if (dots.length === 0) return;
        const totalSlides = track.querySelectorAll('.slider-img').length;
        let currentIndex = 0;
        let autoSlideInterval;

        function goTo(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
                d.setAttribute('aria-current', String(i === currentIndex));
            });
        }

        let inView = false;
        let hovered = false;
        let focused = false;

        function stopAuto() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }

        // Autoplay only while the slider is on screen and nobody is using it
        // (WCAG 2.2.2: moving content needs a way to pause).
        function syncAuto() {
            const shouldRun = !reduceMotion && inView && !hovered && !focused;
            if (shouldRun && !autoSlideInterval) {
                autoSlideInterval = setInterval(() => goTo(currentIndex + 1), 3000);
            } else if (!shouldRun) {
                stopAuto();
            }
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.index, 10));
            });
        });

        sliderEl.addEventListener('mouseenter', () => { hovered = true; syncAuto(); });
        sliderEl.addEventListener('mouseleave', () => { hovered = false; syncAuto(); });
        sliderEl.addEventListener('focusin', () => { focused = true; syncAuto(); });
        sliderEl.addEventListener('focusout', () => { focused = false; syncAuto(); });

        if (!('IntersectionObserver' in window)) { inView = true; syncAuto(); return; }
        new IntersectionObserver((entries) => {
            inView = entries[0].isIntersecting;
            syncAuto();
        }, { threshold: 0.3 }).observe(sliderEl);
    }

    document.querySelectorAll('.project-slider').forEach(el => initSlider(el.id));

    // ===== CONSOLE =====
    // Anyone who opens DevTools on a portfolio is worth saying hello to.
    console.log(
        "%cNirav Shetty%c\n" +
        "You opened the console. Good instinct.\n\n" +
        "Built with vanilla HTML, CSS and JS — no framework, no build step.\n" +
        "shettynirav2005@gmail.com",
        "font-size:20px;font-weight:800;color:#646cff",
        "font-size:12px;color:#888;line-height:1.7"
    );
});
