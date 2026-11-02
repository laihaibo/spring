"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CircleCheck, CircleX, Lightbulb, Sparkles } from "lucide-react";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFileIcon,
  CodeBlockHeader,
  CodeBlockLanguageBadge,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { QuizOptionRow } from "@/components/learning/quiz-option";
import { correctAnswerLabel, OPTION_KEYS, quizCode } from "@/lib/quiz-utils";
import { getTopicById } from "@/lib/content";
import type { Quiz } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { QuizEngine } from "@/hooks/use-quiz-engine";

/** 单题渲染：作答 UI（按题型）+ 提交后逐选项解析 + 「为什么这么设计」+ 关联知识点 */
export function QuizQuestion({ quiz, engine }: { quiz: Quiz; engine: QuizEngine }) {
  const code = quizCode(quiz);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          <span className="nums">
            第 {engine.index + 1} / {engine.total} 题
          </span>
          <KindBadge quiz={quiz} />
        </div>
        <p className="text-[16px] font-medium leading-relaxed">{quiz.question}</p>
      </div>

      {code && (
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <CodeBlockFileIcon />
              {code.path}
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockLanguageBadge language={code.language} />
              <CodeBlockCopyButton value={code.code} aria-label="复制代码" />
            </CodeBlockActions>
          </CodeBlockHeader>
          {quiz.kind === "code-completion" ? (
            <TemplateBody quiz={quiz} engine={engine} />
          ) : (
            <CodeBlockContent code={code.code} language={code.language} lineNumbers />
          )}
        </CodeBlock>
      )}

      {!code && quiz.kind === "code-completion" && <TemplateBody quiz={quiz} engine={engine} />}

      <AnswerArea quiz={quiz} engine={engine} />
      {engine.submitted && <Analysis quiz={quiz} correct={engine.correct} />}
    </div>
  );
}

function KindBadge({ quiz }: { quiz: Quiz }) {
  const label =
    quiz.kind === "single"
      ? "单选"
      : quiz.kind === "judge"
        ? "判断"
        : quiz.kind === "multiple"
          ? "多选"
          : quiz.kind === "code-reading"
            ? "代码阅读"
            : "代码补全";
  return (
    <span className="rounded-full border border-border bg-foreground/8 px-2 py-0.5 text-[11px] text-muted-foreground">
      {label}
    </span>
  );
}

