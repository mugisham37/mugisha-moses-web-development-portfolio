# BrutalCard Component

A theme-aware card component with layered effects, designed for the brutalist portfolio theme system.

## Features

- **Theme-aware styling** - Automatically adapts between extreme-brutalist and refined-brutalist themes
- **Multiple variants** - default, elevated, flat, outlined
- **Size variations** - sm, md, lg, xl
- **Interactive hover effects** - Complex layered animations with elevation and border effects
- **Geometric clip-path styling** - corner, diagonal, hexagon, arrow shapes for brutalist aesthetic
- **Responsive behavior** - Optimized for mobile, tablet, and desktop
- **Accessibility features** - Keyboard navigation, ARIA labels, semantic HTML support

## Usage

### Basic Usage

```tsx
import { BrutalCard } from "@/components/ui/BrutalCard";

function MyComponent() {
  return (
    <BrutalCard>
      <h3>Card Title</h3>
      <p>Card content goes here.</p>
    </BrutalCard>
  );
}
```

### Interactive Card

```tsx
<BrutalCard interactive onClick={() => console.log("Card clicked!")}>
  <h3>Clickable Card</h3>
  <p>This card responds to clicks and keyboard interactions.</p>
</BrutalCard>
```

### Variants

```tsx
{
  /* Default card with brutal shadow */
}
<BrutalCard variant="default">Default Card</BrutalCard>;

{
  /* Pre-elevated with enhanced shadows */
}
<BrutalCard variant="elevated">Elevated Card</BrutalCard>;

{
  /* Minimal styling, shadows on hover */
}
<BrutalCard variant="flat">Flat Card</BrutalCard>;

{
  /* Transparent background with border */
}
<BrutalCard variant="outlined">Outlined Card</BrutalCard>;
```

### Sizes

```tsx
<BrutalCard size="sm">Small Card</BrutalCard>
<BrutalCard size="md">Medium Card</BrutalCard>
<BrutalCard size="lg">Large Card</BrutalCard>
<BrutalCard size="xl">Extra Large Card</BrutalCard>
```

### Geometric Shapes

```tsx
<BrutalCard clipPath="corner">Corner Cut</BrutalCard>
<BrutalCard clipPath="diagonal">Diagonal Edges</BrutalCard>
<BrutalCard clipPath="hexagon">Hexagonal Shape</BrutalCard>
<BrutalCard clipPath="arrow">Arrow Shape</BrutalCard>
```

### Padding Control

```tsx
<BrutalCard padding="none">No Padding</BrutalCard>
<BrutalCard padding="sm">Small Padding</BrutalCard>
<BrutalCard padding="md">Medium Padding</BrutalCard>
<BrutalCard padding="lg">Large Padding</BrutalCard>
<BrutalCard padding="xl">Extra Large Padding</BrutalCard>
```

### Complex Example

```tsx
<BrutalCard
  variant="elevated"
  size="lg"
  clipPath="corner"
  interactive
  padding="lg"
  onClick={() => handleCardClick()}
  className="bg-accent text-bg"
>
  <h3>Featured Project</h3>
  <p>Complex card with multiple features combined.</p>
</BrutalCard>
```

### Semantic HTML

```tsx
{
  /* Render as article element */
}
<BrutalCard as="article" role="article">
  <h3>Article Card</h3>
  <p>This renders as an article element for better semantics.</p>
</BrutalCard>;

{
  /* Render as section element */
}
<BrutalCard as="section" role="region" aria-labelledby="section-title">
  <h3 id="section-title">Section Card</h3>
  <p>This renders as a section element.</p>
</BrutalCard>;
```

## Props

| Prop          | Type                                                       | Default     | Description                       |
| ------------- | ---------------------------------------------------------- | ----------- | --------------------------------- |
| `children`    | `React.ReactNode`                                          | -           | Card content                      |
| `variant`     | `"default" \| "elevated" \| "flat" \| "outlined"`          | `"default"` | Visual variant                    |
| `size`        | `"sm" \| "md" \| "lg" \| "xl"`                             | `"md"`      | Card size                         |
| `theme`       | `ThemeType`                                                | -           | Override current theme            |
| `interactive` | `boolean`                                                  | `false`     | Enable hover/click interactions   |
| `clipPath`    | `"none" \| "corner" \| "diagonal" \| "hexagon" \| "arrow"` | `"none"`    | Geometric shape                   |
| `padding`     | `"none" \| "sm" \| "md" \| "lg" \| "xl"`                   | `"md"`      | Internal padding                  |
| `className`   | `string`                                                   | `""`        | Additional CSS classes            |
| `as`          | `keyof JSX.IntrinsicElements`                              | `"div"`     | HTML element to render            |
| `onClick`     | `(event: MouseEvent) => void`                              | -           | Click handler                     |
| `onKeyDown`   | `(event: KeyboardEvent) => void`                           | -           | Keyboard handler                  |
| `tabIndex`    | `number`                                                   | -           | Tab index for keyboard navigation |
| `role`        | `string`                                                   | -           | ARIA role                         |

## Theme Integration

The BrutalCard automatically adapts to the current theme:

### Extreme Brutalist Theme

- Sharp geometric borders (8px solid)
- High contrast black/white/yellow colors
- Aggressive shadow effects
- Glitch animations on hover
- Scan line effects
- Space Mono typography

### Refined Brutalist Theme

- Softer geometric elements with rounded corners
- Professional color palette (cyan, purple accents)
- Subtle shadow effects with blur
- Smooth glow animations
- Inter typography

## Accessibility

The BrutalCard component includes comprehensive accessibility features:

- **Keyboard Navigation**: Interactive cards can be activated with Enter or Space keys
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Focus Management**: Clear focus indicators and focus trapping
- **Semantic HTML**: Support for semantic elements (article, section, etc.)
- **Reduced Motion**: Respects `prefers-reduced-motion` settings
- **High Contrast**: Adapts to `prefers-contrast: high` settings

## Performance

- **Hardware Acceleration**: Uses `transform3d` for smooth animations
- **Mobile Optimization**: Simplified animations on mobile devices
- **Reduced Motion**: Disables animations when requested
- **Efficient Rendering**: Minimal reflows and repaints

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS Custom Properties support required
- Clip-path support for geometric shapes (graceful degradation)

## Examples

See `BrutalCardDemo.tsx` for comprehensive examples of all features and use cases.
