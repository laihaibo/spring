"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NAV_GROUPS } from "@/components/layout/nav-config";

/** 桌面端左侧玻璃导航 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="flex-row items-center gap-2 px-4 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/80 to-violet-500/80 shadow-[0_0_16px_rgba(99,102,241,0.5)]">
          <GraduationCap className="size-5 text-white" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[15px] font-semibold">Spring Learn</span>
          <span className="truncate text-xs text-muted-foreground">费曼学习法 · 习题带练</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="touch-target data-active:bg-foreground/10 data-active:text-foreground"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 text-[11px] text-muted-foreground">
        <span className="nums">已上线 3 批 · 30 讲 · 90 题</span>
      </SidebarFooter>
    </Sidebar>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
