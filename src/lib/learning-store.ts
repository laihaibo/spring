import type {
  AppData,
  ImportStrategy,
  LearningRecord,
  MistakeEntry,
  Note,
} from "@/lib/types";

/**
 * 全站学习数据单例 store（纯 localStorage）。
 * 组件通过 hooks/use-learning-store.ts（useSyncExternalStore）消费。
 * localStorage key 统一前缀：spring-learn:
 */
export const STORAGE_KEY = "spring-learn:data";
/** 错题 7 天后间隔重现 */
export const REVIEW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export const EMPTY_DATA: AppData = { version: 1, records: {}, mistakes: {}, notes: [] };

let state: AppData = EMPTY_DATA;
let initialized = false;
const listeners = new Set<() => void>();

function defaultRecord(topicId: string): LearningRecord {
  return {
    topicId,
    feynmanNote: undefined,
    selfRating: undefined,
    quizAttempts: [],
    lastReviewedAt: 0,
    reviewedCount: 0,
  };
}

function loadFromStorage(): AppData {
  if (typeof window === "undefined") return EMPTY_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DATA;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return normalize(parsed);
  } catch {
    return EMPTY_DATA;
  }
}

/** 任何来源的数据进来都先归一化，保证运行时形状完整 */
export function normalize(input: Partial<AppData> | null | undefined): AppData {
  const records: Record<string, LearningRecord> = {};
  for (const [topicId, rec] of Object.entries(input?.records ?? {})) {
    const base = defaultRecord(topicId);
    records[topicId] = {
      ...base,
      ...rec,
      topicId,
      quizAttempts: Array.isArray(rec?.quizAttempts) ? rec.quizAttempts : [],
    };
  }
  const mistakes: Record<string, MistakeEntry> = {};
  for (const [quizId, m] of Object.entries(input?.mistakes ?? {})) {
    if (m && typeof m.lastWrongAt === "number") {
      mistakes[quizId] = {
        quizId,
        lastWrongAt: m.lastWrongAt,
        wrongCount: m.wrongCount ?? 1,
      };
    }
  }
  const notes = Array.isArray(input?.notes) ? input.notes : [];
  return { version: 1, records, mistakes, notes };
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 存储满 / 隐私模式：静默失败，不打断学习流程
  }
}

function commit(next: AppData) {
  state = next;
  persist();
  listeners.forEach((fn) => fn());
}

/** 立即从 localStorage 读取（客户端首帧前调用一次） */
export function ensureLoaded(): AppData {
  if (!initialized) {
    state = loadFromStorage();
    initialized = true;
  }
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): AppData {
  return ensureLoaded();
}

export function getServerSnapshot(): AppData {
  return EMPTY_DATA;
}

/* ---------------- 学习记录 actions ---------------- */

function upsertRecord(topicId: string, patch: (r: LearningRecord) => LearningRecord) {
  const records = { ...state.records };
  const current = records[topicId] ?? defaultRecord(topicId);
  records[topicId] = patch(current);
  commit({ ...state, records });
}

/** 保存「我的复述」+ 自我评分；评分 <3 的知识点自动进入复习队列（由派生逻辑判定） */
export function saveFeynman(topicId: string, feynmanNote: string, selfRating?: LearningRecord["selfRating"]) {
  upsertRecord(topicId, (r) => ({
    ...r,
    feynmanNote: feynmanNote.trim() || undefined,
    selfRating: selfRating ?? r.selfRating,
    lastReviewedAt: Date.now(),
    reviewedCount: r.reviewedCount + 1,
  }));
}

export function setSelfRating(topicId: string, selfRating: LearningRecord["selfRating"]) {
  upsertRecord(topicId, (r) => ({ ...r, selfRating, lastReviewedAt: Date.now() }));
}

