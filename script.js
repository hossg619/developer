// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(10, 10, 10, 0.99), rgba(26, 26, 26, 0.99))';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, rgba(10, 10, 10, 0.98), rgba(26, 26, 26, 0.98))';
            navbar.style.backdropFilter = 'blur(15px)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Animate skill cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add typing effect to main heading (if on home page)
    const mainHeading = document.querySelector('h1');
    if (mainHeading && mainHeading.textContent === 'Hoss Gassaway') {
        typeWriter(mainHeading, 'Hoss Gassaway', 100);
    }

    // Contact form enhancement
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupContactForm(contactForm);
    }

    // Add particle effect on mouse move
    addParticleEffect();
});

// Typing effect function
function typeWriter(element, text, speed) {
    element.textContent = '';
    element.style.borderRight = '2px solid #4ade80';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    type();
}

// Contact form setup
function setupContactForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            await submitForm(form);
        }
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

// Remove error message
function removeErrorMessage(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Submit form to backend
async function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name') || document.getElementById('name').value,
            email: formData.get('email') || document.getElementById('email').value,
            message: formData.get('message') || document.getElementById('message').value
        };
        
        const response = await fetch('/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage();
            form.reset();
        } else {
            showErrorMessage(result.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage('Network error. Please try again.');
    } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = '✅ Message sent successfully! I\'ll get back to you soon.';
    successDiv.style.cssText = `
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
        animation: slideIn 0.5s ease;
    `;
    
    const form = document.getElementById('contact-form');
    form.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `❌ ${message}`;
    errorDiv.style.cssText = `
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
        animation: slideIn 0.5s ease;
    `;
    
    const form = document.getElementById('contact-form');
    form.appendChild(errorDiv);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Particle effect
function addParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = Math.random() > 0.5 ? '#4ade80' : '#06b6d4';
            this.opacity = Math.random() * 0.5 + 0.2;
            this.life = 60;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.01;
            this.life--;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0 || particles[i].opacity <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Add CSS for error styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
