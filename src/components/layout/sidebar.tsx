"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  BarChart3,
  GitBranch,
  FileText,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Activity,
  Shield,
  LogOut,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const navItems = [
  {
    section: "主要功能",
    items: [
      {
        href: "/dashboard",
        label: "儀表板",
        icon: LayoutDashboard,
        description: "系統總覽與KPI",
      },
      {
        href: "/referrals",
        label: "轉診追蹤",
        icon: ArrowLeftRight,
        description: "管理所有轉診個案",
        badge: 18,
      },
      {
        href: "/patients",
        label: "個案管理",
        icon: Users,
        description: "病人資料與健康紀錄",
      },
    ],
  },
  {
    section: "分析與報表",
    items: [
      {
        href: "/reports",
        label: "統計報表",
        icon: BarChart3,
        description: "轉診成效分析",
      },
      {
        href: "/flow-analysis",
        label: "流向分析",
        icon: GitBranch,
        description: "桑基圖轉入轉出分析",
      },
      {
        href: "/audit",
        label: "稽核軌跡",
        icon: Shield,
        description: "操作記錄查詢",
      },
    ],
  },
  {
    section: "系統管理",
    items: [
      {
        href: "/documents",
        label: "文件管理",
        icon: FileText,
        description: "報告與影像共享",
      },
      {
        href: "/institutions",
        label: "機構管理",
        icon: Building2,
        description: "合作機構設定",
      },
      {
        href: "/settings",
        label: "系統設定",
        icon: Settings,
        description: "帳號與通知設定",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">轉診追蹤平台</p>
              <p className="text-xs text-slate-400 truncate">健保個案管理系統</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <p className="px-3 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.section}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group relative",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {"badge" in item && item.badge && (
                            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {collapsed && "badge" in item && item.badge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="border-t border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold shrink-0">
              王
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">王大明 醫師</p>
              <p className="text-xs text-slate-400 truncate">長春診所 · 家醫科</p>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
