/* ================================
   CALCULATOR METHODS & OPERATIONS
   ================================ */

// Extend the ScientificCalculator class with additional methods
if (typeof ScientificCalculator !== 'undefined') {
    
    // Clear and input methods
    ScientificCalculator.prototype.clear = function() {
        this.currentInput = '0';
        this.expression = '';
        this.lastResult = null;
        this.pendingOperator = null;
        this.waitingForOperand = false;
        if (this.subDisplay) this.subDisplay.textContent = '';
    };

    ScientificCalculator.prototype.clearEntry = function() {
        this.currentInput = '0';
        this.waitingForOperand = false;
    };

    ScientificCalculator.prototype.backspace = function() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    };

    ScientificCalculator.prototype.negate = function() {
        if (this.currentInput !== '0') {
            if (this.currentInput.startsWith('-')) {
                this.currentInput = this.currentInput.substring(1);
            } else {
                this.currentInput = '-' + this.currentInput;
            }
        }
    };

    ScientificCalculator.prototype.applyPercent = function() {
        const value = parseFloat(this.currentInput);
        if (!isNaN(value)) {
            this.currentInput = String(value / 100);
            this.waitingForOperand = true;
        }
    };

    // Parentheses handling
    ScientificCalculator.prototype.inputOpenParenthesis = function() {
        if (this.waitingForOperand || this.currentInput === '0') {
            this.currentInput = '0';
            this.expression += '(';
        } else {
            this.expression += this.currentInput + '*(';
            this.currentInput = '0';
        }
        this.waitingForOperand = true;
    };

    ScientificCalculator.prototype.inputCloseParenthesis = function() {
        if (!this.waitingForOperand) {
            this.expression += this.currentInput + ')';
            this.waitingForOperand = true;
        }
    };

    ScientificCalculator.prototype.inputConstant = function(value) {
        this.currentInput = String(this.formatResult(value));
        this.waitingForOperand = true;
    };

    // Memory operations
    ScientificCalculator.prototype.memoryClear = function() {
        this.memory = 0;
        this.updateMemoryIndicator();
        this.saveToStorage();
    };

    ScientificCalculator.prototype.memoryRecall = function() {
        this.currentInput = String(this.memory);
        this.waitingForOperand = true;
    };

    ScientificCalculator.prototype.memoryStore = function() {
        const value = parseFloat(this.currentInput);
        if (!isNaN(value)) {
            this.memory = value;
            this.updateMemoryIndicator();
            this.saveToStorage();
            this.animateMemoryChange();
        }
    };

    ScientificCalculator.prototype.memoryAdd = function() {
        const value = parseFloat(this.currentInput);
        if (!isNaN(value)) {
            this.memory += value;
            this.updateMemoryIndicator();
            this.saveToStorage();
            this.animateMemoryChange();
        }
    };

    ScientificCalculator.prototype.memorySubtract = function() {
        const value = parseFloat(this.currentInput);
        if (!isNaN(value)) {
            this.memory -= value;
            this.updateMemoryIndicator();
            this.saveToStorage();
            this.animateMemoryChange();
        }
    };

    // Angle mode operations
    ScientificCalculator.prototype.toggleAngleMode = function() {
        this.angleMode = this.angleMode === 'deg' ? 'rad' : 'deg';
        this.updateAngleModeIndicator();
        this.saveToStorage();
    };

    // UI update methods
    ScientificCalculator.prototype.updateMemoryIndicator = function() {
        if (this.memoryIndicator) {
            this.memoryIndicator.textContent = `M: ${this.formatNumber(this.memory)}`;
            
            if (this.memory !== 0) {
                this.memoryIndicator.classList.add('has-memory');
            } else {
                this.memoryIndicator.classList.remove('has-memory');
            }
        }
    };

    ScientificCalculator.prototype.updateAngleModeIndicator = function() {
        if (this.angleModeIndicator) {
            this.angleModeIndicator.textContent = this.angleMode.toUpperCase();
        }
    };

    ScientificCalculator.prototype.animateMemoryChange = function() {
        if (this.memoryIndicator) {
            this.memoryIndicator.classList.add('memory-changed');
            setTimeout(() => {
                this.memoryIndicator.classList.remove('memory-changed');
            }, 1000);
        }
    };

    ScientificCalculator.prototype.animateButton = function(button) {
        button.classList.add('animate-press');
        setTimeout(() => {
            button.classList.remove('animate-press');
        }, 150);
    };

    // History management
    ScientificCalculator.prototype.addToHistory = function(expression, result) {
        const historyItem = {
            expression: expression,
            result: this.formatNumber(result),
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now()
        };

        this.history.unshift(historyItem);

        // Limit history size
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }

        this.updateHistoryDisplay();
        this.saveToStorage();
    };

    ScientificCalculator.prototype.updateHistoryDisplay = function() {
        if (!this.historyList) return;

        if (this.history.length === 0) {
            this.historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }

        this.historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-timestamp">${item.timestamp}</div>
                <div class="history-expression">${this.escapeHtml(item.expression)}</div>
                <div class="history-result">= ${item.result}</div>
                <button class="history-item-delete" title="Delete">×</button>
            </div>
        `).join('');

        // Add event listeners to history items
        this.setupHistoryEventListeners();
    };

    ScientificCalculator.prototype.setupHistoryEventListeners = function() {
        if (!this.historyList) return;

        this.historyList.querySelectorAll('.history-item').forEach(item => {
            const deleteBtn = item.querySelector('.history-item-delete');
            
            // Click to reuse calculation
            item.addEventListener('click', (e) => {
                if (e.target !== deleteBtn) {
                    const id = parseInt(item.getAttribute('data-id'));
                    this.reuseHistoryItem(id);
                }
            });

            // Delete button
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = parseInt(item.getAttribute('data-id'));
                    this.deleteHistoryItem(id);
                });
            }
        });
    };

    ScientificCalculator.prototype.reuseHistoryItem = function(id) {
        const item = this.history.find(h => h.id === id);
        if (item) {
            this.currentInput = item.result;
            this.waitingForOperand = true;
            this.updateDisplay();
        }
    };

    ScientificCalculator.prototype.deleteHistoryItem = function(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.updateHistoryDisplay();
        this.saveToStorage();
    };

    ScientificCalculator.prototype.clearHistory = function() {
        this.history = [];
        this.updateHistoryDisplay();
        this.saveToStorage();
    };

    ScientificCalculator.prototype.toggleHistory = function() {
        if (this.historyPanel) {
            this.historyPanel.classList.toggle('show');
        }
    };

    // Keyboard handling
    ScientificCalculator.prototype.handleKeyboard = function(e) {
        // Prevent default for calculator keys
        const calculatorKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','=','Enter','Escape','Backspace','Delete','.','(',')'];
        
        if (calculatorKeys.includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                this.handleAction(e.key);
                break;
            case '.':
                this.handleAction('.');
                break;
            case '+':
                this.handleAction('+');
                break;
            case '-':
                this.handleAction('-');
                break;
            case '*':
                this.handleAction('*');
                break;
            case '/':
                this.handleAction('/');
                break;
            case '=':
            case 'Enter':
                this.handleAction('=');
                break;
            case 'Escape':
                this.handleAction('clear');
                break;
            case 'Backspace':
            case 'Delete':
                this.handleAction('backspace');
                break;
            case '(':
                this.handleAction('(');
                break;
            case ')':
                this.handleAction(')');
                break;
            case 'h':
            case 'H':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleHistory();
                }
                break;
        }

        this.updateDisplay();
    };

    // Utility methods
    ScientificCalculator.prototype.getOperatorSymbol = function(operator) {
        switch (operator) {
            case '*': return '×';
            case '/': return '÷';
            case '**': return '^';
            default: return operator;
        }
    };

    ScientificCalculator.prototype.formatNumber = function(num) {
        if (Math.abs(num) < 1e-10) return '0';
        
        // Handle very large or very small numbers with scientific notation
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-4 && num !== 0)) {
            return num.toExponential(6);
        }
        
        // Regular formatting
        const formatted = parseFloat(num.toPrecision(12));
        return formatted.toString();
    };

    ScientificCalculator.prototype.escapeHtml = function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Storage methods
    ScientificCalculator.prototype.saveToStorage = function() {
        try {
            const data = {
                memory: this.memory,
                angleMode: this.angleMode,
                history: this.history.slice(0, 50) // Save only last 50 history items
            };
            localStorage.setItem('calculator-data', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save calculator data:', error);
        }
    };

    ScientificCalculator.prototype.loadFromStorage = function() {
        try {
            const data = localStorage.getItem('calculator-data');
            if (data) {
                const parsed = JSON.parse(data);
                this.memory = parsed.memory || 0;
                this.angleMode = parsed.angleMode || 'deg';
                this.history = parsed.history || [];
                
                this.updateMemoryIndicator();
                this.updateAngleModeIndicator();
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.warn('Could not load calculator data:', error);
            this.memory = 0;
            this.angleMode = 'deg';
            this.history = [];
        }
    };

    // Theme change handler
    ScientificCalculator.prototype.onThemeChange = function(theme) {
        // Update any theme-dependent features
        console.log('Calculator theme changed to:', theme);
        
        // You could add theme-specific calculator behaviors here
        if (theme === 'dark') {
            // Dark theme specific features
        } else {
            // Light theme specific features
        }
    };

    // Advanced calculation methods
    ScientificCalculator.prototype.evaluateExpression = function(expression) {
        try {
            // Replace display symbols with JavaScript operators
            let jsExpression = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E);
            
            // Evaluate using Function constructor for security
            const result = Function('"use strict"; return (' + jsExpression + ')')();
            
            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid result');
            }
            
            return this.formatResult(result);
            
        } catch (error) {
            throw new Error('Invalid expression');
        }
    };

} else {
    console.error('ScientificCalculator class not found');
}