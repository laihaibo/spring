"use client";

import * as React from "react";
import { AlarmClock, Play, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { QuizPanel } from "@/components/learning/quiz-panel";
import { useLearningStore } from "@/hooks/use-learning-store";
import { useMounted } from "@/hooks/use-mounted";
import { getAllQuizzes, getQuizById, getQuizzesByTrack, TRACKS, TRACK_META } from "@/lib/content";
import { dueMistakeIds, pendingMistakeCount } from "@/lib/learning-store";
import type { Quiz, Track } from "@/lib/types";
import { cn } from "@/lib/utils";

const SESSION_SIZE = 10;

/** 刷题中心：错题本（到期重现）+ 自由刷题（按轨道筛选，每轮 10 题） */
export function PracticeView() {
  const { data } = useLearningStore();
  const mounted = useMounted();
  const dueIds = mounted ? dueMistakeIds(data) : [];
  const pending = mounted ? pendingMistakeCount(data) : 0;

  const [track, setTrack] = React.useState<"all" | Track>("all");
  const [mistakeSession, setMistakeSession] = React.useState<Quiz[] | null>(null);
  const [freeSession, setFreeSession] = React.useState<Quiz[] | null>(null);
  const [sessionKey, setSessionKey] = React.useState(0);

  const dueQuizzes = dueIds
    .map((id) => getQuizById(id))
    .filter((q): q is Quiz => Boolean(q));

  const pool = track === "all" ? getAllQuizzes() : getQuizzesByTrack(track);

  const startMistakes = () => {
    setMistakeSession(shuffle(dueQuizzes));
    setSessionKey((k) => k + 1);
  };

  const startFree = () => {
    setFreeSession(shuffle(pool).slice(0, SESSION_SIZE));
    setSessionKey((k) => k + 1);
  };

  return (
    <div className="space-y-5">
      <p className="text-[13.5px] text-muted-foreground">
        答错的题自动进入错题本，7 天后间隔重现；答对即移出。
      </p>

      <LiquidGlassCard soft className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold">
            <AlarmClock className="size-4 text-destructive" />
            错题本 · 到期复习
            <span className="nums rounded-full bg-destructive/20 px-2 py-0.5 text-[12px] text-destructive">
              {dueQuizzes.length}
            </span>
          </h2>
          {dueQuizzes.length > 0 && !mistakeSession && (
            <Button className="touch-target h-10" onClick={startMistakes}>
              <Play className="size-4" />
              开始复习
            </Button>
          )}
        </div>
        {pending > 0 && (
          <p className="nums mt-2 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <Timer className="size-3.5" />
            另有 {pending} 道错题冷却中（不足 7 天，之后自动重现）
          </p>
        )}
        {dueQuizzes.length === 0 ? (
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            没有到期的错题。做错的题会在 7 天后出现在这里。
          </p>
        ) : mistakeSession ? (
          <div className="mt-3">
            <QuizPanel
              key={`mistake-${sessionKey}`}
              quizzes={mistakeSession}
              emptyHint="没有到期错题"
              onFinish={() => setMistakeSession(null)}
            />
          </div>
        ) : null}
      </LiquidGlassCard>

      <LiquidGlassCard soft className="p-4">
        <h2 className="text-[15px] font-semibold">自由刷题</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={track === "all"} onClick={() => setTrack("all")}>
            全部
          </FilterChip>
          {TRACKS.map((t) => (
            <FilterChip key={t} active={track === t} onClick={() => setTrack(t)}>
              {TRACK_META[t].label}
            </FilterChip>
          ))}
        </div>
        <p className="nums mt-3 text-[13px] text-muted-foreground">
          题库共 {pool.length} 题，每轮随机 {Math.min(SESSION_SIZE, pool.length)} 题。
        </p>
        {freeSession ? (
          <div className="mt-3">
            <QuizPanel
              key={`free-${sessionKey}`}
              quizzes={freeSession}
              emptyHint="题库为空"
              onFinish={() => setFreeSession(null)}
            />
          </div>
        ) : (
          <Button className="touch-target mt-3 h-11" onClick={startFree} disabled={pool.length === 0}>
            <Play className="size-4" />
            开始一轮
          </Button>
        )}
      </LiquidGlassCard>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "touch-target rounded-full border px-3.5 py-2 text-[13px] transition-colors",
        active
          ? "border-[var(--primary)]/70 bg-[var(--primary)]/15 text-foreground"
          : "border-white/15 bg-white/5 text-muted-foreground hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}
