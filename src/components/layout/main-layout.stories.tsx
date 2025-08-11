import type { Meta, StoryObj } from "@storybook/react";
import { MainLayout } from "./main-layout";
import { PageHeader } from "./breadcrumb";
import { Container } from "./container";
import { Typography } from "@/components/ui/typography";

const meta: Meta<typeof MainLayout> = {
  title: "Layout/MainLayout",
  component: MainLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete main layout wrapper with header, footer, scroll progress, and skip navigation.",
      },
    },
  },
  argTypes: {
    showHeader: {
      control: "boolean",
      description: "Whether to show the header",
    },
    showFooter: {
      control: "boolean",
      description: "Whether to show the footer",
    },
    showScrollProgress: {
      control: "boolean",
      description: "Whether to show the scroll progress indicator",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

const SampleContent = () => (
  <>
    <PageHeader
      title="Sample Page"
      description="This is a sample page demonstrating the main layout component with header, footer, and scroll progress."
    />

    <Container>
      <div className="space-y-8 py-16">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="bg-brutalist-charcoal-100 border-4 border-white p-8"
          >
            <Typography
              variant="h3"
              weight="bold"
              transform="uppercase"
              className="mb-4 text-white"
            >
              Section {i + 1}
            </Typography>
            <Typography
              variant="body"
              className="leading-relaxed text-white/80"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
          </div>
        ))}
      </div>
    </Container>
  </>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete main layout with all components enabled. Scroll to see the scroll progress indicator and header behavior.",
      },
    },
  },
};

export const WithoutHeader: Story = {
  args: {
    showHeader: false,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: "Main layout without header component.",
      },
    },
  },
};

export const WithoutFooter: Story = {
  args: {
    showFooter: false,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: "Main layout without footer component.",
      },
    },
  },
};

export const WithoutScrollProgress: Story = {
  args: {
    showScrollProgress: false,
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: "Main layout without scroll progress indicator.",
      },
    },
  },
};

export const MinimalLayout: Story = {
  args: {
    showHeader: false,
    showFooter: false,
    showScrollProgress: false,
    children: (
      <Container>
        <div className="py-16 text-center">
          <Typography
            variant="display"
            weight="bold"
            transform="uppercase"
            className="mb-8 text-white"
          >
            Minimal Layout
          </Typography>
          <Typography variant="xl" className="text-white/80">
            Just the content, no header, footer, or scroll progress.
          </Typography>
        </div>
      </Container>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Minimal layout with all optional components disabled.",
      },
    },
  },
};
