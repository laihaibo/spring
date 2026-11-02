"use client";

import * as React from "react";
import { Lightbulb, MessageSquareQuote, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { useLearningStore } from "@/hooks/use-learning-store";
import { useMounted } from "@/hooks/use-mounted";
import { topicMastery } from "@/lib/learning-store";
import type { LearningRecord, Topic } from "@/lib/types";

const GUIDE_QUESTIONS = [
  "你能否只用一句话概括它的本质？",
  "它解决的核心痛点是什么？不用它会更麻烦在哪？",
  "你能否举一个真实代码场景的例子？",
];

const RATING_LABEL: Record<number, string> = {
  1: "完全没懂",
  2: "有点模糊",
  3: "基本讲清",
  4: "讲得清楚",
  5: "能教会别人",
};

/** 费曼环节：我的复述 → 三个引导自查 → 1-5 自我评分 → 未掌握自动进复习队列 */
export function FeynmanPanel({ topic }: { topic: Topic }) {
  const { data, saveFeynman, setSelfRating } = useLearningStore();
  const mounted = useMounted();
  const record = data.records[topic.id];
  const [draft, setDraft] = React.useState("");

  React.useEffect(() => {
    if (mounted) setDraft(record?.feynmanNote ?? "");
    // 仅在挂载与 record 变化时同步草稿
  }, [mounted, record?.feynmanNote]);

  const rating = record?.selfRating;

  const handleSave = () => {
    saveFeynman(topic.id, draft, undefined);
  };

  const handleRate = (value: number) => {
    setSelfRating(topic.id, value as LearningRecord["selfRating"]);
  };

  if (!mounted) {
    return <SkeletonCard />;
  }

  return (
    <div className="space-y-4">
      <LiquidGlassCard soft className="p-4">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-medium">
          <MessageSquareQuote className="size-4 text-[var(--primary)]" />
          用你自己的话，把这个概念讲给一个完全不懂的朋友听
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="例：IoC 就像……（先别翻资料，凭理解写；写不下去的地方就是没吃透的地方）"
          rows={8}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-border bg-foreground/5 p-3 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground/60 focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-ring/30"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="nums text-xs text-muted-foreground">
            {draft.length > 0 ? `已写 ${draft.length} 字` : "写下来，才算真的想清楚了"}
          </span>
          <Button size="sm" className="touch-target h-10" onClick={handleSave} disabled={draft.trim() === ""}>
            <Save className="size-4" />
            保存我的复述
          </Button>
        </div>
      </LiquidGlassCard>

      {record?.feynmanNote ? (
        <LiquidGlassCard soft className="p-4">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-medium">
            <Lightbulb className="size-4 text-amber-600 dark:text-amber-300" />
            写完自查：三个引导问题
          </div>
          <ol className="space-y-2.5">
            {GUIDE_QUESTIONS.map((q, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]">
                <span className="nums mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-xs font-semibold text-[var(--primary)]">
                  {i + 1}
                </span>
                {q}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[13px] text-muted-foreground">
            对照上方「我的复述」逐条问自己：答不上来的那一条，就是回头重看讲解的理由。
          </p>
        </LiquidGlassCard>
      ) : (
        <p className="px-1 text-[13px] text-muted-foreground">
          保存复述后，这里会出现三个引导自查问题。
        </p>
      )}

      <LiquidGlassCard soft className="p-4">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <span className="text-[15px] font-medium">自我评分</span>
          <span className="nums text-[15px] font-semibold text-[var(--primary)]">
            {rating ?? "—"} {rating ? `· ${RATING_LABEL[rating]}` : ""}
          </span>
        </div>
        <Slider
          value={[rating ?? 1]}
          min={1}
          max={5}
          step={1}
          onValueChange={(v) => handleRate(v[0] ?? 1)}
          className="my-2"
          aria-label="自我评分 1 到 5"
        />
        <div className="nums flex justify-between text-[11px] text-muted-foreground">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {rating !== undefined && rating < 3
            ? "未掌握：已自动进入复习队列，在仪表盘和刷题页会反复出现。"
            : rating !== undefined
              ? `当前掌握度 ${topicMastery(record)}%。做几道题巩固，正确率会折算进掌握度。`
              : "先写复述，再拖动滑块打分（1-5 分）。低于 3 分自动进入复习队列。"}
        </p>
      </LiquidGlassCard>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="liquid-glass liquid-glass-soft h-72 animate-pulse rounded-2xl" aria-hidden />
  );
}
