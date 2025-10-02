// Digital rain (Matrix-like) effect for cyberpunk website
document.addEventListener('DOMContentLoaded', function() {
    initDigitalRain();
});

function initDigitalRain() {
    const container = document.getElementById('digitalRain');
    if (!container) return;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    // Characters to use (can include various alphabets for cyberpunk feel)
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+=><[]{}$%&@#';
    
    // Column settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Track the Y position of each column
    const drops = [];
    
    // Initialize all columns to start position
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
    }
    
    // Define colors
    const primaryColor = '#05d9e8';
    const secondaryColor = '#ff2a6d';
    const fadedColor = 'rgba(5, 217, 232, 0.2)';
    
    // Draw function
    function draw() {
        // Add semi-transparent black rectangle over previous frame
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Loop through each column
        for (let i = 0; i < drops.length; i++) {
            // Choose a random character
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            
            // Set color based on position
            if (drops[i] > 0) {
                // Head of the column is brighter
                if (drops[i] < 5) {
                    ctx.fillStyle = secondaryColor;
                } else if (drops[i] < 15) {
                    ctx.fillStyle = primaryColor;
                } else {
                    ctx.fillStyle = fadedColor;
                }
                
                // Draw the character
                ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            }
            
            // Increment Y position for next frame
            drops[i]++;
            
            // Reset position after reaching bottom or randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = Math.floor(Math.random() * -20);
            }
        }
        
        // Call draw function again after a short delay
        setTimeout(draw, 50);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Recalculate columns
        const newColumns = Math.floor(canvas.width / fontSize);
        
        // Adjust drops array
        if (newColumns > columns) {
            // Add new columns
            for (let i = columns; i < newColumns; i++) {
                drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
            }
        } else if (newColumns < columns) {
            // Remove extra columns
            drops.length = newColumns;
        }
    });
    
    // Start the animation
    draw();
}
