# BrutalButton Component

A sophisticated, theme-aware button component that embodies the brutalist design philosophy with complex layered animations and effects.

## Features

- **Dual Theme Support**: Seamlessly adapts between Extreme Brutalist and Refined Brutalist themes
- **Multiple Variants**: Primary, Secondary, and Ghost variants with distinct visual styles
- **Size Variations**: Small (sm), Medium (md), and Large (lg) sizes with proper scaling
- **Complex Animations**: Shimmer, glow, strike, glitch, and border rotation effects
- **Loading States**: Built-in loading spinner with proper accessibility
- **Full Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Responsive Design**: Mobile-optimized with touch-friendly interactions
- **Performance Optimized**: Hardware-accelerated animations with reduced motion support

## Usage

### Basic Usage

```tsx
import { BrutalButton } from "@/components/ui/BrutalButton";

function MyComponent() {
  return (
    <BrutalButton onClick={() => console.log("Clicked!")}>
      Click Me
    </BrutalButton>
  );
}
```

### Advanced Usage

```tsx
import { BrutalButton } from "@/components/ui/BrutalButton";

function AdvancedExample() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrutalButton
      variant="primary"
      size="lg"
      theme="extreme-brutalist"
      loading={loading}
      fullWidth
      onClick={handleSubmit}
    >
      {loading ? "Submitting..." : "Submit Form"}
    </BrutalButton>
  );
}
```

## Props

| Prop        | Type                                         | Default       | Description            |
| ----------- | -------------------------------------------- | ------------- | ---------------------- |
| `children`  | `React.ReactNode`                            | -             | Button content         |
| `variant`   | `'primary' \| 'secondary' \| 'ghost'`        | `'primary'`   | Visual variant         |
| `size`      | `'sm' \| 'md' \| 'lg'`                       | `'md'`        | Button size            |
| `theme`     | `'extreme-brutalist' \| 'refined-brutalist'` | Current theme | Override theme         |
| `loading`   | `boolean`                                    | `false`       | Show loading state     |
| `disabled`  | `boolean`                                    | `false`       | Disable button         |
| `fullWidth` | `boolean`                                    | `false`       | Full width button      |
| `className` | `string`                                     | `''`          | Additional CSS classes |
| `onClick`   | `(event: MouseEvent) => void`                | -             | Click handler          |

All standard HTML button attributes are also supported.

## Variants

### Primary

- Bold, attention-grabbing design
- Uses theme accent color as background
- High contrast text
- Most prominent shadow effects

### Secondary

- Subtle, supportive design
- Background color with text color border
- Medium emphasis
- Balanced visual weight

### Ghost

- Minimal, transparent design
- No background initially
- Transforms on hover
- Lowest visual weight

## Sizes

### Small (sm)

- Height: 2.5rem
- Padding: 0.5rem 1rem
- Font size: Small
- Compact for tight spaces

### Medium (md) - Default

- Height: 3rem
- Padding: 0.75rem 1.5rem
- Font size: Base
- Standard size for most use cases

### Large (lg)

- Height: 3.5rem
- Padding: 1rem 2rem
- Font size: Large
- Prominent for important actions

## Theme Behavior

### Extreme Brutalist Theme

- Sharp, geometric borders (8px solid)
- High contrast black/white/yellow colors
- Aggressive animations and glitch effects
- Space Mono typography
- Multiple layered shadows
- Uppercase text transformation

### Refined Brutalist Theme

- Softer geometric elements with rounded corners
- Professional color palette (cyan, purple accents)
- Smooth glow effects
- Inter typography
- Subtle shadows with blur
- Mixed case text

## Animation Effects

### Hover Effects

- **Transform**: Button moves up and left (-2px, -2px)
- **Shadow**: Shadow moves down and right (4px, 4px)
- **Shimmer**: Light sweep across button surface
- **Strike**: Horizontal line animation across button
- **Border**: Animated border with scale effect
- **Theme-specific**: Glitch (extreme) or Glow (refined)

### Loading State

- Animated spinner with theme-aware styling
- Text shifts right with reduced opacity
- Disabled interaction during loading
- Proper ARIA attributes for accessibility

### Focus State

- Visible outline with theme accent color
- Pulsing border animation
- Keyboard navigation support

## Accessibility Features

- **ARIA Labels**: Proper `aria-busy`, `aria-disabled` attributes
- **Screen Reader**: Hidden text for state announcements
- **Keyboard Navigation**: Full Tab, Enter, Space support
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Enhanced borders for better visibility

## Performance Considerations

- **Hardware Acceleration**: `transform: translateZ(0)` for smooth animations
- **Mobile Optimization**: Reduced effects on smaller screens
- **Reduced Motion**: Animations disabled when user prefers reduced motion
- **Efficient Rendering**: CSS-only animations where possible

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS Custom Properties (CSS Variables)
- CSS Transforms and Transitions
- Intersection Observer API (for advanced features)

## Customization

The component uses CSS custom properties for easy customization:

```css
.brutal-button {
  --button-bg: your-background-color;
  --button-text: your-text-color;
  --button-border: your-border-color;
  --button-shadow: your-shadow-value;
  --button-animation-duration: your-duration;
}
```

## Testing

The component includes comprehensive tests covering:

- Rendering with different props
- Theme switching
- User interactions
- Accessibility features
- Animation states
- Loading and disabled states

Run tests with:

```bash
npm test BrutalButton.test.tsx
```

## Examples

See `BrutalButtonDemo.tsx` for a comprehensive showcase of all features and use cases.

## Related Components

- `BrutalCard`: Theme-aware card component
- `BrutalInput`: Form input with brutalist styling
- `AnimatedText`: Text components with brutalist animations

## Contributing

When contributing to this component:

1. Maintain theme consistency
2. Ensure accessibility compliance
3. Test across different screen sizes
4. Verify animation performance
5. Update tests for new features
