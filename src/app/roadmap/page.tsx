import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { getTopicsByTrack, LEVEL_LABEL, prereqDepth, TRACKS, TRACK_META } from "@/lib/content";
import type { Topic } from "@/lib/types";

export const metadata = { title: "学习路线图" };

export default function RoadmapPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8">
      <header className="mb-5">
        <h1 className="text-xl font-semibold">学习路线图</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          按前置依赖深度分列：从左往右，先修完左边再修右边。
        </p>
      </header>

      {TRACKS.map((track) => {
        const topics = getTopicsByTrack(track);
        if (topics.length === 0) return null;
        const columns = buildColumns(topics);
        return (
          <section key={track} className="mb-8">
            <h2 className={`mb-3 text-[15px] font-semibold ${TRACK_META[track].text}`}>
              {TRACK_META[track].label}
            </h2>
            <div className="thin-scrollbar flex items-stretch gap-2 overflow-x-auto pb-2">
              {columns.map((column, ci) => (
                <div key={ci} className="flex items-stretch gap-2">
                  {ci > 0 && (
                    <div className="flex items-center text-muted-foreground/50">
                      <ChevronRight className="size-5" />
                    </div>
                  )}
                  <div className="flex w-44 shrink-0 flex-col gap-2">
                    {column.map((topic) => (
                      <TopicNode key={topic.id} topic={topic} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

function TopicNode({ topic }: { topic: Topic }) {
  return (
    <Link href={`/learn/${topic.track}/${topic.id}`}>
      <LiquidGlassCard soft className="p-3 transition-colors hover:bg-white/12">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Lv.{topic.level} {LEVEL_LABEL[topic.level]}
          </span>
        </div>
        <span className="block text-[13px] font-medium leading-snug">{topic.title}</span>
      </LiquidGlassCard>
    </Link>
  );
}

/** 按 prereq 深度分列，同列内按 level 排序 */
function buildColumns(topics: Topic[]): Topic[][] {
  const max = Math.max(...topics.map((t) => prereqDepth(t.id)));
  const columns: Topic[][] = Array.from({ length: max + 1 }, () => []);
  for (const t of topics) {
    columns[prereqDepth(t.id)]!.push(t);
  }
  for (const col of columns) {
    col.sort((a, b) => a.level - b.level);
  }
  return columns;
}
