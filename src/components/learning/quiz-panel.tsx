"use client";

import { CheckCircle2, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { QuizQuestion } from "@/components/learning/quiz-question";
import { useQuizEngine } from "@/hooks/use-quiz-engine";
import type { Quiz } from "@/lib/types";

/** 习题带练容器：进度 → 单题作答 → 解析 → 下一题 → 完成页 */
export function QuizPanel({
  quizzes,
  emptyHint = "本知识点暂无习题",
  onFinish,
}: {
  quizzes: Quiz[];
  emptyHint?: string;
  onFinish?: () => void;
}) {
  const engine = useQuizEngine(quizzes);

  if (quizzes.length === 0) {
    return (
      <LiquidGlassCard soft className="p-6 text-center text-[14px] text-muted-foreground">
        {emptyHint}
      </LiquidGlassCard>
    );
  }

  if (engine.finished) {
    return <FinishCard total={engine.total} onRestart={engine.restart} onFinish={onFinish} />;
  }

  const canSubmit =
    engine.answer !== null &&
    (engine.answer.kind !== "multi" || engine.answer.choices.length > 0);

  return (
    <LiquidGlassCard soft className="p-4">
      <QuizQuestion quiz={quizzes[engine.index]!} engine={engine} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="nums text-[12px] text-muted-foreground">
          {engine.submitted ? "已交卷，查看解析" : "作答后点击提交"}
        </span>
        {engine.submitted ? (
          <Button className="touch-target h-11 px-5" onClick={engine.index + 1 >= engine.total ? onFinish : engine.next}>
            {engine.index + 1 >= engine.total ? "完成" : "下一题"}
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button className="touch-target h-11 px-6" onClick={engine.submit} disabled={!canSubmit}>
            提交
          </Button>
        )}
      </div>
    </LiquidGlassCard>
  );
}

function FinishCard({
  total,
  onRestart,
  onFinish,
}: {
  total: number;
  onRestart: () => void;
  onFinish?: () => void;
}) {
  return (
    <LiquidGlassCard soft className="p-6 text-center">
      <Trophy className="mx-auto size-10 text-amber-300" />
      <h3 className="mt-3 text-[17px] font-semibold">本轮刷题完成</h3>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        共 {total} 题，答错的已自动进入错题本（7 天后重现）。
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="ghost" className="touch-target h-10 border border-white/15 bg-white/5" onClick={onRestart}>
          <RotateCcw className="size-4" />
          再来一轮
        </Button>
        {onFinish && (
          <Button className="touch-target h-10" onClick={onFinish}>
            <CheckCircle2 className="size-4" />
            返回知识点
          </Button>
        )}
      </div>
    </LiquidGlassCard>
  );
}
