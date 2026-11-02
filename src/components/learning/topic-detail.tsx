"use client";

import * as React from "react";
import {
  AlertTriangle,
  BookOpen,
  Lightbulb,
  MessageSquareQuote,
  NotebookPen,
  Target,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { CodeExampleCard } from "@/components/learning/code-example-card";
import { FeynmanPanel } from "@/components/learning/feynman-panel";
import { MarkdownViewer } from "@/components/learning/markdown-viewer";
import { NoteEditor } from "@/components/learning/note-editor";
import { QuizPanel } from "@/components/learning/quiz-panel";
import type { Topic } from "@/lib/types";

/** 知识点详情：概念讲解 / 我来讲解（费曼）/ 习题 / 笔记 四个 tab */
export function TopicDetail({ topic }: { topic: Topic }) {
  return (
    <Tabs defaultValue="concept" className="gap-4">
      {/* 模仿底部导航的语言：图标 + 文字竖排，激活 = 主色 + 荧光 */}
      <TabsList className="liquid-glass liquid-glass-strong h-auto w-full justify-around gap-0 overflow-x-auto rounded-2xl p-1 md:justify-start md:gap-1 md:overflow-visible">
        <TabsTrigger
          value="concept"
          className="group touch-target h-auto flex-1 flex-col gap-0.5 rounded-xl border-transparent bg-transparent px-1 py-2 text-[11px] text-muted-foreground shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none md:flex-none md:flex-row md:gap-2 md:px-4 md:text-[13.5px] md:hover:bg-foreground/5"
        >
          <BookOpen className="size-4 transition-all group-data-[state=active]:drop-shadow-[0_0_8px_rgba(96,165,250,0.7)] md:group-data-[state=active]:drop-shadow-none" />
          概念讲解
        </TabsTrigger>
        <TabsTrigger
          value="feynman"
          className="group touch-target h-auto flex-1 flex-col gap-0.5 rounded-xl border-transparent bg-transparent px-1 py-2 text-[11px] text-muted-foreground shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none md:flex-none md:flex-row md:gap-2 md:px-4 md:text-[13.5px] md:hover:bg-foreground/5"
        >
          <MessageSquareQuote className="size-4 transition-all group-data-[state=active]:drop-shadow-[0_0_8px_rgba(96,165,250,0.7)] md:group-data-[state=active]:drop-shadow-none" />
          我来讲解
        </TabsTrigger>
        <TabsTrigger
          value="quiz"
          className="group touch-target h-auto flex-1 flex-col gap-0.5 rounded-xl border-transparent bg-transparent px-1 py-2 text-[11px] text-muted-foreground shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none md:flex-none md:flex-row md:gap-2 md:px-4 md:text-[13.5px] md:hover:bg-foreground/5"
        >
          <Target className="size-4 transition-all group-data-[state=active]:drop-shadow-[0_0_8px_rgba(96,165,250,0.7)] md:group-data-[state=active]:drop-shadow-none" />
          习题
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="group touch-target h-auto flex-1 flex-col gap-0.5 rounded-xl border-transparent bg-transparent px-1 py-2 text-[11px] text-muted-foreground shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none md:flex-none md:flex-row md:gap-2 md:px-4 md:text-[13.5px] md:hover:bg-foreground/5"
        >
          <NotebookPen className="size-4 transition-all group-data-[state=active]:drop-shadow-[0_0_8px_rgba(96,165,250,0.7)] md:group-data-[state=active]:drop-shadow-none" />
          笔记
        </TabsTrigger>
      </TabsList>

      <TabsContent value="concept" className="space-y-4">
        <LiquidGlassCard soft className="p-4">
          <MarkdownViewer content={topic.explanation} />
        </LiquidGlassCard>

        {topic.codeExamples.length > 0 && (
          <section className="space-y-3">
            <h3 className="px-1 text-[15px] font-semibold">代码示例</h3>
            {topic.codeExamples.map((example) => (
              <CodeExampleCard key={example.id} example={example} />
            ))}
          </section>
        )}

        {topic.misconceptions.length > 0 && (
          <LiquidGlassCard soft className="p-4">
            <h3 className="mb-2 flex items-center gap-2 text-[15px] font-semibold">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-300" />
              常见错误认知
            </h3>
            <ul className="space-y-2">
              {topic.misconceptions.map((m, i) => (
                <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-muted-foreground">
                  <span className="text-destructive">✗</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </LiquidGlassCard>
        )}
      </TabsContent>

      <TabsContent value="feynman" className="mx-auto w-full max-w-3xl space-y-4">
        <LiquidGlassCard soft className="flex items-start gap-3 p-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-300" />
          <div>
            <div className="text-[13px] font-medium text-amber-700 dark:text-amber-200/90">先听个比喻</div>
            <p className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{topic.analogy}</p>
          </div>
        </LiquidGlassCard>
        <FeynmanPanel topic={topic} />
      </TabsContent>

      <TabsContent value="quiz" className="mx-auto w-full max-w-3xl">
        <QuizPanel quizzes={topic.quiz} emptyHint="本知识点习题制作中" />
      </TabsContent>

      <TabsContent value="notes" className="mx-auto w-full max-w-3xl">
        <NoteEditor topicId={topic.id} titlePrefix={topic.title} />
      </TabsContent>
    </Tabs>
  );
}
