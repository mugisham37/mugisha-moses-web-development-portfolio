import type { Meta, StoryObj } from "@storybook/react";
import { MainFooter } from "./footer";

const meta: Meta<typeof MainFooter> = {
  title: "Layout/Footer",
  component: MainFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Brutalist footer component with social links, newsletter signup, and contact information.",
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
type Story = StoryObj<typeof MainFooter>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Default footer with all sections including newsletter signup and social links.",
      },
    },
  },
};

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Footer optimized for mobile devices with stacked layout.",
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
        story: "Footer on tablet devices showing responsive grid layout.",
      },
    },
  },
};
