# Enhanced Card Component System

## Overview

The enhanced Card component system provides a comprehensive set of components for creating visually engaging, brutalist-inspired cards with modern refinements. The system includes multiple hover effects, variants, and specialized components for different use cases.

## Features

### 🎨 Multiple Hover Effects

- **Lift**: Elevates the card with enhanced shadow
- **Glow**: Adds accent color glow effect
- **Invert**: Inverts background and text colors
- **Scale**: Subtle scaling with shadow enhancement

### 🎯 Card Variants

- **Default**: Standard black background with white border
- **Elevated**: Charcoal background with built-in shadow
- **Accent**: Yellow background for high-impact content
- **Outline**: Transparent background with border only
- **Interactive**: Cursor pointer with hover border change

### 📐 Size Options

- **sm**: 200px minimum height
- **md**: 280px minimum height (default)
- **lg**: 360px minimum height
- **xl**: 440px minimum height

### 🎭 Animation Variants

- **Subtle**: Light shadow transition
- **Smooth**: Enhanced shadow with ease-out timing
- **Bounce**: Subtle bounce animation on hover

## Components

### Core Components

#### Card

The main card container with all variant and hover options.

```tsx
<Card
  variant="default"
  size="md"
  hover="lift"
  animation="smooth"
  isLoading={false}
  hasImage={false}
>
  {/* Card content */}
</Card>
```

#### CardHeader

Header section with optional variants for layout.

```tsx
<CardHeader variant="default | centered | minimal">
  {/* Header content */}
</CardHeader>
```

#### CardTitle

Responsive heading component with level and variant options.

```tsx
<CardTitle level={3} variant="default | accent | minimal">
  Card Title
</CardTitle>
```

#### CardDescription

Description text with styling variants.

```tsx
<CardDescription variant="default | muted | accent">
  Card description text
</CardDescription>
```

#### CardContent

Main content area with spacing variants.

```tsx
<CardContent variant="default | padded | flush">
  {/* Main content */}
</CardContent>
```

#### CardFooter

Footer section with layout variants.

```tsx
<CardFooter variant="default | actions | minimal">
  {/* Footer content */}
</CardFooter>
```

### Enhanced Components

#### CardImage

Optimized image component with aspect ratio options.

```tsx
<CardImage
  src="/path/to/image.jpg"
  alt="Image description"
  aspectRatio="video | square | portrait | landscape"
  loading="lazy | eager"
/>
```

#### CardBadge

Small badge component for labels and status indicators.

```tsx
<CardBadge variant="default | accent | outline">FEATURED</CardBadge>
```

#### CardActions

Container for action buttons with layout options.

```tsx
<CardActions variant="horizontal | vertical | stacked">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</CardActions>
```

## Usage Examples

### Basic Card

```tsx
<Card hover="lift">
  <CardHeader>
    <CardTitle>Basic Card</CardTitle>
    <CardDescription>A simple card with lift hover effect</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Project Showcase Card

```tsx
<Card variant="default" hover="lift" hasImage>
  <CardImage
    src="/project-image.jpg"
    alt="Project showcase"
    aspectRatio="video"
  />
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardBadge variant="accent">FEATURED</CardBadge>
      <CardBadge variant="outline">WEB APP</CardBadge>
    </div>
    <CardTitle level={3}>Project Name</CardTitle>
    <CardDescription>Project description and key features</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span
          key={tech}
          className="bg-brutalist-charcoal-100 px-2 py-1 text-xs"
        >
          {tech}
        </span>
      ))}
    </div>
  </CardContent>
  <CardFooter variant="actions">
    <CardActions>
      <Button variant="ghost" size="sm">
        View Demo
      </Button>
      <Button variant="primary" size="sm">
        View Code
      </Button>
    </CardActions>
  </CardFooter>
</Card>
```

### Blog Post Card

```tsx
<Card variant="elevated" hover="glow">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardBadge>BLOG POST</CardBadge>
      <span className="text-brutalist-charcoal-200 text-xs">5 min read</span>
    </div>
    <CardTitle level={3}>Blog Post Title</CardTitle>
    <CardDescription>
      Brief description of the blog post content
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm">Blog post excerpt or summary...</p>
  </CardContent>
  <CardFooter variant="default">
    <div className="flex items-center gap-2">
      <div className="bg-brutalist-yellow h-8 w-8 rounded-full">
        <span className="text-xs font-bold text-black">JD</span>
      </div>
      <span className="text-sm">Author Name</span>
    </div>
    <Button variant="ghost" size="sm">
      Read More
    </Button>
  </CardFooter>
</Card>
```

### Loading State

```tsx
<Card isLoading />
```

## Design Principles

### Brutalist Aesthetics

- Bold, geometric shapes with sharp edges
- High contrast color combinations
- Prominent borders and shadows
- Industrial, honest design approach

### Modern Refinements

- Smooth animations and transitions
- Responsive design patterns
- Accessibility considerations
- Performance optimizations

### Visual Hierarchy

- Clear typography scale
- Strategic use of accent colors
- Consistent spacing system
- Proper content organization

## Accessibility Features

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader compatibility
- High contrast color combinations
- Focus indicators
- Reduced motion support

## Performance Considerations

- Optimized image loading with lazy loading
- CSS-only animations where possible
- Minimal JavaScript footprint
- Efficient re-rendering patterns
- Hardware acceleration for smooth animations

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Progressive enhancement for older browsers
- Graceful degradation of advanced features
- Mobile-first responsive design

## Best Practices

1. **Use hover effects sparingly** - Choose one primary hover effect per card
2. **Maintain visual hierarchy** - Use size and variant combinations thoughtfully
3. **Consider content length** - Choose appropriate card sizes for content
4. **Optimize images** - Always provide alt text and use appropriate aspect ratios
5. **Test accessibility** - Ensure keyboard navigation and screen reader compatibility
6. **Performance first** - Use loading states for dynamic content

## Migration Guide

### From Previous Card System

The enhanced card system is backward compatible with the previous implementation. However, to take advantage of new features:

1. Update import statements to include new components
2. Replace old hover classes with new hover prop
3. Use new variant options for better visual hierarchy
4. Implement loading states for dynamic content
5. Add CardImage components for better image handling

### Breaking Changes

- `hover` prop now uses predefined values instead of custom classes
- `padding` prop has new size options
- New required props for enhanced functionality

## Testing

The card system includes comprehensive testing through:

- Visual regression tests with Chromatic
- Unit tests for all component variants
- Accessibility testing with axe-core
- Performance testing with Lighthouse
- Cross-browser compatibility testing

## Future Enhancements

- Additional hover effects and animations
- More specialized card variants
- Enhanced accessibility features
- Performance optimizations
- Additional responsive breakpoints
