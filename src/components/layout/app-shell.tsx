"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MeshBackground } from "@/components/layout/mesh-background";
import { TopBar } from "@/components/layout/top-bar";

/** 响应式应用外壳：统一顶栏 + 桌面 Sidebar / 移动底部 Tab + 动态渐变背景 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MeshBackground />
      <AppSidebar />
      <SidebarInset className="min-h-dvh md:pb-0">
        <TopBar />
        <div className="pb-24 md:pb-8">{children}</div>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}
