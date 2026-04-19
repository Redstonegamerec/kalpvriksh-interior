/* ============================================================
   KALPVRIKSH INTERIOR — Clean, Light JavaScript
   No heavy libraries. Vanilla JS + CSS class-based animations.
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. NAVBAR
       ============================================================ */
    const navbar    = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks  = document.getElementById('nav-links');
    const allLinks  = document.querySelectorAll('.nav-link');

    // Scroll: add/remove scrolled class
    function onScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Smooth scroll + close menu on nav click
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 8;
                    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        const scrollPos = window.scrollY + navbar.offsetHeight + 40;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');
            const link   = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link && scrollPos >= top && scrollPos < top + height) {
                allLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }

    /* ============================================================
       2. SCROLL REVEAL (Intersection Observer)
       ============================================================ */
    function setupReveal() {
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .process-step');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(el => observer.observe(el));
    }
    setupReveal();

    /* ============================================================
       3. COUNTER ANIMATION (hero stats)
       ============================================================ */
    function animateCounter(el, target, duration = 1800) {
        let start = null;
        const startVal = 0;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.round(startVal + eased * (target - startVal));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const counterEls = document.querySelectorAll('.trust-number[data-count]');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                counterEls.forEach(el => {
                    const target = parseInt(el.getAttribute('data-count'));
                    animateCounter(el, target);
                });
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.getElementById('hero');
    if (heroSection) counterObserver.observe(heroSection);

    /* ============================================================
       4. PORTFOLIO FILTER
       ============================================================ */
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    let visibleItems   = [...portfolioItems];
    let currentModalIdx = 0;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const cat = item.getAttribute('data-category');
                const matches = filter === 'all' || cat === filter;

                if (matches) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.transition = 'opacity 0.4s, transform 0.4s';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 350);
                }
            });

            setTimeout(() => {
                visibleItems = portfolioItems.filter(i => i.style.display !== 'none');
            }, 450);
        });
    });

    /* ============================================================
       5. PORTFOLIO MODAL
       ============================================================ */
    const modal        = document.getElementById('portfolio-modal');
    const modalImg     = document.getElementById('modal-image');
    const modalImgWrap = document.getElementById('modal-img-wrap');
    const modalTag     = document.getElementById('modal-tag');
    const modalTitle   = document.getElementById('modal-title');
    const modalLoc     = document.getElementById('modal-loc');
    const modalCounter = document.getElementById('modal-counter');
    const modalClose   = document.getElementById('modal-close');
    const modalPrev    = document.getElementById('modal-prev');
    const modalNext    = document.getElementById('modal-next');
    const backdrop     = document.getElementById('modal-backdrop');

    function openModal(index) {
        currentModalIdx = index;
        const item = visibleItems[index];
        if (!item) return;

        const img = item.querySelector('img');
        modalImg.src   = img.src;
        modalImg.alt   = img.alt;
        modalTag.textContent   = item.getAttribute('data-tag') || '';
        modalTitle.textContent = item.getAttribute('data-title') || '';
        modalLoc.textContent   = item.getAttribute('data-caption') || '';
        modalCounter.textContent = `${index + 1} / ${visibleItems.length}`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateModal(dir) {
        const next = (currentModalIdx + dir + visibleItems.length) % visibleItems.length;
        modalImgWrap.classList.add('transitioning');
        setTimeout(() => {
            openModal(next);
            modalImgWrap.classList.remove('transitioning');
        }, 300);
    }

    // Open modal on expand button click
    document.querySelectorAll('.portfolio-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.portfolio-item');
            const idx  = visibleItems.indexOf(item);
            if (idx !== -1) openModal(idx);
        });
    });

    // Also open on item click
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const idx = visibleItems.indexOf(item);
            if (idx !== -1) openModal(idx);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (backdrop)   backdrop.addEventListener('click', closeModal);
    if (modalPrev)  modalPrev.addEventListener('click', () => navigateModal(-1));
    if (modalNext)  modalNext.addEventListener('click', () => navigateModal(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowLeft')  navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });

    /* ============================================================
       6. TESTIMONIALS SLIDER
       ============================================================ */
    const track    = document.getElementById('testimonials-track');
    const dotsWrap = document.getElementById('testimonial-dots');
    const prevBtn  = document.getElementById('testimonial-prev');
    const nextBtn  = document.getElementById('testimonial-next');

    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        let current = 0;
        let autoTimer;

        // Build dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to review ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        function goTo(idx) {
            current = (idx + cards.length) % cards.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            // Update dots
            dotsWrap.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
            resetAuto();
        }

        function resetAuto() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => goTo(current + 1), 6000);
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

        resetAuto();

        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend',   e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        });
    }

    /* ============================================================
       7. CONTACT FORM
       ============================================================ */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = document.getElementById('submit-btn');
            const nameEl = document.getElementById('name');
            const phoneEl = document.getElementById('phone');

            // Basic validation
            if (!nameEl.value.trim() || !phoneEl.value.trim()) {
                shakeEl(nameEl.value.trim() ? phoneEl : nameEl);
                return;
            }

            // Simulate submission
            btn.disabled  = true;
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.3"/><path d="M21 12a9 9 0 01-9 9"/></svg> Sending...';

            setTimeout(() => {
                form.closest('.contact-form-wrap').innerHTML = `
                    <div class="form-success">
                        <div class="form-success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h3>Enquiry Sent! 🎉</h3>
                        <p>Thank you! We've received your request and will call you back within <strong>2 hours</strong>.</p>
                        <p style="margin-top:12px; font-size: 0.88rem; color: var(--text-light);">For urgent queries, WhatsApp us directly at <a href="https://wa.me/919876543210" style="color: var(--accent-dark); font-weight: 600;">+91 98765 43210</a></p>
                    </div>
                `;
            }, 1600);
        });
    }

    function shakeEl(el) {
        el.style.borderColor = '#e53e3e';
        el.style.animation   = 'shake 0.4s ease';
        el.focus();
        setTimeout(() => {
            el.style.animation   = '';
            el.style.borderColor = '';
        }, 500);
    }

    /* ============================================================
       8. SMOOTH SCROLL for hero buttons (not nav links)
       ============================================================ */
    document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 8;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                        behavior: 'smooth'
                    });
                    // Close mobile menu
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    /* ============================================================
       9. HERO SECTION — subtle image parallax (performance friendly)
       ============================================================ */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY  = window.scrollY;
            const heroH    = heroBg.closest('.hero').offsetHeight;
            if (scrollY <= heroH) {
                heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ============================================================
       10. STICKY CTA BAR — show after scrolling past hero
       ============================================================ */
    const stickyBar   = document.getElementById('sticky-cta-bar');
    const heroEl      = document.getElementById('hero');
    if (stickyBar && heroEl) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
            if (window.scrollY > heroBottom - 100 && window.innerWidth <= 768) {
                stickyBar.style.display = 'flex';
            } else {
                stickyBar.style.display = '';
            }
        }, { passive: true });
    }

    /* ============================================================
       11. CSS ANIMATION: spin & shake keyframes injection
       ============================================================ */
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(styleSheet);

    /* ============================================================
       12. TRIGGER INITIAL STATE
       ============================================================ */
    // Run on load
    onScroll();

    // Ensure process steps are visible when page loads with hash
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - 90,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

})();
