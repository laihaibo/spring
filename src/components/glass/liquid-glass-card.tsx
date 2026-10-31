import { cn } from "@/lib/utils";

/**
 * 液态玻璃卡片：三层体系的内容容器。
 * 背景（mesh gradient）与模糊（backdrop-filter）在 globals.css 定义；
 * iOS Safari 不支持时自动降级（@supports）。
 */
export function LiquidGlassCard({
  className,
  strong = false,
  soft = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** 更实的玻璃底（导航/弹层用） */
  strong?: boolean;
  /** 更通透的玻璃底（列表卡片用） */
  soft?: boolean;
}) {
  return (
    <div
      className={cn(
        "liquid-glass",
        strong && "liquid-glass-strong",
        soft && "liquid-glass-soft",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
