/* ================================
   CONVERTER CORE LOGIC
   ================================ */

// Unit conversion definitions and functions
const CONVERSION_UNITS = {
    length: {
        name: 'Length',
        icon: '📏',
        base: 'meter',
        units: {
            meter: { name: 'Meter', symbol: 'm', factor: 1 },
            kilometer: { name: 'Kilometer', symbol: 'km', factor: 1000 },
            centimeter: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
            millimeter: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
            inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
            foot: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
            yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
            mile: { name: 'Mile', symbol: 'mi', factor: 1609.344 },
            nautical_mile: { name: 'Nautical Mile', symbol: 'nmi', factor: 1852 }
        },
        quick: [
            { from: 'meter', to: 'foot', values: [1, 3.28084] },
            { from: 'kilometer', to: 'mile', values: [1, 0.621371] },
            { from: 'inch', to: 'centimeter', values: [1, 2.54] },
            { from: 'foot', to: 'meter', values: [1, 0.3048] }
        ]
    },
    
    weight: {
        name: 'Weight',
        icon: '⚖️',
        base: 'kilogram',
        units: {
            kilogram: { name: 'Kilogram', symbol: 'kg', factor: 1 },
            gram: { name: 'Gram', symbol: 'g', factor: 0.001 },
            pound: { name: 'Pound', symbol: 'lb', factor: 0.453592 },
            ounce: { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
            ton: { name: 'Metric Ton', symbol: 't', factor: 1000 },
            stone: { name: 'Stone', symbol: 'st', factor: 6.35029 },
            short_ton: { name: 'Short Ton', symbol: 'ton', factor: 907.185 },
            long_ton: { name: 'Long Ton', symbol: 'long ton', factor: 1016.05 }
        },
        quick: [
            { from: 'kilogram', to: 'pound', values: [1, 2.20462] },
            { from: 'gram', to: 'ounce', values: [1, 0.035274] },
            { from: 'pound', to: 'kilogram', values: [1, 0.453592] },
            { from: 'stone', to: 'kilogram', values: [1, 6.35029] }
        ]
    },

    temperature: {
        name: 'Temperature',
        icon: '🌡️',
        base: 'celsius',
        units: {
            celsius: { name: 'Celsius', symbol: '°C' },
            fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
            kelvin: { name: 'Kelvin', symbol: 'K' },
            rankine: { name: 'Rankine', symbol: '°R' }
        },
        quick: [
            { from: 'celsius', to: 'fahrenheit', values: [0, 32] },
            { from: 'celsius', to: 'fahrenheit', values: [100, 212] },
            { from: 'fahrenheit', to: 'celsius', values: [32, 0] },
            { from: 'fahrenheit', to: 'celsius', values: [212, 100] }
        ]
    },

    volume: {
        name: 'Volume',
        icon: '🧪',
        base: 'liter',
        units: {
            liter: { name: 'Liter', symbol: 'L', factor: 1 },
            milliliter: { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
            gallon_us: { name: 'US Gallon', symbol: 'gal', factor: 3.78541 },
            gallon_uk: { name: 'UK Gallon', symbol: 'gal UK', factor: 4.54609 },
            quart_us: { name: 'US Quart', symbol: 'qt', factor: 0.946353 },
            pint_us: { name: 'US Pint', symbol: 'pt', factor: 0.473176 },
            cup_us: { name: 'US Cup', symbol: 'cup', factor: 0.236588 },
            fluid_ounce_us: { name: 'US Fluid Ounce', symbol: 'fl oz', factor: 0.0295735 },
            cubic_meter: { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
            cubic_foot: { name: 'Cubic Foot', symbol: 'ft³', factor: 28.3168 }
        },
        quick: [
            { from: 'liter', to: 'gallon_us', values: [1, 0.264172] },
            { from: 'milliliter', to: 'fluid_ounce_us', values: [1, 0.033814] },
            { from: 'gallon_us', to: 'liter', values: [1, 3.78541] },
            { from: 'cup_us', to: 'milliliter', values: [1, 236.588] }
        ]
    },

    area: {
        name: 'Area',
        icon: '📐',
        base: 'square_meter',
        units: {
            square_meter: { name: 'Square Meter', symbol: 'm²', factor: 1 },
            square_kilometer: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
            square_centimeter: { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
            square_foot: { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
            square_inch: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
            square_yard: { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
            acre: { name: 'Acre', symbol: 'ac', factor: 4046.86 },
            hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 },
            square_mile: { name: 'Square Mile', symbol: 'mi²', factor: 2589988 }
        },
        quick: [
            { from: 'square_meter', to: 'square_foot', values: [1, 10.7639] },
            { from: 'acre', to: 'square_meter', values: [1, 4046.86] },
            { from: 'hectare', to: 'acre', values: [1, 2.47105] },
            { from: 'square_foot', to: 'square_meter', values: [1, 0.092903] }
        ]
    },

    speed: {
        name: 'Speed',
        icon: '🚀',
        base: 'meter_per_second',
        units: {
            meter_per_second: { name: 'Meter per Second', symbol: 'm/s', factor: 1 },
            kilometer_per_hour: { name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778 },
            mile_per_hour: { name: 'Mile per Hour', symbol: 'mph', factor: 0.44704 },
            foot_per_second: { name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048 },
            knot: { name: 'Knot', symbol: 'kn', factor: 0.514444 },
            mach: { name: 'Mach', symbol: 'Ma', factor: 343 }
        },
        quick: [
            { from: 'kilometer_per_hour', to: 'mile_per_hour', values: [1, 0.621371] },
            { from: 'meter_per_second', to: 'kilometer_per_hour', values: [1, 3.6] },
            { from: 'mile_per_hour', to: 'kilometer_per_hour', values: [1, 1.60934] },
            { from: 'knot', to: 'kilometer_per_hour', values: [1, 1.852] }
        ]
    },

    energy: {
        name: 'Energy',
        icon: '⚡',
        base: 'joule',
        units: {
            joule: { name: 'Joule', symbol: 'J', factor: 1 },
            kilojoule: { name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
            calorie: { name: 'Calorie', symbol: 'cal', factor: 4.184 },
            kilocalorie: { name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
            watt_hour: { name: 'Watt Hour', symbol: 'Wh', factor: 3600 },
            kilowatt_hour: { name: 'Kilowatt Hour', symbol: 'kWh', factor: 3600000 },
            btu: { name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.06 },
            foot_pound: { name: 'Foot Pound', symbol: 'ft⋅lb', factor: 1.35582 }
        },
        quick: [
            { from: 'joule', to: 'calorie', values: [1, 0.239006] },
            { from: 'kilocalorie', to: 'kilojoule', values: [1, 4.184] },
            { from: 'kilowatt_hour', to: 'joule', values: [1, 3600000] },
            { from: 'btu', to: 'joule', values: [1, 1055.06] }
        ]
    },

    pressure: {
        name: 'Pressure',
        icon: '🎈',
        base: 'pascal',
        units: {
            pascal: { name: 'Pascal', symbol: 'Pa', factor: 1 },
            kilopascal: { name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
            megapascal: { name: 'Megapascal', symbol: 'MPa', factor: 1000000 },
            bar: { name: 'Bar', symbol: 'bar', factor: 100000 },
            atmosphere: { name: 'Atmosphere', symbol: 'atm', factor: 101325 },
            psi: { name: 'Pounds per Square Inch', symbol: 'psi', factor: 6894.76 },
            torr: { name: 'Torr', symbol: 'Torr', factor: 133.322 },
            mmhg: { name: 'mmHg', symbol: 'mmHg', factor: 133.322 }
        },
        quick: [
            { from: 'pascal', to: 'bar', values: [1, 0.00001] },
            { from: 'psi', to: 'pascal', values: [1, 6894.76] },
            { from: 'atmosphere', to: 'pascal', values: [1, 101325] },
            { from: 'bar', to: 'psi', values: [1, 14.5038] }
        ]
    }
};

// Conversion Engine
class ConversionEngine {
    constructor() {
        this.currentCategory = 'length';
        this.history = this.loadHistory();
    }

    // Standard unit conversions (using base unit)
    convert(value, fromUnit, toUnit, category) {
        if (!value || isNaN(value)) return 0;
        
        const categoryData = CONVERSION_UNITS[category];
        if (!categoryData) return 0;

        // Handle temperature conversions (special case)
        if (category === 'temperature') {
            return this.convertTemperature(value, fromUnit, toUnit);
        }

        // Standard conversions using base unit
        const fromFactor = categoryData.units[fromUnit]?.factor || 1;
        const toFactor = categoryData.units[toUnit]?.factor || 1;

        // Convert to base unit first, then to target unit
        const baseValue = value * fromFactor;
        const result = baseValue / toFactor;

        return this.roundResult(result);
    }

    // Temperature conversion (special handling required)
    convertTemperature(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;

        // Convert to Celsius first
        let celsius;
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            case 'rankine':
                celsius = (value - 491.67) * 5/9;
                break;
            default:
                return 0;
        }

        // Convert from Celsius to target unit
        let result;
        switch (toUnit) {
            case 'celsius':
                result = celsius;
                break;
            case 'fahrenheit':
                result = celsius * 9/5 + 32;
                break;
            case 'kelvin':
                result = celsius + 273.15;
                break;
            case 'rankine':
                result = celsius * 9/5 + 491.67;
                break;
            default:
                return 0;
        }

        return this.roundResult(result);
    }

    // Smart rounding based on magnitude
    roundResult(value) {
        if (Math.abs(value) >= 1000000) {
            return Number(value.toExponential(4));
        } else if (Math.abs(value) >= 1) {
            return Number(value.toFixed(6)).valueOf();
        } else {
            return Number(value.toFixed(8)).valueOf();
        }
    }

    // Get conversion formula text
    getFormula(fromUnit, toUnit, category) {
        const categoryData = CONVERSION_UNITS[category];
        if (!categoryData) return '';

        const fromName = categoryData.units[fromUnit]?.name || fromUnit;
        const toName = categoryData.units[toUnit]?.name || toUnit;

        if (category === 'temperature') {
            return this.getTemperatureFormula(fromUnit, toUnit);
        }

        const fromFactor = categoryData.units[fromUnit]?.factor || 1;
        const toFactor = categoryData.units[toUnit]?.factor || 1;
        const ratio = fromFactor / toFactor;

        if (ratio === 1) {
            return `1 ${fromName} = 1 ${toName}`;
        } else if (ratio > 1) {
            return `1 ${fromName} = ${this.roundResult(ratio)} ${toName}`;
        } else {
            return `1 ${fromName} = ${this.roundResult(ratio)} ${toName}`;
        }
    }

    // Temperature formula text
    getTemperatureFormula(fromUnit, toUnit) {
        const formulas = {
            'celsius-fahrenheit': '°F = (°C × 9/5) + 32',
            'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
            'celsius-kelvin': 'K = °C + 273.15',
            'kelvin-celsius': '°C = K - 273.15',
            'fahrenheit-kelvin': 'K = (°F + 459.67) × 5/9',
            'kelvin-fahrenheit': '°F = (K × 9/5) - 459.67'
        };

        const key = `${fromUnit}-${toUnit}`;
        return formulas[key] || `Convert ${fromUnit} to ${toUnit}`;
    }

    // History management
    addToHistory(conversion) {
        this.history.unshift({
            ...conversion,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });

        // Keep only last 50 conversions
        this.history = this.history.slice(0, 50);
        this.saveHistory();
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('converter_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('converter_history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    getHistory() {
        return this.history;
    }

    // Quick conversions for a category
    getQuickConversions(category) {
        const categoryData = CONVERSION_UNITS[category];
        return categoryData?.quick || [];
    }

    // Get all units for a category
    getCategoryUnits(category) {
        const categoryData = CONVERSION_UNITS[category];
        return categoryData?.units || {};
    }

    // Get category information
    getCategoryInfo(category) {
        return CONVERSION_UNITS[category];
    }

    // Get all categories
    getAllCategories() {
        return Object.keys(CONVERSION_UNITS);
    }

    // Format number for display
    formatNumber(value) {
        if (typeof value !== 'number' || isNaN(value)) return '0';

        // Handle very large and very small numbers
        if (Math.abs(value) >= 1e9 || (Math.abs(value) < 1e-6 && value !== 0)) {
            return value.toExponential(4);
        }

        // Regular formatting
        if (Math.abs(value) >= 1000) {
            return value.toLocaleString('en-US', { maximumFractionDigits: 4 });
        }

        // For smaller numbers, remove trailing zeros
        return Number(value.toPrecision(8)).toString();
    }

    // Validate conversion inputs
    isValidConversion(value, fromUnit, toUnit, category) {
        if (!value || isNaN(value)) return false;
        if (!fromUnit || !toUnit || !category) return false;
        
        const categoryData = CONVERSION_UNITS[category];
        if (!categoryData) return false;
        
        const hasFromUnit = categoryData.units[fromUnit];
        const hasToUnit = categoryData.units[toUnit];
        
        return hasFromUnit && hasToUnit;
    }
}

// Export for use in other files
window.ConversionEngine = ConversionEngine;
window.CONVERSION_UNITS = CONVERSION_UNITS;
