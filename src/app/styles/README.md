# Brutalist Portfolio CSS Architecture

This document outlines the comprehensive CSS architecture implemented for the brutalist portfolio project.

## Architecture Overview

The CSS architecture is built around a dual-theme system that seamlessly transitions between **Extreme Brutalist** and **Refined Brutalist** themes based on scroll position and user interaction.

## File Structure

```
src/app/styles/
├── themes/
│   └── theme-variables.css      # Complete theme system with CSS custom properties
├── animations/
│   ├── brutalist-keyframes.css  # Core animation keyframes library
│   ├── hover-effects.css        # Interactive hover effects
│   └── loading-animations.css   # Loading states and spinners
├── components/
│   ├── navigation.css           # Navigation component styles
│   └── example.module.css       # CSS Modules example
└── README.md                    # This documentation
```

## Theme System

### Extreme Brutalist Theme

- **Colors**: Black/white/yellow high contrast
- **Typography**: Space Mono, JetBrains Mono
- **Borders**: 8px solid borders, no border radius
- **Shadows**: Layered brutal shadows with multiple colors
- **Animations**: Aggressive, bouncy easing functions

### Refined Brutalist Theme

- **Colors**: Soft grays with purple/cyan accents
- **Typography**: Inter with JetBrains Mono for code
- **Borders**: 2px borders with 8px border radius
- **Shadows**: Subtle elevation shadows
- **Animations**: Smooth, elegant transitions

## CSS Custom Properties

The system uses CSS custom properties for dynamic theming:

```css
/* Current theme variables - updated dynamically */
--current-bg: var(--extreme-bg);
--current-text: var(--extreme-text);
--current-accent: var(--extreme-accent);
/* ... and many more */
```

## Theme Switching

Themes are switched using CSS classes:

- `.theme-extreme` - Activates extreme brutalist theme
- `.theme-refined` - Activates refined brutalist theme

## Animation Library

### Core Animations

- `brutalGlitch` - Glitch effect with color shifting
- `brutalPulse` - Pulsing opacity animation
- `brutalShake` - Shake effect for interactions
- `typewriter` - Typewriter text effect
- `scanLine` - Terminal-style scan line effect

### Hover Effects

- Button shimmer effects
- Card elevation and tilt
- Text glow and strike-through
- Image scan effects
- Border rotation animations

### Loading Animations

- Brutal spinners (circular and square)
- Progress bars with stripes
- Skeleton loaders
- Typing indicators
- Wave animations

## Utility Classes

### Typography

- `.text-xs` to `.text-9xl` - Font size utilities
- `.font-primary`, `.font-code` - Font family utilities

### Colors

- `.bg-current`, `.bg-accent` - Background utilities
- `.text-current`, `.text-accent` - Text color utilities
- `.border-current`, `.border-accent` - Border color utilities

### Layout

- `.container` - Max-width container with padding
- `.flex-center`, `.flex-between` - Flexbox utilities
- `.section-spacing` - Consistent section spacing

### Animations

- `.animate-brutal-glitch` - Apply glitch animation
- `.animate-brutal-pulse` - Apply pulse animation
- `.animate-fade-in-up` - Fade in from bottom
- `.animate-slide-in-left` - Slide in from left

## CSS Modules Support

CSS Modules are configured for component-scoped styles:

```css
/* example.module.css */
.container {
  background: var(--current-bg);
  /* Component-specific styles */
}

/* Global theme overrides */
:global(.theme-extreme) .container {
  /* Theme-specific overrides */
}
```

## Responsive Design

The system includes comprehensive responsive breakpoints:

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: < 480px

Mobile optimizations include:

- Reduced border widths
- Simplified shadows
- Performance-optimized animations
- Touch-friendly interactions

## Accessibility

### Reduced Motion

Respects `prefers-reduced-motion` preference by disabling animations.

### High Contrast

Supports `prefers-contrast: high` with increased border widths.

### Focus Management

Consistent focus styles using `--current-accent` color.

### Screen Reader Support

Semantic HTML structure with proper ARIA labels.

## Performance Optimizations

- CSS custom properties for efficient theme switching
- Optimized animations using `transform` and `opacity`
- Reduced animations on mobile devices
- PostCSS optimization in production builds
- CSS Modules for component isolation

## Usage Examples

### Basic Theme-Aware Component

```css
.my-component {
  background: var(--current-bg);
  color: var(--current-text);
  border: var(--current-border-width) var(--current-border-style)
    var(--current-border);
  transition: all var(--current-animation-duration)
    var(--current-animation-easing);
}
```

### Hover Effect

```css
.my-button {
  @extend .brutal-button-hover;
  /* Additional styles */
}
```

### Animation

```css
.my-element {
  animation: brutalGlitch var(--current-animation-duration)
    var(--current-animation-easing);
}
```

## Build Configuration

The system is integrated with:

- **Next.js 14** - App Router and CSS optimization
- **Tailwind CSS** - Utility classes and design system
- **PostCSS** - CSS processing and optimization
- **CSS Modules** - Component-scoped styling

## Future Enhancements

- Additional theme variants
- More animation presets
- Enhanced mobile interactions
- Dark mode support
- Custom property fallbacks for older browsers

This architecture provides a solid foundation for building the brutalist portfolio with consistent theming, smooth animations, and excellent performance across all devices.
