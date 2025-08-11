import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialCard } from "./testimonial-card";

const meta: Meta<typeof TestimonialCard> = {
  title: "Components/Testimonials/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A card component for displaying client testimonials with ratings, content, and author information.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "compact", "featured"],
      description: "Visual variant of the card",
    },
    showVideo: {
      control: { type: "boolean" },
      description: "Whether to show video player if video URL is provided",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialCard>;

const baseTestimonial = {
  id: "test-1",
  name: "Sarah Chen",
  role: "CTO",
  company: "TechFlow Solutions",
  content:
    "The brutalist approach to our web application was exactly what we needed. Clean, fast, and incredibly effective. Our conversion rates increased by 340% after launch.",
  rating: 5,
  videoUrl: null,
  avatarUrl: null,
  featured: false,
  approved: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
  authorId: null,
  email: "sarah@techflow.com",
  author: null,
};

export const Default: Story = {
  args: {
    testimonial: baseTestimonial,
    variant: "default",
    showVideo: true,
  },
};

export const Featured: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      featured: true,
    },
    variant: "featured",
    showVideo: true,
  },
};

export const Compact: Story = {
  args: {
    testimonial: baseTestimonial,
    variant: "compact",
    showVideo: true,
  },
};

export const WithAvatar: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      avatarUrl: "/testimonials/sarah-chen.jpg",
    },
    variant: "default",
    showVideo: true,
  },
};

export const WithVideo: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      videoUrl: "https://example.com/video.mp4",
    },
    variant: "default",
    showVideo: true,
  },
};

export const WithLinkedInConnection: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      author: {
        id: "user-1",
        name: "Sarah Chen",
        email: "sarah@techflow.com",
        image: null,
      },
    },
    variant: "default",
    showVideo: true,
  },
};

export const LowerRating: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      name: "Marcus Rodriguez",
      role: "Founder",
      company: "StartupForge",
      content:
        "Good work overall, delivered on time and met most requirements. There were a few minor issues but they were resolved quickly.",
      rating: 3,
    },
    variant: "default",
    showVideo: true,
  },
};

export const NoCompany: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      name: "Alex Kumar",
      role: "Independent Developer",
      company: null,
      content:
        "Excellent collaboration and technical expertise. The code quality was outstanding and the project was delivered ahead of schedule.",
    },
    variant: "default",
    showVideo: true,
  },
};

export const LongContent: Story = {
  args: {
    testimonial: {
      ...baseTestimonial,
      content:
        "This is a much longer testimonial that demonstrates how the component handles extensive content. The brutalist approach to our web application was exactly what we needed. Clean, fast, and incredibly effective. Our conversion rates increased by 340% after launch. The team was professional, responsive, and delivered exceptional results that exceeded our expectations. The technical implementation was flawless and the performance improvements were immediately noticeable. I would highly recommend their services to any company looking for elite development work.",
    },
    variant: "default",
    showVideo: true,
  },
};
