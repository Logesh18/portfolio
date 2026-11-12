import React from "react";
import Link from "next/link";
import { isApprovedUrl } from "@/lib/security/allowlist";

interface SafeMarkdownProps {
  content: string;
}

function renderInlineSegments(line: string): React.ReactNode[] {
  // Split by **bold** or [label](url)
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = line.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1] ?? "";
      const href = (linkMatch[2] ?? "").trim();
      if (isApprovedUrl(href)) {
        const isExternal = href.startsWith("http");
        return (
          <Link
            key={index}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="underline decoration-blue-500/50 underline-offset-2 text-blue-600 dark:text-blue-400 hover:decoration-blue-500"
          >
            {label}
          </Link>
        );
      }
      return <span key={index}>{label}</span>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function SafeMarkdown({ content }: SafeMarkdownProps) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      blocks.push(
        <ul
          key={`${keyPrefix}-list`}
          className="list-disc pl-5 space-y-1.5 my-2 text-sm leading-relaxed"
        >
          {currentList.map((item, idx) => (
            <li key={idx}>{renderInlineSegments(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushList(`line-${idx}`);
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      currentList.push(trimmed.slice(2).trim());
    } else {
      flushList(`line-${idx}`);
      blocks.push(
        <p key={`p-${idx}`} className="text-sm leading-relaxed my-1.5">
          {renderInlineSegments(trimmed)}
        </p>
      );
    }
  });

  flushList("final");

  return <div className="space-y-1">{blocks}</div>;
}
