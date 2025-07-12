document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('colorInput');
    const predefinedColors = document.querySelector('.predefined-colors');
    const themeOptions = document.querySelectorAll('input[name="themeType"]');
    const paletteGrid = document.getElementById('paletteGrid');
    const copyPaletteBtn = document.getElementById('copyPaletteBtn');
    const exportCssBtn = document.getElementById('exportCssBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const togglePreviewModeBtn = document.getElementById('togglePreviewMode');
    const websitePreview = document.getElementById('websitePreview');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const closeMessageBoxBtn = document.getElementById('closeMessageBox');

    const saturationSlider = document.getElementById('saturationSlider');
    const lightnessSlider = document.getElementById('lightnessSlider');
    const saturationValueSpan = document.getElementById('saturationValue');
    const lightnessValueSpan = document.getElementById('lightnessValue');
    const resetAdjustmentsBtn = document.getElementById('resetAdjustmentsBtn');


    let currentBaseColor = '#1a73e8'; // Default Google Blue
    let currentThemeType = 'monochromatic';
    let isPreviewDarkMode = false;
    let globalSaturationOffset = 0;
    let globalLightnessOffset = 0;

    // Store the original palette generated without any user adjustments
    let originalGeneratedPalette = [];

    // Function to show custom message box
    function showMessageBox(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    // Function to hide custom message box
    function hideMessageBox() {
        messageBox.style.display = 'none';
    }

    closeMessageBoxBtn.addEventListener('click', hideMessageBox);

    // --- Color Conversion Functions ---
    // Converts HSL to Hex
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    // Converts Hex to HSL
    function hexToHsl(hex) {
        let r = 0, g = 0, b = 0;
        // 3 digits
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // 6 digits
        else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        } else {
            return null; // Invalid hex
        }

        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return { h, s, l };
    }

    // Converts RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return { h, s, l };
    }

    // Parses a color string (Hex, RGB, HSL) and returns HSL object
    function parseColorToHsl(colorString) {
        colorString = colorString.trim().toLowerCase();

        // Hex
        if (colorString.startsWith('#')) {
            return hexToHsl(colorString);
        }
        // RGB
        else if (colorString.startsWith('rgb')) {
            const match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                return rgbToHsl(r, g, b);
            }
        }
        // HSL
        else if (colorString.startsWith('hsl')) {
            const match = colorString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if (match) {
                const h = parseInt(match[1]);
                const s = parseInt(match[2]);
                const l = parseInt(match[3]);
                return { h, s, l };
            }
        }
        return null; // Invalid format
    }

    // --- Color Palette Generation Logic ---
    // This function generates the *base* palette, without any global adjustments
    function generateBasePalette(baseColorHex, themeType) {
        const baseHsl = parseColorToHsl(baseColorHex);
        if (!baseHsl) {
            showMessageBox('Invalid color format. Please use Hex (#RRGGBB), RGB (rgb(R,G,B)), or HSL (hsl(H,S%,L%)).');
            return [];
        }

        const { h: selected_hue, s: selected_saturation, l: selected_lightness } = baseHsl;
        const palette = [];

        if (themeType === 'monochromatic') {
            // Light Mode Colors
            palette.push({
                name: 'Light Mode - Primary Background',
                h: selected_hue, s: 25, l: 90
            });
            palette.push({
                name: 'Light Mode - Secondary Background',
                h: selected_hue, s: 80, l: 70
            });
            palette.push({
                name: 'Light Mode - Tertiary Background',
                h: selected_hue, s: 90, l: 80 // Fixed as per request
            });
            palette.push({
                name: 'Light Mode - Primary Text',
                h: selected_hue, s: 90, l: 20
            });
            palette.push({
                name: 'Light Mode - Secondary Text',
                h: selected_hue, s: 90, l: 25
            });
            palette.push({
                name: 'Light Mode - Tertiary Text',
                h: selected_hue, s: 90, l: 30
            });
            palette.push({
                name: 'Light Mode - Accent',
                h: selected_hue, s: selected_saturation, l: selected_lightness
            });

            // Dark Mode Colors
            palette.push({
                name: 'Dark Mode - Primary Background',
                h: selected_hue, s: 25, l: 10
            });
            palette.push({
                name: 'Dark Mode - Secondary Background',
                h: selected_hue, s: 20, l: 20
            });
            palette.push({
                name: 'Dark Mode - Tertiary Background',
                h: selected_hue, s: 15, l: 25
            });
            palette.push({
                name: 'Dark Mode - Primary Text',
                h: selected_hue, s: 75, l: 90
            });
            palette.push({
                name: 'Dark Mode - Secondary Text',
                h: selected_hue, s: 75, l: 85
            });
            palette.push({
                name: 'Dark Mode - Tertiary Text',
                h: selected_hue, s: 75, l: 80
            });
            palette.push({
                name: 'Dark Mode - Accent',
                h: selected_hue, s: Math.max(0, selected_saturation - 20), l: selected_lightness
            });
        } else if (themeType === 'neutral') {
            // Neutral Light Mode (adjusted to not be pure white/black)
            palette.push({ name: 'Light Mode - Primary Background', h: 0, s: 0, l: 98 }); // Slightly off-white
            palette.push({ name: 'Light Mode - Secondary Background', h: 0, s: 0, l: 93 }); // Adjusted
            palette.push({ name: 'Light Mode - Tertiary Background', h: 0, s: 0, l: 88 }); // Adjusted
            palette.push({ name: 'Light Mode - Primary Text', h: 0, s: 0, l: 10 });    // Slightly off-black
            palette.push({ name: 'Light Mode - Secondary Text', h: 0, s: 0, l: 20 });   // Adjusted
            palette.push({ name: 'Light Mode - Tertiary Text', h: 0, s: 0, l: 30 });   // Adjusted
            palette.push({
                name: 'Light Mode - Accent',
                h: selected_hue, s: selected_saturation, l: selected_lightness
            });

            // Neutral Dark Mode (adjusted to not be pure white/black)
            palette.push({ name: 'Dark Mode - Primary Background', h: 0, s: 0, l: 10 });  // Slightly off-black
            palette.push({ name: 'Dark Mode - Secondary Background', h: 0, s: 0, l: 15 }); // Adjusted
            palette.push({ name: 'Dark Mode - Tertiary Background', h: 0, s: 0, l: 20 }); // Adjusted
            palette.push({ name: 'Dark Mode - Primary Text', h: 0, s: 0, l: 90 });     // Slightly off-white
            palette.push({ name: 'Dark Mode - Secondary Text', h: 0, s: 0, l: 85 });    // Adjusted
            palette.push({ name: 'Dark Mode - Tertiary Text', h: 0, s: 0, l: 80 });    // Adjusted
            palette.push({
                name: 'Dark Mode - Accent',
                h: selected_hue, s: Math.max(0, selected_saturation - 20), l: selected_lightness
            });
        }
        return palette;
    }

    // Applies global saturation/lightness adjustments to a palette
    function applyAdjustments(palette, satOffset, lightOffset) {
        return palette.map(color => {
            // Only apply adjustments to non-accent colors
            // Accent color is meant to be the user's chosen color or a slight variation
            if (color.name.includes('Accent')) {
                return { ...color, hsl: `hsl(${color.h}, ${color.s}%, ${color.l}%)` };
            }

            const newS = Math.min(100, Math.max(0, color.s + satOffset));
            const newL = Math.min(100, Math.max(0, color.l + lightOffset));
            return {
                ...color,
                hsl: `hsl(${color.h}, ${newS}%, ${newL}%)`
            };
        });
    }

    // --- UI Update Functions ---
    function displayPalette(palette) {
        paletteGrid.innerHTML = ''; // Clear previous palette

        palette.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = color.hsl;

            // Determine text color for readability based on lightness
            const hslValues = parseColorToHsl(color.hsl);
            const textColor = hslValues.l > 50 ? 'black' : 'white';
            colorBox.style.color = textColor;

            // Set copy button's text and background dynamically for visibility
            const buttonTextColor = hslValues.l > 70 ? 'black' : 'white'; // More aggressive check for button text
            const buttonBgColor = hslValues.l > 70 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)';

            colorBox.innerHTML = `
                <div class="color-info">
                    <div class="color-name">${color.name}</div>
                    <div class="color-value">${color.hsl}</div>
                </div>
                <button class="copy-button" data-color="${color.hsl}"
                    style="color: ${buttonTextColor}; background-color: ${buttonBgColor};">Copy</button>
            `;
            paletteGrid.appendChild(colorBox);
        });

        // Add event listeners for new copy buttons
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const colorValue = event.target.dataset.color;
                copyToClipboard(colorValue);
                showMessageBox(`Copied ${colorValue} to clipboard!`);
            });
        });
    }

    function applyColorsToPreview(palette, isDark) {
        const root = document.documentElement;
        const accentColor = palette.find(c => c.name.includes('Accent') && c.name.includes(isDark ? 'Dark' : 'Light')).hsl;
        const accentRgbMatch = accentColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        let accentRgb = '';
        if (accentRgbMatch) {
            const h = parseInt(accentRgbMatch[1]);
            const s = parseInt(accentRgbMatch[2]);
            const l = parseInt(accentRgbMatch[3]);
            const hex = hslToHex(h, s, l);
            const rgb = hexToRgb(hex);
            accentRgb = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        }

        if (isDark) {
            root.style.setProperty('--primary-bg-dark', palette.find(c => c.name === 'Dark Mode - Primary Background').hsl);
            root.style.setProperty('--secondary-bg-dark', palette.find(c => c.name === 'Dark Mode - Secondary Background').hsl);
            root.style.setProperty('--tertiary-bg-dark', palette.find(c => c.name === 'Dark Mode - Tertiary Background').hsl); // New
            root.style.setProperty('--primary-text-dark', palette.find(c => c.name === 'Dark Mode - Primary Text').hsl);
            root.style.setProperty('--secondary-text-dark', palette.find(c => c.name === 'Dark Mode - Secondary Text').hsl);
            root.style.setProperty('--tertiary-text-dark', palette.find(c => c.name === 'Dark Mode - Tertiary Text').hsl); // New
            root.style.setProperty('--accent-dark', accentColor);
            root.style.setProperty('--accent-dark-rgb', accentRgb); // For box-shadow
            websitePreview.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            root.style.setProperty('--primary-bg-light', palette.find(c => c.name === 'Light Mode - Primary Background').hsl);
            root.style.setProperty('--secondary-bg-light', palette.find(c => c.name === 'Light Mode - Secondary Background').hsl);
            root.style.setProperty('--tertiary-bg-light', palette.find(c => c.name === 'Light Mode - Tertiary Background').hsl); // New
            root.style.setProperty('--primary-text-light', palette.find(c => c.name === 'Light Mode - Primary Text').hsl);
            root.style.setProperty('--secondary-text-light', palette.find(c => c.name === 'Light Mode - Secondary Text').hsl);
            root.style.setProperty('--tertiary-text-light', palette.find(c => c.name === 'Light Mode - Tertiary Text').hsl); // New
            root.style.setProperty('--accent-light', accentColor);
            root.style.setProperty('--accent-light-rgb', accentRgb); // For box-shadow
            websitePreview.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
    }

    // Helper to convert hex to RGB for CSS variable
    function hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
    }

    // --- Event Handlers ---
    function updateColors() {
        // Generate the original palette first
        originalGeneratedPalette = generateBasePalette(currentBaseColor, currentThemeType);
        if (originalGeneratedPalette.length === 0) return;

        // Apply global adjustments to the original palette for display
        const adjustedPalette = applyAdjustments(originalGeneratedPalette, globalSaturationOffset, globalLightnessOffset);

        displayPalette(adjustedPalette);
        // Always apply both light and dark mode colors to root variables
        // The preview will toggle which set is active
        applyColorsToPreview(adjustedPalette, false); // Apply light mode vars
        applyColorsToPreview(adjustedPalette, true);  // Apply dark mode vars
        // Ensure the preview reflects the current toggle state
        if (isPreviewDarkMode) {
            websitePreview.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            websitePreview.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
        saveState();
    }

    colorPicker.addEventListener('input', (event) => {
        currentBaseColor = event.target.value;
        colorInput.value = currentBaseColor; // Update text input
        updateColors();
    });

    colorInput.addEventListener('input', (event) => {
        const inputVal = event.target.value.trim();
        const hsl = parseColorToHsl(inputVal);
        if (hsl) {
            // If valid, update color picker and currentBaseColor
            const hex = hslToHex(hsl.h, hsl.s, hsl.l);
            colorPicker.value = hex;
            currentBaseColor = hex;
            updateColors();
        }
        // No error message on every invalid input, only when generating palette
    });

    predefinedColors.addEventListener('click', (event) => {
        const swatch = event.target.closest('.color-swatch');
        if (swatch) {
            currentBaseColor = swatch.dataset.color;
            colorPicker.value = currentBaseColor;
            colorInput.value = currentBaseColor;
            // Reset sliders when a predefined color is selected
            globalSaturationOffset = 0;
            globalLightnessOffset = 0;
            saturationSlider.value = 0;
            lightnessSlider.value = 0;
            saturationValueSpan.textContent = '0%';
            lightnessValueSpan.textContent = '0%';
            updateColors();
        }
    });

    themeOptions.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentThemeType = event.target.value;
            // Reset sliders when theme type changes
            globalSaturationOffset = 0;
            globalLightnessOffset = 0;
            saturationSlider.value = 0;
            lightnessSlider.value = 0;
            saturationValueSpan.textContent = '0%';
            lightnessValueSpan.textContent = '0%';
            updateColors();
        });
    });

    togglePreviewModeBtn.addEventListener('click', () => {
        isPreviewDarkMode = !isPreviewDarkMode;
        websitePreview.classList.toggle('dark-mode', isPreviewDarkMode);
        document.body.classList.toggle('dark-mode', isPreviewDarkMode);
        togglePreviewModeBtn.textContent = isPreviewDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        saveState();
    });

    // Slider event listeners
    saturationSlider.addEventListener('input', (event) => {
        globalSaturationOffset = parseInt(event.target.value);
        saturationValueSpan.textContent = `${globalSaturationOffset}%`;
        updateColors(); // Re-render with new adjustments
    });

    lightnessSlider.addEventListener('input', (event) => {
        globalLightnessOffset = parseInt(event.target.value);
        lightnessValueSpan.textContent = `${globalLightnessOffset}%`;
        updateColors(); // Re-render with new adjustments
    });

    resetAdjustmentsBtn.addEventListener('click', () => {
        globalSaturationOffset = 0;
        globalLightnessOffset = 0;
        saturationSlider.value = 0;
        lightnessSlider.value = 0;
        saturationValueSpan.textContent = '0%';
        lightnessValueSpan.textContent = '0%';
        updateColors(); // Re-render to original state
    });


    // --- Clipboard and Export Functions ---
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy'); // Deprecated but works in iframes
        document.body.removeChild(textarea);
    }

    copyPaletteBtn.addEventListener('click', () => {
        // Use the currently displayed (adjusted) palette for copying
        const palette = applyAdjustments(originalGeneratedPalette, globalSaturationOffset, globalLightnessOffset);
        if (palette.length === 0) return;

        let cssVariables = ':root {\n';
        palette.forEach(color => {
            let varName = '';
            if (color.name.includes('Light Mode')) {
                varName = `--${color.name.replace('Light Mode - ', '').toLowerCase().replace(/ /g, '-')}-light`;
            } else if (color.name.includes('Dark Mode')) {
                varName = `--${color.name.replace('Dark Mode - ', '').toLowerCase().replace(/ /g, '-')}-dark`;
            }
            cssVariables += `  ${varName}: ${color.hsl};\n`;
        });
        cssVariables += '}\n';
        copyToClipboard(cssVariables);
        showMessageBox('Copied CSS variables to clipboard!');
    });

    exportCssBtn.addEventListener('click', () => {
        // Use the currently displayed (adjusted) palette for exporting
        const palette = applyAdjustments(originalGeneratedPalette, globalSaturationOffset, globalLightnessOffset);
        if (palette.length === 0) return;

        let cssVariables = ':root {\n';
        palette.forEach(color => {
            let varName = '';
            if (color.name.includes('Light Mode')) {
                varName = `--${color.name.replace('Light Mode - ', '').toLowerCase().replace(/ /g, '-')}-light`;
            } else if (color.name.includes('Dark Mode')) {
                varName = `--${color.name.replace('Dark Mode - ', '').toLowerCase().replace(/ /g, '-')}-dark`;
            }
            cssVariables += `  ${varName}: ${color.hsl};\n`;
        });
        cssVariables += '}\n';

        const blob = new Blob([cssVariables], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessageBox('CSS variables exported as color-palette.css!');
    });

    exportJsonBtn.addEventListener('click', () => {
        // Use the currently displayed (adjusted) palette for exporting
        const palette = applyAdjustments(originalGeneratedPalette, globalSaturationOffset, globalLightnessOffset);
        if (palette.length === 0) return;

        const jsonOutput = {};
        palette.forEach(color => {
            jsonOutput[color.name] = color.hsl;
        });

        const jsonString = JSON.stringify(jsonOutput, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessageBox('Palette exported as color-palette.json!');
    });

    // --- Local Storage ---
    function saveState() {
        localStorage.setItem('lastBaseColor', currentBaseColor);
        localStorage.setItem('lastThemeType', currentThemeType);
        localStorage.setItem('isPreviewDarkMode', isPreviewDarkMode);
        localStorage.setItem('globalSaturationOffset', globalSaturationOffset);
        localStorage.setItem('globalLightnessOffset', globalLightnessOffset);
    }

    function loadState() {
        const savedColor = localStorage.getItem('lastBaseColor');
        const savedTheme = localStorage.getItem('lastThemeType');
        const savedDarkMode = localStorage.getItem('isPreviewDarkMode');
        const savedSatOffset = localStorage.getItem('globalSaturationOffset');
        const savedLightOffset = localStorage.getItem('globalLightnessOffset');


        if (savedColor) {
            currentBaseColor = savedColor;
            colorPicker.value = savedColor;
            colorInput.value = savedColor;
        }
        if (savedTheme) {
            currentThemeType = savedTheme;
            document.querySelector(`input[name="themeType"][value="${savedTheme}"]`).checked = true;
        }
        if (savedDarkMode !== null) {
            isPreviewDarkMode = savedDarkMode === 'true';
            websitePreview.classList.toggle('dark-mode', isPreviewDarkMode);
            document.body.classList.toggle('dark-mode', isPreviewDarkMode);
            togglePreviewModeBtn.textContent = isPreviewDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
        }
        if (savedSatOffset !== null) {
            globalSaturationOffset = parseInt(savedSatOffset);
            saturationSlider.value = globalSaturationOffset;
            saturationValueSpan.textContent = `${globalSaturationOffset}%`;
        }
        if (savedLightOffset !== null) {
            globalLightnessOffset = parseInt(savedLightOffset);
            lightnessSlider.value = globalLightnessOffset;
            lightnessValueSpan.textContent = `${globalLightnessOffset}%`;
        }
    }

    // Function to initialize predefined color swatches
    function initializePredefinedSwatches() {
        document.querySelectorAll('.predefined-colors .color-swatch').forEach(swatch => {
            const color = swatch.dataset.color;
            if (color) {
                swatch.style.backgroundColor = color;
            }
        });
    }

    // Initial load
    loadState();
    initializePredefinedSwatches(); // Initialize swatches on load
    updateColors(); // Generate palette on page load
});