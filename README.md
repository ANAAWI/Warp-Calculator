# Warp-Calculator
Web calculator designed by Warp
[README.md](https://github.com/user-attachments/files/21706126/README.md)
# 🧮 Modern Scientific Calculator Suite

A comprehensive calculator suite featuring a scientific calculator, unit converter, and modern landing page with light/dark theme support.

## 🌟 Features Overview

### 🏠 **Landing Page** (`index.html`)
- Modern card-based navigation
- Interactive tool selection
- Keyboard shortcuts
- Responsive design
- Theme integration

### 🧮 **Scientific Calculator** (`calculator.html`)
- Complete scientific functions
- Memory operations
- Calculation history
- Documentation modal

### 🔄 **Unit Converter** (`converter.html`)
- 8 conversion categories
- Real-time conversion
- Quick conversion examples
- Conversion history
- Formula display

## 📁 Project Structure

```
scientific-calculator/
├── 🏠 index.html                   # Landing page
├── 🧮 calculator.html              # Scientific calculator
├── 🔄 converter.html               # Unit converter
├── 📄 README.md                    # Project documentation
├── 📁 css/                         # Stylesheets
│   ├── 🎨 themes.css              # Global theme variables
│   ├── 🏗️ base.css                # Base styles & utilities
│   ├── 🏠 landing.css              # Landing page styles
│   ├── 🧮 calculator.css          # Calculator interface
│   ├── 🔄 converter.css           # Converter interface
│   ├── 🔘 buttons.css             # Button components
│   ├── 📜 history-responsive.css  # History & responsive
│   └── 📖 documentation.css       # Documentation styles
└── 📁 js/                          # JavaScript modules
    ├── 🌓 theme-toggle.js          # Theme switching
    ├── 🏠 landing.js               # Landing page logic
    ├── 🧮 calculator-core.js       # Calculator engine
    ├── 🔢 calculator-methods.js    # Math functions
    ├── 🔄 converter-core.js        # Conversion engine
    ├── 🔧 converter-app.js         # Converter interface
    └── 🚀 app.js                   # Calculator initialization
```

## 🎯 Features

### 🧮 Calculator Functions
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Scientific Functions**: Trigonometry, logarithms, powers, roots
- **Memory Operations**: Store, recall, add, subtract from memory
- **Special Features**: Parentheses, percentage, sign toggle
- **Constants**: π (pi), e (Euler's number)
- **History**: View and reuse previous calculations

### 🌓 Theme System
- **Dark Theme**: Nature forest background with green color scheme
- **Light Theme**: Mountain landscape with professional color palette
- **Persistent**: Theme preference saved in localStorage
- **Synchronized**: Works across both calculator and documentation pages

### ⌨️ Input Methods
- **Mouse/Touch**: Click buttons for input
- **Keyboard**: Full keyboard support for all operations
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### CSS Organization
Each CSS file has a specific purpose:
- **`themes.css`**: CSS custom properties for light/dark themes
- **`base.css`**: Reset styles, body layout, utility classes
- **`calculator.css`**: Calculator container and display styles
- **`buttons.css`**: All button styles and navigation elements
- **`history-responsive.css`**: History panel and responsive breakpoints
- **`documentation.css`**: Documentation page specific styles

### JavaScript Organization
The JavaScript is split into focused modules:
- **`theme-toggle.js`**: Handles theme switching logic
- **`calculator-core.js`**: Main ScientificCalculator class with core functionality
- **`calculator-methods.js`**: Mathematical methods and calculator operations
- **`app.js`**: Application initialization and coordination

## 🚀 Getting Started

1. **Open the calculator**: Open `index.html` in your web browser
2. **View documentation**: Click the "Docs" button or open `documentation.html`
3. **Switch themes**: Click the sun/moon icon in the top-right corner

## 🎨 Customization

### Adding New Themes
1. Add new CSS variables to `css/themes.css`
2. Create a new theme class (e.g., `.autumn-theme`)
3. Update the theme toggle logic in `js/theme-toggle.js`

### Adding New Functions
1. Add the button to `index.html`
2. Add the function logic to `js/calculator-methods.js`
3. Update the action handler in `js/calculator-core.js`

### Styling Changes
- **Colors**: Modify `css/themes.css`
- **Layout**: Modify `css/base.css` or `css/calculator.css`
- **Buttons**: Modify `css/buttons.css`
- **Responsive**: Modify `css/history-responsive.css`

## 📱 Responsive Design

The calculator is fully responsive with breakpoints:
- **Desktop**: Full layout with all features
- **Tablet** (≤768px): Compact navigation, adjusted spacing
- **Mobile** (≤480px): Smaller buttons, optimized layout
- **Small Mobile** (≤360px): Minimal button sizes

## 🎨 Design Philosophy

This calculator embraces a modern, professional design approach:
- **Clean Backgrounds**: Minimalist solid color backgrounds
- **Professional Shapes**: Clean, rounded button borders
- **Modern Color Palette**: Professional color schemes for both themes
- **Smooth Animations**: Responsive transitions and interactions
- **Accessibility**: Proper focus states and keyboard navigation

## 🔧 Development

### File Loading Order
The files are loaded in a specific order for proper functionality:

**CSS Files** (in `<head>`):
1. `themes.css` - Theme variables first
2. `base.css` - Base styles and layout
3. `calculator.css` - Calculator components
4. `buttons.css` - Button styles
5. `history-responsive.css` - History and responsive styles

**JavaScript Files** (before `</body>`):
1. `theme-toggle.js` - Theme functionality
2. `calculator-core.js` - Calculator class
3. `calculator-methods.js` - Calculator methods
4. `app.js` - Application initialization

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Features**: CSS Custom Properties, Grid, Flexbox
- **JavaScript**: ES6+ features, localStorage API

## 📖 Documentation

Comprehensive documentation is available at `documentation.html` including:
- Detailed function explanations
- Keyboard shortcuts
- Usage tips
- Design philosophy
- Feature descriptions

## ⌨️ Keyboard Shortcuts

### Numbers & Operators
- `0-9`: Number input
- `+`, `-`, `*`, `/`: Basic operations
- `.`: Decimal point
- `(`, `)`: Parentheses

### Control Keys
- `Enter` or `=`: Calculate
- `Escape`: Clear calculator
- `Backspace`: Delete last digit
- `Ctrl+H`: Toggle history panel
- `Ctrl+T`: Toggle theme
- `Ctrl+R`: Reset calculator (prevents page refresh)

## 🧮 Scientific Functions

### Trigonometric Functions
- **sin**, **cos**, **tan**: Basic trigonometric functions
- **sin⁻¹**, **cos⁻¹**, **tan⁻¹**: Inverse trigonometric functions
- **DEG/RAD**: Switch between degrees and radians

### Logarithmic Functions
- **ln**: Natural logarithm (base e)
- **log**: Common logarithm (base 10)
- **10ˣ**: Power of 10

### Power & Root Functions
- **x²**: Square function
- **√**: Square root
- **∛**: Cube root
- **xʸ**: Power function
- **1/x**: Reciprocal

### Special Functions
- **n!**: Factorial
- **|x|**: Absolute value
- **π**: Pi constant (3.14159...)
- **e**: Euler's number (2.71828...)
- **%**: Percentage
- **±**: Sign toggle

## 💾 Memory Operations

- **MC**: Memory Clear - Clears memory to 0
- **MR**: Memory Recall - Displays current memory value
- **MS**: Memory Store - Stores display value in memory
- **M+**: Memory Add - Adds display value to memory
- **M-**: Memory Subtract - Subtracts display value from memory

## 📜 History Feature

- **Automatic Recording**: Every calculation is saved with timestamp
- **Quick Reuse**: Click any history item to reuse the result
- **Easy Management**: Clear individual items or entire history
- **Persistent Storage**: History saved in browser localStorage

## 🤝 Contributing

To contribute to this project:
1. Follow the modular file structure
2. Add appropriate comments to your code
3. Update documentation for new features
4. Test on multiple devices and browsers
5. Maintain the eco-friendly design aesthetic

## 💡 Tips & Tricks

### Speed Calculations
- Use keyboard shortcuts for faster input
- Chain operations without pressing equals
- Use parentheses for complex expressions

### Angle Mode
- Switch between DEG and RAD for trigonometry
- DEG mode for everyday calculations
- RAD mode for advanced mathematics

### Memory Usage
- Store intermediate results with MS
- Use M+ and M- for running totals
- Check memory value in status bar

### Theme Benefits
- Light theme for bright environments
- Dark theme reduces eye strain
- Theme preference is automatically saved

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy calculating with nature! 🌿🧮**
