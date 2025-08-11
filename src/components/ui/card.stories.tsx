import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "elevated", "interactive", "accent"],
    },
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
    },
    hover: {
      control: { type: "select" },
      options: ["none", "lift", "glow", "invert"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    padding: "md",
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content area where you can put any content.</p>
        </CardContent>
        <CardFooter>
          <Button variant="primary">Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    padding: "md",
    children: (
      <>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>This card has an elevated background</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content in an elevated card with darker background.</p>
        </CardContent>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: "interactive",
    padding: "md",
    children: (
      <>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>This card has hover effects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover over this card to see the brutalist lift effect.</p>
        </CardContent>
      </>
    ),
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
    padding: "md",
    children: (
      <>
        <CardHeader>
          <CardTitle>Accent Card</CardTitle>
          <CardDescription>This card uses the accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card stands out with the brutalist yellow background.</p>
        </CardContent>
      </>
    ),
  },
};

export const WithHoverEffects: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <Card hover="lift" padding="md">
        <CardHeader>
          <CardTitle>Lift Hover</CardTitle>
          <CardDescription>Hover to see lift effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card lifts up on hover with a shadow.</p>
        </CardContent>
      </Card>
      
      <Card hover="glow" padding="md">
        <CardHeader>
          <CardTitle>Glow Hover</CardTitle>
          <CardDescription>Hover to see glow effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card glows with yellow shadow on hover.</p>
        </CardContent>
      </Card>
      
      <Card hover="invert" padding="md">
        <CardHeader>
          <CardTitle>Invert Hover</CardTitle>
          <CardDescription>Hover to see invert effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card inverts colors on hover.</p>
        </CardContent>
      </Card>
      
      <Card variant="interactive" padding="md">
        <CardHeader>
          <CardTitle>Interactive</CardTitle>
          <CardDescription>Built-in interactive variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This uses the interactive variant.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const DifferentPadding: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <Card padding="none">
        <div className="p-4 border-b-4 border-white">
          <CardTitle>No Padding</CardTitle>
        </div>
        <div className="p-4">
          <p>This card has no default padding.</p>
        </div>
      </Card>
      
      <Card padding="sm">
        <CardTitle>Small Padding</CardTitle>
        <p>This card has small padding.</p>
      </Card>
      
      <Card padding="lg">
        <CardTitle>Large Padding</CardTitle>
        <p>This card has large padding for more breathing room.</p>
      </Card>
    </div>
  ),
};