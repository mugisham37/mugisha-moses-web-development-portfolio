/**
 * Design Token Documentation Generator
 * Generate comprehensive documentation for the design token system
 */

import { designTokens } from "./design-tokens";
import type { DesignTokens } from "@/types/design-tokens";

/**
 * Generate markdown documentation for design tokens
 */
export function generateTokenDocumentation(
  tokens: DesignTokens = designTokens
): string {
  const docs: string[] = [];

  docs.push("# Design Token System Documentation");
  docs.push("");
  docs.push(
    "This document provides comprehensive documentation for the brutalist portfolio design token system."
  );
  docs.push("");

  // Table of Contents
  docs.push("## Table of Contents");
  docs.push("");
  docs.push("- [Colors](#colors)");
  docs.push("- [Typography](#typography)");
  docs.push("- [Spacing](#spacing)");
  docs.push("- [Shadows](#shadows)");
  docs.push("- [Animations](#animations)");
  docs.push("- [Borders](#borders)");
  docs.push("- [Breakpoints](#breakpoints)");
  docs.push("- [Z-Index](#z-index)");
  docs.push("- [Usage Examples](#usage-examples)");
  docs.push("");

  // Colors Section
  docs.push("## Colors");
  docs.push("");
  docs.push(
    "The color system is built around a brutalist aesthetic with high contrast and bold choices."
  );
  docs.push("");

  // Primary Colors
  docs.push("### Primary Colors");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  docs.push(
    `| \`primary.black\` | \`${tokens.colors.primary.black}\` | \`var(--color-primary-black)\` | Main background, text |`
  );
  docs.push(
    `| \`primary.white\` | \`${tokens.colors.primary.white}\` | \`var(--color-primary-white)\` | Contrast text, borders |`
  );

  Object.entries(tokens.colors.primary.gray).forEach(([key, value]) => {
    docs.push(
      `| \`primary.gray.${key}\` | \`${value}\` | \`var(--color-primary-gray-${key})\` | Neutral tones |`
    );
  });
  docs.push("");

  // Accent Colors
  docs.push("### Accent Colors");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  Object.entries(tokens.colors.accent).forEach(([key, value]) => {
    docs.push(
      `| \`accent.${key}\` | \`${value}\` | \`var(--color-accent-${key})\` | Highlights, CTAs |`
    );
  });
  docs.push("");

  // Semantic Colors
  docs.push("### Semantic Colors");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  Object.entries(tokens.colors.semantic).forEach(([key, value]) => {
    docs.push(
      `| \`semantic.${key}\` | \`${value}\` | \`var(--color-semantic-${key})\` | Status indicators |`
    );
  });
  docs.push("");

  // Typography Section
  docs.push("## Typography");
  docs.push("");
  docs.push(
    "The typography system uses Space Mono for headings and Inter for body text, following brutalist principles."
  );
  docs.push("");

  // Font Families
  docs.push("### Font Families");
  docs.push("");
  docs.push("| Token | Value | CSS Variable |");
  docs.push("|-------|-------|--------------|");
  Object.entries(tokens.typography.fontFamilies).forEach(([key, value]) => {
    const fontList = Array.isArray(value) ? value.join(", ") : value;
    docs.push(
      `| \`${key}\` | \`${fontList}\` | \`var(--font-family-${key})\` |`
    );
  });
  docs.push("");

  // Font Sizes
  docs.push("### Font Sizes");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  Object.entries(tokens.typography.fontSizes).forEach(([key, value]) => {
    let usage = "";
    if (key === "display" || key.includes("xl")) usage = "Display headings";
    else if (
      key.startsWith("h") ||
      ["6xl", "5xl", "4xl", "3xl", "2xl", "xl"].includes(key)
    )
      usage = "Headings";
    else if (["lg", "base"].includes(key)) usage = "Body text";
    else if (["sm", "xs"].includes(key)) usage = "Small text, captions";

    docs.push(
      `| \`${key}\` | \`${value}\` | \`var(--font-size-${key})\` | ${usage} |`
    );
  });
  docs.push("");

  // Font Weights
  docs.push("### Font Weights");
  docs.push("");
  docs.push("| Token | Value | CSS Variable |");
  docs.push("|-------|-------|--------------|");
  Object.entries(tokens.typography.fontWeights).forEach(([key, value]) => {
    docs.push(`| \`${key}\` | \`${value}\` | \`var(--font-weight-${key})\` |`);
  });
  docs.push("");

  // Spacing Section
  docs.push("## Spacing");
  docs.push("");
  docs.push("The spacing system follows an 8px grid with consistent scaling.");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Pixels |");
  docs.push("|-------|-------|--------------|--------|");
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    let pixels = "";
    if (value.endsWith("rem")) {
      const remValue = parseFloat(value.replace("rem", ""));
      pixels = `${remValue * 16}px`;
    } else if (value.endsWith("px")) {
      pixels = value;
    }
    docs.push(
      `| \`${key}\` | \`${value}\` | \`var(--spacing-${key})\` | ${pixels} |`
    );
  });
  docs.push("");

  // Shadows Section
  docs.push("## Shadows");
  docs.push("");
  docs.push(
    "Brutalist shadows with hard edges and no blur, available in multiple variants and sizes."
  );
  docs.push("");

  Object.entries(tokens.shadows).forEach(([variant, sizes]) => {
    docs.push(
      `### ${variant.charAt(0).toUpperCase() + variant.slice(1)} Shadows`
    );
    docs.push("");
    docs.push("| Size | Value | CSS Variable |");
    docs.push("|------|-------|--------------|");
    Object.entries(sizes).forEach(([size, value]) => {
      docs.push(
        `| \`${size}\` | \`${value}\` | \`var(--shadow-${variant}-${size})\` |`
      );
    });
    docs.push("");
  });

  // Animations Section
  docs.push("## Animations");
  docs.push("");
  docs.push(
    "Animation tokens for consistent timing and easing across the design system."
  );
  docs.push("");

  docs.push("### Durations");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  Object.entries(tokens.animations.durations).forEach(([key, value]) => {
    let usage = "";
    if (key === "fast") usage = "Micro-interactions";
    else if (key === "normal") usage = "Standard transitions";
    else if (key === "slow") usage = "Complex animations";
    else if (key === "slower") usage = "Page transitions";

    docs.push(
      `| \`${key}\` | \`${value}\` | \`var(--duration-${key})\` | ${usage} |`
    );
  });
  docs.push("");

  docs.push("### Easing Functions");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  Object.entries(tokens.animations.easings).forEach(([key, value]) => {
    let usage = "";
    if (key === "easeOut") usage = "Entrances, hover effects";
    else if (key === "easeIn") usage = "Exits, dismissals";
    else if (key === "easeInOut") usage = "Smooth transitions";
    else if (key === "bounce") usage = "Playful interactions";
    else if (key === "sharp") usage = "Quick, decisive actions";

    docs.push(
      `| \`${key}\` | \`${value}\` | \`var(--easing-${key})\` | ${usage} |`
    );
  });
  docs.push("");

  // Borders Section
  docs.push("## Borders");
  docs.push("");
  docs.push("Border tokens for consistent styling across components.");
  docs.push("");

  docs.push("### Border Widths");
  docs.push("");
  docs.push("| Token | Value | CSS Variable |");
  docs.push("|-------|-------|--------------|");
  Object.entries(tokens.borders.width).forEach(([key, value]) => {
    docs.push(`| \`${key}\` | \`${value}\` | \`var(--border-width-${key})\` |`);
  });
  docs.push("");

  docs.push("### Border Radius");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Note |");
  docs.push("|-------|-------|--------------|------|");
  Object.entries(tokens.borders.radius).forEach(([key, value]) => {
    const note = key === "brutalist" ? "Brutalist design uses no radius" : "";
    docs.push(
      `| \`${key}\` | \`${value}\` | \`var(--border-radius-${key})\` | ${note} |`
    );
  });
  docs.push("");

  // Breakpoints Section
  docs.push("## Breakpoints");
  docs.push("");
  docs.push("Responsive breakpoints for mobile-first design.");
  docs.push("");
  docs.push("| Token | Value | Usage |");
  docs.push("|-------|-------|-------|");
  Object.entries(tokens.breakpoints).forEach(([key, value]) => {
    let usage = "";
    if (key === "xs") usage = "Small phones";
    else if (key === "sm") usage = "Large phones";
    else if (key === "md") usage = "Tablets";
    else if (key === "lg") usage = "Small laptops";
    else if (key === "xl") usage = "Desktops";
    else if (key === "2xl") usage = "Large screens";

    docs.push(`| \`${key}\` | \`${value}\` | ${usage} |`);
  });
  docs.push("");

  // Z-Index Section
  docs.push("## Z-Index");
  docs.push("");
  docs.push("Layering system for consistent stacking order.");
  docs.push("");
  docs.push("| Token | Value | CSS Variable | Usage |");
  docs.push("|-------|-------|--------------|-------|");
  Object.entries(tokens.zIndex).forEach(([key, value]) => {
    let usage = "";
    if (key === "hide") usage = "Hidden elements";
    else if (key === "base") usage = "Default layer";
    else if (key === "docked") usage = "Sticky elements";
    else if (key === "dropdown") usage = "Dropdown menus";
    else if (key === "modal") usage = "Modal dialogs";
    else if (key === "toast") usage = "Toast notifications";
    else if (key === "tooltip") usage = "Tooltips";

    docs.push(
      `| \`${key}\` | \`${value}\` | \`var(--z-index-${key})\` | ${usage} |`
    );
  });
  docs.push("");

  // Usage Examples Section
  docs.push("## Usage Examples");
  docs.push("");

  docs.push("### CSS Custom Properties");
  docs.push("");
  docs.push("```css");
  docs.push(".my-component {");
  docs.push("  background-color: var(--color-primary-black);");
  docs.push("  color: var(--color-primary-white);");
  docs.push("  padding: var(--spacing-4) var(--spacing-8);");
  docs.push(
    "  border: var(--border-width-brutalist) solid var(--color-primary-white);"
  );
  docs.push("  box-shadow: var(--shadow-brutalist-md);");
  docs.push("  transition: all var(--duration-normal) var(--easing-easeOut);");
  docs.push("}");
  docs.push("```");
  docs.push("");

  docs.push("### TypeScript/JavaScript");
  docs.push("");
  docs.push("```typescript");
  docs.push("import { designTokens } from '@/lib/design-tokens';");
  docs.push(
    "import { getColor, getSpacing, brutalistShadow } from '@/lib/utils';"
  );
  docs.push("");
  docs.push("// Direct token access");
  docs.push("const primaryColor = designTokens.colors.primary.black;");
  docs.push("");
  docs.push("// Utility functions");
  docs.push("const textColor = getColor('primary.white');");
  docs.push("const padding = getSpacing('4');");
  docs.push("const shadow = brutalistShadow('lg', 'accent');");
  docs.push("```");
  docs.push("");

  docs.push("### Tailwind CSS Classes");
  docs.push("");
  docs.push("```html");
  docs.push("<!-- Using design token-based classes -->");
  docs.push(
    '<div class="bg-primary-black text-primary-white p-4 border-brutalist border-primary-white shadow-brutalist-md">'
  );
  docs.push("  Brutalist component");
  docs.push("</div>");
  docs.push("");
  docs.push("<!-- Responsive design -->");
  docs.push('<div class="text-base md:text-lg lg:text-xl">');
  docs.push("  Responsive typography");
  docs.push("</div>");
  docs.push("```");
  docs.push("");

  docs.push("### React Components");
  docs.push("");
  docs.push("```tsx");
  docs.push("import { cn, brutalistShadow, token } from '@/lib/utils';");
  docs.push("");
  docs.push("interface ButtonProps {");
  docs.push("  variant?: 'primary' | 'secondary' | 'accent';");
  docs.push("  size?: 'sm' | 'md' | 'lg';");
  docs.push("}");
  docs.push("");
  docs.push(
    "export function Button({ variant = 'primary', size = 'md', ...props }) {"
  );
  docs.push("  return (");
  docs.push("    <button");
  docs.push("      className={cn(");
  docs.push(
    "        'font-mono font-bold uppercase transition-all duration-normal',"
  );
  docs.push("        'border-brutalist hover:shadow-brutalist-lg',");
  docs.push("        {");
  docs.push(
    "          'bg-primary-black text-primary-white border-primary-white': variant === 'primary',"
  );
  docs.push(
    "          'bg-accent-yellow text-primary-black border-primary-black': variant === 'accent',"
  );
  docs.push("          'px-4 py-2 text-sm': size === 'sm',");
  docs.push("          'px-6 py-3 text-base': size === 'md',");
  docs.push("          'px-8 py-4 text-lg': size === 'lg',");
  docs.push("        }");
  docs.push("      )}");
  docs.push("      {...props}");
  docs.push("    />");
  docs.push("  );");
  docs.push("}");
  docs.push("```");
  docs.push("");

  docs.push("## Best Practices");
  docs.push("");
  docs.push(
    "1. **Use CSS custom properties** for dynamic theming and runtime changes"
  );
  docs.push(
    "2. **Prefer utility functions** over direct token access for type safety"
  );
  docs.push("3. **Follow the spacing scale** for consistent layouts");
  docs.push(
    "4. **Use semantic color names** in components rather than specific color values"
  );
  docs.push(
    "5. **Test accessibility** with high contrast mode and screen readers"
  );
  docs.push("6. **Validate tokens** in development using the token validator");
  docs.push("7. **Document component variants** using the design token system");
  docs.push("");

  return docs.join("\n");
}

