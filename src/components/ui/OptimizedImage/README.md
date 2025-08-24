# OptimizedImage Component

A comprehensive image optimization component for Next.js applications with advanced performance monitoring, lazy loading, and brutalist design effects.

## Features

- **Next.js Image Optimization**: Full integration with Next.js Image component
- **Lazy Loading**: Intersection Observer-based lazy loading with configurable thresholds
- **Performance Monitoring**: Real-time performance tracking and reporting
- **Image Preloading**: Smart preloading for critical images
- **Error Handling**: Automatic retry with exponential backoff
- **Responsive Images**: Automatic responsive image generation
- **Brutalist Effects**: Theme-aware visual effects and animations
- **Accessibility**: Full WCAG compliance with proper ARIA labels
- **TypeScript**: Complete type safety

## Basic Usage

```tsx
import { OptimizedImage } from '@/components/ui';

// Basic usage
<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={800}
/>

// With configuration preset
<OptimizedImage
  src="/card-image.jpg"
  alt="Card image"
  width={400}
  height={300}
  configName="card"
  lazy={true}
  brutalistEffects={true}
/>
```

## Props

### Required Props

| Prop  | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| `src` | `string` | Image source URL                   |
| `alt` | `string` | Alternative text for accessibility |

### Optional Props

| Prop               | Type                                                      | Default                                                      | Description                                          |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| `width`            | `number`                                                  | -                                                            | Image width in pixels                                |
| `height`           | `number`                                                  | -                                                            | Image height in pixels                               |
| `priority`         | `boolean`                                                 | `false`                                                      | Load image with high priority                        |
| `theme`            | `ThemeType`                                               | -                                                            | Override theme (extreme-brutalist/refined-brutalist) |
| `className`        | `string`                                                  | `''`                                                         | Additional CSS classes                               |
| `sizes`            | `string`                                                  | `'(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'` | Responsive sizes attribute                           |
| `quality`          | `number`                                                  | `85`                                                         | Image quality (1-100)                                |
| `placeholder`      | `'blur' \| 'empty'`                                       | `'blur'`                                                     | Placeholder type                                     |
| `blurDataURL`      | `string`                                                  | -                                                            | Custom blur placeholder data URL                     |
| `fill`             | `boolean`                                                 | `false`                                                      | Fill parent container                                |
| `lazy`             | `boolean`                                                 | `true`                                                       | Enable lazy loading                                  |
| `responsive`       | `boolean`                                                 | `true`                                                       | Enable responsive images                             |
| `brutalistEffects` | `boolean`                                                 | `true`                                                       | Enable brutalist visual effects                      |
| `configName`       | `'hero' \| 'card' \| 'thumbnail' \| 'portrait' \| 'logo'` | -                                                            | Predefined configuration preset                      |
| `preload`          | `boolean`                                                 | `false`                                                      | Preload image                                        |
| `retryOnError`     | `boolean`                                                 | `true`                                                       | Retry on load error                                  |
| `maxRetries`       | `number`                                                  | `3`                                                          | Maximum retry attempts                               |

## Configuration Presets

### Hero Images

```tsx
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  configName="hero"
  priority={true}
/>
```

### Card Images

```tsx
<OptimizedImage
  src="/card.jpg"
  alt="Card"
  width={400}
  height={300}
  configName="card"
  lazy={true}
/>
```

### Thumbnails

```tsx
<OptimizedImage
  src="/thumb.jpg"
  alt="Thumbnail"
  width={200}
  height={150}
  configName="thumbnail"
  lazy={true}
/>
```

### Portraits

```tsx
<OptimizedImage
  src="/portrait.jpg"
  alt="Portrait"
  width={600}
  height={800}
  configName="portrait"
  lazy={true}
/>
```

### Logos

```tsx
<OptimizedImage
  src="/logo.svg"
  alt="Logo"
  width={300}
  height={150}
  configName="logo"
  priority={true}
/>
```

## Advanced Usage

### With Performance Monitoring

```tsx
import { useImagePerformanceMonitor } from "@/utils/imagePerformanceMonitor";

const MyComponent = () => {
  const performanceMonitor = useImagePerformanceMonitor();

  const handleShowReport = () => {
    const report = performanceMonitor.getReport();
    console.log("Performance Report:", report);
  };

  return (
    <div>
      <OptimizedImage
        src="/image.jpg"
        alt="Monitored image"
        width={800}
        height={600}
        configName="card"
      />
      <button onClick={handleShowReport}>Show Performance Report</button>
    </div>
  );
};
```

