"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFileIcon,
  CodeBlockHeader,
  CodeBlockLanguageBadge,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

/** 从 fenced code 的 meta（如 ```java path=Demo.java）里取路径 */
function metaValue(meta: string, key: string): string | undefined {
  for (const token of meta.split(/\s+/)) {
    if (token.startsWith(key + "=")) return token.slice(key.length + 1);
  }
  return undefined;
}

const components: Components = {
  h1: (p) => <h2 className="mt-5 mb-3 text-lg font-semibold first:mt-0" {...p} />,
  h2: (p) => <h3 className="mt-5 mb-2 text-base font-semibold" {...p} />,
  h3: (p) => <h4 className="mt-4 mb-2 text-[15px] font-semibold" {...p} />,
  p: (p) => <p className="my-2.5 text-[15px] leading-relaxed" {...p} />,
  ul: (p) => <ul className="my-2.5 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed" {...p} />,
  ol: (p) => <ol className="my-2.5 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed" {...p} />,
  li: (p) => <li className="pl-1" {...p} />,
  strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
  blockquote: (p) => (
    <blockquote
      className="my-3 rounded-r-lg border-l-2 border-[var(--primary)] bg-white/5 py-1 pl-3 text-muted-foreground"
      {...p}
    />
  ),
  a: (p) => <a className="text-[var(--primary)] underline underline-offset-4" target="_blank" rel="noreferrer" {...p} />,
  hr: () => <hr className="my-4 border-white/10" />,
  table: (p) => (
    <div className="thin-scrollbar my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-[13px]" {...p} />
    </div>
  ),
  th: (p) => <th className="border-b border-white/10 bg-white/5 px-3 py-2 text-start font-medium" {...p} />,
  td: (p) => <td className="border-b border-white/5 px-3 py-2 align-top" {...p} />,
  code: (props) => <CodeRenderer {...props} />,
};

type CodeProps = {
  node?: { data?: { meta?: string | null | undefined } };
  className?: string;
  children?: React.ReactNode;
};

function CodeRenderer({ className, children, node }: CodeProps) {
  const raw = String(children ?? "");
  const languageMatch = (className ?? "").match(/language-([a-z0-9_-]+)/i);
  const isBlock = Boolean(languageMatch) || raw.includes("\n");

  if (!isBlock) {
    return (
      <code className="rounded-md border border-white/10 bg-white/8 px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--primary)]">
        {raw}
      </code>
    );
  }

  const language = languageMatch?.[1] ?? "java";
  const meta = node?.data?.meta ?? "";
  const path = metaValue(meta, "path") ?? "Snippet.java";

  return (
    <div className="my-3 min-w-0">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <CodeBlockFileIcon />
            {path}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockLanguageBadge language={language} />
            <CodeBlockCopyButton value={raw} aria-label={"复制 " + path} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent code={raw} language={language} lineNumbers />
      </CodeBlock>
    </div>
  );
}

/** 知识点讲解 / 笔记的 Markdown 渲染器 */
export function MarkdownViewer({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
