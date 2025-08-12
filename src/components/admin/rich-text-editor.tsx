"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import readingTime from "reading-time";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onReadingTimeChange?: (minutes: number) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  onReadingTimeChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onChange(newContent);

    // Calculate reading time
    if (onReadingTimeChange) {
      const stats = readingTime(newContent);
      onReadingTimeChange(stats.minutes);
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        const newCursorPos =
          start + before.length + selectedText.length + after.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent =
      content.substring(0, start) + text + content.substring(end);

    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }
    }, 0);
  };

  const formatMarkdown = (markdown: string): string => {
    // Basic markdown to HTML conversion
    let html = markdown
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-bold text-white mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold text-white mb-3">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold text-white mb-4">$1</h1>'
      )

      // Bold and Italic
      .replace(
        /\*\*\*(.*?)\*\*\*/g,
        '<strong><em class="text-yellow-400">$1</em></strong>'
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-bold">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="text-yellow-400">$1</em>')

      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-900 border-2 border-white p-4 font-mono text-green-400 overflow-x-auto mb-4"><code>$1</code></pre>'
      )
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-900 border border-white px-2 py-1 font-mono text-green-400">$1</code>'
      )

      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-yellow-400 underline hover:text-yellow-300" target="_blank" rel="noopener noreferrer">$1</a>'
      )

      // Lists
      .replace(/^\* (.*$)/gim, '<li class="text-white mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="text-white mb-1">$1</li>')

      // Blockquotes
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-yellow-400 pl-4 text-gray-300 italic mb-4">$1</blockquote>'
      )

      // Line breaks
      .replace(/\n\n/g, '</p><p class="text-white mb-4">')
      .replace(/\n/g, "<br>");

    // Wrap in paragraphs
    if (html && !html.startsWith("<")) {
      html = '<p class="text-white mb-4">' + html + "</p>";
    }

    // Wrap lists
    html = html.replace(
      /(<li.*?<\/li>)/g,
      '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>'
    );

    return html;
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertAtCursor("# "),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertAtCursor("## "),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertAtCursor("### "),
    },
    { type: "separator" },
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`"),
    },
    { type: "separator" },
    {
      icon: Link,
      label: "Link",
      action: () => {
        const url = prompt("Enter URL:");
        const text = prompt("Enter link text:");
        if (url && text) {
          insertAtCursor(`[${text}](${url})`);
        }
      },
    },
    {
      icon: Image,
      label: "Image",
      action: () => {
        const url = prompt("Enter image URL:");
        const alt = prompt("Enter alt text:");
        if (url) {
          insertAtCursor(`![${alt || "Image"}](${url})`);
        }
      },
    },
    { type: "separator" },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertAtCursor("* "),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertAtCursor("1. "),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertAtCursor("> "),
    },
  ];

  return (
    <div className="border-2 border-white bg-black">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b-2 border-white p-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => {
            if (button.type === "separator") {
              return <div key={index} className="mx-2 h-6 w-px bg-gray-600" />;
            }

            const Icon = button.icon!;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.label}
                className="h-8 w-8 p-0 text-white hover:bg-white hover:text-black"
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-white hover:bg-white hover:text-black"
          >
            {isPreview ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                EDIT
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                PREVIEW
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div className="p-6">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
            />
            {!content && (
              <p className="font-mono text-gray-400">NO CONTENT TO PREVIEW</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              placeholder={placeholder}
              className="w-full resize-none border-0 bg-transparent p-6 font-mono text-white placeholder-gray-400 focus:outline-none"
              style={{ minHeight: "400px" }}
            />

            {/* Markdown Cheatsheet */}
            {!content && (
              <div className="absolute top-4 right-4 rounded border border-gray-600 bg-gray-900 p-3 text-xs text-gray-400">
                <div className="mb-2 font-bold text-white">
                  MARKDOWN CHEATSHEET:
                </div>
                <div># Heading 1</div>
                <div>## Heading 2</div>
                <div>**Bold** *Italic*</div>
                <div>`Code` ```Code Block```</div>
                <div>[Link](url)</div>
                <div>![Image](url)</div>
                <div>* List Item</div>
                <div>&gt; Quote</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t-2 border-white p-2 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>CHARACTERS: {content.length}</span>
          <span>
            WORDS:{" "}
            {content.split(/\s+/).filter((word) => word.length > 0).length}
          </span>
          <span>LINES: {content.split("\n").length}</span>
          <span>
            READING TIME: {Math.ceil(readingTime(content).minutes)} MIN
          </span>
        </div>
        <div>MARKDOWN EDITOR</div>
      </div>
    </div>
  );
}
