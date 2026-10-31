"use client";

import { Download, Info } from "lucide-react";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFileIcon,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLanguageBadge,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import type { CodeExample } from "@/lib/types";

/**
 * 统一代码示例卡：头部 = 文件路径 + 语言标签 + 一键复制（去行号、保留缩进）；
 * 底部 = 说明 + 「在本地试运行」下载按钮。
 */
export function CodeExampleCard({ example }: { example: CodeExample }) {
  const download = () => {
    const blob = new Blob([example.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = example.runnableFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <figure className="m-0">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <CodeBlockFileIcon />
            {example.filePath}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockLanguageBadge language={example.language} />
            <CodeBlockCopyButton value={example.code} aria-label={`复制 ${example.filePath}`} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent code={example.code} language={example.language} lineNumbers />
      </CodeBlock>
      {(example.summary || example.sourceNote) && (
        <figcaption className="mt-2 flex flex-col gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-[13px] text-muted-foreground">
          {example.summary && (
            <span className="flex items-start gap-1.5">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              {example.summary}
            </span>
          )}
          {example.sourceNote && (
            <span className="font-mono text-[12px] leading-relaxed text-muted-foreground/80">
              源码：{example.sourceNote}
            </span>
          )}
        </figcaption>
      )}
      <button
        type="button"
        onClick={download}
        className="touch-target mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-white/15 hover:text-foreground"
      >
        <Download className="size-3.5" />
        在本地试运行 · 下载 {example.runnableFileName}
      </button>
    </figure>
  );
}
