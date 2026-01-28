/* ============================================
   MAIN JAVASCRIPT - Portfolio Website
   ============================================ */

/**
 * Mobile Navigation Toggle
 * Handles hamburger menu functionality
 */
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (this.hamburger) {
            this.init();
        }
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }
}

/**
 * Smooth Scroll Handler
 * Handles smooth scrolling for navigation links
 */
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * Intersection Observer for Animations
 * Triggers animations when elements come into view
 */
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(
            '.slide-in-left, .slide-in-right, .fade-in, .hover-lift'
        );
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.elements.forEach(element => observer.observe(element));
    }
}

/**
 * Form Handler with Web3Forms
 * Handles contact form submission with loading states
 */
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';

        try {
            const formData = new FormData(this.form);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Message sent successfully! 🎉 I\'ll get back to you soon.', 'success');
                this.form.reset();
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            this.showNotification('Failed to send message. Please try again or email directly.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : '#ff6b6b'};
            color: ${type === 'success' ? '#0a0e27' : '#fff'};
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

/**
 * Active Link Highlighter
 * Highlights the current section in navigation
 */
class ActiveLinkHighlighter {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Parallax Scroll Effect
 * Creates parallax effect for hero section
 */
class ParallaxScroll {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.stars = document.querySelector('.stars');
        if (this.hero && this.stars) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.clientHeight;
        
        if (scrollY < heroHeight) {
            this.stars.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }
}

/**
 * Skill Tag Interaction
 * Adds hover effects to skill tags
 */
class SkillTagInteraction {
    constructor() {
        this.skillTags = document.querySelectorAll('.skill-tag');
        this.init();
    }

    init() {
        this.skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => this.onHover(tag));
            tag.addEventListener('mouseleave', () => this.onLeave(tag));
        });
    }

    onHover(tag) {
        tag.style.transform = 'scale(1.15) rotate(-2deg)';
    }

    onLeave(tag) {
        tag.style.transform = 'scale(1) rotate(0deg)';
    }
}

/**
 * Navbar Background on Scroll
 * Changes navbar background when scrolling
 */
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateNavbarBackground());
    }

    updateNavbarBackground() {
        if (window.scrollY > 50) {
            this.navbar.style.background = 'rgba(10, 14, 39, 0.98)';
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(10, 14, 39, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }
}

/**
 * Counter Animation
 * Animates numbers when they come into view
 */
class CounterAnimation {
    constructor() {
        this.statBoxes = document.querySelectorAll('.stat-box h3');
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.statBoxes.forEach(box => observer.observe(box));
    }

    animateCounter(element) {
        const finalValue = parseInt(element.textContent);
        const duration = 1000;
        const increment = finalValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

/**
 * Project Card Hover Effect
 * Adds interactive hover effects to project cards
 */
class ProjectCardHover {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onHover(card));
            card.addEventListener('mouseleave', () => this.onLeave(card));
        });
    }

    onHover(card) {
        const image = card.querySelector('.project-image');
        const content = card.querySelector('.project-content');
        
        image.style.transform = 'scale(1.1)';
        content.style.transform = 'translateY(-5px)';
    }

    onLeave(card) {
        const image = card.querySelector('.project-image');
        const content = card.querySelector('.project-content');
        
        image.style.transform = 'scale(1)';
        content.style.transform = 'translateY(0)';
    }
}

/**
 * Utility Function: Debounce
 * Prevents excessive function calls during scroll/resize events
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Initialize All Components
 * Runs when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Website Initialized');

    // Initialize all components
    new SmoothScroll();
    new ScrollAnimations();
    new FormHandler();
    new ActiveLinkHighlighter();
    new ParallaxScroll();
    new SkillTagInteraction();
    new CounterAnimation();
    new ProjectCardHover();

    // Add custom CSS for active link
    const style = document.createElement('style');
    style.textContent = `
        .skill-tag {
            transition: all 0.3s ease;
        }
        
        .project-image {
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .project-content {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

/**
 * Handle window resize events with debounce
 */
window.addEventListener('resize', debounce(() => {
    console.log('Window resized');
}, 250));

/**
 * Log page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});