/**
 * Generate JSON schema for design tokens
 */
export function generateTokenSchema(
  tokens: DesignTokens = designTokens
): object {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Design Tokens Schema",
    description: "Schema for the brutalist portfolio design token system",
    type: "object",
    properties: {
      colors: {
        type: "object",
        properties: {
          primary: {
            type: "object",
            properties: {
              black: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
              white: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
              gray: {
                type: "object",
                patternProperties: {
                  "^[0-9]+$": { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
                },
              },
            },
          },
          accent: {
            type: "object",
            properties: {
              yellow: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
              yellowDark: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
              yellowLight: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            },
          },
        },
      },
      typography: {
        type: "object",
        properties: {
          fontSizes: {
            type: "object",
            patternProperties: {
              ".*": { type: "string", pattern: "^\\d+(\\.\\d+)?(rem|px|em)$" },
            },
          },
          fontWeights: {
            type: "object",
            patternProperties: {
              ".*": { type: "number", minimum: 100, maximum: 900 },
            },
          },
        },
      },
      spacing: {
        type: "object",
        patternProperties: {
          ".*": {
            type: "string",
            pattern: "^\\d+(\\.\\d+)?(rem|px|em)$|^0px$",
          },
        },
      },
    },
    required: ["colors", "typography", "spacing"],
  };
}

