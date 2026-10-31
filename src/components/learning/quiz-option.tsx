"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizOptionKey } from "@/lib/types";

/** 单个选项行：提交后高亮正确/误选并提供逐选项解析 */
export function QuizOptionRow({
  label,
  text,
  state,
  disabled,
  onToggle,
}: {
  label: QuizOptionKey | "T" | "F";
  text: string;
  state: "idle" | "picked" | "correct" | "wrong" | "muted";
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-start text-[15px] transition-all",
        "min-h-11",
        state === "idle" && "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10",
        state === "picked" && "border-[var(--primary)]/70 bg-[var(--primary)]/15",
        state === "correct" && "border-emerald-400/60 bg-emerald-400/15",
        state === "wrong" && "border-destructive/70 bg-destructive/15",
        state === "muted" && "border-white/10 bg-white/3 opacity-60",
      )}
    >
      <span
        className={cn(
          "nums mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold",
          state === "correct" && "border-emerald-400/60 bg-emerald-400/20 text-emerald-300",
          state === "wrong" && "border-destructive/60 bg-destructive/20 text-destructive",
          state === "picked" && "border-[var(--primary)]/60 bg-[var(--primary)]/20 text-[var(--primary)]",
        )}
      >
        {state === "correct" ? <Check className="size-3.5" /> : state === "wrong" ? <X className="size-3.5" /> : label}
      </span>
      <span className="min-w-0 flex-1">{text}</span>
    </button>
  );
}
