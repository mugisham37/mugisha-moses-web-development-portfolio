# Optional Polyfills

This document describes the optional polyfill dependencies that enhance browser compatibility.

## Overview

The polyfills system is designed to work without these packages installed. If they're available, they'll be loaded automatically. If not, the system will gracefully fall back to native implementations or display helpful warnings.

## Optional Dependencies

### intersection-observer
**Purpose**: Polyfill for the IntersectionObserver API  
**Usage**: Enables lazy loading and scroll-triggered animations in older browsers  
**Installation**: `npm install intersection-observer`  
**Fallback**: Manual scroll event detection

### @juggle/resize-observer
**Purpose**: Polyfill for the ResizeObserver API  
**Usage**: Component resize detection in older browsers  
**Installation**: `npm install @juggle/resize-observer`  
**Fallback**: Window resize events

### web-animations-js
**Purpose**: Polyfill for the Web Animations API  
**Usage**: Advanced CSS animations in older browsers  
**Installation**: `npm install web-animations-js`  
**Fallback**: CSS transitions and keyframes

### css-vars-ponyfill
**Purpose**: CSS Custom Properties support for IE  
**Usage**: Design token system compatibility  
**Installation**: `npm install css-vars-ponyfill`  
**Fallback**: Static CSS values

## Installation

To install all optional polyfills:

```bash
npm install intersection-observer @juggle/resize-observer web-animations-js css-vars-ponyfill
```

Or install them individually as needed based on your browser support requirements.

## Browser Support

- **Modern browsers**: No polyfills needed
- **IE 11**: All polyfills recommended
- **Safari < 12**: IntersectionObserver and ResizeObserver recommended
- **Firefox < 55**: Web Animations API recommended

## Configuration

The polyfills are automatically detected and loaded. No manual configuration is required.

## Performance

- Polyfills are loaded asynchronously
- Only missing APIs are polyfilled
- Graceful degradation if polyfills fail to load
- No impact on modern browsers
