# Portfolio Sections - Self-Contained Components

This directory contains self-contained HTML sections extracted from the main `index.html` file. Each section can be viewed independently while maintaining the same visual appearance and functionality as in the complete portfolio.

## 📁 Section Files

### 01. Header Navigation (`01-header-navigation.html`)

- **Purpose**: Fixed header with responsive navigation
- **Features**:
  - Desktop and mobile navigation menus
  - Skip links for accessibility
  - Logo and CTA button
  - Mobile hamburger menu with overlay
- **Dependencies**:
  - `css/components/header.css`
  - `css/components/buttons.css`
  - `js/mobile-menu.min.js`

### 02. Hero Section (`02-hero-section.html`)

- **Purpose**: Main landing area with animated elements
- **Features**:
  - ASCII portrait canvas
  - Animated metrics counters
  - Typewriter effect
  - Brutalist overlay effects (scanlines, film grain)
  - Call-to-action buttons
- **Dependencies**:
  - `css/components/hero.css`
  - `css/components/metrics.css`
  - `css/components/cta-enhanced.css`
  - `css/components/scanlines-filmgrain.css`
  - Multiple JavaScript files for animations

### 03. Capabilities Matrix (`03-capabilities-matrix.html`)

- **Purpose**: Interactive showcase of technical skills
- **Features**:
  - 6 capability blocks (Frontend, Backend, Mobile, Database, DevOps, Design)
  - Interactive demos for each technology
  - Technology badges
  - Hover effects and animations
- **Dependencies**:
  - `css/components/capabilities-matrix.css`
  - `js/components/capabilities-matrix.js`

### 04. Terminal Section (`04-terminal-section.html`)

- **Purpose**: Live coding interface with GitHub integration
- **Features**:
  - Terminal-style interface
  - GitHub commit feed
  - Live coding display with syntax highlighting
  - GitHub statistics and heatmap
  - File tree visualization
- **Dependencies**:
  - `css/components/terminal.css`
  - Prism.js for syntax highlighting
  - `js/components/terminal.js`

### 05. Design Showcase (`05-design-showcase.html`)

- **Purpose**: Design system components demonstration
- **Features**:
  - Typography examples (H1-H6, body, caption)
  - Button variants (primary, accent, secondary, ghost)
  - Card components (default, elevated, accent, glow)
  - Color palette swatches
- **Dependencies**:
  - `css/components/design-showcase.css`
  - `css/components/buttons.css`
  - `css/components/cards.css`
  - `css/components/typography.css`

### 06. Project Showcase (`06-project-showcase.html`)

- **Purpose**: Horizontal scrolling project cards
- **Features**:
  - Flip cards with front/back content
  - GitHub statistics integration
  - Project status indicators
  - Navigation dots and arrows
  - Technology badges
- **Dependencies**:
  - `css/components/cards.css`
  - `css/components/buttons.css`
  - Project thumbnail images

### 07. Technical Arsenal (`07-technical-arsenal.html`)

- **Purpose**: Skills visualization system
- **Features**:
  - Skill filter system
  - Hexagonal grid layout
  - Technology constellation
  - Certification badges
- **Dependencies**:
  - `css/components/technical-arsenal.css`
  - `js/components/technical-arsenal.js`

### 08. Testimonials Carousel (`08-testimonials-carousel.html`)

- **Purpose**: 3D testimonial carousel with client impact metrics
- **Features**:
  - 3D carousel animation
  - Client photos and information
  - Success metrics
  - Navigation controls
- **Dependencies**:
  - `css/components/testimonial-carousel.css`
  - `js/components/testimonial-carousel.js`
  - Client testimonial images

### 09. Footer (`09-footer.html`)

- **Purpose**: Complete footer with all sections
- **Features**:
  - Brand information and social links
  - Navigation menus
  - Contact information
  - Newsletter signup form
  - Legal links and copyright
- **Dependencies**:
  - `css/components/footer.css`
  - `css/components/buttons.css`

## 🎨 Design Consistency

Each section maintains the brutalist design aesthetic with:

- **Color Palette**: Black (#000000), White (#FFFFFF), Accent Yellow (#FFFF00)
- **Typography**: Space Mono (display), JetBrains Mono (code), Inter (body)
- **Design Principles**: Industrial strength, raw functionality, uncompromising aesthetics

## 🔧 Technical Features

### CSS Architecture

- CSS Custom Properties (CSS Variables) for consistent theming
- Component-based CSS organization
- Responsive design with mobile-first approach
- Accessibility-focused styling

### JavaScript Functionality

- Modular JavaScript components
- Performance-optimized animations
- Accessibility features (ARIA labels, keyboard navigation)
- Progressive enhancement

### Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Skip links for keyboard navigation
- Screen reader friendly
- Focus management
- Reduced motion support

## 📱 Responsive Design

All sections are fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Usage Instructions

### Viewing Individual Sections

1. Open any section file in a web browser
2. Ensure the CSS and JS dependencies are available in the correct relative paths
3. Each section includes demo content to showcase the component

### Integration into Projects

1. Copy the HTML structure from any section
2. Include the required CSS files
3. Add the necessary JavaScript files
4. Customize content and styling as needed

### Customization

- Modify CSS custom properties in the `:root` selector for theme changes
- Update content within the HTML structure
- Adjust JavaScript configurations for different behaviors

## 📋 Dependencies Summary

### Required CSS Files

- Component-specific CSS files (see individual sections)
- `css/utilities/animations.css` (for most sections)
- `css/utilities/responsive.css`
- `css/utilities/accessibility.css`

### Required JavaScript Files

- Component-specific JS files (see individual sections)
- External libraries (Prism.js for syntax highlighting)

### External Resources

- Google Fonts (Inter, Space Mono, JetBrains Mono)
- Prism.js CDN for syntax highlighting

## 🔄 Maintenance Notes

- Each section is designed to be self-contained
- CSS and JS paths are relative to the main portfolio structure
- Images paths may need adjustment based on deployment structure
- All sections follow the same design system for consistency

## 🎯 Performance Considerations

- Critical CSS is inlined in each section
- Non-critical CSS is loaded asynchronously where possible
- Images use modern formats (WebP) with fallbacks
- JavaScript is loaded after DOM content
- Animations respect `prefers-reduced-motion`
