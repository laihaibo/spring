"use client";

import * as React from "react";
import { isAnswerCorrect } from "@/lib/quiz-utils";
import { recordQuizAttempt } from "@/lib/learning-store";
import type { Quiz, QuizAnswer, QuizOptionKey } from "@/lib/types";

/**
 * 习题带练引擎：未答 → 已提交（显示正确性 + 逐选项解析）→ 下一题。
 * 提交即写入学习记录（错题自动入册）。
 */
export interface QuizEngine {
  index: number;
  current: Quiz | undefined;
  answer: QuizAnswer | null;
  submitted: boolean;
  correct: boolean;
  finished: boolean;
  total: number;
  setChoice: (choice: QuizOptionKey) => void;
  toggleMulti: (choice: QuizOptionKey) => void;
  setJudge: (value: boolean) => void;
  setBlank: (index: number, value: string) => void;
  submit: () => void;
  next: () => void;
  restart: () => void;
}

export function useQuizEngine(quizzes: Quiz[], topicId?: string): QuizEngine {
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState<QuizAnswer | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [correct, setCorrect] = React.useState(false);

  const current = quizzes[index];
  const finished = quizzes.length > 0 && index >= quizzes.length;

  // 切题 / 重开时重置作答状态
  React.useEffect(() => {
    setAnswer(null);
    setSubmitted(false);
    setCorrect(false);
  }, [index, quizzes]);

  const setChoice = React.useCallback((choice: QuizOptionKey) => {
    if (submitted) return;
    setAnswer({ kind: "choice", choice });
  }, [submitted]);

  const toggleMulti = React.useCallback((choice: QuizOptionKey) => {
    if (submitted) return;
    setAnswer((prev) => {
      const choices = prev?.kind === "multi" ? prev.choices : [];
      return {
        kind: "multi",
        choices: choices.includes(choice)
          ? choices.filter((c) => c !== choice)
          : [...choices, choice],
      };
    });
  }, [submitted]);

  const setJudge = React.useCallback((value: boolean) => {
    if (submitted) return;
    setAnswer({ kind: "judge", value });
  }, [submitted]);

  const setBlank = React.useCallback((i: number, value: string) => {
    if (submitted) return;
    setAnswer((prev) => {
      const values = prev?.kind === "blanks" ? [...prev.values] : [];
      values[i] = value;
      return { kind: "blanks", values };
    });
  }, [submitted]);

  const submit = React.useCallback(() => {
    if (!current || submitted) return;
    const ok = isAnswerCorrect(current, answer);
    setCorrect(ok);
    setSubmitted(true);
    // 交卷即写学习记录；错题自动进入错题本（7 天后间隔重现）
    recordQuizAttempt(current.topicId ?? topicId ?? "", current.id, ok);
  }, [current, submitted, answer, topicId]);

  const next = React.useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const restart = React.useCallback(() => {
    setIndex(0);
  }, []);

  return {
    index,
    current,
    answer,
    submitted,
    correct,
    finished,
    total: quizzes.length,
    setChoice,
    toggleMulti,
    setJudge,
    setBlank,
    submit,
    next,
    restart,
  };
}
