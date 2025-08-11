import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./container";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "sm",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Small Container</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has a small max-width (max-w-3xl).</p>
        </CardContent>
      </Card>
    ),
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Medium Container</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has a medium max-width (max-w-4xl).</p>
        </CardContent>
      </Card>
    ),
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Large Container</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has a large max-width (max-w-6xl). This is the default size.</p>
        </CardContent>
      </Card>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Extra Large Container</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has an extra large max-width (max-w-7xl).</p>
        </CardContent>
      </Card>
    ),
  },
};

export const Full: Story = {
  args: {
    size: "full",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Full Width Container</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This container has no max-width constraint and takes the full width.</p>
        </CardContent>
      </Card>
    ),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <Container size="sm">
        <Card padding="sm" variant="accent">
          <CardTitle>Small (max-w-3xl)</CardTitle>
        </Card>
      </Container>
      
      <Container size="md">
        <Card padding="sm" variant="elevated">
          <CardTitle>Medium (max-w-4xl)</CardTitle>
        </Card>
      </Container>
      
      <Container size="lg">
        <Card padding="sm">
          <CardTitle>Large (max-w-6xl) - Default</CardTitle>
        </Card>
      </Container>
      
      <Container size="xl">
        <Card padding="sm" variant="elevated">
          <CardTitle>Extra Large (max-w-7xl)</CardTitle>
        </Card>
      </Container>
      
      <Container size="full">
        <Card padding="sm" variant="accent">
          <CardTitle>Full Width (no max-width)</CardTitle>
        </Card>
      </Container>
    </div>
  ),
};