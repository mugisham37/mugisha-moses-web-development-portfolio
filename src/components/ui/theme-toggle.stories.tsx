import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./theme-toggle";
import { ThemeProvider } from "./theme-provider";

const meta: Meta<typeof ThemeToggle> = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["button", "dropdown", "inline"],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    variant: "button",
  },
};

export const Dropdown: Story = {
  args: {
    variant: "dropdown",
  },
};

export const Inline: Story = {
  args: {
    variant: "inline",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-mono uppercase text-sm">Button Variant</h3>
        <ThemeToggle variant="button" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-mono uppercase text-sm">Dropdown Variant</h3>
        <ThemeToggle variant="dropdown" />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-mono uppercase text-sm">Inline Variant</h3>
        <ThemeToggle variant="inline" />
      </div>
    </div>
  ),
};