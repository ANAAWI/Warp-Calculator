/* ================================
   CONVERTER APP LOGIC
   ================================ */

// Global converter instance
let converter;
let currentCategory = 'length';

// Initialize the converter application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Converter app initializing...');
    
    // Initialize conversion engine
    converter = new ConversionEngine();
    
    // Setup the interface
    initializeInterface();
    setupEventListeners();
    
    // Load initial category
    selectCategory('length');
    
    // Handle URL hash for docs
    if (window.location.hash === '#docs') {
        openDocs();
    }
    
    console.log('Converter app initialized successfully');
});

// Initialize the user interface
function initializeInterface() {
    // Set up input field auto-conversion
    const inputField = document.getElementById('input-value');
    if (inputField) {
        inputField.addEventListener('input', function() {
            if (this.value) {
                performConversion();
            } else {
                clearOutput();
            }
        });
    }
    
    // Set up unit change handlers
    const inputUnit = document.getElementById('input-unit');
    const outputUnit = document.getElementById('output-unit');
    
    if (inputUnit) {
        inputUnit.addEventListener('change', function() {
            updateUnitSymbols();
            updateFormula();
            if (document.getElementById('input-value').value) {
                performConversion();
            }
        });
    }
    
    if (outputUnit) {
        outputUnit.addEventListener('change', function() {
            updateUnitSymbols();
            updateFormula();
            if (document.getElementById('input-value').value) {
                performConversion();
            }
        });
    }
    
    // Load and display history
    updateHistoryDisplay();
}

// Set up event listeners
function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                performConversion();
                break;
            case 'Escape':
                clearInput();
                break;
            case 's':
            case 'S':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    swapUnits();
                }
                break;
            case 'h':
            case 'H':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'index.html';
                }
                break;
        }
    });
    
    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('.modal-overlay')) {
            closeDocs();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('docs-modal').style.display === 'flex') {
            closeDocs();
        }
    });
}

