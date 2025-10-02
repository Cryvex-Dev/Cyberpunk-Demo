/**
 * CyberVision Demo - Interactive Cyberpunk Terminal
 * 
 * Features:
 * - Interactive command line interface
 * - Fun cyberpunk-themed commands
 * - Secure implementation (isolated from actual system)
 */

(function() {
    'use strict';
    
    // Terminal elements
    let terminal;
    let terminalContent;
    let terminalInput;
    let terminalCursor;
    
    // Command history
    const commandHistory = [];
    let historyIndex = -1;
    
    // Terminal state
    let isTerminalActive = false;
    let isHacked = false;
    
    // Terminal initialization
    function initTerminal() {
        // Get terminal elements
        terminal = document.querySelector('.interface-terminal');
        terminalContent = document.getElementById('terminal-content');
        terminalInput = document.querySelector('.terminal-input');
        terminalCursor = document.querySelector('.cursor');
        
        if (!terminal || !terminalContent || !terminalInput) {
            console.error('Terminal elements not found');
            return;
        }
        
        // Create a real input element (hidden) to capture keystrokes
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'text';
        hiddenInput.className = 'hidden-terminal-input';
        hiddenInput.setAttribute('aria-label', 'Terminal input');
        hiddenInput.autocomplete = 'off';
        hiddenInput.autocorrect = 'off';
        hiddenInput.autocapitalize = 'off';
        hiddenInput.spellcheck = false;
        terminal.appendChild(hiddenInput);
        
        // Style the hidden input
        const style = document.createElement('style');
        style.textContent = `
            .hidden-terminal-input {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }
            .terminal-active .terminal-input {
                border-bottom: 2px solid var(--secondary-color);
                padding-bottom: 5px;
                margin-bottom: 5px;
                animation: pulse-border 2s infinite;
            }
            @keyframes pulse-border {
                0% { border-color: var(--secondary-color); }
                50% { border-color: var(--primary-color); }
                100% { border-color: var(--secondary-color); }
            }
            .terminal-input span.typed-text {
                color: var(--secondary-color);
                font-family: var(--font-mono);
                text-shadow: 0 0 5px var(--secondary-color);
            }
            .terminal-warning {
                background-color: rgba(255, 0, 0, 0.2);
                color: var(--warning-color);
                padding: 10px;
                margin: 10px 0;
                border-left: 3px solid var(--warning-color);
                font-family: var(--font-mono);
                animation: pulse 2s infinite;
                box-shadow: 0 0 10px rgba(255, 159, 28, 0.2);
            }
            @keyframes pulse {
                0% { opacity: 0.7; }
                50% { opacity: 1; }
                100% { opacity: 0.7; }
            }
            .terminal-success {
                color: var(--success-color);
            }
            .site-glitch {
                animation: site-glitch 0.15s infinite;
            }
            @keyframes site-glitch {
                0% { transform: translate(0); filter: none; }
                10% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
                30% { transform: translate(-5px, -5px); filter: hue-rotate(-60deg); }
                50% { transform: translate(5px, 5px); filter: invert(0.1); }
                70% { transform: translate(5px, -5px); filter: hue-rotate(30deg); }
                90% { transform: translate(-3px, 3px); filter: brightness(1.2); }
                100% { transform: translate(0); filter: none; }
            }
            .terminal-active {
                border: 2px solid var(--secondary-color);
                box-shadow: 0 0 20px rgba(5, 217, 232, 0.5);
            }
            .extreme-glitch {
                animation: extreme-glitch 0.2s infinite;
                position: relative;
                display: inline-block;
                width: auto;
                text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.7);
            }
            .extreme-glitch::before, .extreme-glitch::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                opacity: 0.8;
            }
            .extreme-glitch::before {
                animation: glitch-anim-1 0.2s infinite;
                left: -2px;
                text-shadow: 2px 0 red;
                background: transparent;
            }
            .extreme-glitch::after {
                animation: glitch-anim-2 0.3s infinite;
                left: 2px;
                text-shadow: -2px 0 cyan;
                background: transparent;
            }
            @keyframes extreme-glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
            @keyframes glitch-anim-1 {
                0% { transform: translate(0); }
                20% { transform: translate(-5px, 5px); }
                40% { transform: translate(-5px, -5px); }
                60% { transform: translate(5px, 5px); }
                80% { transform: translate(5px, -5px); }
                100% { transform: translate(0); }
            }
            @keyframes glitch-anim-2 {
                0% { transform: translate(0); }
                20% { transform: translate(5px, 5px); }
                40% { transform: translate(5px, -5px); }
                60% { transform: translate(-5px, 5px); }
                80% { transform: translate(-5px, -5px); }
                100% { transform: translate(0); }
            }
            .hack-warning {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(255, 0, 0, 0.7);
                color: white;
                padding: 30px;
                border: 2px solid red;
                font-family: var(--font-mono);
                z-index: 9999;
                text-align: center;
                width: 90%;
                max-width: 500px;
                animation: warning-flicker 0.5s infinite;
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 0, 0, 0.5);
            }
            @keyframes warning-flicker {
                0% { opacity: 1; }
                50% { opacity: 0.8; }
                52% { opacity: 1; }
                54% { opacity: 0.8; }
                56% { opacity: 1; }
                100% { opacity: 1; }
            }
            .hack-warning h3 {
                margin-top: 0;
                color: white;
                font-size: 24px;
                letter-spacing: 2px;
                animation: text-glitch 0.3s infinite;
            }
            @keyframes text-glitch {
                0% { text-shadow: 2px 0 0 red, -2px 0 0 blue; }
                25% { text-shadow: -2px 0 0 red, 2px 0 0 blue; }
                50% { text-shadow: 2px 0 0 red, -2px 0 0 blue; }
                75% { text-shadow: -2px 0 0 red, 2px 0 0 blue; }
                100% { text-shadow: 2px 0 0 red, -2px 0 0 blue; }
            }
            .countdown {
                font-size: 18px;
                margin: 15px 0;
                font-weight: bold;
            }
            .timer {
                color: red;
                font-size: 24px;
                animation: pulse 0.5s infinite;
            }
            .glitch-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
                background: repeating-linear-gradient(
                    0deg,
                    rgba(0, 0, 0, 0.1) 0px,
                    rgba(0, 0, 0, 0.1) 1px,
                    rgba(255, 0, 0, 0.05) 1px,
                    rgba(255, 0, 0, 0.05) 2px
                );
                animation: scan-lines 0.2s linear infinite;
                opacity: 0.4;
            }
            @keyframes scan-lines {
                0% { background-position: 0 0; }
                100% { background-position: 0 2px; }
            }
            @keyframes blink-caret {
                from, to { opacity: 0; }
                50% { opacity: 1; }
            }
            .screen-flash {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                opacity: 0.3;
                pointer-events: none;
                z-index: 9997;
                animation: flash-out 0.15s forwards;
            }
            @keyframes flash-out {
                0% { opacity: 0.3; }
                100% { opacity: 0; }
            }
            .color-shift {
                animation: color-distort 1s infinite;
            }
            @keyframes color-distort {
                0% { filter: none; }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(-60deg) brightness(1.2); }
                75% { filter: hue-rotate(30deg) contrast(1.5); }
                100% { filter: none; }
            }
        `;
        
        // Add style to document using a nonce
        const styleElement = document.createElement('style');
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
        
        // Add event listeners for the terminal
        terminalContent.addEventListener('click', focusTerminal);
        hiddenInput.addEventListener('input', handleInput);
        hiddenInput.addEventListener('keydown', handleKeyDown);
        
        // Start the terminal after animations
        setTimeout(activateTerminal, 8000);
    }
    
    // Activate terminal for interaction
    function activateTerminal() {
        isTerminalActive = true;
        terminal.classList.add('terminal-active');
        
        // Add new line showing terminal is ready
        addTerminalLine('CRYVEX TERMINAL v1.0 - ACCESS GRANTED', 'terminal-success');
        addTerminalLine('Terminal active. Type "help" for available commands.', 'terminal-success');
        
        // Update the input line
        updateInputLine('');
        
        // Make sure the terminal input line is transparent
        const termInput = document.querySelector('.terminal-input');
        if (termInput) {
            termInput.style.background = 'transparent';
            termInput.style.border = 'none';
            termInput.style.boxShadow = 'none';
        }
        
        // Make sure the status indicator is showing correctly
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.textContent = 'Online';
            statusIndicator.style.color = 'var(--success-color)';
        }
        
        focusTerminal();
    }
    
    // Focus the hidden input to capture keystrokes
    function focusTerminal() {
        if (!isTerminalActive) return;
        
        const hiddenInput = document.querySelector('.hidden-terminal-input');
        if (hiddenInput) {
            hiddenInput.focus();
        }
        
        // Make cursor blink
        if (terminalCursor) {
            terminalCursor.style.animation = 'blink-caret 0.75s step-end infinite';
        }
    }
    
    // Handle input in the terminal
    function handleInput(e) {
        if (!isTerminalActive) return;
        
        const inputText = e.target.value;
        updateInputLine(inputText);
    }
    
    // Handle special keys (Enter, Up, Down)
    function handleKeyDown(e) {
        if (!isTerminalActive) return;
        
        const key = e.key;
        
        if (key === 'Enter') {
            const commandText = e.target.value.trim();
            
            if (commandText) {
                // Add command to history
                commandHistory.push(commandText);
                historyIndex = commandHistory.length;
                
                // Execute command
                executeCommand(commandText);
                
                // Reset input
                e.target.value = '';
                updateInputLine('');
            }
            
            e.preventDefault();
        } else if (key === 'ArrowUp') {
            // Navigate command history (up)
            if (historyIndex > 0) {
                historyIndex--;
                e.target.value = commandHistory[historyIndex];
                updateInputLine(commandHistory[historyIndex]);
            }
            e.preventDefault();
        } else if (key === 'ArrowDown') {
            // Navigate command history (down)
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                e.target.value = commandHistory[historyIndex];
                updateInputLine(commandHistory[historyIndex]);
            } else if (historyIndex === commandHistory.length - 1) {
                historyIndex = commandHistory.length;
                e.target.value = '';
                updateInputLine('');
            }
            e.preventDefault();
        }
    }
    
    // Update the visible input line
    function updateInputLine(text) {
        if (!terminalInput) return;
        
        const inputSpan = terminalInput.querySelector('span') || document.createElement('span');
        
        if (!inputSpan.classList.contains('typed-text')) {
            if (terminalInput.querySelector('.cursor')) {
                terminalInput.querySelector('.cursor').remove();
            }
            
            inputSpan.className = 'typed-text';
            terminalInput.appendChild(inputSpan);
            
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.innerHTML = '&nbsp;';
            cursor.style.animation = 'blink-caret 0.75s step-end infinite';
            terminalInput.appendChild(cursor);
        }
        
        inputSpan.textContent = text;
        
        // Ensure the terminal scrolls to the bottom
        if (terminalContent) {
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    }
    
    // Add a new line to the terminal
    function addTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (className) {
            line.classList.add(className);
        }
        
        line.textContent = '> ' + text;
        
        // Insert before the input line
        terminalContent.insertBefore(line, terminalInput);
        
        // Scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }
    
    // Execute a terminal command
    function executeCommand(command) {
        // Log the command
        addTerminalLine(command);
        
        // Parse command
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Handle commands
        switch (cmd) {
            case 'help':
                showHelp();
                break;
            case 'clear':
                clearTerminal();
                break;
            case 'sudo':
                executeSudoCommand(args);
                break;
            case 'exit':
                addTerminalLine('Closing terminal session...');
                setTimeout(() => {
                    addTerminalLine('Terminal session closed.', 'terminal-success');
                    isTerminalActive = false;
                    terminal.classList.remove('terminal-active');
                }, 1000);
                break;
            case 'about':
                addTerminalLine('CyberVision Terminal v1.0');
                addTerminalLine('Created by Cryvex Dev');
                addTerminalLine('This is a demo interactive terminal with fun cyberpunk commands.');
                break;
            case 'time':
                const now = new Date();
                addTerminalLine(`Current system time: ${now.toLocaleString()}`);
                break;
            default:
                addTerminalLine(`Command not found: ${cmd}. Type "help" for available commands.`, 'terminal-warning');
        }
    }
    
    // Show help message
    function showHelp() {
        addTerminalLine('Available commands:');
        addTerminalLine('  help      - Show this help message');
        addTerminalLine('  clear     - Clear terminal screen');
        addTerminalLine('  sudo      - Execute privileged commands');
        addTerminalLine('  exit      - Exit terminal session');
        addTerminalLine('  about     - Show terminal information');
        addTerminalLine('  time      - Display current system time');
        addTerminalLine('');
        addTerminalLine('Sudo commands:');
        addTerminalLine('  sudo @kill    - Refreshes the site');
        addTerminalLine('  sudo hack     - Initiate system glitch');
    }
    
    // Clear the terminal
    function clearTerminal() {
        // Remove all terminal lines except the input
        const children = Array.from(terminalContent.children);
        for (const child of children) {
            if (!child.classList.contains('terminal-input')) {
                child.remove();
            }
        }
    }
    
    // Execute sudo commands
    function executeSudoCommand(args) {
        if (args.length === 0) {
            addTerminalLine('Usage: sudo [command]', 'terminal-warning');
            return;
        }
        
        const sudoCmd = args[0].toLowerCase();
        
        switch (sudoCmd) {
            case '@kill':
                addTerminalLine('System refresh initiated...', 'terminal-warning');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                break;
            

            
            case 'hack':
                if (!isHacked) {
                    addTerminalLine('WARNING: System glitch activated!', 'terminal-warning');
                    activateHackMode();
                    isHacked = true;
                } else {
                    addTerminalLine('System already compromised. Refresh to restore.', 'terminal-warning');
                }
                break;
            
            default:
                addTerminalLine(`Sudo command not found: ${sudoCmd}`, 'terminal-warning');
        }
    }
    
    // Emoji functionality has been removed
    
    // Activate hack mode
    function activateHackMode() {
        // Add warning message with intense flashing
        const warning = document.createElement('div');
        warning.className = 'hack-warning';
        warning.innerHTML = `
            <h3>⚠️ SYSTEM COMPROMISED ⚠️</h3>
            <p style="font-size: 16px; margin: 15px 0;">Critical security breach detected!</p>
            <p style="color: #ff4d4d; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">MALICIOUS CODE EXECUTION IN PROGRESS</p>
            <div class="countdown">System shutdown in <span class="timer">10</span></div>
            <p style="margin-top: 15px; font-size: 14px;">Refresh the page to restore normal operation.</p>
            <div class="warning-decoration" style="margin-top: 15px; font-size: 18px;">
                ⚠️ ⚠️ ⚠️ ⚠️ ⚠️
            </div>
        `;
        document.body.appendChild(warning);
        
        // Center the warning element properly
        warning.style.position = 'fixed';
        warning.style.top = '50%';
        warning.style.left = '50%';
        warning.style.transform = 'translate(-50%, -50%)';
        warning.style.zIndex = '9999';
        
        // Add some inline styles to ensure proper display
        warning.style.padding = '30px';
        warning.style.textAlign = 'center';
        warning.style.width = '90%';
        warning.style.maxWidth = '500px';
        warning.style.border = '2px solid red';
        
        // Start countdown
        let count = 10;
        const timerElement = warning.querySelector('.timer');
        const countdownInterval = setInterval(() => {
            count--;
            if (timerElement) timerElement.textContent = count;
            if (count <= 0) clearInterval(countdownInterval);
        }, 1000);
        
        // Create glitch overlay
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay';
        document.body.appendChild(glitchOverlay);
        
        // Random screen flash
        const flashScreen = () => {
            if (!document.body.classList.contains('site-glitch')) return;
            
            const flash = document.createElement('div');
            flash.className = 'screen-flash';
            document.body.appendChild(flash);
            
            setTimeout(() => {
                flash.remove();
            }, 150);
            
            setTimeout(() => {
                if (document.body.classList.contains('site-glitch')) {
                    flashScreen();
                }
            }, Math.random() * 3000 + 1000);
        };
        
        // Make elements glitch
        document.body.classList.add('site-glitch');
        
        // Apply heavy glitch to titles
        const titles = document.querySelectorAll('.section-header h2, .glitch-text, h1');
        titles.forEach(title => {
            title.classList.add('extreme-glitch');
            
            // Fix data-text attribute for glitch effect
            if (!title.hasAttribute('data-text') && title.classList.contains('glitch-text')) {
                title.setAttribute('data-text', title.textContent);
            }
            
            // Save original text
            if (title.textContent && title.textContent.length > 0) {
                title.setAttribute('original-text', title.textContent);
                
                // Create data corruption effect in titles
                const originalText = title.textContent;
                
                const corruptText = () => {
                    if (!document.body.classList.contains('site-glitch')) {
                        title.textContent = originalText;
                        if (title.classList.contains('glitch-text')) {
                            title.setAttribute('data-text', originalText);
                        }
                        return;
                    }
                    
                    let newText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() > 0.7) {
                            const charCode = Math.floor(Math.random() * 26) + 65;
                            newText += String.fromCharCode(charCode);
                        } else {
                            newText += originalText[i];
                        }
                    }
                    
                    title.textContent = newText;
                    if (title.classList.contains('glitch-text')) {
                        title.setAttribute('data-text', newText);
                    }
                    
                    setTimeout(corruptText, Math.random() * 200 + 50);
                };
                
                corruptText();
            }
        });
        
        // Start screen flash
        flashScreen();
        
        // Add color distortion
        document.documentElement.classList.add('color-shift');
        
        // Add lag effect (with reduced calculation load to keep animation smooth)
        const lagInterval = setInterval(() => {
            if (!document.body.classList.contains('site-glitch')) {
                clearInterval(lagInterval);
                return;
            }
            
            // Lighter calculation to avoid freezing but create perception of lag
            for (let i = 0; i < 100000; i++) {
                Math.sqrt(i);
            }
        }, 800);
        
        // Random element movements with more extreme values
        const elements = document.querySelectorAll('h1, h2, p, .grid-item, .card, button, img');
        elements.forEach(el => {
            el.style.transition = 'transform 0.2s ease';
            
            const glitchInterval = setInterval(() => {
                if (!document.body.classList.contains('site-glitch')) {
                    clearInterval(glitchInterval);
                    el.style.transform = '';
                    return;
                }
                
                const x = (Math.random() - 0.5) * 40; // More extreme movement
                const y = (Math.random() - 0.5) * 40;
                const rotate = (Math.random() - 0.5) * 10; // Add rotation
                const scaleX = 1 + (Math.random() - 0.5) * 0.2; // Add scale distortion
                
                el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scaleX(${scaleX})`;
            }, 150 + Math.random() * 250); // Faster intervals
        });
        
        // Add a reset function to be called when the page is refreshed
        window.addEventListener('beforeunload', resetHackEffects);
    }
    
    // Reset all hack effects
    function resetHackEffects() {
        // Remove classes
        document.body.classList.remove('site-glitch');
        document.documentElement.classList.remove('color-shift');
        
        // Remove glitch overlay and warning
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) glitchOverlay.remove();
        
        const hackWarning = document.querySelector('.hack-warning');
        if (hackWarning) hackWarning.remove();
        
        // Reset titles
        const titles = document.querySelectorAll('.extreme-glitch');
        titles.forEach(title => {
            title.classList.remove('extreme-glitch');
            if (title.hasAttribute('original-text')) {
                const originalText = title.getAttribute('original-text');
                title.textContent = originalText;
                if (title.classList.contains('glitch-text')) {
                    title.setAttribute('data-text', originalText);
                }
                title.removeAttribute('original-text');
            }
        });
        
        // Reset all element transforms
        const elements = document.querySelectorAll('h1, h2, p, .grid-item, .card, button, img');
        elements.forEach(el => {
            el.style.transform = '';
        });
        
        // Remove any screen flashes
        const flashes = document.querySelectorAll('.screen-flash');
        flashes.forEach(flash => flash.remove());
    }
    
    // Initialize terminal when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTerminal);
    } else {
        // If it's already loaded (rarely happens but just in case)
        setTimeout(initTerminal, 500);
    }
    
})();
