import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "UI/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["display", "h1", "h2", "h3", "h4", "h5", "h6", "body", "large", "small", "caption", "code"],
    },
    weight: {
      control: { type: "select" },
      options: ["normal", "bold"],
    },
    transform: {
      control: { type: "select" },
      options: ["none", "uppercase", "lowercase", "capitalize"],
    },
    spacing: {
      control: { type: "select" },
      options: ["tight", "normal", "wide", "wider"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    variant: "display",
    children: "Display Text",
  },
};

export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "Heading 1",
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "Heading 2",
  },
};

export const Heading3: Story = {
  args: {
    variant: "h3",
    children: "Heading 3",
  },
};

export const Body: Story = {
  args: {
    variant: "body",
    children: "This is body text that would be used for paragraphs and general content throughout the application.",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "Caption Text",
  },
};

export const Code: Story = {
  args: {
    variant: "code",
    children: "const code = 'example';",
  },
};

export const AllHeadings: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="display">Display Text</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
    </div>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Typography variant="large">
        Large text variant for important content that needs to stand out.
      </Typography>
      <Typography variant="body">
        Body text variant for regular paragraphs and content. This is the most commonly used text variant throughout the application.
      </Typography>
      <Typography variant="small">
        Small text variant for less important information or fine print.
      </Typography>
      <Typography variant="caption">
        Caption text for image captions and metadata
      </Typography>
      <Typography variant="code">
        const codeExample = "This is code text";
      </Typography>
    </div>
  ),
};

export const TextTransforms: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h3" transform="none">
        Normal Text Transform
      </Typography>
      <Typography variant="h3" transform="uppercase">
        Uppercase Text Transform
      </Typography>
      <Typography variant="h3" transform="lowercase">
        Lowercase Text Transform
      </Typography>
      <Typography variant="h3" transform="capitalize">
        capitalize text transform
      </Typography>
    </div>
  ),
};

export const LetterSpacing: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h3" spacing="tight">
        Tight Letter Spacing
      </Typography>
      <Typography variant="h3" spacing="normal">
        Normal Letter Spacing
      </Typography>
      <Typography variant="h3" spacing="wide">
        Wide Letter Spacing
      </Typography>
      <Typography variant="h3" spacing="wider">
        Wider Letter Spacing
      </Typography>
    </div>
  ),
};