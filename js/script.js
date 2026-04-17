/* ============================================================
   KALPVRIKSH INTERIOR — Cinematic JavaScript
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. CINEMATIC PRELOADER
       ============================================================ */
    const preloader = document.getElementById('preloader');

    function runPreloader() {
        const tl = gsap.timeline({
            onComplete: () => {
                // Curtain reveal
                gsap.to('.preloader-curtain-left', {
                    xPercent: -100,
                    duration: 1.2,
                    ease: 'power4.inOut'
                });
                gsap.to('.preloader-curtain-right', {
                    xPercent: 100,
                    duration: 1.2,
                    ease: 'power4.inOut'
                });
                gsap.to('.preloader-inner', {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.6,
                    ease: 'power2.in'
                });
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.4,
                    delay: 1.0,
                    onComplete: () => {
                        preloader.classList.add('hidden');
                        document.body.style.overflow = '';
                        initAnimations();
                    }
                });
            }
        });

        tl.from('.preloader-k', {
            opacity: 0,
            scale: 1.5,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.preloader-text', {
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to('.preloader-sub', {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2')
        .to('.preloader-progress-bar', {
            width: '100%',
            duration: 1.4,
            ease: 'power2.inOut'
        }, '-=0.3')
        .to('.preloader-tagline', {
            opacity: 0.6,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.8');
    }

    window.addEventListener('load', () => {
        setTimeout(runPreloader, 300);
    });

    /* ============================================================
       2. LENIS SMOOTH SCROLL
       ============================================================ */
    const lenis = new Lenis({
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* ============================================================
       3. NAVBAR
       ============================================================ */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80, duration: 2 });
            }
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    lenis.on('scroll', () => {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    /* ============================================================
       4. GSAP CINEMATIC ANIMATIONS
       ============================================================ */
    gsap.registerPlugin(ScrollTrigger);

    function initAnimations() {

        // ------ Tree Logo Growth (Scroll Drawing) ------
        const treePath = document.querySelector('.nav-tree-path');
        if (treePath) {
            const pathLength = treePath.getTotalLength();
            // Start fully hidden (offset = length)
            gsap.set(treePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

            // Animate offset to 0 as user scrolls down the entire page
            gsap.to(treePath, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.5
                }
            });
        }

        // ------ Falling Leaves (Tree Essence) ------
        const leafContainer = document.querySelector('.falling-leaves');
        if (leafContainer) {
            const numLeaves = window.innerWidth < 768 ? 10 : 25;
            for (let i = 0; i < numLeaves; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'leaf';
                
                // Randomize starting properties
                const size = gsap.utils.random(15, 30);
                gsap.set(leaf, {
                    x: gsap.utils.random(0, window.innerWidth),
                    y: gsap.utils.random(-150, -50),
                    scale: size / 20,
                    rotation: gsap.utils.random(-180, 180),
                    opacity: gsap.utils.random(0.2, 0.5)
                });
                
                leafContainer.appendChild(leaf);
                
                // Animate leaf falling continuously
                gsap.to(leaf, {
                    y: window.innerHeight + 100,
                    x: `+=${gsap.utils.random(-150, 150)}`,
                    rotation: `+=${gsap.utils.random(-360, 360)}`,
                    duration: gsap.utils.random(8, 18),
                    ease: 'none',
                    repeat: -1,
                    delay: gsap.utils.random(0, 10)
                });
            }
        }

        // ------ Hero Cinematic Intro ------
        const heroTl = gsap.timeline({ delay: 0.3 });

        // Slow zoom on bg
        gsap.to('.hero-bg', {
            scale: 1.2,
            duration: 25,
            ease: 'none',
            repeat: -1,
            yoyo: true
        });

        // Staggered letter-by-letter reveal
        const heroLines = document.querySelectorAll('.hero-line-inner');
        heroLines.forEach(line => {
            const text = line.textContent;
            line.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(100%)';
                line.appendChild(span);
            });
        });

        heroTl
            .from('.hero-badge', {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: 'power3.out'
            })
            .from('.hero-badge-line', {
                width: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.5');

        // Animate each letter
        heroLines.forEach((line, lineIndex) => {
            const chars = line.querySelectorAll('span');
            heroTl.to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: 'power3.out'
            }, lineIndex === 0 ? '-=0.3' : '-=0.15');
        });

        heroTl
            .from('.hero-subtitle', {
                opacity: 0,
                y: 30,
                duration: 1.2,
                ease: 'power3.out'
            }, '-=0.3')
            .from('.hero-cta .btn', {
                opacity: 0,
                y: 25,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-stat', {
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.hero-scroll-indicator', {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.4');

        // Hero parallax (layered)
        gsap.to('.hero-bg', {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        gsap.to('.hero-content', {
            yPercent: 60,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '70% top',
                scrub: 1.5
            }
        });

        gsap.to('.hero-stats', {
            yPercent: 30,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: '50% top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // ------ Counter Animation ------
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'));
            const obj = { val: 0 };
            ScrollTrigger.create({
                trigger: num,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        val: target,
                        duration: 3,
                        ease: 'power2.out',
                        onUpdate: () => { num.textContent = Math.round(obj.val); }
                    });
                }
            });
        });

        // ------ About Section (Cinematic Reveal) ------
        gsap.set('.about-image-reveal', { scaleX: 1 });
        gsap.set('.about-content', { opacity: 0, x: 60 });
        gsap.set('.about-feature', { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: '.about',
            start: 'top 65%',
            once: true,
            onEnter: () => {
                // Image wipe reveal
                gsap.to('.about-image-reveal', {
                    scaleX: 0,
                    duration: 1.4,
                    ease: 'power4.inOut'
                });
                gsap.to('.about-content', {
                    opacity: 1, x: 0,
                    duration: 1.4,
                    ease: 'power3.out',
                    delay: 0.3
                });
                gsap.to('.about-feature', {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    delay: 0.8
                });
            }
        });

        // About parallax (layered depth)
        gsap.to('.about-image-wrapper', {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });

        gsap.to('.about-experience-badge', {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });

        // ------ Services ------
        gsap.set('.services .section-header', { opacity: 0, y: 50 });
        gsap.set('.service-card', { opacity: 0, y: 70 });

        ScrollTrigger.create({
            trigger: '.services',
            start: 'top 70%',
            once: true,
            onEnter: () => {
                gsap.to('.services .section-header', {
                    opacity: 1, y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                });
                gsap.to('.service-card', {
                    opacity: 1, y: 0,
                    duration: 1,
                    stagger: 0.12,
                    ease: 'power3.out',
                    delay: 0.3
                });
            }
        });

        // ------ Portfolio Header Reveal ------
        gsap.set('.portfolio-header-anim', { opacity: 0, y: 50 });
        gsap.set('.portfolio-filters', { opacity: 0, y: 20 });

        ScrollTrigger.create({
            trigger: '.portfolio',
            start: 'top 70%',
            once: true,
            onEnter: () => {
                gsap.to('.portfolio-header-anim', {
                    opacity: 1, y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                });
                gsap.to('.portfolio-filters', {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.25
                });
            }
        });

        gsap.set('.portfolio-cta-wrap', { opacity: 0, y: 30 });
        ScrollTrigger.create({
            trigger: '.portfolio-cta-wrap',
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to('.portfolio-cta-wrap', {
                    opacity: 1, y: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            }
        });

        // ------ Why Choose Us ------
        gsap.set('.why-us .section-header', { opacity: 0, y: 50 });
        gsap.set('.why-card', { opacity: 0, y: 60 });

        ScrollTrigger.create({
            trigger: '.why-us',
            start: 'top 65%',
            once: true,
            onEnter: () => {
                gsap.to('.why-us .section-header', {
                    opacity: 1, y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                });
                gsap.to('.why-card', {
                    opacity: 1, y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 0.3
                });
            }
        });

        // ------ Process Timeline ------
        gsap.set('.process .section-header', { opacity: 0, y: 50 });

        ScrollTrigger.create({
            trigger: '.process',
            start: 'top 70%',
            once: true,
            onEnter: () => {
                gsap.to('.process .section-header', {
                    opacity: 1, y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                });
            }
        });

        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach((step) => {
            ScrollTrigger.create({
                trigger: step,
                start: 'top 78%',
                once: true,
                onEnter: () => {
                    step.classList.add('active');
                    gsap.to(step, {
                        opacity: 1,
                        x: 0,
                        duration: 1.2,
                        ease: 'power3.out'
                    });
                }
            });
        });

        // Timeline fill
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
            const timelineFill = document.createElement('div');
            timelineFill.style.cssText = `
                position: absolute; top: 0; left: 0;
                width: 100%; height: 0%; background: linear-gradient(180deg, #C9A96E, #A88B52);
                border-radius: 2px; z-index: 1;
            `;
            timelineLine.appendChild(timelineFill);

            gsap.to(timelineFill, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.process-timeline',
                    start: 'top 78%',
                    end: 'bottom 55%',
                    scrub: 1.5
                }
            });
        }

        // ------ Testimonials ------
        gsap.set('.testimonials .section-header', { opacity: 0, y: 50 });
        gsap.set('.testimonials-slider', { opacity: 0, y: 40 });

        ScrollTrigger.create({
            trigger: '.testimonials',
            start: 'top 65%',
            once: true,
            onEnter: () => {
                gsap.to('.testimonials .section-header', {
                    opacity: 1, y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                });
                gsap.to('.testimonials-slider', {
                    opacity: 1, y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 0.2
                });
            }
        });

        // ------ Contact ------
        gsap.set('.contact .section-header', { opacity: 0, y: 50 });
        gsap.set('.contact-form-wrapper', { opacity: 0, x: -60 });
        gsap.set('.contact-info-wrapper', { opacity: 0, x: 60 });

        ScrollTrigger.create({
            trigger: '.contact',
            start: 'top 65%',
            once: true,
            onEnter: () => {
                gsap.to('.contact .section-header', {
                    opacity: 1, y: 0,
                    duration: 1.2,
                    ease: 'power3.out'
                });
                gsap.to('.contact-form-wrapper', {
                    opacity: 1, x: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 0.15
                });
                gsap.to('.contact-info-wrapper', {
                    opacity: 1, x: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 0.3
                });
            }
        });

        // ------ Footer ------
        gsap.set('.footer-grid > div', { opacity: 0, y: 40 });

        ScrollTrigger.create({
            trigger: '.footer',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to('.footer-grid > div', {
                    opacity: 1, y: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            }
        });

        // Refresh ScrollTrigger
        setTimeout(() => { ScrollTrigger.refresh(); }, 200);
    }

    /* ============================================================
       5. PORTFOLIO — Bento Grid Filter, Tilt & Parallax
       ============================================================ */

    // -- Build item list for modal navigation --
    const bentoItems = Array.from(document.querySelectorAll('.pb-item'));
    let visibleItems = [...bentoItems]; // will update on filter
    let currentModalIndex = 0;

    // -- Update filter counts --
    function updateCounts() {
        const cats = { all: 0, residential: 0, office: 0, '3d': 0 };
        bentoItems.forEach(item => {
            const cat = item.getAttribute('data-category');
            cats.all++;
            if (cats[cat] !== undefined) cats[cat]++;
        });
        const el = (id) => document.getElementById(id);
        el('count-all').textContent = cats.all;
        el('count-residential').textContent = cats.residential;
        el('count-office').textContent = cats.office;
        el('count-3d').textContent = cats['3d'];
    }
    updateCounts();

    // -- Category Filter --
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Animate out all, then in matching
            const bento = document.getElementById('portfolio-bento');

            bentoItems.forEach(item => {
                const cat = item.getAttribute('data-category');
                const matches = filter === 'all' || cat === filter;

                if (matches) {
                    item.classList.remove('hidden');
                    gsap.fromTo(item, {
                        opacity: 0, scale: 0.93, y: 24
                    }, {
                        opacity: 1, scale: 1, y: 0,
                        duration: 0.65,
                        ease: 'power3.out',
                        clearProps: 'all'
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0, scale: 0.9,
                        duration: 0.35,
                        ease: 'power2.in',
                        onComplete: () => item.classList.add('hidden')
                    });
                }
            });

            // Update visible items list for modal nav
            setTimeout(() => {
                visibleItems = bentoItems.filter(i => !i.classList.contains('hidden'));
                const countEl = document.getElementById('visible-count');
                if (countEl) countEl.textContent = visibleItems.length;
            }, 500);
        });
    });

    // -- GSAP Scroll Reveal for bento items --
    gsap.set('.pb-item', { opacity: 0, y: 50, scale: 0.96 });
    ScrollTrigger.create({
        trigger: '#portfolio-bento',
        start: 'top 75%',
        once: true,
        onEnter: () => {
            gsap.to('.pb-item', {
                opacity: 1, y: 0, scale: 1,
                duration: 0.9,
                stagger: { amount: 0.65, from: 'start' },
                ease: 'power3.out'
            });
        }
    });

    // -- 3D Tilt Effect on Desktop --
    if (window.matchMedia('(hover: hover)').matches) {
        bentoItems.forEach(item => {
            const inner = item.querySelector('.pbi-inner');

            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(inner, {
                    rotationY: x * 10,
                    rotationX: -y * 10,
                    transformPerspective: 900,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(inner, {
                    rotationY: 0, rotationX: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
        });
    }

    // -- Subtle image parallax on scroll --
    bentoItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        gsap.to(img, {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });
    });

    /* ============================================================
       6. PREMIUM PORTFOLIO MODAL — prev/next navigation
       ============================================================ */
    const modal = document.getElementById('portfolio-modal');
    const modalImg = document.getElementById('modal-image');
    const modalImgWrap = document.getElementById('modal-img-wrap');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalLoc = document.getElementById('modal-loc');
    const modalCounter = document.getElementById('modal-counter');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    function populateModal(index) {
        const item = visibleItems[index];
        if (!item) return;

        const img = item.querySelector('img');
        const title = item.getAttribute('data-title') || item.querySelector('h3')?.textContent || '';
        const caption = item.getAttribute('data-caption') || item.querySelector('p')?.textContent || '';
        const tag = item.getAttribute('data-tag') || item.querySelector('.pbi-tag')?.textContent || '';

        // Animate out
        modalImgWrap.classList.add('transitioning');

        setTimeout(() => {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalTag.textContent = tag;
            modalTitle.textContent = title;
            modalLoc.textContent = caption;
            modalCounter.textContent = `${index + 1} / ${visibleItems.length}`;
            modalImgWrap.classList.remove('transitioning');
        }, 350);
    }

    function openModal(index) {
        currentModalIndex = index;
        // Instantly set (no transition needed on open)
        const item = visibleItems[index];
        const img = item.querySelector('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalTag.textContent = item.getAttribute('data-tag') || '';
        modalTitle.textContent = item.getAttribute('data-title') || '';
        modalLoc.textContent = item.getAttribute('data-caption') || '';
        modalCounter.textContent = `${index + 1} / ${visibleItems.length}`;

        modal.classList.add('active');
        lenis.stop();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        lenis.start();
        document.body.style.overflow = '';
    }

    function goNext() {
        currentModalIndex = (currentModalIndex + 1) % visibleItems.length;
        populateModal(currentModalIndex);
    }

    function goPrev() {
        currentModalIndex = (currentModalIndex - 1 + visibleItems.length) % visibleItems.length;
        populateModal(currentModalIndex);
    }

    // Bind open on item click
    bentoItems.forEach((item) => {
        item.addEventListener('click', () => {
            visibleItems = bentoItems.filter(i => !i.classList.contains('hidden'));
            const idx = visibleItems.indexOf(item);
            if (idx !== -1) openModal(idx);
        });

        const expandBtn = item.querySelector('.pbi-expand');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.click();
            });
        }
    });

    modalClose.addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', closeModal);
    modalNext.addEventListener('click', goNext);
    modalPrev.addEventListener('click', goPrev);

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });

    // Touch/swipe support for modal
    let touchStartXModal = 0;
    modal.addEventListener('touchstart', (e) => { touchStartXModal = e.changedTouches[0].screenX; }, { passive: true });
    modal.addEventListener('touchend', (e) => {
        const diff = touchStartXModal - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goNext(); else goPrev();
        }
    }, { passive: true });



    /* ============================================================
       7. TESTIMONIALS CAROUSEL
       ============================================================ */
    const track = document.getElementById('testimonials-track');
    const cards = track.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    let currentSlide = 0;
    let autoSlideInterval;

    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        currentSlide = index;
        gsap.to(track, {
            x: `-${index * 100}%`,
            duration: 1,
            ease: 'power3.out'
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function nextSlide() { goToSlide((currentSlide + 1) % cards.length); }
    function prevSlide() { goToSlide((currentSlide - 1 + cards.length) % cards.length); }

    nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 6000); }
    function resetAutoSlide() { clearInterval(autoSlideInterval); startAutoSlide(); }
    startAutoSlide();

    const slider = document.getElementById('testimonials-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);

    // Touch
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide(); else prevSlide();
            resetAutoSlide();
        }
    }, { passive: true });

    /* ============================================================
       8. CONTACT FORM
       ============================================================ */
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            const formWrapper = document.querySelector('.contact-form-wrapper');
            formWrapper.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <h3>Thank You!</h3>
                    <p>Your enquiry has been received. Our design team will reach out to you within 24 hours to schedule a free consultation.</p>
                </div>
            `;
            gsap.from('.form-success', { opacity: 0, y: 30, scale: 0.95, duration: 0.8, ease: 'power3.out' });
        }, 1500);
    });

    /* ============================================================
       9. SMOOTH SCROLL FOR ALL ANCHORS
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('nav-link')) {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, { offset: -80, duration: 2 });
                }
            });
        }
    });

    /* ============================================================
       10. MAGNETIC EFFECT (Desktop)
       ============================================================ */
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn-primary, .sticky-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.12, y: y * 0.12, duration: 0.5, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
            });
        });

        // Subtle image tilt on portfolio hover
        document.querySelectorAll('.portfolio-image-wrapper').forEach(wrapper => {
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(wrapper, {
                    rotationY: x * 6,
                    rotationX: -y * 6,
                    duration: 0.5,
                    ease: 'power2.out',
                    transformPerspective: 600
                });
            });
            wrapper.addEventListener('mouseleave', () => {
                gsap.to(wrapper, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            });
        });
    }

    /* ============================================================
       11. PARALLAX ELEMENTS
       ============================================================ */
    document.querySelectorAll('[data-parallax]').forEach(el => {
        if (!el.classList.contains('portfolio-item')) {
            const speed = parseFloat(el.getAttribute('data-parallax'));
            gsap.to(el, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2.5
                }
            });
        }
    });

})();
