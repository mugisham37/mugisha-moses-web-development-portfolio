import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, PageHeader } from "./breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Layout/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Brutalist breadcrumb navigation component for showing page hierarchy.",
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of breadcrumb items",
    },
    showHome: {
      control: "boolean",
      description: "Whether to show the home breadcrumb",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const sampleBreadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Web Development", href: "/projects/web-development" },
  {
    label: "E-commerce Platform",
    href: "/projects/web-development/ecommerce-platform",
    isCurrentPage: true,
  },
];

export const Default: Story = {
  args: {
    items: sampleBreadcrumbs,
  },
  parameters: {
    docs: {
      description: {
        story: "Default breadcrumb navigation with multiple levels.",
      },
    },
  },
};

export const WithoutHome: Story = {
  args: {
    items: sampleBreadcrumbs,
    showHome: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Breadcrumb navigation without the home link.",
      },
    },
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog", isCurrentPage: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Simple two-level breadcrumb navigation.",
      },
    },
  },
};

// Page Header Stories
const PageHeaderMeta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page header component with title, description, and breadcrumb navigation.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Page title",
    },
    description: {
      control: "text",
      description: "Page description",
    },
    showBreadcrumbs: {
      control: "boolean",
      description: "Whether to show breadcrumbs",
    },
    breadcrumbItems: {
      control: "object",
      description: "Custom breadcrumb items",
    },
  },
};

export const PageHeaderDefault: StoryObj<typeof PageHeader> = {
  args: {
    title: "Projects",
    description:
      "Explore my latest work and technical achievements in full-stack development, showcasing brutalist design principles and cutting-edge technologies.",
    breadcrumbItems: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects", isCurrentPage: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Default page header with title, description, and breadcrumbs.",
      },
    },
  },
};

export const PageHeaderWithoutBreadcrumbs: StoryObj<typeof PageHeader> = {
  args: {
    title: "Contact",
    description:
      "Ready to build something extraordinary? Let's discuss your next project and create digital experiences that convert.",
    showBreadcrumbs: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Page header without breadcrumb navigation.",
      },
    },
  },
};

export const PageHeaderWithChildren: StoryObj<typeof PageHeader> = {
  args: {
    title: "Blog",
    description:
      "Technical insights, development tutorials, and thoughts on modern web development.",
    children: (
      <div className="flex gap-4">
        <button className="bg-accent border-4 border-white px-6 py-3 font-mono font-bold text-black uppercase transition-colors hover:bg-white hover:text-black">
          Subscribe
        </button>
        <button className="border-4 border-white bg-transparent px-6 py-3 font-mono font-bold text-white uppercase transition-colors hover:bg-white hover:text-black">
          RSS Feed
        </button>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Page header with additional content/actions.",
      },
    },
  },
};

// Export PageHeader stories with different meta
export {
  PageHeaderDefault,
  PageHeaderWithoutBreadcrumbs,
  PageHeaderWithChildren,
};
PageHeaderDefault.parameters = {
  ...PageHeaderDefault.parameters,
  title: "Layout/PageHeader",
};
PageHeaderWithoutBreadcrumbs.parameters = {
  ...PageHeaderWithoutBreadcrumbs.parameters,
  title: "Layout/PageHeader",
};
PageHeaderWithChildren.parameters = {
  ...PageHeaderWithChildren.parameters,
  title: "Layout/PageHeader",
};
