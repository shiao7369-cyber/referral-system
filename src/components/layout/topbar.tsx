"use client";

import { Bell, Search, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { mockNotifications } from "@/lib/mock-data";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.is_read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          className="pl-9 w-64 h-9 bg-slate-50 border-slate-200 text-sm"
          placeholder="搜尋個案、轉診單號…"
        />
      </div>

      {/* Help */}
      <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">通知</h3>
              <Badge className="bg-red-100 text-red-700 text-xs">{unreadCount} 則未讀</Badge>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {mockNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !notif.is_read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.is_read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                    <div className={!notif.is_read ? "" : "pl-5"}>
                      <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(notif.created_at).toLocaleString("zh-TW")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                查看全部通知
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
