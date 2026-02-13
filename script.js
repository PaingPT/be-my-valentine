// ============================================
// STATE MACHINE LOGIC
// ============================================

const states = {
    STATE_0: {
        image: 'Snuggie.jpg',
        dialogue: "Hello Mommy! Daddy and I miss you so much.",
        buttons: [
            { id: 'btn-primary', text: 'Mommy misses you too, Snuggie', action: 'STATE_1' }
        ]
    },
    STATE_1: {
        image: 'Snuggie.jpg',
        dialogue: "Mommy, Daddy is asking if you will be his Valentine.",
        buttons: [
            { id: 'btn-yes', text: 'Yes', action: 'STATE_YES' },
            { id: 'btn-no', text: 'No', action: 'STATE_2' }
        ]
    },
    STATE_2: {
        image: 'S_weeping.png',
        dialogue: "Please say yes, Mommy",
        buttons: [
            { id: 'btn-yes', text: 'Yes', action: 'STATE_YES' },
            { id: 'btn-no', text: 'No', action: 'STATE_3' }
        ]
    },
    STATE_3: {
        image: 'S_crying.png',
        dialogue: "Mommy, please!!!",
        buttons: [
            { id: 'btn-yes', text: 'Yes', action: 'STATE_YES' }
        ]
    },
    STATE_YES: {
        image: 'S_happy.png',
        dialogue: "Yay! Mommy and Daddy's first valentine! Daddy is sorry that he couldn't be with Mommy tomorrow.",
        buttons: []
    }
};

let currentState = 'STATE_0';

// DOM elements
const snuggieImage = document.getElementById('snuggie-image');
const dialogueText = document.getElementById('dialogue-text');
const buttonContainer = document.getElementById('button-container');
const btnPrimary = document.getElementById('btn-primary');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

// Initialize state
function updateState(stateName) {
    currentState = stateName;
    const state = states[stateName];
    
    // Update image
    snuggieImage.src = state.image;
    
    // Update dialogue
    dialogueText.textContent = state.dialogue;
    
    // Hide all buttons first
    btnPrimary.style.display = 'none';
    btnYes.style.display = 'none';
    btnNo.style.display = 'none';
    
    // Show relevant buttons
    state.buttons.forEach(button => {
        const btnElement = document.getElementById(button.id);
        if (btnElement) {
            btnElement.style.display = 'block';
            btnElement.textContent = button.text;
            btnElement.onclick = () => updateState(button.action);
        }
    });
}

// Initialize on page load
updateState('STATE_0');

// ============================================
// HEART ANIMATION (Canvas)
// ============================================

const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');

let centerX, centerY;
let hearts = [];

// Heart colors
const heartColors = ['#ff4d6d', '#ff6fae', '#ff2d55', '#ff8ccf', '#ff1744', '#ff6b9d'];

// Resize canvas to full viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Heart class
class Heart {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Start at center
        this.x = centerX;
        this.y = centerY;
        
        // Random direction (angle in radians)
        this.angle = Math.random() * Math.PI * 2;
        
        // Random speed
        this.speed = 1 + Math.random() * 2;
        
        // Velocity components
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        
        // Random size
        this.size = 8 + Math.random() * 20;
        
        // Random color
        this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        
        // Opacity
        this.opacity = 1;
        
        // Wobble effect
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02 + Math.random() * 0.03;
        
        // Lifetime
        this.age = 0;
        this.maxAge = 120 + Math.random() * 60;
    }
    
    update() {
        // Apply wobble
        this.x += this.vx + Math.sin(this.age * this.wobbleSpeed + this.wobbleOffset) * 0.5;
        this.y += this.vy + Math.cos(this.age * this.wobbleSpeed + this.wobbleOffset) * 0.5;
        
        this.age++;
        
        // Fade out as it ages
        this.opacity = 1 - (this.age / this.maxAge);
        
        // Reset if too old or out of bounds
        if (this.age >= this.maxAge || 
            this.x < -50 || this.x > canvas.width + 50 || 
            this.y < -50 || this.y > canvas.height + 50) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw heart shape
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        
        ctx.moveTo(this.x, this.y + topCurveHeight);
        
        // Left curve
        ctx.bezierCurveTo(
            this.x, this.y,
            this.x - this.size / 2, this.y,
            this.x - this.size / 2, this.y + topCurveHeight
        );
        
        ctx.bezierCurveTo(
            this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2,
            this.x, this.y + (this.size + topCurveHeight) / 1.2,
            this.x, this.y + this.size
        );
        
        // Right curve
        ctx.bezierCurveTo(
            this.x, this.y + (this.size + topCurveHeight) / 1.2,
            this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2,
            this.x + this.size / 2, this.y + topCurveHeight
        );
        
        ctx.bezierCurveTo(
            this.x + this.size / 2, this.y,
            this.x, this.y,
            this.x, this.y + topCurveHeight
        );
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Create initial hearts
for (let i = 0; i < 50; i++) {
    hearts.push(new Heart());
    // Stagger initial ages for variety
    hearts[i].age = Math.floor(Math.random() * hearts[i].maxAge);
}

// Animation loop
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw all hearts
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    
    requestAnimationFrame(animate);
}

// Start animation
animate();
