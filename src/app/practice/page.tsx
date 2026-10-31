import { PracticeView } from "@/components/learning/practice-view";

export const metadata = { title: "刷题与错题本" };

export default function PracticePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8">
      <PracticeView />
    </main>
  );
}
