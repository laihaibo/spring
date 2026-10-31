"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** SVG 进度环：track 掌握度可视化 */
export function ProgressRing({
  value,
  size = 92,
  stroke = 8,
  from,
  to,
  id,
  sublabel,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  from: string;
  to: string;
  id: string;
  sublabel?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`掌握度 ${clamped}%`}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="nums text-lg font-semibold leading-none">{clamped}%</span>
        {sublabel && <span className="mt-1 text-[11px] text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}
