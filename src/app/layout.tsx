import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Spring Learn · 费曼学习法吃透 Spring / Spring Boot / RuoYi",
    template: "%s · Spring Learn",
  },
  description:
    "移动优先的交互式 Spring 学习应用：学知识点 → 用自己的话讲一遍 → 做题检验 → 记录掌握度 → 复习未掌握项。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1022",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
