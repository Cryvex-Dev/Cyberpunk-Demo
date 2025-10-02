// Advanced animations for the cyberpunk website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations after the page has loaded
    setTimeout(() => {
        // Split text animation for headings
        initSplitTextAnimations();
        
        // Parallax effect for hero section
        initParallaxEffect();
        
        // Data corruption effect
        initDataCorruptionEffect();
        
        // Terminal typing effect
        initTerminalTyping();
        
        // Glitch hover effect
        initGlitchHoverEffect();
    }, 1000); // Delay to ensure loading screen completes
});

// Split text animations using SplitType
function initSplitTextAnimations() {
    // Check if SplitType and gsap are loaded
    if (typeof SplitType === 'undefined') {
        console.error('SplitType library not loaded');
        return;
    }
    
    if (typeof gsap === 'undefined') {
        console.error('GSAP library not loaded');
        return;
    }
    
    // Check if ScrollTrigger is available
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    
    // Apply to all section headers
    document.querySelectorAll('.section-header h2').forEach(heading => {
        try {
            // Split the text into characters
            const splitHeading = new SplitType(heading, { types: 'chars' });
            
            // Set up GSAP animation
            if (hasScrollTrigger) {
                gsap.from(splitHeading.chars, {
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 20,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                });
            } else {
                // Fallback animation without ScrollTrigger
                gsap.from(splitHeading.chars, {
                    opacity: 0,
                    y: 20,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                });
            }
        } catch (error) {
            console.error('Error in split text animation:', error);
        }
    });
    
    // Apply to product names
    document.querySelectorAll('.product-info h3').forEach(heading => {
        try {
            // Split the text into characters
            const splitHeading = new SplitType(heading, { types: 'chars' });
            
            // Set up GSAP animation
            gsap.from(splitHeading.chars, {
                opacity: 0,
                x: -10,
                stagger: 0.03,
                duration: 0.5,
                ease: 'power2.out'
            });
        } catch (error) {
            console.error('Error in product name animation:', error);
        }
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (!heroSection || !heroContent || !heroVisual) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollPercentage = scrollTop / heroHeight;
        
        // Only apply parallax if within the hero section
        if (scrollPercentage <= 1) {
            // Move content up faster than background
            heroContent.style.transform = `translateY(${scrollTop * 0.3}px)`;
            
            // Move visual elements slightly
            heroVisual.style.transform = `translateY(${scrollTop * 0.1}px)`;
            
            // Adjust opacity based on scroll
            heroContent.style.opacity = 1 - (scrollPercentage * 1.5);
        }
    });
}

// Data corruption effect
function initDataCorruptionEffect() {
    // Apply to tech cards
    document.querySelectorAll('.tech-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add a quick glitch effect on hover
            card.classList.add('digital-distortion');
            
            // Text glitch effect
            const heading = card.querySelector('h3');
            if (heading) {
                heading.setAttribute('data-text', heading.textContent);
                heading.classList.add('glitch-text');
            }
            
            // Remove the effect after animation completes
            setTimeout(() => {
                card.classList.remove('digital-distortion');
                if (heading) {
                    heading.classList.remove('glitch-text');
                }
            }, 1000);
        });
    });
    
    // Apply to grid items in cyberspace section
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('data-corruption');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('data-corruption');
        });
    });
}

