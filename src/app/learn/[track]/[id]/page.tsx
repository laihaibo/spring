import { notFound } from "next/navigation";
import Link from "next/link";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { TopicDetail } from "@/components/learning/topic-detail";
import { ALL_TOPICS, getTopicById, LEVEL_LABEL } from "@/lib/content";
import type { Track } from "@/lib/types";

interface PageProps {
  params: Promise<{ track: string; id: string }>;
}

export function generateStaticParams() {
  return ALL_TOPICS.map((t) => ({ track: t.track, id: t.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const topic = getTopicById(id);
  return {
    title: topic ? topic.title : "知识点",
    description: topic?.brief,
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { track, id } = await params;
  const topic = getTopicById(id);
  if (!topic || topic.track !== (track as Track)) notFound();

  const prereqTopics = topic.prereq
    .map((pid) => getTopicById(pid))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8">
      <header className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            {LEVEL_LABEL[topic.level]}
          </span>
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">{topic.brief}</p>

        {prereqTopics.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="text-muted-foreground">前置：</span>
            {prereqTopics.map((p) => (
              <Link
                key={p.id}
                href={`/learn/${p.track}/${p.id}`}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-muted-foreground transition-colors hover:bg-white/15 hover:text-foreground"
              >
                {p.title}
              </Link>
            ))}
          </div>
        )}
      </header>

      <LiquidGlassCard soft className="p-0">
        <div className="p-4">
          <TopicDetail topic={topic} />
        </div>
      </LiquidGlassCard>
    </main>
  );
}
