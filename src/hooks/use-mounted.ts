"use client";

import * as React from "react";

/** 客户端挂载守卫：所有读 localStorage 的组件先等挂载，避免 hydration 不匹配 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}
