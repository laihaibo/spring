"use client";

import * as React from "react";
import { Eye, NotebookPen, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { MarkdownViewer } from "@/components/learning/markdown-viewer";
import { useLearningStore } from "@/hooks/use-learning-store";
import type { Note } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Markdown 笔记：列表 + 编辑/预览。
 * 传 topicId 时只管理该知识点的随堂笔记；不传时管理全部笔记（/notes 页）。
 */
export function NoteEditor({ topicId, titlePrefix }: { topicId?: string; titlePrefix?: string }) {
  const { data, upsertNote, deleteNote } = useLearningStore();
  const notes = data.notes.filter((n) => (topicId ? n.topicId === topicId : true));
  const [editing, setEditing] = React.useState<Note | "new" | null>(null);
  const [draft, setDraft] = React.useState({ title: "", content: "" });
  const [preview, setPreview] = React.useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const startNew = () => {
    setDraft({ title: titlePrefix ? `${titlePrefix} · ` : "", content: "" });
    setPreview(false);
    setEditing("new");
  };

  const startEdit = (note: Note) => {
    setDraft({ title: note.title, content: note.content });
    setPreview(false);
    setEditing(note);
  };

  const save = () => {
    if (draft.title.trim() === "" && draft.content.trim() === "") {
      toast.error("笔记内容为空");
      return;
    }
    const now = Date.now();
    const note: Note =
      editing === "new"
        ? {
            id: `note-${now}-${Math.random().toString(36).slice(2, 8)}`,
            topicId,
            title: draft.title.trim() || "未命名笔记",
            content: draft.content,
            createdAt: now,
            updatedAt: now,
          }
        : {
            ...(editing as Note),
            title: draft.title.trim() || "未命名笔记",
            content: draft.content,
            updatedAt: now,
          };
    upsertNote(note);
    setEditing(null);
    toast.success("笔记已保存");
  };

  const remove = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      window.setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 3000);
      return;
    }
    deleteNote(id);
    setConfirmDeleteId(null);
    if (editing !== "new" && editing?.id === id) setEditing(null);
    toast.success("笔记已删除");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="nums text-[13px] text-muted-foreground">{notes.length} 条笔记</span>
        <Button size="sm" className="touch-target h-10" onClick={startNew}>
          <Plus className="size-4" />
          新建笔记
        </Button>
      </div>

      {editing !== null && (
        <LiquidGlassCard soft className="space-y-3 p-4">
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="笔记标题"
            autoCapitalize="none"
            autoCorrect="off"
            className="h-11 w-full rounded-xl border border-border bg-foreground/5 px-3 text-[15px] outline-none placeholder:text-muted-foreground/60 focus:border-[var(--primary)]/60"
          />
          {preview ? (
            <div className="min-h-40 rounded-xl border border-border bg-foreground/5 p-3">
              <MarkdownViewer content={draft.content || "_（空）_"} />
            </div>
          ) : (
            <textarea
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              placeholder="支持 Markdown：## 标题、**加粗**、`代码`、```java 代码块```"
              rows={10}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full resize-y rounded-xl border border-border bg-foreground/5 p-3 font-mono text-[13.5px] leading-relaxed outline-none placeholder:text-muted-foreground/60 focus:border-[var(--primary)]/60"
            />
          )}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="touch-target h-9 border border-border bg-foreground/5"
              onClick={() => setPreview((p) => !p)}
            >
              {preview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
              {preview ? "继续编辑" : "预览"}
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="touch-target h-9" onClick={() => setEditing(null)}>
                取消
              </Button>
              <Button size="sm" className="touch-target h-9" onClick={save}>
                保存
              </Button>
            </div>
          </div>
        </LiquidGlassCard>
      )}

      {notes.length === 0 && editing === null ? (
        <LiquidGlassCard soft className="flex flex-col items-center gap-2 p-8 text-center">
          <NotebookPen className="size-8 text-muted-foreground" />
          <p className="text-[14px] text-muted-foreground">还没有笔记。学习中随时记下你的理解。</p>
        </LiquidGlassCard>
      ) : (
        <ul className="space-y-2.5">
          {notes.map((note) => (
            <li key={note.id}>
              <LiquidGlassCard soft className="p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(note)}
                    className="min-w-0 flex-1 text-start"
                  >
                    <span className="block truncate text-[15px] font-medium">{note.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[13px] text-muted-foreground">
                      {note.content.replace(/[#*`>\-\n]/g, " ").trim() || "（空）"}
                    </span>
                    <span className="nums mt-1 block text-[11px] text-muted-foreground/70">
                      更新于 {new Date(note.updatedAt).toLocaleString("zh-CN")}
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="删除笔记"
                    className={cn(
                      "touch-target size-9 shrink-0",
                      confirmDeleteId === note.id
                        ? "bg-destructive/20 text-destructive"
                        : "text-muted-foreground hover:text-destructive",
                    )}
                    onClick={() => remove(note.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </LiquidGlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
