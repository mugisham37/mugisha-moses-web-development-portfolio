import type { Meta, StoryObj } from "@storybook/react";
import { 
  AnimationWrapper, 
  BrutalistMotion, 
  StaggerContainer, 
  StaggerItem, 
  ScrollTrigger 
} from "./animation";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Button } from "./button";

const meta: Meta<typeof AnimationWrapper> = {
  title: "UI/Animation",
  component: AnimationWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["fadeIn", "slideInUp", "slideInDown", "slideInLeft", "slideInRight", "scaleIn"],
    },
    delay: {
      control: { type: "number", min: 0, max: 2, step: 0.1 },
    },
    duration: {
      control: { type: "number", min: 0.1, max: 2, step: 0.1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FadeIn: Story = {
  args: {
    type: "fadeIn",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Fade In Animation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card fades in when it comes into view.</p>
        </CardContent>
      </Card>
    ),
  },
};

export const SlideInUp: Story = {
  args: {
    type: "slideInUp",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Slide In Up</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card slides in from the bottom.</p>
        </CardContent>
      </Card>
    ),
  },
};

export const SlideInLeft: Story = {
  args: {
    type: "slideInLeft",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Slide In Left</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card slides in from the left.</p>
        </CardContent>
      </Card>
    ),
  },
};

export const ScaleIn: Story = {
  args: {
    type: "scaleIn",
    children: (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Scale In</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card scales in from smaller size.</p>
        </CardContent>
      </Card>
    ),
  },
};

export const BrutalistHover: Story = {
  render: () => (
    <div className="space-y-4">
      <BrutalistMotion hover className="inline-block">
        <Button variant="primary">Hover for Brutalist Effect</Button>
      </BrutalistMotion>
      
      <BrutalistMotion hover>
        <Card padding="md" className="max-w-sm">
          <CardHeader>
            <CardTitle>Hover Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Hover over this card to see the brutalist lift effect.</p>
          </CardContent>
        </Card>
      </BrutalistMotion>
    </div>
  ),
};

export const BrutalistPress: Story = {
  render: () => (
    <div className="space-y-4">
      <BrutalistMotion press className="inline-block">
        <Button variant="accent">Press Me</Button>
      </BrutalistMotion>
      
      <BrutalistMotion press>
        <Card padding="md" className="max-w-sm cursor-pointer">
          <CardHeader>
            <CardTitle>Press Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Click this card to see the press effect.</p>
          </CardContent>
        </Card>
      </BrutalistMotion>
    </div>
  ),
};

export const StaggerAnimation: Story = {
  render: () => (
    <StaggerContainer className="grid grid-cols-2 gap-4 max-w-2xl">
      <StaggerItem>
        <Card padding="md">
          <CardTitle>Item 1</CardTitle>
          <CardContent>
            <p>First item in stagger sequence.</p>
          </CardContent>
        </Card>
      </StaggerItem>
      
      <StaggerItem>
        <Card padding="md">
          <CardTitle>Item 2</CardTitle>
          <CardContent>
            <p>Second item in stagger sequence.</p>
          </CardContent>
        </Card>
      </StaggerItem>
      
      <StaggerItem>
        <Card padding="md">
          <CardTitle>Item 3</CardTitle>
          <CardContent>
            <p>Third item in stagger sequence.</p>
          </CardContent>
        </Card>
      </StaggerItem>
      
      <StaggerItem>
        <Card padding="md">
          <CardTitle>Item 4</CardTitle>
          <CardContent>
            <p>Fourth item in stagger sequence.</p>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  ),
};

export const ScrollTriggerExample: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="h-96 flex items-center justify-center bg-brutalist-charcoal-100 border-4 border-white">
        <p className="text-center font-mono uppercase">
          Scroll down to see the scroll trigger animation
        </p>
      </div>
      
      <ScrollTrigger>
        <Card padding="md">
          <CardHeader>
            <CardTitle>Scroll Triggered</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card animates when it comes into view while scrolling.</p>
          </CardContent>
        </Card>
      </ScrollTrigger>
      
      <div className="h-96 flex items-center justify-center bg-brutalist-charcoal-100 border-4 border-white">
        <p className="text-center font-mono uppercase">
          More content to demonstrate scroll behavior
        </p>
      </div>
    </div>
  ),
};

export const AllAnimationTypes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <AnimationWrapper type="fadeIn" delay={0}>
        <Card padding="sm">
          <CardTitle>Fade In</CardTitle>
        </Card>
      </AnimationWrapper>
      
      <AnimationWrapper type="slideInUp" delay={0.1}>
        <Card padding="sm">
          <CardTitle>Slide Up</CardTitle>
        </Card>
      </AnimationWrapper>
      
      <AnimationWrapper type="slideInLeft" delay={0.2}>
        <Card padding="sm">
          <CardTitle>Slide Left</CardTitle>
        </Card>
      </AnimationWrapper>
      
      <AnimationWrapper type="slideInRight" delay={0.3}>
        <Card padding="sm">
          <CardTitle>Slide Right</CardTitle>
        </Card>
      </AnimationWrapper>
      
      <AnimationWrapper type="scaleIn" delay={0.4}>
        <Card padding="sm">
          <CardTitle>Scale In</CardTitle>
        </Card>
      </AnimationWrapper>
      
      <AnimationWrapper type="slideInDown" delay={0.5}>
        <Card padding="sm">
          <CardTitle>Slide Down</CardTitle>
        </Card>
      </AnimationWrapper>
    </div>
  ),
};