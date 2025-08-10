/* ================================
   LANDING PAGE FUNCTIONALITY
   ================================ */

// Landing page initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded');
    
    // Initialize landing page features
    setupCardAnimations();
    setupNavigationHandlers();
    setupModalHandlers();
    
    // Add some interactive polish
    addInteractiveEffects();
});

// Navigation functions
function openTool(page) {
    console.log(`Opening tool: ${page}`);
    
    // Add loading state to clicked card
    const clickedCard = event.target.closest('.tool-card');
    if (clickedCard) {
        clickedCard.classList.add('loading');
    }
    
    // Navigate to the tool page
    window.location.href = page;
}

function openDocs() {
    console.log('Opening documentation modal');
    
    // Open the documentation modal on the landing page
    const modal = document.getElementById('docs-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Focus the modal for keyboard navigation
        modal.setAttribute('tabindex', '-1');
        modal.focus();
    }
}

// Function to close the documentation modal
function closeDocs() {
    console.log('Closing documentation modal');
    
    const modal = document.getElementById('docs-modal');
    if (modal) {
        modal.classList.remove('show');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function setupCardAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        observer.observe(card);
    });
}

function setupModalHandlers() {
    // Handle modal close events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('docs-modal');
            if (modal && modal.classList.contains('show')) {
                closeDocs();
            }
        }
    });
    
    // Handle clicking outside modal to close
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('docs-modal');
        if (modal && e.target === modal) {
            closeDocs();
        }
    });
}

function setupNavigationHandlers() {
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case '1':
                if (e.ctrlKey) {
                    e.preventDefault();
                    openTool('calculator.html');
                }
                break;
            case '2':
                if (e.ctrlKey) {
                    e.preventDefault();
                    openTool('converter.html');
                }
                break;
            case '3':
                if (e.ctrlKey) {
                    e.preventDefault();
                    openDocs();
                }
                break;
            case 'h':
            case 'H':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'calculator.html';
                }
                break;
        }
    });

    // Add keyboard shortcuts info
    const shortcuts = document.createElement('div');
    shortcuts.className = 'keyboard-shortcuts-info';
    shortcuts.innerHTML = `
        <div class="shortcuts-hint">
            <span>💡 Keyboard Shortcuts:</span>
            <kbd>Ctrl+1</kbd> Calculator |
            <kbd>Ctrl+2</kbd> Converter |
            <kbd>Ctrl+3</kbd> Docs
        </div>
    `;
    
    // Add styles for shortcuts hint
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-shortcuts-info {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--tertiary-bg);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 10px 15px;
            font-size: 0.8rem;
            color: var(--text-muted);
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 100;
        }
        
        .keyboard-shortcuts-info.show {
            opacity: 1;
        }
        
        .shortcuts-hint kbd {
            background: var(--text-primary);
            color: var(--secondary-bg);
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 0.7rem;
            margin: 0 2px;
        }
        
        @media (max-width: 768px) {
            .keyboard-shortcuts-info {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(shortcuts);
    
    // Show shortcuts after a delay
    setTimeout(() => {
        shortcuts.classList.add('show');
    }, 2000);
    
    // Hide shortcuts when user starts interacting
    let hideTimer;
    const hideShortcuts = () => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            shortcuts.classList.remove('show');
        }, 5000);
    };
    
    document.addEventListener('mousemove', hideShortcuts);
    document.addEventListener('keydown', hideShortcuts);
}

function addInteractiveEffects() {
    // Add mouse follower effect for tool cards
    const cards = document.querySelectorAll('.tool-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const tiltX = deltaY * 5;
            const tiltY = deltaX * -5;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Add click ripple effect
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: var(--text-accent);
                border-radius: 50%;
                opacity: 0.3;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                z-index: 1;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Utility functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideInToast 0.3s ease;
        }
        
        .toast-info {
            background: var(--text-accent);
        }
        
        .toast-success {
            background: var(--btn-equals);
        }
        
        .toast-error {
            background: var(--btn-clear);
        }
        
        @keyframes slideInToast {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#toast-styles')) {
        style.id = 'toast-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInToast 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Export functions for potential use by other scripts
window.LandingPage = {
    openTool,
    openDocs,
    showToast
};
