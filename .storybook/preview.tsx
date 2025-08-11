import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import { ThemeProvider } from "../src/components/ui/theme-provider";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#000000",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) => React.createElement(
      ThemeProvider,
      { defaultTheme: "dark" },
      React.createElement(
        "div",
        { className: "min-h-screen bg-background text-foreground p-4" },
        React.createElement(Story)
      )
    ),
  ],
};

export default preview;