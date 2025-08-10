/* ================================
   SCIENTIFIC CALCULATOR CORE CLASS
   ================================ */

class ScientificCalculator {
    constructor() {
        // Display elements
        this.display = null;
        this.subDisplay = null;
        this.angleMode = 'deg'; // 'deg' or 'rad'
        this.memory = 0;
        
        // Calculator state
        this.currentInput = '0';
        this.expression = '';
        this.lastResult = null;
        this.waitingForOperand = false;
        this.pendingOperator = null;
        
        // History
        this.history = [];
        this.maxHistoryItems = 100;
        
        // UI elements
        this.memoryIndicator = null;
        this.angleModeIndicator = null;
        this.historyPanel = null;
        this.historyList = null;
        
        // Initialize
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCalculator());
        } else {
            this.setupCalculator();
        }
    }

    setupCalculator() {
        // Get DOM elements
        this.display = document.getElementById('display');
        this.subDisplay = document.getElementById('sub-display');
        this.memoryIndicator = document.getElementById('memory-indicator');
        this.angleModeIndicator = document.getElementById('angle-mode');
        this.historyPanel = document.getElementById('history-panel');
        this.historyList = document.getElementById('history-list');
        
        // Set initial display
        this.updateDisplay();
        this.updateMemoryIndicator();
        this.updateAngleModeIndicator();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load saved data
        this.loadFromStorage();
        
        console.log('Scientific Calculator initialized');
    }

    setupEventListeners() {
        // Button clicks
        document.querySelectorAll('.btn[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleAction(action);
                this.animateButton(e.target);
            });
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // History panel toggle
        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.toggleHistory());
        }
        
        // Clear history button
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
        
        // Angle mode click
        if (this.angleModeIndicator) {
            this.angleModeIndicator.addEventListener('click', () => this.toggleAngleMode());
        }
    }

    handleAction(action) {
        try {
            switch (action) {
                // Numbers
                case '0': case '1': case '2': case '3': case '4':
                case '5': case '6': case '7': case '8': case '9':
                    this.inputNumber(action);
                    break;
                
                case '.':
                    this.inputDecimal();
                    break;
                
                // Basic operators
                case '+': case '-': case '*': case '/':
                    this.inputOperator(action);
                    break;
                
                case '=':
                    this.calculate();
                    break;
                
                // Parentheses
                case '(':
                    this.inputOpenParenthesis();
                    break;
                case ')':
                    this.inputCloseParenthesis();
                    break;
                
                // Clear functions
                case 'clear':
                    this.clear();
                    break;
                case 'clear-entry':
                    this.clearEntry();
                    break;
                case 'backspace':
                    this.backspace();
                    break;
                
                // Memory functions
                case 'mc':
                    this.memoryClear();
                    break;
                case 'mr':
                    this.memoryRecall();
                    break;
                case 'ms':
                    this.memoryStore();
                    break;
                case 'mplus':
                    this.memoryAdd();
                    break;
                case 'mminus':
                    this.memorySubtract();
                    break;
                
                // Scientific functions
                case 'sin': case 'cos': case 'tan':
                case 'asin': case 'acos': case 'atan':
                case 'ln': case 'log': case 'sqrt': case 'cbrt':
                case 'square': case 'reciprocal': case 'factorial':
                case 'abs': case 'pow10':
                    this.applyFunction(action);
                    break;
                
                // Constants
                case 'pi':
                    this.inputConstant(Math.PI);
                    break;
                case 'e':
                    this.inputConstant(Math.E);
                    break;
                
                // Special functions
                case 'percent':
                    this.applyPercent();
                    break;
                case 'negate':
                    this.negate();
                    break;
                case 'power':
                    this.inputOperator('**');
                    break;
                case 'deg-rad':
                    this.toggleAngleMode();
                    break;
                
                default:
                    console.warn('Unknown action:', action);
            }
        } catch (error) {
            this.showError('Error: ' + error.message);
        }
        
        this.updateDisplay();
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
    }

    inputOperator(operator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.lastResult === null) {
            this.lastResult = inputValue;
        } else if (this.pendingOperator) {
            const currentResult = this.performCalculation();
            
            if (currentResult === null) return;
            
            this.currentInput = String(currentResult);
            this.lastResult = currentResult;
        }

        this.waitingForOperand = true;
        this.pendingOperator = operator;
        
        // Update expression display
        this.expression = this.currentInput + ' ' + this.getOperatorSymbol(operator) + ' ';
    }

    calculate() {
        if (this.pendingOperator && !this.waitingForOperand) {
            const result = this.performCalculation();
            
            if (result !== null) {
                // Add to history
                const expression = this.expression + this.currentInput;
                this.addToHistory(expression, result);
                
                this.currentInput = String(result);
                this.lastResult = null;
                this.pendingOperator = null;
                this.waitingForOperand = true;
                this.expression = '';
            }
        }
    }

    performCalculation() {
        const prev = this.lastResult;
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return null;
        
        let result;
        
        switch (this.pendingOperator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return null;
                }
                result = prev / current;
                break;
            case '**':
                result = Math.pow(prev, current);
                break;
            default:
                return null;
        }
        
        return this.formatResult(result);
    }

    applyFunction(func) {
        let value = parseFloat(this.currentInput);
        let result;
        
        if (isNaN(value)) return;
        
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(this.toRadians(value));
                    break;
                case 'cos':
                    result = Math.cos(this.toRadians(value));
                    break;
                case 'tan':
                    result = Math.tan(this.toRadians(value));
                    break;
                case 'asin':
                    if (value < -1 || value > 1) {
                        this.showError('Invalid input for arcsin');
                        return;
                    }
                    result = this.fromRadians(Math.asin(value));
                    break;
                case 'acos':
                    if (value < -1 || value > 1) {
                        this.showError('Invalid input for arccos');
                        return;
                    }
                    result = this.fromRadians(Math.acos(value));
                    break;
                case 'atan':
                    result = this.fromRadians(Math.atan(value));
                    break;
                case 'ln':
                    if (value <= 0) {
                        this.showError('Invalid input for ln');
                        return;
                    }
                    result = Math.log(value);
                    break;
                case 'log':
                    if (value <= 0) {
                        this.showError('Invalid input for log');
                        return;
                    }
                    result = Math.log10(value);
                    break;
                case 'sqrt':
                    if (value < 0) {
                        this.showError('Cannot take square root of negative number');
                        return;
                    }
                    result = Math.sqrt(value);
                    break;
                case 'cbrt':
                    result = Math.cbrt(value);
                    break;
                case 'square':
                    result = value * value;
                    break;
                case 'reciprocal':
                    if (value === 0) {
                        this.showError('Cannot divide by zero');
                        return;
                    }
                    result = 1 / value;
                    break;
                case 'factorial':
                    if (value < 0 || !Number.isInteger(value) || value > 170) {
                        this.showError('Invalid input for factorial');
                        return;
                    }
                    result = this.factorial(value);
                    break;
                case 'abs':
                    result = Math.abs(value);
                    break;
                case 'pow10':
                    result = Math.pow(10, value);
                    break;
                default:
                    return;
            }
            
            // Add to history
            this.addToHistory(`${func}(${value})`, result);
            
            this.currentInput = String(this.formatResult(result));
            this.waitingForOperand = true;
            
        } catch (error) {
            this.showError('Math error');
        }
    }

    // Helper methods
    toRadians(degrees) {
        return this.angleMode === 'deg' ? degrees * (Math.PI / 180) : degrees;
    }

    fromRadians(radians) {
        return this.angleMode === 'deg' ? radians * (180 / Math.PI) : radians;
    }

    factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    formatResult(result) {
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation result');
        }
        
        // Handle very small numbers
        if (Math.abs(result) < 1e-10) {
            return 0;
        }
        
        // Limit decimal places for display
        if (result % 1 !== 0) {
            return parseFloat(result.toFixed(12));
        }
        
        return result;
    }

    updateDisplay() {
        if (this.display) {
            this.display.textContent = this.currentInput;
        }
        if (this.subDisplay && this.expression) {
            this.subDisplay.textContent = this.expression;
        }
    }

    showError(message) {
        if (this.display) {
            this.display.textContent = message;
            this.display.classList.add('error');
            
            setTimeout(() => {
                this.display.classList.remove('error');
                this.clear();
            }, 2000);
        }
    }

    // Additional methods are defined in calculator-methods.js
    // This includes: clear, clearEntry, backspace, negate, memory operations,
    // history management, keyboard handling, storage, and utility methods
}