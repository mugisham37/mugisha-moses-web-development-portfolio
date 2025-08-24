# Theme-Aware Component Utilities

This directory contains a comprehensive set of theme-aware component utilities for the brutalist portfolio project. These utilities provide powerful abstractions for creating components that seamlessly adapt to the dual-theme architecture.

## Overview

The theme utilities system provides:

- **Render Props Components**: For theme-dependent rendering
- **Higher-Order Components (HOCs)**: For automatic theme injection
- **Custom Hooks**: For accessing theme state and utilities
- **CSS-in-JS Utilities**: For dynamic styling based on theme

## Components

### ThemeRenderer

Render props component for theme-dependent rendering.

```tsx
import { ThemeRenderer } from "@/components/theme";

<ThemeRenderer>
  {(theme, config) => (
    <div style={{ backgroundColor: config.colors.bg }}>
      Current theme: {theme}
    </div>
  )}
</ThemeRenderer>;
```

### ConditionalThemeRenderer

Renders content only for specific themes.

```tsx
import { ConditionalThemeRenderer } from "@/components/theme";

<ConditionalThemeRenderer theme="extreme-brutalist">
  <div>Only visible in extreme theme</div>
</ConditionalThemeRenderer>;
```

### MultiThemeRenderer

Renders different content for each theme.

```tsx
import { MultiThemeRenderer } from "@/components/theme";

<MultiThemeRenderer
  extreme={<div>Extreme content</div>}
  refined={<div>Refined content</div>}
/>;
```

## Higher-Order Components

### withTheme

Injects complete theme context into components.

```tsx
import { withTheme, WithThemeProps } from "@/components/theme";

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps & WithThemeProps> = ({
  title,
  theme,
  themeConfig,
  isTransitioning,
}) => (
  <div>
    <h1>{title}</h1>
    <p>Theme: {theme}</p>
    <p>Transitioning: {isTransitioning ? "Yes" : "No"}</p>
  </div>
);

export default withTheme(MyComponent);
```

### withCurrentTheme

Injects only the current theme.

```tsx
import { withCurrentTheme } from "@/components/theme";

const SimpleComponent: React.FC<{ currentTheme: string }> = ({
  currentTheme,
}) => <div>Current theme: {currentTheme}</div>;

export default withCurrentTheme(SimpleComponent);
```

### withThemeStyles

Automatically applies theme-aware styles.

```tsx
import { withThemeStyles } from "@/components/theme";

const StyledComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div>{children}</div>;

export default withThemeStyles(StyledComponent, (theme, config) => ({
  backgroundColor: config.colors.bg,
  color: config.colors.text,
  border: `2px solid ${config.colors.accent}`,
}));
```

## Custom Hooks

### useTheme

Main hook for accessing theme context.

```tsx
import { useTheme } from "@/components/theme";

const MyComponent = () => {
  const { currentTheme, setTheme, config, isTransitioning } = useTheme();

  return (
    <div>
      <p>Current theme: {currentTheme}</p>
      <button onClick={() => setTheme("refined-brutalist")}>
        Switch to Refined
      </button>
    </div>
  );
};
```

### useThemeVariables

Get CSS custom properties for the current theme.

```tsx
import { useThemeVariables } from "@/components/theme";

const MyComponent = () => {
  const themeVars = useThemeVariables();

  return (
    <div style={themeVars}>
      <p>This uses theme CSS variables</p>
    </div>
  );
};
```

### useThemeClassName

Generate theme-aware class names.

```tsx
import { useThemeClassName } from "@/components/theme";

const MyComponent = () => {
  const className = useThemeClassName("my-component", {
    "extreme-brutalist": "my-component--extreme",
    "refined-brutalist": "my-component--refined",
  });

  return <div className={className}>Themed component</div>;
};
```

### useThemeStyles

Generate theme-aware inline styles.

```tsx
import { useThemeStyles } from "@/components/theme";

const MyComponent = () => {
  const styles = useThemeStyles(
    { padding: "16px" },
    {
      "extreme-brutalist": { backgroundColor: "#ffff00", color: "#000" },
      "refined-brutalist": { backgroundColor: "#f8fafc", color: "#1e293b" },
    }
  );

  return <div style={styles}>Themed styles</div>;
};
```

