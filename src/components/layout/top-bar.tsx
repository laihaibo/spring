"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/layout/settings-dialog";
import { getTopicById, TRACK_META } from "@/lib/content";
import type { Track } from "@/lib/types";

/** 由路由派生当前页标题与返回目标（usePathname 不含 basePath） */
function resolvePage(pathname: string): { title: string; back?: string } {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return { title: "学习总览" };
  }

  if (segments[0] === "learn") {
    const track = segments[1] as Track;
    const meta = TRACK_META[track];
    if (segments.length === 2) {
      return { title: meta?.label ?? "知识点列表", back: "/" };
    }
    const topic = getTopicById(segments[2] ?? "");
    return {
      title: topic?.title ?? meta?.label ?? "知识点",
      back: `/learn/${track}`,
    };
  }

  const singles: Record<string, string> = {
    practice: "刷题与错题本",
    notes: "我的笔记",
    roadmap: "学习路线图",
  };
  if (segments[0] && singles[segments[0]]) {
    return { title: singles[segments[0]], back: "/" };
  }
  return { title: "Spring Learn" };
}

/** 统一顶栏：左侧返回 + 页面标题，右侧设置齿轮（打开设置弹窗） */
export function TopBar() {
  const pathname = usePathname();
  const { title, back } = resolvePage(pathname);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <header className="liquid-glass liquid-glass-strong sticky top-0 z-40 rounded-none border-x-0 border-t-0 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-1 px-3 md:px-6">
          {back && (
            <Link
              href={back}
              aria-label="返回"
              className="touch-target flex size-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <ChevronLeft className="size-5" />
            </Link>
          )}
          <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-wide">
            {title}
          </h1>
          <button
            type="button"
            aria-label="设置"
            onClick={() => setSettingsOpen(true)}
            className="touch-target flex size-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </header>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
