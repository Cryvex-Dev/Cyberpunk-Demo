// Main JavaScript for the cyberpunk website
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(element => {
        if (element.textContent.includes('©')) {
            element.textContent = element.textContent.replace('2025', currentYear.toString());
        }
    });
    
    // Loading screen animation
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15; // Increased speed by 3x
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.floor(progress)}%`;
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            // Reduced delays from 500ms to 100ms
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Initialize animations after loading screen
                    initAnimations();
                }, 100);
            }, 100);
        }
    }, 30); // Reduced interval from 100ms to 30ms
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            
            // Scroll to target
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Product tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productInfos = document.querySelectorAll('.product-info');
    
    // Initialize the first product (NeuroLink X9)
    if (tabBtns.length > 0) {
        // Make sure first product is shown by default
        update3DModel('neurolink');
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and info panels
            tabBtns.forEach(b => b.classList.remove('active'));
            productInfos.forEach(info => info.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding info panel
            btn.classList.toggle('active');
            const productId = btn.getAttribute('data-product');
            document.getElementById(`${productId}-info`).classList.add('active');
            
            // Update 3D model
            update3DModel(productId);
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat-value');
    const statsSection = document.querySelector('.about-section');
    
    let statsAnimated = false;
    
    function animateStats() {
        if (statsAnimated) return;
        
        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-value'));
            const hasDecimal = target.toString().includes('.');
            const suffix = stat.textContent.replace(/[0-9.]/g, '');
            
            let current = 0;
            const increment = target / 50;
            const duration = 1500;
            const stepTime = duration / 50;
            
            const counter = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                
                if (hasDecimal) {
                    stat.textContent = current.toFixed(1) + suffix;
                } else {
                    stat.textContent = Math.floor(current).toLocaleString() + suffix;
                }
            }, stepTime);
        });
        
        statsAnimated = true;
    }
    
    // Terminal typing effect
    function typeTerminalText() {
        const terminalLines = document.querySelectorAll('.terminal-line .typing-text');
        
        terminalLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite';
            }, index * 2000);
        });
    }
    
    // Initialize all animations
    function initAnimations() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined') {
            console.error('GSAP library not loaded');
            return;
        }
        
        // Initialize GSAP animations and ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        } else {
            console.error('ScrollTrigger plugin not loaded');
        }
        
        // Hero section animations
        gsap.from('.hero-content h1', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-content .subtitle', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.cta-container', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        // Section headers animation
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
        
        // Tech cards animation
        gsap.utils.toArray('.tech-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Product showcase animation
        gsap.from('.product-viewer', {
            scrollTrigger: {
                trigger: '.product-showcase',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from('.product-details', {
            scrollTrigger: {
                trigger: '.product-showcase',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Cyberspace grid animation
        gsap.utils.toArray('.grid-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'back.out(1.7)'
            });
        });
        
        // Terminal animation
        gsap.from('.interface-terminal', {
            scrollTrigger: {
                trigger: '.interface-terminal',
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => typeTerminalText()
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // About section animation
        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from('.about-visual', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Stats animation
        ScrollTrigger.create({
            trigger: '.stats-grid',
            start: 'top 80%',
            onEnter: animateStats
        });
        
        // Timeline animation
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: 30,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Split text animations
        document.querySelectorAll('.split-text').forEach(text => {
            // Split the text into characters
            const splitter = new SplitType(text, { types: 'chars' });
            
            // Animate each character
            gsap.from(splitter.chars, {
                scrollTrigger: {
                    trigger: text,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 20,
                stagger: 0.02,
                duration: 0.5,
                ease: 'power3.out',
                onComplete: () => text.classList.add('reveal')
            });
        });
    }
});

// Function to show/hide an element with fade animation
function fadeToggle(element, show) {
    if (show) {
        element.style.display = 'block';
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    } else {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }
}

// Function to update 3D model based on selected product
function update3DModel(productId) {
    const modelContainer = document.getElementById('product-3d-container');
    
    // This would be replaced with actual 3D model loading code
    // For demo, use a subtle border glow instead of the big gradient background
    
    switch (productId) {
        case 'neurolink':
            modelContainer.style.background = 'rgba(10, 10, 10, 0.3)';
            modelContainer.style.boxShadow = '0 0 15px rgba(255, 42, 109, 0.3)';
            break;
        case 'holovisor':
            modelContainer.style.background = 'rgba(10, 10, 10, 0.3)';
            modelContainer.style.boxShadow = '0 0 15px rgba(5, 217, 232, 0.3)';
            break;
        case 'synthlimb':
            modelContainer.style.background = 'rgba(10, 10, 10, 0.3)';
            modelContainer.style.boxShadow = '0 0 15px rgba(211, 0, 197, 0.3)';
            break;
        case 'nanodrone':
            modelContainer.style.background = 'rgba(10, 10, 10, 0.3)';
            modelContainer.style.boxShadow = '0 0 15px rgba(254, 228, 64, 0.3)';
            break;
    }
}