### useThemeCondition

Check theme conditions.

```tsx
import { useThemeCondition } from "@/components/theme";

const MyComponent = () => {
  const { isActive, isExtreme, isRefined } =
    useThemeCondition("extreme-brutalist");

  return (
    <div>
      <p>Is extreme theme active: {isActive ? "Yes" : "No"}</p>
      <p>Is any extreme theme: {isExtreme ? "Yes" : "No"}</p>
      <p>Is any refined theme: {isRefined ? "Yes" : "No"}</p>
    </div>
  );
};
```

### useThemeAnimation

Get theme-aware animation properties.

```tsx
import { useThemeAnimation } from "@/components/theme";

const MyComponent = () => {
  const pulseAnimation = useThemeAnimation("pulse");

  return <div style={pulseAnimation}>Animated element</div>;
};
```

### useThemeTransitionUtils

Utilities for theme transitions.

```tsx
import { useThemeTransitionUtils } from "@/components/theme";

const MyComponent = () => {
  const { toggleTheme, isTransitioning, getTransitionStyle } =
    useThemeTransitionUtils();

  const opacity = getTransitionStyle(0.5, 1.0);

  return (
    <div style={{ opacity }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>Transitioning: {isTransitioning ? "Yes" : "No"}</p>
    </div>
  );
};
```

### useThemeResponsive

Responsive utilities with theme awareness.

```tsx
import { useThemeResponsive } from "@/components/theme";

const MyComponent = () => {
  const { getResponsiveValue, mediaQueries } = useThemeResponsive();

  const fontSize = getResponsiveValue({
    mobile: "14px",
    tablet: "16px",
    desktop: "18px",
    extreme: "20px",
    refined: "16px",
  });

  return <div style={{ fontSize }}>Responsive text</div>;
};
```

## CSS-in-JS Utilities

### ThemeCSSUtils

Class for generating theme-aware styles.

```tsx
import { createThemeCSSUtils } from "@/components/theme";

const MyComponent = () => {
  const { currentTheme, config } = useTheme();
  const cssUtils = createThemeCSSUtils(currentTheme, config);

  const buttonStyles = cssUtils.getBrutalButtonStyles("primary");
  const cardStyles = cssUtils.getBrutalCardStyles();

  return (
    <div style={cardStyles}>
      <button style={buttonStyles}>Themed Button</button>
    </div>
  );
};
```

### themeUtils

Utility functions for common theme operations.

```tsx
import { themeUtils } from "@/components/theme";

const className = themeUtils.getThemeClassName(
  "my-component",
  "extreme-brutalist"
);
const interpolated = themeUtils.interpolateThemeValue(0, 100, 0.5); // 50
const cssVars = themeUtils.generateCSSVariables(config);
```

## Best Practices

### 1. Use Appropriate Abstractions

- Use `ThemeRenderer` for complex theme-dependent logic
- Use `useThemeClassName` for simple class name generation
- Use `withTheme` for components that need full theme context

### 2. Performance Considerations

- Theme utilities use `useMemo` and `useCallback` for optimization
- Avoid creating new objects in render functions
- Use CSS custom properties when possible

### 3. Type Safety

- All utilities are fully typed with TypeScript
- Use the provided type interfaces for better development experience
- Extend types as needed for custom implementations

### 4. Accessibility

- Ensure theme transitions don't break accessibility
- Test with screen readers and keyboard navigation
- Provide reduced motion alternatives when needed

## Examples

See `ThemeUtilsDemo.tsx` for comprehensive examples of all utilities in action.

## Testing

The theme utilities include comprehensive test coverage. Run tests with:

```bash
npm test -- --testPathPattern=theme
```

## Contributing

When adding new theme utilities:

1. Follow the existing patterns and naming conventions
2. Add comprehensive TypeScript types
3. Include performance optimizations (memoization)
4. Add tests and documentation
5. Update this README with examples
