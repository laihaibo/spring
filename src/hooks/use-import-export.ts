"use client";

import * as React from "react";
import {
  clearAll,
  exportSnapshot,
  normalize,
  replaceAll,
} from "@/lib/learning-store";
import type { AppData, BackupFile, ImportResult, ImportStrategy } from "@/lib/types";

/**
 * 学习数据导入 / 导出 / 清空（纯 localStorage）。
 * 导出文件名带时间戳：spring-learn-backup-YYYYMMDD-HHmmss.json
 */
export function useImportExport() {
  const exportData = React.useCallback((): void => {
    const data = exportSnapshot();
    const backup: BackupFile = {
      app: "spring-learn",
      version: 1,
      exportedAt: Date.now(),
      data,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spring-learn-backup-${timestamp()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = React.useCallback(
    async (file: File, strategy: ImportStrategy): Promise<ImportResult> => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as BackupFile | AppData;
        const candidate = "app" in parsed && parsed.app === "spring-learn" ? parsed.data : parsed;
        if (!candidate || typeof candidate !== "object" || !("records" in candidate)) {
          return { ok: false, error: "文件格式不正确：不是本应用导出的学习数据" };
        }
        const data = normalize(candidate as AppData);
        replaceAll(data, strategy);
        return { ok: true, data };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? `解析失败：${err.message}` : "解析失败：未知错误",
        };
      }
    },
    [],
  );

  const clear = React.useCallback((): void => {
    clearAll();
  }, []);

  return { exportData, importData, clear };
}

function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  );
}
