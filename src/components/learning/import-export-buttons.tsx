"use client";

import * as React from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LiquidGlassCard } from "@/components/glass/liquid-glass-card";
import { useImportExport } from "@/hooks/use-import-export";
import { useLearningStore } from "@/hooks/use-learning-store";
import type { ImportStrategy } from "@/lib/types";

/**
 * 学习数据导入 / 导出 / 清空：
 * 导出 JSON（文件名带时间戳）；导入支持覆盖 / 合并两种冲突策略；清空需二次确认。
 */
export function ImportExportButtons({ compact = false }: { compact?: boolean }) {
  const { exportData, importData, clear } = useImportExport();
  const { data } = useLearningStore();
  const [importOpen, setImportOpen] = React.useState(false);
  const [clearOpen, setClearOpen] = React.useState(false);
  const [strategy, setStrategy] = React.useState<ImportStrategy>("merge");
  const [file, setFile] = React.useState<File | null>(null);

  const handleImportConfirm = async () => {
    if (!file) {
      toast.error("请先选择导出的 JSON 文件");
      return;
    }
    const result = await importData(file, strategy);
    if (result.ok) {
      toast.success(
        `导入成功（${strategy === "merge" ? "合并" : "覆盖"}）：${Object.keys(result.data.records).length} 个知识点记录、${result.data.notes.length} 条笔记`,
      );
      setImportOpen(false);
      setFile(null);
    } else {
      toast.error(result.error);
    }
  };

  const handleClear = () => {
    clear();
    toast.success("已清空全部学习数据");
    setClearOpen(false);
  };

  const wrap = compact ? "flex flex-wrap items-center gap-2" : "contents";

  return (
    <div className={wrap}>
      <Button
        variant="ghost"
        className="touch-target h-10 border border-white/15 bg-white/5 hover:bg-white/15"
        onClick={exportData}
      >
        <Download className="size-4" />
        导出
      </Button>
      <Button
        variant="ghost"
        className="touch-target h-10 border border-white/15 bg-white/5 hover:bg-white/15"
        onClick={() => setImportOpen(true)}
      >
        <Upload className="size-4" />
        导入
      </Button>
      <Button
        variant="ghost"
        className="touch-target h-10 border border-destructive/30 text-destructive hover:bg-destructive/15"
        onClick={() => setClearOpen(true)}
      >
        <Trash2 className="size-4" />
        清空
      </Button>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="liquid-glass liquid-glass-strong border-white/20">
          <DialogHeader>
            <DialogTitle>导入学习数据</DialogTitle>
            <DialogDescription>
              选择之前导出的 JSON 文件。当前数据：{Object.keys(data.records).length} 个知识点、
              {data.notes.length} 条笔记。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="冲突策略">
              <StrategyOption
                selected={strategy === "merge"}
                onClick={() => setStrategy("merge")}
                title="合并（推荐）"
                desc="按时间戳新者胜，保留两边数据"
              />
              <StrategyOption
                selected={strategy === "overwrite"}
                onClick={() => setStrategy("overwrite")}
                title="覆盖"
                desc="用文件内容完全替换现有数据"
              />
            </div>
            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-white/10">
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? `已选择：${file.name}` : "点击选择 JSON 文件"}
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setImportOpen(false)}>
              取消
            </Button>
            <Button onClick={handleImportConfirm} disabled={!file}>
              确认导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent className="liquid-glass liquid-glass-strong border-white/20">
          <DialogHeader>
            <DialogTitle>确认清空全部学习数据？</DialogTitle>
            <DialogDescription>
              将删除所有复述、自我评分、做题记录与笔记，且不可恢复。建议先「导出」备份。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setClearOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              确认清空
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StrategyOption({
  selected,
  onClick,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={
        "rounded-xl border px-3 py-2.5 text-start transition-colors " +
        (selected
          ? "border-[var(--primary)]/70 bg-[var(--primary)]/15"
          : "border-white/15 bg-white/5 hover:bg-white/10")
      }
    >
      <span className="block text-[14px] font-medium">{title}</span>
      <span className="mt-0.5 block text-[12px] text-muted-foreground">{desc}</span>
    </button>
  );
}
