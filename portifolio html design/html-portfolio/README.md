# Brutalist Developer Portfolio - HTML/CSS Version

A lightweight, static HTML/CSS conversion of a Next.js brutalist developer portfolio, maintaining pixel-perfect design fidelity while optimizing for performance.

## Project Structure

```
html-portfolio/
├── index.html                 # Homepage
├── projects.html             # Projects page (to be created)
├── blog.html                 # Blog page (to be created)
├── contact.html              # Contact page (to be created)
├── css/
│   ├── main.css             # Core styles and design system variables
│   ├── components/          # Component-specific styles
│   │   ├── header.css       # Header and navigation
│   │   ├── footer.css       # Footer styles
│   │   ├── hero.css         # Hero section
│   │   ├── cards.css        # Card components
│   │   ├── buttons.css      # Button variants
│   │   ├── typography.css   # Extended typography
│   │   └── forms.css        # Form elements
│   ├── pages/               # Page-specific styles
│   │   ├── home.css         # Homepage specific
│   │   ├── projects.css     # Projects page
│   │   ├── blog.css         # Blog page
│   │   └── contact.css      # Contact page
│   └── utilities/           # Utility styles
│       ├── animations.css   # CSS animations
│       ├── responsive.css   # Media queries
│       └── accessibility.css # A11y styles
├── js/
│   ├── main.js              # Core functionality (< 2KB target)
│   └── mobile-menu.js       # Mobile navigation (< 1KB target)
├── images/
│   ├── project-thumbnails/  # Project images
│   └── icons/               # Icon files
└── fonts/                   # Local font files (if needed)
```

## Design System

### Colors

- **Primary Black**: #000000
- **Primary White**: #ffffff
- **Accent Yellow**: #ffff00
- **Charcoal**: #1a1a1a, #2a2a2a
- **Off-White**: #f8f8f8, #f0f0f0

### Typography

- **Headings**: Space Mono (Bold, Uppercase)
- **Body**: Inter (Regular)
- **Responsive scaling**: Using clamp() functions

### Spacing

- **Base unit**: 4px
- **Border width**: 4px
- **Shadow offset**: 4px, 8px

## Implementation Status

✅ **Task 1**: Project structure and core CSS foundation

- [x] Directory structure created
- [x] CSS custom properties implemented
- [x] Base typography and spacing utilities
- [x] Responsive breakpoints defined

🔄 **Remaining Tasks**: See tasks.md for complete implementation plan

## Development Notes

- Mobile-first responsive design approach
- CSS custom properties for consistent theming
- Semantic HTML5 structure with accessibility considerations
- Progressive enhancement with minimal JavaScript
- Target: < 2MB total file size including assets
- Target: < 5KB total JavaScript

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Targets

- Page load: < 3 seconds on 3G
- CSS: < 100KB minified
- JavaScript: < 5KB total
- Images: Optimized WebP with JPEG fallbacks
