/* ================================
   APPLICATION INITIALIZATION
   ================================ */

// Global application state
window.calculator = null;
window.themeManager = null;

// Application initialization
class CalculatorApp {
    constructor() {
        this.calculator = null;
        this.themeManager = null;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing Calculator App...');
        
        try {
            // Initialize theme manager (already initialized in theme-toggle.js)
            this.themeManager = window.getThemeManager?.() || null;
            
            // Initialize calculator
            this.initializeCalculator();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Make calculator globally available
            window.calculator = this.calculator;
            
            console.log('Calculator App initialized successfully');
            
            // Dispatch ready event
            this.dispatchReadyEvent();
            
        } catch (error) {
            console.error('Failed to initialize Calculator App:', error);
            this.showInitializationError();
        }
    }

    initializeCalculator() {
        if (typeof ScientificCalculator !== 'undefined') {
            this.calculator = new ScientificCalculator();
            console.log('Scientific Calculator initialized');
        } else {
            throw new Error('ScientificCalculator class not found');
        }
    }

    setupGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Handle beforeunload to save state
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));
        
        // Handle theme changes
        window.addEventListener('themeChanged', (e) => this.handleThemeChange(e));
        
        // Handle online/offline status
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
        
        // Setup modal functionality
        this.setupModalHandlers();
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleGlobalError(e.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleGlobalError(e.reason);
        });
    }

    handleResize() {
        // Handle responsive layout changes
        if (this.calculator && this.calculator.historyPanel) {
            const width = window.innerWidth;
            
            // Auto-hide history panel on small screens
            if (width <= 768 && this.calculator.historyPanel.classList.contains('show')) {
                this.calculator.toggleHistory();
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, save current state
            if (this.calculator && typeof this.calculator.saveToStorage === 'function') {
                this.calculator.saveToStorage();
            }
        } else {
            // Page is visible, could refresh data if needed
            console.log('Calculator app is now visible');
        }
    }

    handleBeforeUnload() {
        // Save calculator state before page unload
        if (this.calculator && typeof this.calculator.saveToStorage === 'function') {
            this.calculator.saveToStorage();
        }
    }

    handleGlobalKeyboard(e) {
        // Handle app-level keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'h':
                    // Ctrl+H: Toggle history
                    if (this.calculator && typeof this.calculator.toggleHistory === 'function') {
                        e.preventDefault();
                        this.calculator.toggleHistory();
                    }
                    break;
                    
                case 'r':
                    // Ctrl+R: Clear/Reset (prevent default refresh)
                    if (this.calculator && typeof this.calculator.clear === 'function') {
                        e.preventDefault();
                        this.calculator.clear();
                        this.calculator.updateDisplay();
                    }
                    break;
                    
                case 't':
                    // Ctrl+T: Toggle theme
                    if (this.themeManager && typeof this.themeManager.toggleTheme === 'function') {
                        e.preventDefault();
                        this.themeManager.toggleTheme();
                    }
                    break;
            }
        }
        
        // ESC key: Close panels
        if (e.key === 'Escape') {
            // Close documentation modal first
            const modal = document.getElementById('docs-modal');
            if (modal && modal.classList.contains('show')) {
                this.closeModal();
                return;
            }
            
            // Then close history panel
            if (this.calculator && this.calculator.historyPanel && 
                this.calculator.historyPanel.classList.contains('show')) {
                this.calculator.toggleHistory();
            }
        }
    }

    handleThemeChange(e) {
        console.log('App received theme change:', e.detail.theme);
        
        // Update calculator theme-dependent features
        if (this.calculator && typeof this.calculator.onThemeChange === 'function') {
            this.calculator.onThemeChange(e.detail.theme);
        }
        
        // Update document title or meta tags if needed
        this.updateAppMeta(e.detail.theme);
    }

    handleOnlineStatus(isOnline) {
        console.log('Online status changed:', isOnline);
        
        // You could add online/offline specific features here
        // For example, syncing with cloud storage when online
        
        if (!isOnline) {
            // Show offline indicator or adjust functionality
            console.log('Calculator is now offline');
        } else {
            // Online features available
            console.log('Calculator is now online');
        }
    }

    handleGlobalError(error) {
        // Log error for debugging
        console.error('Calculator app error:', error);
        
        // Show user-friendly error message
        if (this.calculator && typeof this.calculator.showError === 'function') {
            this.calculator.showError('An unexpected error occurred');
        } else {
            // Fallback error display
            this.showFallbackError();
        }
    }

    updateAppMeta(theme) {
        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#2c3e50' : '#f5f7fa';
    }

    showInitializationError() {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4757;
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        errorMessage.innerHTML = `
            <h3>⚠️ Initialization Error</h3>
            <p>The calculator failed to initialize properly.</p>
            <p>Please refresh the page to try again.</p>
            <button onclick="window.location.reload()" style="
                background: white;
                color: #ff4757;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
            ">Refresh Page</button>
        `;
        
        document.body.appendChild(errorMessage);
    }

    showFallbackError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Segoe UI', sans-serif;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        errorDiv.textContent = 'An error occurred. Please try again.';
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    dispatchReadyEvent() {
        const event = new CustomEvent('calculatorReady', {
            detail: {
                calculator: this.calculator,
                themeManager: this.themeManager,
                version: '1.0.0'
            }
        });
        window.dispatchEvent(event);
    }

    // Public API methods
    getCalculator() {
        return this.calculator;
    }

    getThemeManager() {
        return this.themeManager;
    }

    isReady() {
        return this.isInitialized;
    }

    // Utility method to get app info
    getAppInfo() {
        return {
            name: 'Scientific Calculator',
            version: '1.0.0',
            features: [
                'Basic arithmetic operations',
                'Scientific functions',
                'Memory operations',
                'Calculation history',
                'Dual themes',
                'Keyboard support',
                'Responsive design'
            ],
            initialized: this.isInitialized,
            calculator: !!this.calculator,
            themeManager: !!this.themeManager
        };
    }

    // Modal functionality
    setupModalHandlers() {
        const docsBtn = document.getElementById('docs-btn');
        const modal = document.getElementById('docs-modal');
        const closeBtn = document.getElementById('close-docs');
        const calculatorContainer = document.querySelector('.container');

        if (docsBtn && modal) {
            // Open modal
            docsBtn.addEventListener('click', () => {
                this.openModal();
            });

            // Close modal
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal();
                });
            }

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });

            // Handle table of contents links
            this.setupTocLinks();
        }
    }

    openModal() {
        const modal = document.getElementById('docs-modal');
        const calculatorContainer = document.querySelector('.container');
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Blur the calculator background
            if (calculatorContainer) {
                calculatorContainer.style.filter = 'blur(5px)';
                calculatorContainer.style.pointerEvents = 'none';
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('docs-modal');
        const calculatorContainer = document.querySelector('.container');
        
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Remove blur from calculator background
            if (calculatorContainer) {
                calculatorContainer.style.filter = '';
                calculatorContainer.style.pointerEvents = '';
            }
        }
    }

    setupTocLinks() {
        const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Scroll to the target section within the modal
                    const docContent = document.querySelector('.doc-content');
                    if (docContent) {
                        const targetOffset = targetElement.offsetTop - docContent.offsetTop;
                        docContent.scrollTo({
                            top: targetOffset - 20,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Update active link
                    tocLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }
}

// Add CSS for error animations
const appCSS = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = appCSS;
    document.head.appendChild(style);
}

// Initialize the application
const calculatorApp = new CalculatorApp();

// Make app globally available
window.calculatorApp = calculatorApp;

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CalculatorApp, calculatorApp };
}

// Listen for calculator ready event
window.addEventListener('calculatorReady', (e) => {
    console.log('🧮 Scientific Calculator is ready!', e.detail);
    
    // You can add any post-initialization code here
    // For example, showing a welcome message or tutorial
});

console.log('Calculator app script loaded');