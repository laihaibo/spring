import {
  Blocks,
  LayoutDashboard,
  Map,
  NotebookPen,
  Sprout,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** 桌面端 Sidebar 分组 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "总览",
    items: [{ href: "/", label: "学习仪表盘", icon: LayoutDashboard }],
  },
  {
    label: "学习轨道",
    items: [
      { href: "/learn/spring", label: "Spring 核心", icon: Sprout },
      { href: "/learn/springboot", label: "Spring Boot", icon: Zap },
      { href: "/learn/ruoyi", label: "RuoYi", icon: Blocks },
    ],
  },
  {
    label: "训练与工具",
    items: [
      { href: "/practice", label: "刷题与错题本", icon: Target },
      { href: "/notes", label: "我的笔记", icon: NotebookPen },
      { href: "/roadmap", label: "学习路线图", icon: Map },
    ],
  },
];

/** 移动端底部 Tab */
export const BOTTOM_NAV: NavItem[] = [
  { href: "/", label: "总览", icon: LayoutDashboard },
  { href: "/learn/spring", label: "学习", icon: Sprout },
  { href: "/practice", label: "刷题", icon: Target },
  { href: "/notes", label: "笔记", icon: NotebookPen },
  { href: "/roadmap", label: "路线", icon: Map },
];
