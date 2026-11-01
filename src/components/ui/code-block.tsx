"use client";

import * as React from "react";
import type { ShikiTransformer } from "shiki";
import { Check, Copy, FileCode2, WrapText } from "lucide-react";
import { cn } from "@/lib/utils";

/** 换行偏好全局记忆（默认换行：移动端免横向拖拽） */
const WRAP_PREF_KEY = "spring-learn:codewrap";

/**
 * 与 shadcn 官方 code-block 组件同接口的本地实现。
 * 官方注册表（new-york-v4）暂未收录 code-block（Base UI 变体），
 * 故按官方文档 API 自实现：组合式子组件 + Shiki 高亮 + CSS counter 行号。
 * 复制按钮永远拿到原始代码（行号是 CSS 装饰，不进入剪贴板）。
 */

const loaded = new Map<string, string>();

/** 去掉 shiki 自带的 pre 内联样式，交给玻璃容器控制外观 */
const stripPreStyle: ShikiTransformer = {
  name: "strip-pre-style",
  pre(node) {
    delete node.properties.style;
  },
};

export function useHighlightedCode(code: string, language: string): string | null {
  const [html, setHtml] = React.useState<string | null>(loaded.get(cacheKey(code, language)) ?? null);

  React.useEffect(() => {
    const key = cacheKey(code, language);
    if (loaded.has(key)) {
      setHtml(loaded.get(key) ?? null);
      return;
    }
    let active = true;
    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(code, {
          lang: language,
          theme: "one-dark-pro",
          transformers: [stripPreStyle],
        }),
      )
      .then((result) => {
        loaded.set(key, result);
        if (active) setHtml(result);
      })
      .catch(() => {
        // 高亮失败时静默降级为纯文本
      });
    return () => {
      active = false;
    };
  }, [code, language]);

  return html;
}

function cacheKey(code: string, language: string) {
  return `${language}:${code.length}:${hash(code)}`;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

export function CodeBlock({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block"
      className={cn(
        "group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0d1017]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.35)]",
        className,
      )}
      {...props}
    />
  );
}

export function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-h-11 w-full shrink-0 items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2",
        className,
      )}
      {...props}
    />
  );
}

export function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "flex min-w-0 items-center gap-1.5 truncate font-mono text-xs text-white/70",
        className,
      )}
      {...props}
    />
  );
}

export function CodeBlockActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

export function CodeBlockCopyButton({
  value,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        aria-label={copied ? "已复制" : "复制代码"}
        className={cn(
          "touch-target inline-flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-copied:text-emerald-400",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {});
        }}
        {...props}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "已复制" : ""}
      </span>
    </>
  );
}

export function CodeBlockLanguageBadge({ language, className }: { language: string; className?: string }) {
  return (
    <span
      className={cn(
        "nums rounded-full border border-white/15 bg-white/8 px-2 py-0.5 font-mono text-[11px] tracking-wide text-white/60 uppercase",
        className,
      )}
    >
      {language}
    </span>
  );
}

export function CodeBlockFileIcon({ className }: { className?: string }) {
  return <FileCode2 className="size-3.5 shrink-0 text-[var(--primary)]" aria-hidden />;
}

export function CodeBlockContent({
  className,
  children,
  code,
  language = "java",
  wrap: wrapProp,
  lineNumbers = false,
  ...props
}: React.ComponentProps<"div"> & {
  code: string;
  language?: string;
  /** 不传则读取全局偏好（默认换行） */
  wrap?: boolean;
  lineNumbers?: boolean;
}) {
  const highlighted = useHighlightedCode(code, language);
  const [globalWrap, setGlobalWrap] = React.useState(true);
  const [ready, setReady] = React.useState(false);

  // 首帧后读取持久化的换行偏好
  React.useEffect(() => {
    const stored = window.localStorage.getItem(WRAP_PREF_KEY);
    if (stored !== null) setGlobalWrap(stored === "true");
    setReady(true);
  }, []);

  const wrap = wrapProp ?? globalWrap;

  const toggleWrap = () => {
    setGlobalWrap((w) => {
      const next = !w;
      try {
        window.localStorage.setItem(WRAP_PREF_KEY, String(next));
      } catch {
        // 隐私模式忽略
      }
      return next;
    });
  };

  return (
    <div
      data-slot="code-block-content"
      data-numbered={lineNumbers || undefined}
      data-wrap={wrap ? "true" : undefined}
      className={cn(
        "cb-scroll relative min-h-0 min-w-0 overflow-x-auto overscroll-x-contain text-start outline-none",
        className,
      )}
      {...props}
    >
      {ready && (
        <button
          type="button"
          onClick={toggleWrap}
          aria-label={wrap ? "切换为横向滚动" : "切换为自动换行"}
          title={wrap ? "当前：自动换行" : "当前：横向滚动"}
          className={cn(
            "absolute right-2 bottom-2 z-10 flex size-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/50 backdrop-blur transition-colors hover:text-white",
            wrap && "text-white/85",
          )}
        >
          <WrapText className="size-4" />
        </button>
      )}
      {highlighted ? (
        <div className="cb-pre" dangerouslySetInnerHTML={{ __html: highlighted }} />
      ) : (
        <pre className="cb-pre" dir="ltr" tabIndex={0}>
          <code className={cn("cb-code font-mono")}>
            {code
              .replace(/\n$/, "")
              .split("\n")
              .map((line, i) => (
                <span key={i} className="cb-line">
                  {line === "" ? "\n" : line}
                </span>
              ))}
          </code>
        </pre>
      )}
    </div>
  );
}

export function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn("flex w-full shrink-0 items-center gap-2 border-t border-white/10 px-3 py-2", className)}
      {...props}
    />
  );
}
