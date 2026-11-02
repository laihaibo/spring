import { DashboardView } from "@/components/learning/dashboard-view";

export const metadata = { title: "学习总览" };

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8 lg:max-w-6xl lg:px-8 lg:py-10">
      <DashboardView />
    </main>
  );
}
