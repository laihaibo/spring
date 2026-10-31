"use client";

import { useSyncExternalStore } from "react";
import * as store from "@/lib/learning-store";
import type { AppData, ImportStrategy, LearningRecord, Note } from "@/lib/types";

/**
 * 全站学习数据唯一入口。
 * SSR 阶段返回空数据，挂载后自动同步 localStorage（避免 hydration 不匹配）。
 */
export function useLearningStore(): {
  data: AppData;
  ready: boolean;
  saveFeynman: typeof store.saveFeynman;
  setSelfRating: typeof store.setSelfRating;
  recordQuizAttempt: typeof store.recordQuizAttempt;
  upsertNote: (note: Note) => void;
  deleteNote: typeof store.deleteNote;
  replaceAll: (data: AppData, strategy: ImportStrategy) => void;
  clearAll: typeof store.clearAll;
  getRecord: (topicId: string) => LearningRecord;
} {
  const data = useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getServerSnapshot,
  );

  return {
    data,
    ready: data !== store.getServerSnapshot(),
    saveFeynman: store.saveFeynman,
    setSelfRating: store.setSelfRating,
    recordQuizAttempt: store.recordQuizAttempt,
    upsertNote: store.upsertNote,
    deleteNote: store.deleteNote,
    replaceAll: store.replaceAll,
    clearAll: store.clearAll,
    getRecord: (topicId: string) => data.records[topicId] ?? {
      topicId,
      quizAttempts: [],
      lastReviewedAt: 0,
      reviewedCount: 0,
    },
  };
}
