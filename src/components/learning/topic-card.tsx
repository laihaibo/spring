"use client";

import Link from "next/link";
import { ChevronRight, RefreshCcw } from "lucide-react";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { useLearningStore } from "@/hooks/use-learning-store";
import { useMounted } from "@/hooks/use-mounted";
import { LEVEL_LABEL } from "@/lib/content";
import { needsReview, topicMastery } from "@/lib/learning-store";
import type { Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

/** 知识点卡片：等级 + 概览 + 掌握度进度条 + 复习队列标记 */
export function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const { data } = useLearningStore();
  const mounted = useMounted();
  const record = mounted ? data.records[topic.id] : undefined;
  const mastery = topicMastery(record);
  const review = needsReview(record);

  return (
    <Link href={`/learn/${topic.track}/${topic.id}`} className="block">
      <LiquidGlassCard
        soft
        className="group p-4 transition-transform duration-200 active:scale-[0.99] md:hover:scale-[1.01] md:hover:bg-white/12"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="nums text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Badge level={topic.level} />
              {review && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">
                  <RefreshCcw className="size-3" />
                  待复习
                </span>
              )}
            </div>
            <h3 className="text-[16px] font-semibold leading-snug">{topic.title}</h3>
            <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{topic.brief}</p>
          </div>
          <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-[width] duration-500"
              style={{ width: `${mastery}%` }}
            />
          </div>
          <span className="nums text-[11px] text-muted-foreground">
            {mastery}% · {topic.quiz.length} 题
          </span>
        </div>

        {topic.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {topic.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </LiquidGlassCard>
    </Link>
  );
}

function Badge({ level }: { level: Topic["level"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium",
        level === 1 && "bg-emerald-400/15 text-emerald-300",
        level === 2 && "bg-sky-400/15 text-sky-300",
        level === 3 && "bg-fuchsia-400/15 text-fuchsia-300",
      )}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}
