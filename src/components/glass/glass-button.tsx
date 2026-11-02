"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 玻璃质感按钮：shadcn Button + 半透明玻璃底。
 * 触控目标 ≥ 44px（touch-target 工具类）。
 */
export const GlassButton = forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(function GlassButton({ className, ...props }, ref) {
  return (
    <Button
      ref={ref}
      className={cn(
        "touch-target border border-foreground/20 bg-foreground/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md hover:bg-foreground/20",
        className,
      )}
      {...props}
    />
  );
});
