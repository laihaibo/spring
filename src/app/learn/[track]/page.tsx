import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { TrackList } from "@/components/learning/track-list";
import { getTopicsByTrack, TRACKS, TRACK_META } from "@/lib/content";
import type { Track } from "@/lib/types";

interface PageProps {
  params: Promise<{ track: string }>;
}

export function generateStaticParams() {
  return TRACKS.map((track) => ({ track }));
}

export async function generateMetadata({ params }: PageProps) {
  const { track } = await params;
  const meta = TRACK_META[track as Track];
  return { title: meta ? meta.label : "知识点列表" };
}

export default async function TrackPage({ params }: PageProps) {
  const { track } = await params;
  if (!TRACKS.includes(track as Track)) notFound();

  const topics = getTopicsByTrack(track as Track);
  const meta = TRACK_META[track as Track];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8">
      <Link
        href="/"
        className="mb-4 inline-flex min-h-11 items-center gap-1 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        返回总览
        {meta && (
          <>
            <span className="mx-1 opacity-40">/</span>
            <span className={meta.text}>{meta.label}</span>
          </>
        )}
      </Link>

      <header className="mb-5">
        <h1 className="text-xl font-semibold">{meta.label}</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          {meta.brief} · {topics.length > 0 ? `${topics.length} 个知识点` : "内容筹备中"}
        </p>
      </header>

      <TrackList topics={topics} />
    </main>
  );
}
