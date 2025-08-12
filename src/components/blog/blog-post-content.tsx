"use client";

import { useState, useEffect } from "react";
// Syntax highlighter imports - these will be handled by the enhanced code block processing
import { BlogPost } from "@/lib/types";

interface BlogPostContentProps {
  post: BlogPost & {
    author: { name: string | null };
    categories: Array<{ name: string; slug: string; color: string }>;
    tags: Array<{ name: string; slug: string }>;
  };
}

interface CodeBlockProps {
  children: string;
  className?: string;
}

// Code block and inline code components are now handled by the enhanced markdown processing

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [processedContent, setProcessedContent] = useState("");
  const [tableOfContents, setTableOfContents] = useState<
    Array<{ id: string; title: string; level: number }>
  >([]);

  useEffect(() => {
    // Process markdown content and extract table of contents
    let html = post.content;
    const tocItems: Array<{ id: string; title: string; level: number }> = [];

    // Code blocks (must be processed before inline code)
    html = html.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, language, code) => {
        const lang = language || "text";
        const escapedCode = code
          .trim()
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
        return `<div class="code-block-wrapper" data-language="${lang}">
          <div class="code-block-header">
            <span class="code-language">${lang.toUpperCase()}</span>
            <button class="code-copy-btn" onclick="copyCodeBlock(this)">COPY</button>
          </div>
          <pre class="code-block" data-language="${lang}"><code>${escapedCode}</code></pre>
        </div>`;
      }
    );

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headers with TOC extraction
    html = html
      .replace(/^### (.*$)/gim, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        tocItems.push({ id, title: title.trim(), level: 3 });
        return `<h3 id="${id}" class="text-2xl font-bold text-white mb-4 mt-8 font-mono uppercase border-l-4 border-yellow-400 pl-4">${title}</h3>`;
      })
      .replace(/^## (.*$)/gim, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        tocItems.push({ id, title: title.trim(), level: 2 });
        return `<h2 id="${id}" class="text-3xl font-bold text-white mb-6 mt-12 font-mono uppercase border-l-4 border-yellow-400 pl-4">${title}</h2>`;
      })
      .replace(/^# (.*$)/gim, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        tocItems.push({ id, title: title.trim(), level: 1 });
        return `<h1 id="${id}" class="text-4xl font-bold text-white mb-8 mt-16 font-mono uppercase border-l-4 border-yellow-400 pl-4">${title}</h1>`;
      });

    // Bold and Italic
    html = html
      .replace(
        /\*\*\*(.*?)\*\*\*/g,
        '<strong class="text-yellow-400 font-bold"><em>$1</em></strong>'
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-bold">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="text-yellow-400">$1</em>');

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-yellow-400 underline hover:text-yellow-300 transition-colors font-mono" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Lists
    html = html.replace(
      /^\* (.*$)/gim,
      '<li class="text-white mb-2 pl-4 border-l-2 border-gray-600">$1</li>'
    );
    html = html.replace(
      /^\d+\. (.*$)/gim,
      '<li class="text-white mb-2 pl-4 border-l-2 border-gray-600">$1</li>'
    );

    // Wrap consecutive list items
    html = html.replace(
      /(<li.*?<\/li>\s*)+/g,
      '<ul class="space-y-2 mb-6 ml-4">$&</ul>'
    );

    // Blockquotes
    html = html.replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-yellow-400 pl-6 py-4 text-gray-300 italic mb-6 bg-gray-900 font-mono">$1</blockquote>'
    );

    // Horizontal rules
    html = html.replace(
      /^---$/gim,
      '<hr class="border-t-2 border-white my-12" />'
    );

    // Paragraphs
    html = html.replace(/\n\n/g, "</p><p>");
    if (html && !html.startsWith("<")) {
      html = "<p>" + html + "</p>";
    }

    // Add paragraph styling
    html = html.replace(
      /<p>/g,
      '<p class="text-white mb-6 leading-relaxed font-mono">'
    );

    setProcessedContent(html);
    setTableOfContents(tocItems);
  }, [post.content]);

  useEffect(() => {
    // Handle code blocks after content is rendered
    const codeBlocks = document.querySelectorAll(".code-block");
    codeBlocks.forEach((block) => {
      const language = block.getAttribute("data-language") || "text";
      const code = block.textContent || "";

      // Create a container for the syntax highlighter
      const container = document.createElement("div");
      block.parentNode?.replaceChild(container, block);

      // This would need to be handled differently in a real implementation
      // For now, we'll use a simpler approach
      container.innerHTML = `
        <div class="relative group">
          <button class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-gray-800 hover:bg-gray-700 px-2 py-1 text-xs text-white border border-gray-600" onclick="navigator.clipboard.writeText('${code.replace(/'/g, "\\'")}')">
            COPY
          </button>
          <pre class="bg-gray-900 border-2 border-white p-6 font-mono text-green-400 overflow-x-auto"><code>${code}</code></pre>
        </div>
      `;
    });

    // Handle inline code
    const inlineCodes = document.querySelectorAll(".inline-code");
    inlineCodes.forEach((code) => {
      code.className =
        "px-2 py-1 bg-gray-900 border border-white font-mono text-green-400 text-sm";
    });
  }, [processedContent]);

  return (
    <article className="prose prose-invert max-w-none">
      {/* Table of Contents */}
      {tableOfContents.length > 0 && (
        <div className="mb-8 border-4 border-white p-6">
          <h2 className="mb-4 font-mono text-xl font-bold text-white uppercase">
            TABLE OF CONTENTS
          </h2>
          <nav className="space-y-2">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block font-mono text-sm transition-colors hover:text-yellow-400 ${
                  item.level === 1
                    ? "font-bold text-white"
                    : item.level === 2
                      ? "ml-4 text-gray-300"
                      : "ml-8 text-gray-400"
                }`}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          scroll-margin-top: 100px;
        }

        .blog-content img {
          border: 2px solid white;
          margin: 2rem 0;
          max-width: 100%;
          height: auto;
        }

        .blog-content table {
          border: 2px solid white;
          border-collapse: collapse;
          width: 100%;
          margin: 2rem 0;
          font-family: "Space Mono", monospace;
        }

        .blog-content th,
        .blog-content td {
          border: 1px solid white;
          padding: 0.75rem;
          text-align: left;
        }

        .blog-content th {
          background-color: white;
          color: black;
          font-weight: bold;
          text-transform: uppercase;
        }

        .blog-content td {
          color: white;
        }

        .code-block-wrapper {
          margin: 2rem 0;
          border: 2px solid white;
          background: #1a1a1a;
        }

        .code-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: white;
          color: black;
          font-family: "Space Mono", monospace;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .code-language {
          text-transform: uppercase;
        }

        .code-copy-btn {
          background: transparent;
          border: 1px solid black;
          color: black;
          padding: 0.25rem 0.5rem;
          font-family: "Space Mono", monospace;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .code-copy-btn:hover {
          background: black;
          color: white;
        }

        .code-block {
          margin: 0;
          padding: 1.5rem;
          background: #1a1a1a;
          color: #00ff00;
          font-family: "Space Mono", monospace;
          font-size: 0.875rem;
          overflow-x: auto;
          white-space: pre;
        }

        .code-block code {
          background: transparent;
          border: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function copyCodeBlock(button) {
              const codeBlock = button.closest('.code-block-wrapper').querySelector('.code-block code');
              const text = codeBlock.textContent;
              navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'COPIED!';
                setTimeout(() => {
                  button.textContent = originalText;
                }, 2000);
              });
            }
          `,
        }}
      />
    </article>
  );
}