function AnswerArea({ quiz, engine }: { quiz: Quiz; engine: QuizEngine }) {
  switch (quiz.kind) {
    case "single":
    case "code-reading":
      return (
        <div className="space-y-2">
          {OPTION_KEYS.filter((k) => quiz.options[k] !== undefined).map((key) => {
            const picked = engine.answer?.kind === "choice" && engine.answer.choice === key;
            const state = !engine.submitted
              ? picked
                ? "picked"
                : "idle"
              : key === quiz.answer
                ? "correct"
                : picked
                  ? "wrong"
                  : "muted";
            return (
              <QuizOptionRow
                key={key}
                label={key}
                text={quiz.options[key] ?? ""}
                state={state}
                disabled={engine.submitted}
                onToggle={() => engine.setChoice(key)}
              />
            );
          })}
        </div>
      );
    case "judge":
      return (
        <div className="grid grid-cols-2 gap-2">
          {([true, false] as const).map((v) => {
            const picked = engine.answer?.kind === "judge" && engine.answer.value === v;
            const state = !engine.submitted
              ? picked
                ? "picked"
                : "idle"
              : v === quiz.answer
                ? "correct"
                : picked
                  ? "wrong"
                  : "muted";
            return (
              <QuizOptionRow
                key={String(v)}
                label={v ? "T" : "F"}
                text={v ? "正确" : "错误"}
                state={state}
                disabled={engine.submitted}
                onToggle={() => engine.setJudge(v)}
              />
            );
          })}
        </div>
      );
    case "multiple":
      return (
        <div className="space-y-2">
          {OPTION_KEYS.filter((k) => quiz.options[k] !== undefined).map((key) => {
            const picked = engine.answer?.kind === "multi" && engine.answer.choices.includes(key);
            const isAns = quiz.answers.includes(key);
            const state = !engine.submitted
              ? picked
                ? "picked"
                : "idle"
              : isAns
                ? "correct"
                : picked
                  ? "wrong"
                  : "muted";
            return (
              <QuizOptionRow
                key={key}
                label={key}
                text={quiz.options[key] ?? ""}
                state={state}
                disabled={engine.submitted}
                onToggle={() => engine.toggleMulti(key)}
              />
            );
          })}
        </div>
      );
    case "code-completion":
      return (
        <div className="space-y-3">
          {quiz.blanks.map((blank, i) => {
            const value = engine.answer?.kind === "blanks" ? (engine.answer.values[i] ?? "") : "";
            const ok = engine.submitted && value.trim() === blank.answer.trim();
            const bad = engine.submitted && !ok;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <span className="nums w-12 shrink-0 text-[13px] text-muted-foreground">空 {i + 1}</span>
                <select
                  value={value}
                  disabled={engine.submitted}
                  onChange={(e) => engine.setBlank(i, e.target.value)}
                  aria-label={`第 ${i + 1} 个空的候选词`}
                  className={cn(
                    "touch-target h-11 flex-1 rounded-xl border bg-foreground/5 px-3 text-[15px] outline-none",
                    "border-border focus:border-[var(--primary)]/60",
                    ok && "border-emerald-400/60 bg-emerald-400/10",
                    bad && "border-destructive/60 bg-destructive/10",
                  )}
                >
                  <option value="">选择候选词…</option>
                  {blank.candidates.map((c) => (
                    <option key={c} value={c} className="bg-background text-foreground">
                      {c}
                    </option>
                  ))}
                </select>
                {engine.submitted && (
                  <span className="w-6 text-center">
                    {ok ? <CircleCheck className="size-5 text-emerald-400" /> : <CircleX className="size-5 text-destructive" />}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
  }
}

/** 代码补全题的模板渲染：__n__ 位置显示当前已选词或占位标记 */
function TemplateBody({ quiz, engine }: { quiz: Extract<Quiz, { kind: "code-completion" }>; engine: QuizEngine }) {
  const lines = quiz.codeTemplate.split("\n");
  return (
    <div className="cb-scroll overflow-x-auto px-4 py-3" dir="ltr">
      <pre className="cb-pre">
        <code className="cb-code">
          {lines.map((line, li) => {
            const parts = line.split(/(__\d+__)/g);
            return (
              <span key={li} className="cb-line">
                {parts.map((part, pi) => {
                  const m = part.match(/^__(\d+)__$/);
                  if (!m) return <React.Fragment key={pi}>{part}</React.Fragment>;
                  const i = Number(m[1]) - 1;
                  const value = engine.answer?.kind === "blanks" ? engine.answer.values[i] : undefined;
                  return (
                    <span
                      key={pi}
                      className={cn(
                        "nums mx-0.5 inline-block rounded-md border px-1.5 align-middle text-[12px]",
                        value
                          ? "border-[var(--primary)]/60 bg-[var(--primary)]/20 text-[var(--primary)]"
                          : "border-dashed border-amber-600/50 bg-amber-300/10 text-amber-700 dark:border-amber-300/50 dark:text-amber-200",
                      )}
                    >
                      {value ? value : `空${i + 1}`}
                    </span>
                  );
                })}
                {"\n"}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function Analysis({ quiz, correct }: { quiz: Quiz; correct: boolean }) {
  const related = quiz.relatedTopicIds
    .map((id) => getTopicById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3.5 py-3 text-[15px] font-medium",
          correct
            ? "border-emerald-400/50 bg-emerald-400/12 text-emerald-600 dark:text-emerald-300"
            : "border-destructive/50 bg-destructive/12 text-destructive",
        )}
      >
        {correct ? <CircleCheck className="size-5" /> : <CircleX className="size-5" />}
        {correct ? "回答正确" : "回答错误"}
        <span className="nums ml-auto text-[13px] font-normal opacity-85">
          正确答案：{correctAnswerLabel(quiz)}
        </span>
      </div>

      {quiz.optionExplanations && (
        <div className="rounded-xl border border-border bg-foreground/5 p-3.5">
          <div className="mb-2 text-[14px] font-medium">逐选项解析</div>
          <ul className="space-y-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
            {Object.entries(quiz.optionExplanations).map(([key, text]) => (
              <li key={key} className="flex gap-2">
                <span className="nums shrink-0 font-medium text-foreground/85">{key}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-foreground/5 p-3.5">
        <div className="mb-1.5 flex items-center gap-1.5 text-[14px] font-medium">
          <BookOpen className="size-4 text-[var(--primary)]" />
          本题解析
        </div>
        <p className="text-[14px] leading-relaxed text-muted-foreground">{quiz.explanation}</p>
      </div>

      <div className="rounded-xl border border-amber-600/30 bg-amber-300/8 p-3.5 dark:border-amber-300/25">
        <div className="mb-1.5 flex items-center gap-1.5 text-[14px] font-medium text-amber-700 dark:text-amber-200">
          <Sparkles className="size-4" />
          为什么这么设计
        </div>
        <p className="text-[14px] leading-relaxed text-amber-800 dark:text-amber-100/80">{quiz.designWhy}</p>
      </div>

      {related.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <Lightbulb className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">关联知识点：</span>
          {related.map((t) => (
            <Link
              key={t.id}
              href={`/learn/${t.track}/${t.id}`}
              className="rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-2.5 py-1 text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
            >
              {t.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
