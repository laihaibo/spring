import { NoteEditor } from "@/components/learning/note-editor";

export const metadata = { title: "我的笔记" };

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8">
      <header className="mb-5">
        <h1 className="text-xl font-semibold">我的笔记</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">
          全部 Markdown 笔记，随学习数据一起导出 / 导入。
        </p>
      </header>
      <NoteEditor />
    </main>
  );
}
