"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV } from "@/components/layout/nav-config";
import { cn } from "@/lib/utils";

/** 移动端底部 Tab 导航（液态玻璃，safe-area 适配） */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主导航"
      className="liquid-glass liquid-glass-strong fixed inset-x-3 bottom-0 z-50 mb-2 flex items-stretch justify-around rounded-2xl px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 md:hidden"
    >
      {BOTTOM_NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "touch-target flex min-w-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "size-5",
                active && "text-[var(--primary)] drop-shadow-[0_0_8px_rgba(96,165,250,0.7)]",
              )}
            />
            <span className={cn(active && "font-medium")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
