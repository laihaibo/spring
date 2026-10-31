/** 学习轨道 */
export type Track = "spring" | "springboot" | "ruoyi";

/** 代码示例：统一用 code-block 渲染，可下载试运行 */
export interface CodeExample {
  id: string;
  /** 头部显示的文件路径；RuoYi 源码示例须标注真实路径 */
  filePath: string;
  /** java / xml / yaml / sql / properties */
  language: string;
  /** 完整可读代码，含 package 与关键 import，不写省略号 */
  code: string;
  /** 「在本地试运行」按钮生成的下载文件名 */
  runnableFileName: string;
  /** 一句话说明示例演示什么 */
  summary?: string;
  /** 源码出处标注（如 RuoYi 真实仓库路径） */
  sourceNote?: string;
}

export type QuizOptionKey = "A" | "B" | "C" | "D";

/** 题目公共字段 */
export interface QuizMeta {
  id: string;
  topicId: string;
  question: string;
  /** 整题深度解析 */
  explanation: string;
  /** 逐选项解析，key 为选项字母（judge 题为 true/false） */
  optionExplanations?: Record<string, string>;
  /** 「为什么这么设计」——出题/考点设计意图 */
  designWhy: string;
  /** 关联知识点 topic id，答完可跳转 */
  relatedTopicIds: string[];
}

export interface SingleQuiz extends QuizMeta {
  kind: "single";
  options: Record<QuizOptionKey, string>;
  answer: QuizOptionKey;
}

export interface JudgeQuiz extends QuizMeta {
  kind: "judge";
  answer: boolean;
}

export interface MultipleQuiz extends QuizMeta {
  kind: "multiple";
  options: Record<QuizOptionKey, string>;
  answers: QuizOptionKey[];
}

/** 代码阅读题：给一段 Java 代码问输出/行为 */
export interface CodeReadingQuiz extends QuizMeta {
  kind: "code-reading";
  code: string;
  codePath?: string;
  language?: string;
  options: Record<QuizOptionKey, string>;
  answer: QuizOptionKey;
}

export interface CodeBlank {
  /** 候选词 */
  candidates: string[];
  /** 正确答案（必须属于 candidates） */
  answer: string;
}

/** 代码补全题：挖空填空，模板中用 __1__、__2__ 表示挖空 */
export interface CodeCompletionQuiz extends QuizMeta {
  kind: "code-completion";
  codeTemplate: string;
  codePath?: string;
  language?: string;
  blanks: CodeBlank[];
}

export type Quiz =
  | SingleQuiz
  | JudgeQuiz
  | MultipleQuiz
  | CodeReadingQuiz
  | CodeCompletionQuiz;

export type QuizKind = Quiz["kind"];

/** 知识点：与 src/data/topics/ 下 JSON 同构 */
export interface Topic {
  id: string;
  track: Track;
  /** 1 入门 / 2 进阶 / 3 源码级 */
  level: 1 | 2 | 3;
  title: string;
  /** 一句话概览 */
  brief: string;
  /** 知识点讲解（Markdown） */
  explanation: string;
  /** 费曼环节的生活比喻 */
  analogy: string;
  codeExamples: CodeExample[];
  /** 由 lib/content.ts 在加载时从 src/data/quiz/ 合并 */
  quiz: Quiz[];
  /** 常见错误认知 */
  misconceptions: string[];
  tags: string[];
  /** 前置 topic id */
  prereq: string[];
}

export interface QuizAttempt {
  quizId: string;
  correct: boolean;
  ts: number;
}

export interface LearningRecord {
  topicId: string;
  feynmanNote?: string;
  selfRating?: 1 | 2 | 3 | 4 | 5;
  quizAttempts: QuizAttempt[];
  lastReviewedAt: number;
  reviewedCount: number;
}

/** 错题本条目：答错入册，7 天后到期重现，答对即移除 */
export interface MistakeEntry {
  quizId: string;
  lastWrongAt: number;
  wrongCount: number;
}

export interface Note {
  id: string;
  topicId?: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

/** 全站学习数据（localStorage 单键存储，key: spring-learn:data） */
export interface AppData {
  version: 1;
  records: Record<string, LearningRecord>;
  mistakes: Record<string, MistakeEntry>;
  notes: Note[];
}

/** 导入冲突策略 */
export type ImportStrategy = "overwrite" | "merge";

/** 引擎内标准化作答状态 */
export type QuizAnswer =
  | { kind: "choice"; choice: QuizOptionKey }
  | { kind: "multi"; choices: QuizOptionKey[] }
  | { kind: "judge"; value: boolean }
  | { kind: "blanks"; values: string[] };

/** 导出文件包装结构 */
export interface BackupFile {
  app: "spring-learn";
  version: 1;
  exportedAt: number;
  data: AppData;
}

export type ImportResult =
  | { ok: true; data: AppData }
  | { ok: false; error: string };
