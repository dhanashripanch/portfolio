/* ============================================
   ADVANCED ANIMATIONS - Portfolio Website
   ============================================ */

/**
 * Particle Animation Background
 * Creates floating particles in the background
 */
class ParticleAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.5;
        `;
        document.body.appendChild(this.canvas);

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create particles
        this.createParticles();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(30, window.innerWidth / 30);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x - particle.radius < 0 || particle.x + particle.radius > this.canvas.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y - particle.radius < 0 || particle.y + particle.radius > this.canvas.height) {
                particle.vy = -particle.vy;
            }

            // Draw particle
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connections
            this.particles.forEach((otherParticle, otherIndex) => {
                if (index > otherIndex) return;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.globalAlpha = (1 - distance / 100) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(this.animate);
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
        this.canvas.remove();
    }
}

/**
 * Text Scramble Effect
 * Creates a cool text scrambling animation
 */
class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________'.split('');
        this.queue = [];
        this.frame = 0;
        this.frameRequest = null;
        this.resolve = null;
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end, char: '' });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();

        return promise;
    }

    update = () => {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let entry = this.queue[i];

            if (this.frame >= entry.end) {
                complete++;
                output += entry.to;
            } else if (this.frame >= entry.start) {
                if (entry.char === '' || Math.random() < 0.28) {
                    entry.char = this.chars[Math.floor(Math.random() * this.chars.length)];
                }
                output += `<span class="scramble">${entry.char}</span>`;
            } else {
                output += entry.from;
            }
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

/**
 * Typing Effect
 * Creates a typewriter effect
 */
class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.isDeleting = false;
    }

    start() {
        this.type();
    }

    type() {
        if (this.isDeleting) {
            this.element.textContent = this.text.substring(0, this.index - 1);
            this.index--;

            if (this.index === 0) {
                this.isDeleting = false;
            }
        } else {
            this.element.textContent = this.text.substring(0, this.index + 1);
            this.index++;

            if (this.index === this.text.length) {
                this.isDeleting = false;
                // Wait before deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, 2000);
                return;
            }
        }

        const speed = this.isDeleting ? this.speed / 2 : this.speed;
        setTimeout(() => this.type(), speed);
    }
}

/**
 * Scroll Progress Indicator
 * Shows scroll progress on page
 */
class ScrollProgressBar {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #00ff88);
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(this.progressBar);

        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = scrollPercent + '%';
    }
}

/**
 * Cursor Glow Effect
 * Creates a glow effect following the cursor
 */
class CursorGlow {
    constructor() {
        this.glow = document.createElement('div');
        this.glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1;
            transform: translate(-50%, -50%);
            filter: blur(40px);
        `;
        document.body.appendChild(this.glow);

        document.addEventListener('mousemove', (e) => this.updateGlow(e));
    }

    updateGlow(e) {
        this.glow.style.left = e.clientX + 'px';
        this.glow.style.top = e.clientY + 'px';
    }
}

/**
 * Staggered Animation Handler
 * Handles staggered animations for multiple elements
 */
class StaggeredAnimation {
    static animate(elements, animationClass, staggerDelay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * staggerDelay);
        });
    }

    static observeElements(selector, animationClass, staggerDelay = 100, threshold = 0.1) {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetElements = entry.target.querySelectorAll('[data-stagger]');
                    this.animate(targetElements, animationClass, staggerDelay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });

        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Smooth Parallax Effect
 * Creates smooth parallax effect for elements
 */
class SmoothParallax {
    constructor(selector, speed = 0.5) {
        this.elements = document.querySelectorAll(selector);
        this.speed = speed;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.update(), { passive: true });
    }

    update() {
        const scrollY = window.scrollY;
        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const offset = elementTop * this.speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    }
}

/**
 * Number Counter with Formatting
 * Animates numbers with comma formatting
 */
class FormattedCounter {
    static animate(element, target, duration = 1000, prefix = '', suffix = '') {
        const startValue = 0;
        const increment = target / (duration / 16);
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= target) {
                element.textContent = prefix + this.formatNumber(target) + suffix;
                clearInterval(timer);
            } else {
                element.textContent = prefix + this.formatNumber(Math.floor(currentValue)) + suffix;
            }
        }, 16);
    }

    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

/**
 * Background Animation Manager
 * Manages animated backgrounds
 */
class BackgroundAnimation {
    static createGradientShift(element, colors) {
        const gradientSize = '400%';
        let gradientIndex = 0;
        const gradients = colors.map((color, index) => {
            const nextColor = colors[(index + 1) % colors.length];
            return `linear-gradient(45deg, ${color}, ${nextColor})`;
        });

        element.style.backgroundSize = gradientSize;
        element.style.animation = 'none';

        setInterval(() => {
            gradientIndex = (gradientIndex + 1) % gradients.length;
            element.style.background = gradients[gradientIndex];
        }, 5000);
    }

    static createAnimatedBg(element) {
        element.style.background = `
            linear-gradient(45deg, #0a0e27 25%, transparent 25%),
            linear-gradient(-45deg, #0a0e27 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #0a0e27 75%),
            linear-gradient(-45deg, transparent 75%, #0a0e27 75%)
        `;
        element.style.backgroundSize = '50px 50px';
        element.style.backgroundPosition = '0 0, 0 25px, 25px -25px, -25px 0px';
        element.style.animation = 'infinite-scroll 20s linear infinite';
    }
}

/**
 * Code Syntax Highlighter Animation
 * Highlights code syntax with colors
 */
class CodeHighlighter {
    static highlight(element) {
        const code = element.innerHTML;
        
        // Highlight keywords
        let highlighted = code
            .replace(/\b(function|const|let|var|return|if|else|for|while|class)\b/g, 
                '<span class="keyword">$1</span>')
            .replace(/(['"])(.+?)\1/g, 
                '<span class="string">$1$2$1</span>')
            .replace(/\/\/.+$/gm, 
                '<span class="comment">//$&</span>')
            .replace(/(\d+)/g, 
                '<span class="number">$1</span>');

        element.innerHTML = highlighted;
    }
}

/**
 * Initialize Advanced Animations
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize particle animation
        // new ParticleAnimation(); // Uncomment to enable

        // Initialize scroll progress bar
        new ScrollProgressBar();

        // Initialize cursor glow effect
        // new CursorGlow(); // Uncomment to enable

        // Initialize smooth parallax for specific elements
        new SmoothParallax('.about-text', 0.3);
        new SmoothParallax('.hero-graphic', 0.2);

        console.log('Advanced animations initialized');
    } catch (error) {
        console.warn('Some animations failed to initialize:', error);
    }
});

/**
 * Utility: Request Animation Frame Polyfill
 */
if (typeof window.requestAnimationFrame === 'undefined') {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
}

if (typeof window.cancelAnimationFrame === 'undefined') {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}
