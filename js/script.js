document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // ===== SKELETON LOADER =====
    const skeleton = document.getElementById('skeleton-overlay');
    let skeletonDismissed = false;

    const dismissSkeleton = (delay) => {
        if (skeletonDismissed || !skeleton) return;
        skeletonDismissed = true;
        setTimeout(() => {
            skeleton.classList.add('hidden-skeleton');
            setTimeout(() => skeleton.remove(), 600);
        }, delay);
    };

    if (document.readyState === 'complete') {
        dismissSkeleton(300);
    } else {
        window.addEventListener('load', () => dismissSkeleton(400));
    }

    // Hard ceiling. 'load' waits on every subresource, so one slow or blocked
    // CDN (fonts, icons) would otherwise strand the visitor on the skeleton
    // indefinitely. The page is usable well before those finish.
    setTimeout(() => dismissSkeleton(0), 2500);

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

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
    if (statsEl) {
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
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
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

    // ===== CUSTOM CURSOR (pointer devices only) =====
    if (!isTouch) {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .project-card, .cta-button, .img-container, .about-card, .skill-item, .dot, .cert-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ===== IMAGE SLIDERS =====
    function initSlider(sliderId) {
        const sliderEl = document.getElementById(sliderId);
        if (!sliderEl) return;

        const track = sliderEl.querySelector('.slider-track');
        const dots = sliderEl.querySelectorAll('.dot');
        const totalSlides = track.querySelectorAll('.slider-img').length;
        let currentIndex = 0;
        let autoSlideInterval;

        function goTo(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        function startAuto() {
            if (reduceMotion) return;
            autoSlideInterval = setInterval(() => goTo(currentIndex + 1), 3000);
        }

        function stopAuto() {
            clearInterval(autoSlideInterval);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopAuto();
                goTo(parseInt(dot.dataset.index));
                startAuto();
            });
        });

        // Pause on hover
        sliderEl.addEventListener('mouseenter', stopAuto);
        sliderEl.addEventListener('mouseleave', startAuto);

        startAuto();
    }

    initSlider('slider-windscapes');
    initSlider('slider-nutritrust');

    // ===== SKILL WIDGETS: DRAG TO REORDER, PULL TO RESIZE =====
    const skillsGrid = document.querySelector('.skills-grid');

    if (skillsGrid) {
        const cards = [...skillsGrid.querySelectorAll('.skill-category')];
        const LAYOUT_KEY = 'skills-layout';

        // Identify cards by their heading so a saved layout survives edits to
        // the markup order. Read the heading without the grip glyph, so
        // changing that decoration can't invalidate everyone's saved layout.
        cards.forEach(c => {
            const heading = c.querySelector('h3').cloneNode(true);
            heading.querySelector('.skill-grip')?.remove();
            c.dataset.skillId = heading.textContent.trim();
        });

        const readLayout = () => {
            try {
                return JSON.parse(localStorage.getItem(LAYOUT_KEY)) || {};
            } catch {
                return {};
            }
        };

        const saveLayout = () => {
            const layout = {
                order: [...skillsGrid.querySelectorAll('.skill-category')].map(c => c.dataset.skillId),
                heights: {}
            };
            skillsGrid.querySelectorAll('.skill-category').forEach(c => {
                if (c.style.height) layout.heights[c.dataset.skillId] = c.style.height;
            });
            localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
        };

        // Restore a previous arrangement
        const saved = readLayout();
        if (Array.isArray(saved.order)) {
            saved.order.forEach(id => {
                const card = cards.find(c => c.dataset.skillId === id);
                if (card) skillsGrid.appendChild(card);
            });
        }
        if (saved.heights) {
            Object.entries(saved.heights).forEach(([id, h]) => {
                const card = cards.find(c => c.dataset.skillId === id);
                if (card) card.style.height = h;
            });
        }

        let dragged = null;

        cards.forEach(card => {
            card.draggable = true;

            card.addEventListener('dragstart', (e) => {
                dragged = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                // Firefox needs data set for the drag to start at all
                e.dataTransfer.setData('text/plain', card.dataset.skillId);
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                skillsGrid.querySelectorAll('.drop-target')
                    .forEach(c => c.classList.remove('drop-target'));
                dragged = null;
                saveLayout();
            });

            card.addEventListener('dragover', (e) => {
                if (!dragged || dragged === card) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                card.classList.add('drop-target');
            });

            card.addEventListener('dragleave', () => card.classList.remove('drop-target'));

            card.addEventListener('drop', (e) => {
                if (!dragged || dragged === card) return;
                e.preventDefault();
                card.classList.remove('drop-target');
                // Insert before or after depending on which half was dropped on
                const box = card.getBoundingClientRect();
                const after = (e.clientX - box.left) > box.width / 2;
                card.parentNode.insertBefore(dragged, after ? card.nextSibling : card);
            });
        });

        // A resize writes an inline height; capture it once the drag finishes.
        document.addEventListener('mouseup', () => {
            if (skillsGrid.querySelector('.skill-category[style*="height"]')) saveLayout();
        });

        document.getElementById('skills-reset')?.addEventListener('click', () => {
            localStorage.removeItem(LAYOUT_KEY);
            cards.forEach(c => {
                c.style.height = '';
                skillsGrid.appendChild(c);   // cards[] is in original DOM order
            });
        });
    }

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
