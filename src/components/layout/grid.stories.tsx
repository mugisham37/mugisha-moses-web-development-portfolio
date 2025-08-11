import type { Meta, StoryObj } from "@storybook/react";
import { Grid, GridItem } from "./grid";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6, 12],
    },
    gap: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "xl"],
    },
    responsive: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleCard = ({ title, content }: { title: string; content: string }) => (
  <Card padding="sm">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
    </CardContent>
  </Card>
);

export const TwoColumns: Story = {
  args: {
    cols: 2,
    gap: "md",
    responsive: true,
    children: (
      <>
        <SampleCard title="Item 1" content="First grid item" />
        <SampleCard title="Item 2" content="Second grid item" />
        <SampleCard title="Item 3" content="Third grid item" />
        <SampleCard title="Item 4" content="Fourth grid item" />
      </>
    ),
  },
};

export const ThreeColumns: Story = {
  args: {
    cols: 3,
    gap: "md",
    responsive: true,
    children: (
      <>
        <SampleCard title="Item 1" content="First grid item" />
        <SampleCard title="Item 2" content="Second grid item" />
        <SampleCard title="Item 3" content="Third grid item" />
        <SampleCard title="Item 4" content="Fourth grid item" />
        <SampleCard title="Item 5" content="Fifth grid item" />
        <SampleCard title="Item 6" content="Sixth grid item" />
      </>
    ),
  },
};

export const FourColumns: Story = {
  args: {
    cols: 4,
    gap: "lg",
    responsive: true,
    children: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <SampleCard 
            key={i} 
            title={`Item ${i + 1}`} 
            content={`Grid item number ${i + 1}`} 
          />
        ))}
      </>
    ),
  },
};

export const WithGridItems: Story = {
  render: () => (
    <Grid cols={12} gap="md" className="max-w-4xl">
      <GridItem span={12}>
        <Card padding="sm" variant="accent">
          <CardTitle>Full Width Header (span 12)</CardTitle>
        </Card>
      </GridItem>
      
      <GridItem span={8}>
        <Card padding="sm">
          <CardTitle>Main Content (span 8)</CardTitle>
          <CardContent>
            <p>This takes up 8 columns of the 12-column grid.</p>
          </CardContent>
        </Card>
      </GridItem>
      
      <GridItem span={4}>
        <Card padding="sm" variant="elevated">
          <CardTitle>Sidebar (span 4)</CardTitle>
          <CardContent>
            <p>This takes up 4 columns.</p>
          </CardContent>
        </Card>
      </GridItem>
      
      <GridItem span={6}>
        <Card padding="sm">
          <CardTitle>Half Width (span 6)</CardTitle>
        </Card>
      </GridItem>
      
      <GridItem span={6}>
        <Card padding="sm">
          <CardTitle>Half Width (span 6)</CardTitle>
        </Card>
      </GridItem>
      
      <GridItem span={4}>
        <Card padding="sm" variant="elevated">
          <CardTitle>Third (span 4)</CardTitle>
        </Card>
      </GridItem>
      
      <GridItem span={4}>
        <Card padding="sm" variant="elevated">
          <CardTitle>Third (span 4)</CardTitle>
        </Card>
      </GridItem>
      
      <GridItem span={4}>
        <Card padding="sm" variant="elevated">
          <CardTitle>Third (span 4)</CardTitle>
        </Card>
      </GridItem>
    </Grid>
  ),
};

export const DifferentGaps: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-mono uppercase text-sm mb-4">No Gap</h3>
        <Grid cols={3} gap="none" className="max-w-2xl">
          <SampleCard title="Item 1" content="No gap between items" />
          <SampleCard title="Item 2" content="No gap between items" />
          <SampleCard title="Item 3" content="No gap between items" />
        </Grid>
      </div>
      
      <div>
        <h3 className="font-mono uppercase text-sm mb-4">Small Gap</h3>
        <Grid cols={3} gap="sm" className="max-w-2xl">
          <SampleCard title="Item 1" content="Small gap (gap-2)" />
          <SampleCard title="Item 2" content="Small gap (gap-2)" />
          <SampleCard title="Item 3" content="Small gap (gap-2)" />
        </Grid>
      </div>
      
      <div>
        <h3 className="font-mono uppercase text-sm mb-4">Large Gap</h3>
        <Grid cols={3} gap="lg" className="max-w-2xl">
          <SampleCard title="Item 1" content="Large gap (gap-6)" />
          <SampleCard title="Item 2" content="Large gap (gap-6)" />
          <SampleCard title="Item 3" content="Large gap (gap-6)" />
        </Grid>
      </div>
    </div>
  ),
};

export const NonResponsive: Story = {
  args: {
    cols: 4,
    gap: "md",
    responsive: false,
    children: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <SampleCard 
            key={i} 
            title={`Item ${i + 1}`} 
            content="Fixed 4 columns on all screen sizes" 
          />
        ))}
      </>
    ),
  },
};