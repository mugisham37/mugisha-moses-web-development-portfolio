import type { Meta, StoryObj } from "@storybook/react";
import { MainHeader } from "./header";

const meta: Meta<typeof MainHeader> = {
  title: "Layout/Header",
  component: MainHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Brutalist header component with responsive navigation, mobile menu, and scroll-based behavior.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainHeader>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Default header with brutalist navigation design and mobile menu support.",
      },
    },
  },
};

export const WithScrolledState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Header in scrolled state with background and border. Scroll down to see the effect in the actual component.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div className="bg-brutalist-charcoal-100 flex h-screen items-center justify-center">
          <p className="font-mono text-white uppercase">
            Scroll up to see header behavior
          </p>
        </div>
      </div>
    ),
  ],
};

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Header optimized for mobile devices with hamburger menu.",
      },
    },
  },
};

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Header on tablet devices showing responsive behavior.",
      },
    },
  },
};