### With Custom Hook

```tsx
import { useImageOptimization } from "@/hooks/useImageOptimization";

const MyComponent = () => {
  const imageOptimization = useImageOptimization({
    src: "/image.jpg",
    width: 800,
    height: 600,
    preset: "card",
    isAboveTheFold: false,
    enablePerformanceMonitoring: true,
    enablePreloading: false,
    enableLazyLoading: true,
  });

  return (
    <div>
      <p>Load Time: {imageOptimization.loadTime}ms</p>
      <p>Cache Hit: {imageOptimization.cacheHit ? "Yes" : "No"}</p>
      <p>
        Performance Budget Met:{" "}
        {imageOptimization.performanceReport.meetsPerformanceBudget
          ? "Yes"
          : "No"}
      </p>

      <OptimizedImage
        src="/image.jpg"
        alt="Optimized image"
        width={800}
        height={600}
        configName="card"
      />
    </div>
  );
};
```

### Fill Container

```tsx
<div style={{ position: "relative", width: "100%", height: "400px" }}>
  <OptimizedImage
    src="/background.jpg"
    alt="Background"
    fill={true}
    configName="card"
    brutalistEffects={true}
  />
</div>
```

### Error Handling

```tsx
<OptimizedImage
  src="/might-not-exist.jpg"
  alt="Image with error handling"
  width={400}
  height={300}
  retryOnError={true}
  maxRetries={2}
  onError={() => console.log("Image failed to load")}
  onLoad={() => console.log("Image loaded successfully")}
/>
```

## Performance Features

### Lazy Loading

- Intersection Observer-based
- Configurable threshold and root margin
- Automatic preloading for critical images

### Image Preloading

```tsx
import { preloadImage, preloadImages } from "@/utils/imagePreloader";

// Preload single image
await preloadImage("/critical-image.jpg", { priority: true });

// Preload multiple images
await preloadImages([
  { src: "/image1.jpg", options: { priority: true } },
  { src: "/image2.jpg", options: { priority: false } },
]);
```

### Performance Monitoring

```tsx
import {
  getImagePerformanceReport,
  exportImageMetrics,
} from "@/utils/imagePerformanceMonitor";

// Get performance report
const report = getImagePerformanceReport();
console.log(`Average load time: ${report.averageLoadTime}ms`);
console.log(`Cache hit rate: ${report.cacheHitRate * 100}%`);

// Export metrics
const metrics = exportImageMetrics();
// Save or analyze metrics
```

## Brutalist Theme Effects

The component includes theme-aware brutalist visual effects:

### Extreme Brutalist Theme

- Hard geometric borders (8px solid)
- High contrast colors (black/white/yellow)
- Aggressive animations and glitch effects
- Terminal-inspired loading states

### Refined Brutalist Theme

- Softer geometric elements (2px borders, 8px radius)
- Professional color palette (cyan/purple accents)
- Smooth animations and subtle effects
- Business-appropriate styling

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preferences
- High contrast mode support

## Browser Support

- Modern browsers with Intersection Observer support
- Fallback for older browsers
- Progressive enhancement
- Responsive design

## Performance Budgets

Each preset has performance budgets:

| Preset    | Max File Size | Max Load Time | Max Dimensions |
| --------- | ------------- | ------------- | -------------- |
| Hero      | 500KB         | 1.5s          | 1920x1080      |
| Card      | 200KB         | 1s            | 800x600        |
| Thumbnail | 50KB          | 0.5s          | 400x300        |
| Portrait  | 300KB         | 1.2s          | 600x800        |
| Logo      | 20KB          | 0.3s          | 300x150        |

## Testing

Use the `ImageOptimizationTest` component to test all features:

```tsx
import { ImageOptimizationTest } from "@/components/test";

<ImageOptimizationTest />;
```

## Configuration

Global configuration is available in `/src/config/imageOptimization.ts`:

```tsx
import {
  imagePresets,
  performanceBudgets,
  lazyLoadingConfig,
} from "@/config/imageOptimization";
```

## Best Practices

1. **Use appropriate presets** for different image types
2. **Set priority={true}** for above-the-fold images
3. **Enable lazy loading** for below-the-fold images
4. **Monitor performance** in production
5. **Use modern formats** (WebP, AVIF) when possible
6. **Optimize image sizes** for actual display dimensions
7. **Implement proper error handling** for unreliable sources

## Examples

See `/src/components/examples/ImageOptimizationExample.tsx` for comprehensive usage examples.