/**
 * Generate Figma tokens format
 */
export function generateFigmaTokens(
  tokens: DesignTokens = designTokens
): object {
  const figmaTokens: any = {};

  // Colors
  figmaTokens.colors = {};
  Object.entries(tokens.colors).forEach(([category, colors]) => {
    figmaTokens.colors[category] = {};
    Object.entries(colors).forEach(([name, value]) => {
      if (typeof value === "string") {
        figmaTokens.colors[category][name] = {
          value,
          type: "color",
        };
      } else if (typeof value === "object") {
        figmaTokens.colors[category][name] = {};
        Object.entries(value).forEach(([subName, subValue]) => {
          figmaTokens.colors[category][name][subName] = {
            value: subValue,
            type: "color",
          };
        });
      }
    });
  });

  // Typography
  figmaTokens.typography = {};
  Object.entries(tokens.typography.fontSizes).forEach(([name, value]) => {
    figmaTokens.typography[name] = {
      value,
      type: "fontSizes",
    };
  });

  // Spacing
  figmaTokens.spacing = {};
  Object.entries(tokens.spacing).forEach(([name, value]) => {
    figmaTokens.spacing[name] = {
      value,
      type: "spacing",
    };
  });

  return figmaTokens;
}

/**
 * Export design tokens in various formats
 */
export const tokenExports = {
  documentation: () => generateTokenDocumentation(),
  schema: () => generateTokenSchema(),
  figma: () => generateFigmaTokens(),
  css: () => {
    const { generateTokenCSS } = require("./css-generator");
    return generateTokenCSS();
  },
  json: () => designTokens,
};