// Terminal typing effect
function initTerminalTyping() {
    const terminal = document.getElementById('terminal-content');
    if (!terminal) return;
    
    // Add a cursor blinking effect to the terminal input
    const terminalCursor = document.querySelector('.cursor');
    if (terminalCursor) {
        setInterval(() => {
            terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
    
    // Function to add a new line to the terminal
    function addTerminalLine(text, isCommand = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        if (isCommand) {
            line.innerHTML = `>${text}`;
        } else {
            line.innerHTML = `><span class="typing-text">${text}</span>`;
        }
        
        // Insert before the input line
        const inputLine = document.querySelector('.terminal-input');
        terminal.insertBefore(line, inputLine);
        
        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
        
        return line;
    }
    
    // Make the terminal interactive - allow user to type commands
    document.addEventListener('keydown', (e) => {
        // Check if we're focused on the terminal
        if (document.activeElement !== document.body) return;
        
        const inputLine = document.querySelector('.terminal-input');
        if (!inputLine) return;
        
        // Get the current input text
        let currentText = inputLine.textContent.substring(1); // Remove the >
        
        // Handle backspace
        if (e.key === 'Backspace') {
            inputLine.textContent = '>' + currentText.slice(0, -1);
            return;
        }
        
        // Handle enter key
        if (e.key === 'Enter') {
            // Process the command
            const command = currentText.trim();
            
            // Create a new line with the entered command
            addTerminalLine(command, true);
            
            // Process the command
            processTerminalCommand(command);
            
            // Clear the input
            inputLine.textContent = '>';
            return;
        }
        
        // Add character to input if it's a printable character
        if (e.key.length === 1) {
            inputLine.textContent = '>' + currentText + e.key;
        }
    });
    
    // Process terminal commands
    function processTerminalCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand === 'help') {
            addTerminalLine('Available commands: help, about, access, status, clear');
        } else if (lowerCommand === 'about') {
            addTerminalLine('NeoTech Cyberspace Terminal v3.5.7');
            addTerminalLine('Quantum-secured connection established');
        } else if (lowerCommand === 'access') {
            addTerminalLine('Accessing neural network...');
            setTimeout(() => {
                addTerminalLine('Access granted. Welcome to the grid.');
            }, 1500);
        } else if (lowerCommand === 'status') {
            addTerminalLine('System status: ONLINE');
            addTerminalLine('Connection: SECURE');
            addTerminalLine('Bandwidth: 1.2 TB/s');
            addTerminalLine('Latency: 0.5ms');
        } else if (lowerCommand === 'clear') {
            // Clear all lines except the input
            const lines = document.querySelectorAll('.terminal-line:not(.terminal-input)');
            lines.forEach(line => line.remove());
        } else if (command.trim() === '') {
            // Do nothing for empty command
        } else {
            addTerminalLine(`Command not recognized: ${command}`);
        }
    }
}

// Glitch hover effect
function initGlitchHoverEffect() {
    // Apply to logo
    const logo = document.querySelector('.logo-glitch');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.classList.add('flicker-animation');
        });
        
        logo.addEventListener('mouseleave', () => {
            setTimeout(() => {
                logo.classList.remove('flicker-animation');
            }, 1000);
        });
    }
    
    // Apply to CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('distort-on-hover');
        });
        
        button.addEventListener('mouseleave', () => {
            setTimeout(() => {
                button.classList.remove('distort-on-hover');
            }, 500);
        });
    });
    
    // Apply to product buy buttons
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('glitch-text');
            button.setAttribute('data-text', button.textContent);
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('glitch-text');
        });
    });
}

// Cyberpunk cursor trail effect
function initCursorTrailEffect() {
    const body = document.querySelector('body');
    
    // Create cursor trail container
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    trailContainer.style.position = 'fixed';
    trailContainer.style.top = '0';
    trailContainer.style.left = '0';
    trailContainer.style.width = '100%';
    trailContainer.style.height = '100%';
    trailContainer.style.pointerEvents = 'none';
    trailContainer.style.zIndex = '9999';
    body.appendChild(trailContainer);
    
    // Create trail elements
    const trailCount = 10;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.position = 'absolute';
        trail.style.width = '8px';
        trail.style.height = '8px';
        trail.style.borderRadius = '50%';
        trail.style.backgroundColor = i === 0 ? '#ff2a6d' : '#05d9e8';
        trail.style.opacity = 1 - (i / trailCount);
        trail.style.transform = 'translate(-50%, -50%)';
        trail.style.pointerEvents = 'none';
        
        trailContainer.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate the trail
    function animateTrail() {
        // Update the first trail to the current mouse position
        trails[0].x = mouseX;
        trails[0].y = mouseY;
        trails[0].element.style.left = `${mouseX}px`;
        trails[0].element.style.top = `${mouseY}px`;
        
        // Update the rest of the trails to follow the previous one
        for (let i = 1; i < trails.length; i++) {
            const current = trails[i];
            const previous = trails[i - 1];
            
            // Interpolate position (trailing effect)
            current.x += (previous.x - current.x) * 0.3;
            current.y += (previous.y - current.y) * 0.3;
            
            current.element.style.left = `${current.x}px`;
            current.element.style.top = `${current.y}px`;
        }
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}
