import { render, screen } from "@testing-library/react";
import { BlogPostContent } from "../blog-post-content";

// Mock the blog post data
const mockPost = {
  id: "1",
  title: "Test Blog Post",
  slug: "test-blog-post",
  content: `# Introduction

This is a test blog post with **bold text** and *italic text*.

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### List Example

* Item 1
* Item 2
* Item 3

> This is a blockquote

[Link example](https://example.com)`,
  excerpt: "Test excerpt",
  status: "PUBLISHED" as const,
  featured: false,
  viewCount: 100,
  readingTime: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
  authorId: "1",
  author: { name: "Test Author" },
  categories: [{ name: "Technology", slug: "technology", color: "#FFFF00" }],
  tags: [
    { name: "JavaScript", slug: "javascript" },
    { name: "Tutorial", slug: "tutorial" },
  ],
};

describe("BlogPostContent", () => {
  it("renders blog post content with markdown processing", () => {
    render(<BlogPostContent post={mockPost} />);

    // Check if the content is rendered
    expect(screen.getByText("INTRODUCTION")).toBeInTheDocument();
    expect(screen.getByText("CODE EXAMPLE")).toBeInTheDocument();
    expect(screen.getByText("LIST EXAMPLE")).toBeInTheDocument();
  });

  it("generates table of contents for headers", () => {
    render(<BlogPostContent post={mockPost} />);

    // Check if table of contents is rendered
    expect(screen.getByText("TABLE OF CONTENTS")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Code Example")).toBeInTheDocument();
    expect(screen.getByText("List Example")).toBeInTheDocument();
  });

  it("processes code blocks with syntax highlighting", () => {
    render(<BlogPostContent post={mockPost} />);

    // Check if code block is rendered with proper structure
    expect(screen.getByText("JAVASCRIPT")).toBeInTheDocument();
    expect(screen.getByText("COPY")).toBeInTheDocument();
  });

  it("processes inline code correctly", () => {
    const postWithInlineCode = {
      ...mockPost,
      content: "Here is some `inline code` in the text.",
    };

    render(<BlogPostContent post={postWithInlineCode} />);

    // The inline code should be processed
    expect(screen.getByText("inline code")).toBeInTheDocument();
  });

  it("processes links correctly", () => {
    render(<BlogPostContent post={mockPost} />);

    // Check if link is rendered
    const link = screen.getByText("Link example");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "https://example.com");
  });
});
