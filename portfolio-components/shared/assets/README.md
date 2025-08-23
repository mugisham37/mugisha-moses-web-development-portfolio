# Shared Assets

This directory contains all shared assets used across portfolio components.

## Directory Structure

```
shared/assets/
├── images/           # Image assets
├── fonts/            # Font files (for local fonts)
├── icons/            # Icon assets
├── manifest.js       # Asset path management
├── fonts.css         # Font loading and definitions
└── README.md         # This file
```

## Usage

### Images

Images are stored in the `images/` directory and can be accessed using the asset manifest:

```javascript
import { getImagePath, IMAGES } from "./shared/assets/manifest.js";

// Get hero portrait path
const portraitPath = getImagePath(IMAGES.heroPortrait.jpg);
```

### Fonts

Fonts are currently loaded from Google Fonts via CDN. The `fonts.css` file contains:

- Google Fonts imports
- Font face declarations (for future local fonts)
- Font loading optimization classes

```css
/* Import in your component CSS */
@import url("./shared/assets/fonts.css");
```

### Asset Manifest

The `manifest.js` file provides:

- Centralized asset path management
- Helper functions for asset loading
- Asset existence checking
- Responsive image handling

```javascript
import AssetManifest from "./shared/assets/manifest.js";

// Preload critical images
AssetManifest.preloadImages(["hero-portrait.jpg"]);

// Load Google Fonts
AssetManifest.loadGoogleFonts(["spaceMono", "jetBrainsMono"]);
```

## Path Updates

When using assets in components, use relative paths from the component location:

```html
<!-- From a component in portfolio-components/hero/ -->
<img src="../shared/assets/images/hero-portrait.jpg" alt="Portrait" />
```

```css
/* From a component CSS file */
background-image: url("../shared/assets/images/hero-portrait.jpg");
```

## Adding New Assets

1. Add the asset file to the appropriate directory
2. Update the manifest.js file with the new asset reference
3. Update this README if needed

## Performance Considerations

- Critical images should be preloaded using the manifest functions
- Fonts use `font-display: swap` for better loading performance
- Consider using responsive images for different screen sizes
- Optimize images before adding them to the assets directory

## Future Enhancements

- Local font files for better performance
- Icon sprite system
- Automated asset optimization
- WebP/AVIF format support
- Asset versioning for cache busting
