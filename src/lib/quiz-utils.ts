import type { Quiz, QuizAnswer, QuizKind, QuizOptionKey } from "@/lib/types";

export const QUIZ_KIND_LABEL: Record<QuizKind, string> = {
  single: "单选",
  judge: "判断",
  multiple: "多选",
  "code-reading": "代码阅读",
  "code-completion": "代码补全",
};

export const OPTION_KEYS: QuizOptionKey[] = ["A", "B", "C", "D"];

/** 判定一次作答是否正确（多选须完全一致，填空按序全对且忽略首尾空格） */
export function isAnswerCorrect(quiz: Quiz, answer: QuizAnswer | null): boolean {
  if (!answer) return false;
  switch (quiz.kind) {
    case "single":
    case "code-reading":
      return answer.kind === "choice" && answer.choice === quiz.answer;
    case "judge":
      return answer.kind === "judge" && answer.value === quiz.answer;
    case "multiple":
      if (answer.kind !== "multi") return false;
      return (
        answer.choices.length === quiz.answers.length &&
        quiz.answers.every((k) => answer.choices.includes(k))
      );
    case "code-completion":
      if (answer.kind !== "blanks") return false;
      return quiz.blanks.every(
        (blank, i) => (answer.values[i] ?? "").trim() === blank.answer.trim(),
      );
  }
}

/** 正确答案的可读文案（用于解析区展示） */
export function correctAnswerLabel(quiz: Quiz): string {
  switch (quiz.kind) {
    case "single":
    case "code-reading":
      return quiz.answer;
    case "judge":
      return quiz.answer ? "正确 ✓" : "错误 ✗";
    case "multiple":
      return [...quiz.answers].sort().join("、");
    case "code-completion":
      return quiz.blanks.map((b, i) => `空${i + 1}=${b.answer}`).join("；");
  }
}

/** 提取题目携带的代码（若有） */
export function quizCode(quiz: Quiz): { code: string; path: string; language: string } | null {
  if (quiz.kind === "code-reading") {
    return { code: quiz.code, path: quiz.codePath ?? "Demo.java", language: quiz.language ?? "java" };
  }
  if (quiz.kind === "code-completion") {
    return {
      code: quiz.codeTemplate,
      path: quiz.codePath ?? "Demo.java",
      language: quiz.language ?? "java",
    };
  }
  return null;
}

/** 把 codeTemplate 渲染为带挖空占位的行数组 */
export function templateLines(codeTemplate: string): string[] {
  return codeTemplate.split("\n");
}
