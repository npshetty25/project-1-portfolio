document.addEventListener('DOMContentLoaded', () => {
    // ===== SKELETON LOADER =====
    const skeleton = document.getElementById('skeleton-overlay');
    // Dismiss skeleton after page resources settle
    window.addEventListener('load', () => {
        setTimeout(() => {
            skeleton.classList.add('hidden-skeleton');
            // Remove from DOM after fade
            setTimeout(() => skeleton.remove(), 600);
        }, 500);
    });
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            skeleton.classList.add('hidden-skeleton');
            setTimeout(() => skeleton.remove(), 600);
        }, 800);
    }

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

    // ===== SCROLL REVEAL =====
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, observerOptions);

    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= (section.offsetTop - section.clientHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });

    // ===== CUSTOM CURSOR =====
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, .project-card, .cta-button, .img-container, .about-card, .skill-item, .dot');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

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
});
