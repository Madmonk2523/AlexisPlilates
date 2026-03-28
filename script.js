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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            debugLog('Nav click to', this.getAttribute('href'));
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 968) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.instagram-link)');

function updateActiveNav() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Navbar background on scroll
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
    debugLog('Scroll', currentScroll);
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            debugLog('Reveal', entry.target.className || entry.target.tagName);
        }
    });
}, observerOptions);

// Observe all cards and elements for animations
const animateElements = document.querySelectorAll(
    '.instructor-card, .contact-card, .highlight-item, .story-content, .section-header'
);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// ===================================
// PARALLAX EFFECT - DISABLED FOR SMOOTHER SCROLL
// ===================================

// Parallax removed for better scroll performance

// ===================================
// SMOOTH PAGE LOAD
// ===================================

window.addEventListener('load', () => {
    if (window.mfpDebug && typeof window.mfpDebug.mark === 'function') {
        window.mfpDebug.mark('page-load-start');
    }
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
        if (window.mfpDebug && typeof window.mfpDebug.mark === 'function') {
            window.mfpDebug.mark('page-fade-in');
        }
        if (window.mfpDebug && typeof window.mfpDebug.measure === 'function') {
            window.mfpDebug.measure('fade-in-duration', 'page-load-start', 'page-fade-in');
        }
    }, 100);
});

// ===================================
// INSTRUCTOR CARD INTERACTIONS
// ===================================

const instructorCards = document.querySelectorAll('.instructor-card');

instructorCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

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
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-green), var(--primary-purple));
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px) scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
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
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    updateActiveNav();
}));

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// Focus management for mobile menu
mobileMenuToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        navMenu.querySelector('.nav-link').focus();
    }
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
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===================================
// GALLERY LIGHTBOX (SIMPLE VERSION)
// ===================================

const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Add subtle scale animation on click
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = 'scale(1.05)';
        }, 150);
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

// ===================================
// ENHANCED MOBILE MENU FOR MORE LINKS
// ===================================

const mobileMenu = document.querySelector('.nav-menu');
const navLinksAll = document.querySelectorAll('.nav-link');

// Close menu when clicking on a link (mobile)
navLinksAll.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 968) {
            mobileMenu.classList.remove('active');
            document.querySelector('.mobile-menu-toggle').classList.remove('active');
        }
    });
});

