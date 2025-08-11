import type { Meta, StoryObj } from "@storybook/react";
import { Section } from "./section";
import { Container } from "./container";
import { Typography } from "../ui/typography";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    background: {
      control: { type: "select" },
      options: ["default", "muted", "accent"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    padding: "lg",
    background: "default",
    children: (
      <Container>
        <Typography variant="h2">Default Section</Typography>
        <Typography variant="body">
          This is a default section with black background and white text.
        </Typography>
      </Container>
    ),
  },
};

export const Muted: Story = {
  args: {
    padding: "lg",
    background: "muted",
    children: (
      <Container>
        <Typography variant="h2">Muted Section</Typography>
        <Typography variant="body">
          This is a muted section with charcoal background.
        </Typography>
      </Container>
    ),
  },
};

export const Accent: Story = {
  args: {
    padding: "lg",
    background: "accent",
    children: (
      <Container>
        <Typography variant="h2">Accent Section</Typography>
        <Typography variant="body">
          This is an accent section with yellow background and black text.
        </Typography>
      </Container>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    background: "default",
    children: (
      <Container>
        <div className="py-8">
          <Typography variant="h2">No Padding Section</Typography>
          <Typography variant="body">
            This section has no padding, so we added manual padding to the content.
          </Typography>
        </div>
      </Container>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    background: "muted",
    children: (
      <Container>
        <Typography variant="h2">Small Padding</Typography>
        <Typography variant="body">
          This section has small padding (py-8).
        </Typography>
      </Container>
    ),
  },
};

export const ExtraLargePadding: Story = {
  args: {
    padding: "xl",
    background: "accent",
    children: (
      <Container>
        <Typography variant="h2">Extra Large Padding</Typography>
        <Typography variant="body">
          This section has extra large padding (py-24) for maximum breathing room.
        </Typography>
      </Container>
    ),
  },
};

export const MultipleSections: Story = {
  render: () => (
    <div>
      <Section background="default" padding="lg">
        <Container>
          <Typography variant="h1">Hero Section</Typography>
          <Typography variant="body">
            This is the hero section with default black background.
          </Typography>
        </Container>
      </Section>
      
      <Section background="muted" padding="lg">
        <Container>
          <Typography variant="h2">About Section</Typography>
          <Typography variant="body">
            This is an about section with muted charcoal background.
          </Typography>
        </Container>
      </Section>
      
      <Section background="accent" padding="lg">
        <Container>
          <Typography variant="h2">Call to Action</Typography>
          <Typography variant="body">
            This is a call-to-action section with bright yellow background.
          </Typography>
        </Container>
      </Section>
      
      <Section background="default" padding="sm">
        <Container>
          <Typography variant="h3">Footer Section</Typography>
          <Typography variant="small">
            This is a footer section with smaller padding.
          </Typography>
        </Container>
      </Section>
    </div>
  ),
};