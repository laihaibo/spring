"use client";

import Link from "next/link";
import { ArrowRight, RefreshCcw, Target } from "lucide-react";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { ProgressRing } from "@/components/learning/progress-ring";
import { useLearningStore } from "@/hooks/use-learning-store";
import { useMounted } from "@/hooks/use-mounted";
import { ALL_TOPICS, getTopicById, getTopicsByTrack, TRACKS, TRACK_META } from "@/lib/content";
import {
  dueMistakeIds,
  isMastered,
  needsReview,
  pendingMistakeCount,
  topicMastery,
} from "@/lib/learning-store";
import type { Track } from "@/lib/types";

/** 学习总览仪表盘：三条 track 进度环 + 复习队列 + 继续学习 */
export function DashboardView() {
  const { data } = useLearningStore();
  const mounted = useMounted();

  const dueIds = mounted ? dueMistakeIds(data) : [];
  const reviewTopicIds = mounted
    ? Object.values(data.records)
        .filter((r) => needsReview(r))
        .map((r) => r.topicId)
    : [];

  const nextTopic = mounted
    ? ALL_TOPICS.find((t) => !isMastered(data.records[t.id]))
    : undefined;

  return (
    <div className="space-y-5">
      <p className="text-[13.5px] text-muted-foreground">
        学 → 讲 → 练 → 记 → 复习，费曼学习法闭环
      </p>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((track, i) => (
          <TrackProgressCard key={track} track={track} ringIndex={i} />
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <LiquidGlassCard soft className="p-4">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold">
            <RefreshCcw className="size-4 text-amber-300" />
            复习队列
          </h2>
          {reviewTopicIds.length === 0 && dueIds.length === 0 ? (
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              暂无待复习项。费曼自评低于 3 分的知识点、答错的题目（7 天后）会出现在这里。
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {reviewTopicIds.length > 0 && (
                <div>
                  <p className="nums mb-1.5 text-[12px] text-muted-foreground">
                    未掌握知识点 · {reviewTopicIds.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reviewTopicIds.map((id) => (
                      <ReviewChip key={id} topicId={id} />
                    ))}
                  </div>
                </div>
              )}
              {dueIds.length > 0 && (
                <p className="text-[13.5px] text-muted-foreground">
                  <Target className="mr-1 inline size-3.5 text-destructive" />
                  有 <span className="nums font-medium text-foreground">{dueIds.length}</span>{" "}
                  道错题已到复习周期，
                  <Link href="/practice" className="text-[var(--primary)] underline-offset-4 hover:underline">
                    去刷题页巩固
                  </Link>
                </p>
              )}
            </div>
          )}
        </LiquidGlassCard>

        <LiquidGlassCard soft className="flex flex-col justify-between p-4">
          <div>
            <h2 className="text-[15px] font-semibold">继续学习</h2>
            {nextTopic ? (
              <>
                <p className="mt-2 text-[16px] font-medium">{nextTopic.title}</p>
                <p className="mt-1 line-clamp-2 text-[13.5px] text-muted-foreground">{nextTopic.brief}</p>
              </>
            ) : (
              <p className="mt-2 text-[13.5px] text-muted-foreground">
                当前批次内容已全部掌握，去路线图看看下一步学什么。
              </p>
            )}
          </div>
          {nextTopic && (
            <Link
              href={`/learn/${nextTopic.track}/${nextTopic.id}`}
              className="touch-target mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/80 to-violet-500/80 px-4 text-[14px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-opacity hover:opacity-90"
            >
              开始这一讲
              <ArrowRight className="size-4" />
            </Link>
          )}
        </LiquidGlassCard>
      </section>
    </div>
  );
}

function TrackProgressCard({ track, ringIndex }: { track: Track; ringIndex: number }) {
  const { data } = useLearningStore();
  const mounted = useMounted();
  const topics = getTopicsByTrack(track);
  const meta = TRACK_META[track];
  const mastered = mounted ? topics.filter((t) => isMastered(data.records[t.id])).length : 0;
  const progress =
    topics.length > 0 && mounted
      ? topics.reduce((sum, t) => sum + topicMastery(data.records[t.id]), 0) / topics.length
      : 0;

  return (
    <Link href={`/learn/${track}`}>
      <LiquidGlassCard soft className="flex items-center gap-4 p-4">
        <ProgressRing
          value={progress}
          id={`ring-${track}`}
          from={ringIndex === 0 ? "#22d3ee" : ringIndex === 1 ? "#a78bfa" : "#fbbf24"}
          to={ringIndex === 0 ? "#3b82f6" : ringIndex === 1 ? "#8b5cf6" : "#ec4899"}
          sublabel="掌握度"
        />
        <div className="min-w-0">
          <h3 className={`text-[15px] font-semibold ${meta.text}`}>{meta.label}</h3>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">{meta.brief}</p>
          <p className="nums mt-1.5 text-[12.5px] text-muted-foreground">
            {topics.length > 0 ? `${mastered}/${topics.length} 已掌握` : "内容筹备中"}
          </p>
        </div>
      </LiquidGlassCard>
    </Link>
  );
}

function ReviewChip({ topicId }: { topicId: string }) {
  const topic = getTopicById(topicId);
  if (!topic) return null;
  return (
    <Link
      href={`/learn/${topic.track}/${topic.id}`}
      className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-[13px] text-amber-200 transition-colors hover:bg-amber-300/20"
    >
      {topic.title}
    </Link>
  );
}
