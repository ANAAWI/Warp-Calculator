/* ================================
   THEME TOGGLE FUNCTIONALITY
   ================================ */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggleBtn = null;
        this.themeIcon = null;
        this.body = document.body;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTheme());
        } else {
            this.setupTheme();
        }
    }

    setupTheme() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggleBtn?.querySelector('.theme-icon');
        
        // Load saved theme or default to light
        this.loadSavedTheme();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
    }

    setupEventListeners() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
            
            // Add keyboard support
            this.themeToggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => this.handleSystemThemeChange(e));
        }
    }

    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('calculator-theme');
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                this.currentTheme = savedTheme;
            } else {
                // Detect system preference
                this.currentTheme = this.getSystemTheme();
            }
        } catch (error) {
            console.warn('Could not load saved theme:', error);
            this.currentTheme = 'light';
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    saveTheme(theme) {
        try {
            localStorage.setItem('calculator-theme', theme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add button animation
        this.animateToggle();
    }

    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn('Invalid theme:', theme);
            return;
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        
        // Dispatch custom event for other components
        this.dispatchThemeChangeEvent(theme);
    }

    applyTheme(theme) {
        // Remove existing theme classes
        this.body.classList.remove('light-theme', 'dark-theme');
        
        // Add new theme class
        this.body.classList.add(`${theme}-theme`);
        
        // Update theme icon
        this.updateThemeIcon(theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        console.log(`Theme applied: ${theme}`);
    }

    updateThemeIcon(theme) {
        if (this.themeIcon) {
            // Update icon based on theme
            if (theme === 'light') {
                this.themeIcon.textContent = '🌙'; // Moon for light theme (to switch to dark)
                this.themeToggleBtn.title = 'Switch to Dark Theme';
            } else {
                this.themeIcon.textContent = '☀️'; // Sun for dark theme (to switch to light)
                this.themeToggleBtn.title = 'Switch to Light Theme';
            }
        }
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set theme color based on current theme
        if (theme === 'dark') {
            metaThemeColor.content = '#2c3e50';
        } else {
            metaThemeColor.content = '#f5f7fa';
        }
    }

    animateToggle() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.classList.add('animate-toggle');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.themeToggleBtn.classList.remove('animate-toggle');
            }, 300);
        }
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        window.dispatchEvent(event);
    }

    handleSystemThemeChange(e) {
        // Only auto-switch if no user preference is saved
        const savedTheme = localStorage.getItem('calculator-theme');
        if (!savedTheme) {
            const systemTheme = e.matches ? 'dark' : 'light';
            this.setTheme(systemTheme);
        }
    }

    // Public API methods
    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    isLightTheme() {
        return this.currentTheme === 'light';
    }

    // Force theme without saving to localStorage
    previewTheme(theme) {
        this.applyTheme(theme);
    }

    // Reset to system theme
    resetToSystemTheme() {
        localStorage.removeItem('calculator-theme');
        const systemTheme = this.getSystemTheme();
        this.setTheme(systemTheme);
    }
}

// CSS for toggle animation
const toggleAnimationCSS = `
.theme-toggle.animate-toggle {
    animation: themeToggleAnimation 0.3s ease;
}

@keyframes themeToggleAnimation {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
}
`;

// Inject animation CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = toggleAnimationCSS;
    document.head.appendChild(style);
}

// Create global instance
let themeManager;

// Initialize theme manager when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            themeManager = new ThemeManager();
        });
    } else {
        themeManager = new ThemeManager();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
    window.getThemeManager = () => themeManager;
}

// Listen for theme changes and update calculator if needed
if (typeof window !== 'undefined') {
    window.addEventListener('themeChanged', (e) => {
        console.log('Theme changed to:', e.detail.theme);
        
        // Update any theme-dependent calculator features
        if (window.calculator) {
            window.calculator.onThemeChange?.(e.detail.theme);
        }
    });
}