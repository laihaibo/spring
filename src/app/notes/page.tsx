import { NoteEditor } from "@/components/learning/note-editor";

export const metadata = { title: "我的笔记" };

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:py-8 lg:max-w-6xl lg:px-8 lg:py-10">
      <p className="mb-5 text-[13.5px] text-muted-foreground">
        全部 Markdown 笔记，随学习数据一起导出 / 导入。
      </p>
      <NoteEditor />
    </main>
  );
}
