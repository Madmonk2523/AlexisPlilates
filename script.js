// ===================================
// MODERN FIT PILATES - MAIN JAVASCRIPT
// ===================================

// ===================================
// DEBUG INSTRUMENTATION
// ===================================
// Toggle debug via `?debug=1` or localStorage key `mfp-debug` = '1'
const MFP_DEBUG = new URLSearchParams(window.location.search).has('debug') || localStorage.getItem('mfp-debug') === '1';

function debugLog() {
    if (!MFP_DEBUG) return;
    const args = Array.from(arguments);
    console.debug('[MFP]', ...args);
}

// Expose simple debug API
window.mfpDebug = {
    enable() { localStorage.setItem('mfp-debug', '1'); debugLog('Debug enabled'); },
    disable() { localStorage.removeItem('mfp-debug'); console.debug('[MFP] Debug disabled'); },
    log: debugLog,
    mark(name) { if (MFP_DEBUG && performance.mark) performance.mark(name); },
    measure(name, start, end) {
        if (MFP_DEBUG && performance.measure) {
            try { performance.measure(name, start, end); } catch {}
        }
    }
};

debugLog('JavaScript initialized');
window.addEventListener('error', (e) => {
    if (MFP_DEBUG) console.error('[MFP] Error:', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', (e) => {
    if (MFP_DEBUG) console.error('[MFP] Unhandled rejection:', e.reason);
});

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const mobileNavigation = window.matchMedia('(max-width: 1050px)');

function setMenuOpen(isOpen) {
    navMenu.classList.toggle('active', isOpen);
    mobileMenuToggle.classList.toggle('active', isOpen);
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

mobileMenuToggle.addEventListener('click', () => {
    const isOpen = mobileMenuToggle.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(isOpen);
    if (isOpen) {
        navMenu.querySelector('.nav-link').focus();
    }
});

navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNavigation.matches) setMenuOpen(false);
    });
});

document.addEventListener('click', event => {
    if (mobileNavigation.matches && !event.target.closest('.nav-container')) {
        setMenuOpen(false);
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        mobileMenuToggle.focus();
    }
});

mobileNavigation.addEventListener('change', event => {
    if (!event.matches) setMenuOpen(false);
});

const navLinks = document.querySelectorAll('.nav-link[href^="#"]:not(.nav-booking)');
const navSections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

function setActiveSection(section) {
    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${section.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver(entries => {
        const visibleSections = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleSections.length) setActiveSection(visibleSections[0].target);
    }, { rootMargin: '-25% 0px -65% 0px', threshold: [0, 0.2, 0.5, 0.8] });

    navSections.forEach(section => navigationObserver.observe(section));
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

const revealElements = document.querySelectorAll(
    '.instructor-card, .contact-card, .highlight-item, .story-content, .section-header'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealElements.forEach((element, index) => {
        element.classList.add('js-reveal');
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        revealObserver.observe(element);
    });
}

// ===================================
// INSTRUCTOR CARD INTERACTIONS
// ===================================

// ===================================
// SCROLL TO TOP BUTTON (Optional Enhancement)
// ===================================

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.classList.add('scroll-to-top');
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('is-visible', window.pageYOffset > 500);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// LOADING COMPLETION
// ===================================

// Remove preloader if exists
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 300);
        }, 500);
    }
});

// ===================================
// FAQ ACCORDION FUNCTIONALITY
// ===================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    const answer = question.parentElement.querySelector('.faq-answer');
    answer.setAttribute('aria-hidden', 'true');
    answer.querySelectorAll('a').forEach(link => link.tabIndex = -1);

    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            const itemAnswer = item.querySelector('.faq-answer');
            itemAnswer.setAttribute('aria-hidden', 'true');
            itemAnswer.querySelectorAll('a').forEach(link => link.tabIndex = -1);
        });
        
        if (!isActive) {
            faqItem.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
            answer.setAttribute('aria-hidden', 'false');
            answer.querySelectorAll('a').forEach(link => link.removeAttribute('tabindex'));
        }
    });
});

// ===================================
// TESTIMONIAL CAROUSEL
// ===================================

(function () {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const counterCurrent = document.querySelector('.counter-current');
    const counterTotal = document.querySelector('.counter-total');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const viewport = document.querySelector('.carousel-viewport');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const total = slides.length;
    let autoPlayTimer = null;
    let isDragging = false;
    let startX = 0;
    let dragDelta = 0;
    let isVisible = false;
    let isInteracting = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Update counter total
    if (counterTotal) counterTotal.textContent = total;

    // Generate dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => { goTo(i); resetAutoPlay(); });
        dotsContainer.appendChild(dot);
    });

    function updateCarousel() {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        if (counterCurrent) counterCurrent.textContent = currentIndex + 1;
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
        currentIndex = ((index % total) + total) % total;
        updateCarousel();
    }

    function nextSlide() { goTo(currentIndex + 1); }
    function prevSlide() { goTo(currentIndex - 1); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

    function updateAutoPlay() {
        const shouldPlay = isVisible && !isInteracting && !document.hidden && !reducedMotion;
        if (shouldPlay && !autoPlayTimer) {
            autoPlayTimer = setInterval(nextSlide, 6000);
        } else if (!shouldPlay && autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function resetAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
        updateAutoPlay();
    }

    if (viewport && 'IntersectionObserver' in window) {
        const carouselObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            updateAutoPlay();
        }, { threshold: 0.15 });
        carouselObserver.observe(viewport);

        viewport.addEventListener('mouseenter', () => {
            isInteracting = true;
            updateAutoPlay();
        });
        viewport.addEventListener('mouseleave', () => {
            isInteracting = false;
            updateAutoPlay();
        });
        viewport.addEventListener('focusin', () => {
            isInteracting = true;
            updateAutoPlay();
        });
        viewport.addEventListener('focusout', event => {
            if (!viewport.contains(event.relatedTarget)) {
                isInteracting = false;
                updateAutoPlay();
            }
        });
        document.addEventListener('visibilitychange', updateAutoPlay);
    }

    // Touch / swipe support
    track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        isDragging = false;
        isInteracting = true;
        updateAutoPlay();
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
        dragDelta = e.touches[0].clientX - startX;
        isDragging = Math.abs(dragDelta) > 8;
    }, { passive: true });

    track.addEventListener('touchend', function () {
        if (isDragging) {
            if (dragDelta < -50) nextSlide();
            else if (dragDelta > 50) prevSlide();
        }
        isDragging = false;
        dragDelta = 0;
        isInteracting = false;
        updateAutoPlay();
    });

    // Keyboard navigation when testimonials section is in view
    document.addEventListener('keydown', function (e) {
        const section = document.getElementById('testimonials');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
        if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
    });

    updateAutoPlay();
})();

// ===================================
// SERVICES REMOVED
// ===================================
// Services section and related animations removed per request
