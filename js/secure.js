/**
 * CyberVision Demo - Security Enhancements
 * This file provides additional security measures for the demo website
 * 
 * Features:
 * - CSP nonce generation
 * - XSS protection
 * - Input sanitization
 * - Form protection (if forms are added)
 * - Console security warnings
 */

// Self-executing function to avoid polluting global namespace
(function() {
    'use strict';
    
    // Security warning in console
    console.log('%cCyberVision Demo - Security Module Activated', 'color: #ff2a6d; font-weight: bold; font-size: 16px;');
    console.log('%cThis is a demo project with enhanced security features.', 'color: #05d9e8;');
    
    // Generate CSP nonce for inline scripts (if needed)
    function generateNonce() {
        const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let nonce = '';
        for (let i = 0; i < 32; i++) {
            nonce += validChars.charAt(Math.floor(Math.random() * validChars.length));
        }
        return nonce;
    }
    
    // Replace nonce placeholders with actual nonces
    function updateNonces() {
        try {
            const nonce = generateNonce();
            document.querySelectorAll('script[nonce="{{random-nonce}}"]').forEach(script => {
                script.setAttribute('nonce', nonce);
            });
        } catch (error) {
            console.warn('Error updating nonces:', error);
        }
    }
    
    // XSS protection - sanitize inputs (for demonstration)
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Protect against clickjacking
    function protectAgainstClickjacking() {
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }
    }
    
    // Disable console for production (uncomment if needed)
    /*
    function disableConsoleInProduction() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log = function() {};
            console.info = function() {};
            console.warn = function() {};
            console.error = function() {};
        }
    }
    */
    
    // Prevent form submissions (if forms are added)
    function protectForms() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(event) {
                // In this demo, we prevent form submissions
                // In a real app, you'd sanitize inputs and validate
                event.preventDefault();
                console.log('Form submission prevented - this is a demo site');
            });
        });
    }
    
    // Execute security measures
    function initSecurity() {
        updateNonces();
        protectAgainstClickjacking();
        protectForms();
        // disableConsoleInProduction();
        
        // Add security message to page
        const securityMessage = document.createElement('div');
        securityMessage.className = 'security-notice';
        securityMessage.style.display = 'none';
        securityMessage.textContent = 'Enhanced security features active';
        document.body.appendChild(securityMessage);
    }
    
    // Initialize security when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
    // Expose sanitizeInput function for use in other scripts if needed
    window.secureSanitize = sanitizeInput;
    
})();