/** 记录一次做题；答错进错题本，答对则移出 */
export function recordQuizAttempt(topicId: string, quizId: string, correct: boolean) {
  const now = Date.now();
  upsertRecord(topicId, (r) => ({
    ...r,
    quizAttempts: [...r.quizAttempts, { quizId, correct, ts: now }],
    lastReviewedAt: now,
    reviewedCount: r.reviewedCount + 1,
  }));
  if (correct) {
    if (state.mistakes[quizId]) {
      const mistakes = { ...state.mistakes };
      delete mistakes[quizId];
      commit({ ...state, mistakes });
    }
  } else {
    const prev = state.mistakes[quizId];
    commit({
      ...state,
      mistakes: {
        ...state.mistakes,
        [quizId]: {
          quizId,
          lastWrongAt: now,
          wrongCount: (prev?.wrongCount ?? 0) + 1,
        },
      },
    });
  }
}

/* ---------------- 笔记 actions ---------------- */

export function upsertNote(note: Note) {
  const exists = state.notes.some((n) => n.id === note.id);
  const notes = exists
    ? state.notes.map((n) => (n.id === note.id ? note : n))
    : [note, ...state.notes];
  commit({ ...state, notes });
}

export function deleteNote(id: string) {
  commit({ ...state, notes: state.notes.filter((n) => n.id !== id) });
}

/* ---------------- 导入 / 导出 / 清空 ---------------- */

export function exportSnapshot(): AppData {
  return ensureLoaded();
}

/** 导入：overwrite 整体覆盖；merge 按时间戳新者胜合并 */
export function replaceAll(incoming: AppData, strategy: ImportStrategy) {
  commit(strategy === "overwrite" ? incoming : mergeData(state, incoming));
}

export function mergeData(current: AppData, incoming: AppData): AppData {
  const records: Record<string, LearningRecord> = { ...current.records };
  for (const [topicId, rec] of Object.entries(incoming.records)) {
    const mine = records[topicId];
    if (!mine || (rec.lastReviewedAt ?? 0) >= (mine.lastReviewedAt ?? 0)) {
      records[topicId] = rec;
    }
  }
  const mistakes: Record<string, MistakeEntry> = { ...current.mistakes };
  for (const [quizId, m] of Object.entries(incoming.mistakes)) {
    const mine = mistakes[quizId];
    if (!mine || m.lastWrongAt >= mine.lastWrongAt) mistakes[quizId] = m;
  }
  const noteMap = new Map<string, Note>();
  for (const n of [...current.notes, ...incoming.notes]) {
    const existing = noteMap.get(n.id);
    if (!existing || n.updatedAt >= existing.updatedAt) noteMap.set(n.id, n);
  }
  const notes = [...noteMap.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  return { version: 1, records, mistakes, notes };
}

export function clearAll() {
  commit({ version: 1, records: {}, mistakes: {}, notes: [] });
}

/* ---------------- 派生数据：掌握度 / 复习队列 / 到期错题 ---------------- */

/**
 * 知识点掌握度 0-100：做题正确率占 60 分（按题去重），费曼自评占 40 分（每分 8）。
 * ≥60 视为已掌握。
 */
export function topicMastery(record: LearningRecord | undefined): number {
  if (!record) return 0;
  const lastByQuiz = new Map<string, boolean>();
  for (const a of record.quizAttempts) lastByQuiz.set(a.quizId, a.correct);
  let quizScore = 0;
  if (lastByQuiz.size > 0) {
    const correct = [...lastByQuiz.values()].filter(Boolean).length;
    quizScore = (correct / lastByQuiz.size) * 60;
  }
  const feynmanScore = (record.selfRating ?? 0) * 8;
  return Math.min(100, Math.round(quizScore + feynmanScore));
}

export function isMastered(record: LearningRecord | undefined): boolean {
  return topicMastery(record) >= 60;
}

/** 费曼自评 <3 分 → 自动进入复习队列 */
export function needsReview(record: LearningRecord | undefined): boolean {
  return record?.selfRating !== undefined && record.selfRating < 3;
}

/** 到期重现的错题 quizId 列表（距上次答错 ≥7 天） */
export function dueMistakeIds(data: AppData, now = Date.now()): string[] {
  return Object.values(data.mistakes)
    .filter((m) => now - m.lastWrongAt >= REVIEW_INTERVAL_MS)
    .map((m) => m.quizId);
}

/** 尚未到期的错题数 */
export function pendingMistakeCount(data: AppData, now = Date.now()): number {
  return Object.values(data.mistakes).filter((m) => now - m.lastWrongAt < REVIEW_INTERVAL_MS).length;
}
