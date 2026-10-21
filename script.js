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
// BUTTON RIPPLE EFFECT
// ===================================

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// LAZY LOADING IMAGES
// ===================================

// When real images are added, this will handle lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

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
// CONTACT CARD HOVER EFFECTS
// ===================================

const contactCards = document.querySelectorAll('.contact-card');

contactCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.transform = 'rotate(360deg) scale(1.1)';
        icon.style.transition = 'transform 0.6s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.transform = 'rotate(0deg) scale(1)';
    });
});

// ===================================
// LOADING COMPLETION
// ===================================

console.log('🧘‍♀️ Modern Fit Pilates - Website Loaded Successfully');
console.log('✨ Created with care by Digital Web Services');

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

    // Auto-play
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Pause on hover
    if (viewport) {
        viewport.addEventListener('mouseenter', stopAutoPlay);
        viewport.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch / swipe support
    track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        isDragging = false;
        stopAutoPlay();
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
        startAutoPlay();
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

    startAutoPlay();
})();

// ===================================
// SERVICES REMOVED
// ===================================
// Services section and related animations removed per request
