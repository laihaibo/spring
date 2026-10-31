"use client";

import * as React from "react";
import { Download, MonitorCog, Moon, Sun, Trash2, Upload } from "lucide-react";
import { useTheme } from "next-themes";
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
import { useImportExport } from "@/hooks/use-import-export";
import { useLearningStore } from "@/hooks/use-learning-store";
import type { ImportStrategy } from "@/lib/types";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
  { value: "system", label: "跟随系统", icon: MonitorCog },
] as const;

/**
 * 统一设置弹窗：外观（主题）+ 学习数据管理（导出 / 导入 / 清空）。
 * 由顶栏右侧齿轮按钮打开，替代原先平铺在仪表盘头部的按钮组。
 */
export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { exportData, importData, clear } = useImportExport();
  const { data } = useLearningStore();
  const [view, setView] = React.useState<"main" | "import">("main");
  const [strategy, setStrategy] = React.useState<ImportStrategy>("merge");
  const [file, setFile] = React.useState<File | null>(null);
  const [clearOpen, setClearOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setView("main");
      setFile(null);
      setClearOpen(false);
    }
  }, [open]);

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
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  };

  const handleClear = () => {
    clear();
    toast.success("已清空全部学习数据");
    setClearOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="liquid-glass liquid-glass-strong border-white/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>设置</DialogTitle>
            <DialogDescription>外观与学习数据管理</DialogDescription>
          </DialogHeader>

          {view === "main" ? (
            <div className="space-y-5">
              <section>
                <h3 className="mb-2 text-[13px] font-medium text-muted-foreground">外观</h3>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="主题">
                  {THEME_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={theme === opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={cn(
                        "touch-target flex h-11 items-center justify-center gap-1.5 rounded-xl border text-[13px] transition-colors",
                        theme === opt.value
                          ? "border-[var(--primary)]/70 bg-[var(--primary)]/15"
                          : "border-white/15 bg-white/5 text-muted-foreground hover:bg-white/10",
                      )}
                    >
                      <opt.icon className="size-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-[13px] font-medium text-muted-foreground">数据管理</h3>
                <p className="nums mb-2 text-[12px] text-muted-foreground">
                  当前：{Object.keys(data.records).length} 个知识点 · {data.notes.length} 条笔记
                </p>
                <div className="grid gap-2">
                  <Button
                    variant="ghost"
                    className="touch-target h-11 justify-start border border-white/15 bg-white/5 hover:bg-white/15"
                    onClick={() => {
                      exportData();
                      toast.success("已导出备份文件");
                    }}
                  >
                    <Download className="size-4" />
                    导出数据（JSON 备份）
                  </Button>
                  <Button
                    variant="ghost"
                    className="touch-target h-11 justify-start border border-white/15 bg-white/5 hover:bg-white/15"
                    onClick={() => setView("import")}
                  >
                    <Upload className="size-4" />
                    导入数据
                  </Button>
                  <Button
                    variant="ghost"
                    className="touch-target h-11 justify-start border border-destructive/30 text-destructive hover:bg-destructive/15"
                    onClick={() => setClearOpen(true)}
                  >
                    <Trash2 className="size-4" />
                    清空全部数据
                  </Button>
                </div>
              </section>
            </div>
          ) : (
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
              <DialogFooter>
                <Button variant="ghost" onClick={() => setView("main")}>
                  返回
                </Button>
                <Button onClick={handleImportConfirm} disabled={!file}>
                  确认导入
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent className="liquid-glass liquid-glass-strong border-white/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认清空全部学习数据？</DialogTitle>
            <DialogDescription>
              将删除所有复述、自我评分、做题记录与笔记，且不可恢复。建议先「导出数据」备份。
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
    </>
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
      className={cn(
        "rounded-xl border px-3 py-2.5 text-start transition-colors",
        selected
          ? "border-[var(--primary)]/70 bg-[var(--primary)]/15"
          : "border-white/15 bg-white/5 hover:bg-white/10",
      )}
    >
      <span className="block text-[14px] font-medium">{title}</span>
      <span className="mt-0.5 block text-[12px] text-muted-foreground">{desc}</span>
    </button>
  );
}
