"use client";

import { BookOpen } from "lucide-react";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { TopicCard } from "@/components/learning/topic-card";
import { LEVEL_LABEL } from "@/lib/content";
import type { Topic } from "@/lib/types";

/** 按 level 分组的知识点列表 */
export function TrackList({ topics }: { topics: Topic[] }) {
  const levels: Topic["level"][] = [1, 2, 3];
  const grouped = levels
    .map((level) => ({ level, items: topics.filter((t) => t.level === level) }))
    .filter((g) => g.items.length > 0);

  if (topics.length === 0) {
    return (
      <LiquidGlassCard soft className="flex flex-col items-center gap-2 p-10 text-center">
        <BookOpen className="size-8 text-muted-foreground" />
        <p className="text-[15px] font-medium">本轨道内容筹备中</p>
        <p className="text-[13px] text-muted-foreground">
          后续批次会按学习清单陆续补充知识点与习题。
        </p>
      </LiquidGlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <section key={group.level} className="space-y-3">
          <h2 className="flex items-center gap-2 px-1 text-[15px] font-semibold">
            <span className="rounded-md bg-foreground/10 px-2 py-0.5 text-[12px] text-muted-foreground">
              Lv.{group.level}
            </span>
            {LEVEL_LABEL[group.level]}
            <span className="nums text-[12px] font-normal text-muted-foreground">
              {group.items.length} 个知识点
            </span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.items.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