// Category selection
function selectCategory(category) {
    console.log('Selecting category:', category);
    
    currentCategory = category;
    
    // Update active category card
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const activeCard = document.querySelector(`[data-category="${category}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
    
    // Populate unit dropdowns
    populateUnitSelectors(category);
    
    // Update quick conversions
    updateQuickConversions(category);
    
    // Update formula
    updateFormula();
    
    // Clear current conversion
    clearInput();
    clearOutput();
}

// Populate unit selector dropdowns
function populateUnitSelectors(category) {
    const units = converter.getCategoryUnits(category);
    const inputSelect = document.getElementById('input-unit');
    const outputSelect = document.getElementById('output-unit');
    
    if (!inputSelect || !outputSelect) return;
    
    // Clear existing options
    inputSelect.innerHTML = '';
    outputSelect.innerHTML = '';
    
    // Add unit options
    Object.keys(units).forEach(unitKey => {
        const unit = units[unitKey];
        
        const inputOption = document.createElement('option');
        inputOption.value = unitKey;
        inputOption.textContent = unit.name;
        inputSelect.appendChild(inputOption);
        
        const outputOption = document.createElement('option');
        outputOption.value = unitKey;
        outputOption.textContent = unit.name;
        outputSelect.appendChild(outputOption);
    });
    
    // Set default selections
    const unitKeys = Object.keys(units);
    if (unitKeys.length >= 2) {
        inputSelect.value = unitKeys[0];
        outputSelect.value = unitKeys[1];
    }
    
    updateUnitSymbols();
}

// Update unit symbols in the input helpers
function updateUnitSymbols() {
    const inputUnit = document.getElementById('input-unit');
    const outputUnit = document.getElementById('output-unit');
    const inputSymbol = document.getElementById('input-symbol');
    const outputSymbol = document.getElementById('output-symbol');
    
    if (!inputUnit || !outputUnit || !inputSymbol || !outputSymbol) return;
    
    const units = converter.getCategoryUnits(currentCategory);
    
    const inputUnitData = units[inputUnit.value];
    const outputUnitData = units[outputUnit.value];
    
    inputSymbol.textContent = inputUnitData?.symbol || inputUnit.value;
    outputSymbol.textContent = outputUnitData?.symbol || outputUnit.value;
}

// Perform the conversion
function performConversion() {
    const inputValue = parseFloat(document.getElementById('input-value').value);
    const inputUnit = document.getElementById('input-unit').value;
    const outputUnit = document.getElementById('output-unit').value;
    const outputElement = document.getElementById('output-value');
    
    if (!outputElement) return;
    
    if (!inputValue || isNaN(inputValue)) {
        outputElement.textContent = '0';
        return;
    }
    
    // Perform conversion
    const result = converter.convert(inputValue, inputUnit, outputUnit, currentCategory);
    
    // Display result
    outputElement.textContent = converter.formatNumber(result);
    
    // Add to history if valid conversion
    if (converter.isValidConversion(inputValue, inputUnit, outputUnit, currentCategory)) {
        const units = converter.getCategoryUnits(currentCategory);
        const conversion = {
            category: currentCategory,
            inputValue,
            inputUnit: inputUnit,
            inputUnitName: units[inputUnit]?.name || inputUnit,
            outputValue: result,
            outputUnit: outputUnit,
            outputUnitName: units[outputUnit]?.name || outputUnit
        };
        
        converter.addToHistory(conversion);
        updateHistoryDisplay();
    }
    
    // Update formula
    updateFormula();
}

// Swap input and output units
function swapUnits() {
    const inputUnit = document.getElementById('input-unit');
    const outputUnit = document.getElementById('output-unit');
    const inputValue = document.getElementById('input-value');
    const outputValue = document.getElementById('output-value');
    
    if (!inputUnit || !outputUnit || !inputValue || !outputValue) return;
    
    // Swap units
    const tempUnit = inputUnit.value;
    inputUnit.value = outputUnit.value;
    outputUnit.value = tempUnit;
    
    // Swap values if there's a current conversion
    if (inputValue.value && outputValue.textContent !== '0') {
        const tempValue = inputValue.value;
        inputValue.value = parseFloat(outputValue.textContent) || '';
        
        // Update symbols and perform conversion
        updateUnitSymbols();
        if (inputValue.value) {
            performConversion();
        }
    } else {
        updateUnitSymbols();
        updateFormula();
    }
}

// Update formula display
function updateFormula() {
    const inputUnit = document.getElementById('input-unit');
    const outputUnit = document.getElementById('output-unit');
    const formulaContent = document.getElementById('formula-content');
    
    if (!inputUnit || !outputUnit || !formulaContent) return;
    
    const formula = converter.getFormula(inputUnit.value, outputUnit.value, currentCategory);
    formulaContent.textContent = formula;
}

// Update quick conversions display
function updateQuickConversions(category) {
    const quickGrid = document.getElementById('quick-conversions-grid');
    if (!quickGrid) return;
    
    const quickConversions = converter.getQuickConversions(category);
    const units = converter.getCategoryUnits(category);
    
    quickGrid.innerHTML = '';
    
    quickConversions.forEach(quick => {
        const fromUnit = units[quick.from];
        const toUnit = units[quick.to];
        
        if (!fromUnit || !toUnit) return;
        
        const quickItem = document.createElement('div');
        quickItem.className = 'quick-item';
        quickItem.innerHTML = `
            <div class="quick-value">${quick.values[0]} ${fromUnit.symbol}</div>
            <div class="quick-unit">= ${converter.formatNumber(quick.values[1])} ${toUnit.symbol}</div>
        `;
        
        quickItem.addEventListener('click', () => {
            document.getElementById('input-unit').value = quick.from;
            document.getElementById('output-unit').value = quick.to;
            document.getElementById('input-value').value = quick.values[0];
            
            updateUnitSymbols();
            performConversion();
        });
        
        quickGrid.appendChild(quickItem);
    });
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    const history = converter.getHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <span class="empty-icon">📝</span>
                <span class="empty-text">No conversions yet</span>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    history.slice(0, 10).forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const timeAgo = getTimeAgo(new Date(item.timestamp));
        
        historyItem.innerHTML = `
            <div class="history-conversion">
                ${converter.formatNumber(item.inputValue)} ${item.inputUnitName} = 
                ${converter.formatNumber(item.outputValue)} ${item.outputUnitName}
            </div>
            <div class="history-time">${timeAgo}</div>
        `;
        
        historyItem.addEventListener('click', () => {
            // Recreate this conversion
            selectCategory(item.category);
            setTimeout(() => {
                document.getElementById('input-unit').value = item.inputUnit;
                document.getElementById('output-unit').value = item.outputUnit;
                document.getElementById('input-value').value = item.inputValue;
                
                updateUnitSymbols();
                performConversion();
            }, 100);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all conversion history?')) {
        converter.clearHistory();
        updateHistoryDisplay();
        
        // Show success message
        showToast('History cleared successfully', 'success');
    }
}

// Clear input
function clearInput() {
    const inputValue = document.getElementById('input-value');
    if (inputValue) {
        inputValue.value = '';
        inputValue.focus();
    }
    clearOutput();
}

// Clear output
function clearOutput() {
    const outputValue = document.getElementById('output-value');
    if (outputValue) {
        outputValue.textContent = '0';
    }
}

// Documentation modal functions
function openDocs() {
    const modal = document.getElementById('docs-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus the modal for keyboard navigation
        modal.setAttribute('tabindex', '-1');
        modal.focus();
    }
}

function closeDocs() {
    const modal = document.getElementById('docs-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remove hash from URL
        if (window.location.hash === '#docs') {
            history.replaceState(null, null, window.location.pathname);
        }
    }
}

// Utility functions
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        info: '#4A90E2',
        success: '#7ED321',
        error: '#D0021B',
        warning: '#F5A623'
    };
    
    toast.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Export functions for global use
window.selectCategory = selectCategory;
window.performConversion = performConversion;
window.swapUnits = swapUnits;
window.clearHistory = clearHistory;
window.openDocs = openDocs;
window.closeDocs = closeDocs;
