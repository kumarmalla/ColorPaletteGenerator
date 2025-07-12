Responsive Color Palette Generator
A powerful and intuitive web-based tool designed to help web developers and designers generate harmonious color palettes for their projects. This generator provides a live preview of how the colors look in a real website context, offers flexible adjustment options, and allows for easy export of generated palettes.

✨ Features
Flexible Color Input: Choose your base color using a color picker or by directly entering Hex, RGB, or HSL values.

Predefined Color Suggestions: Quickly select from a curated list of popular web accent colors and all Google Material Design accent colors.

Dynamic Palette Generation:

Monochromatic Theme: Generates a palette of 13 colors (7 for Light Mode, 6 for Dark Mode) based on HSL rules derived from your chosen base color, including primary, secondary, and tertiary backgrounds and text, plus an accent color.

Neutral Theme: Creates a pure white/black-based theme with only the accent color derived from your selection, with slight adjustments to avoid pure black/white for better visual depth.

Global Saturation & Lightness Adjustments: Fine-tune the entire generated palette's saturation and lightness using intuitive sliders, allowing for real-time preview of variations.

Live Website Preview: See your generated palette in action on a mock website layout featuring:

Header with navigation

Main content area

Sidebar with tertiary info box

Buttons (primary, secondary, accent)

Card components

Footer

Light/Dark Mode Toggle: Instantly switch the live preview between light and dark modes to assess your palette's versatility.

Copy-to-Clipboard Functionality: Easily copy individual color values (HSL format) or the entire palette as CSS variables.

Export Options: Export your generated palette in common formats:

CSS Variables (.css file)

JSON (.json file)

Responsive Design: Optimized for seamless use across all devices (desktop, tablet, mobile).

Clean & Modern UI: Intuitive interface designed for a smooth user experience.

Accessibility Conscious: Dynamic text and button colors ensure readability on various backgrounds.

Local Storage: Remembers your last used base color, theme type, and slider adjustments for convenience.

Pure JavaScript, HTML, CSS: No external frameworks or libraries, ensuring a lightweight and easily understandable codebase.

🚀 How to Use
Open index.html in your web browser.

Choose a Base Color:

Use the color picker.

Type a Hex, RGB, or HSL value into the input field.

Click on any of the predefined color swatches.

Select a Theme Type: Choose between "Monochromatic" or "Neutral" to influence the palette generation rules.

Adjust Globally (Optional): Use the "Saturation Adjustment" and "Lightness Adjustment" sliders to fine-tune the entire palette's feel. Click "Reset Adjustments" to revert to the original generated palette.

View Your Palette: The "Generated Color Palette" section will display all the calculated colors with their HSL values.

Live Preview: Observe how your chosen palette transforms the "Live Website Preview" section. Toggle between light and dark modes to check adaptability.

Copy & Export:

Click the "Copy" button on any individual color box to copy its HSL value.

Click "Copy Full Palette (CSS Variables)" to copy all generated colors as CSS custom properties.

Use the "Export as CSS Variables" or "Export as JSON" buttons to download the palette.

📁 File Structure
.
├── index.html
├── style.css
└── script.js

index.html: Contains the main HTML structure of the application.

style.css: Houses all the styling and responsive design rules.

script.js: Implements the core logic for color generation, UI interactions, and export functionalities.

🛠️ Development
This project is built using pure HTML, CSS, and JavaScript, making it easy to understand, modify, and extend.

License
This project is open-source and available under the MIT License. (You might want to create a https://www.google.com/search?q=LICENSE file if you don't have one).

Enjoy generating beautiful color palettes!
