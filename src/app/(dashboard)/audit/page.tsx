"use client";

import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, Eye, Edit, Trash2, Upload, Download } from "lucide-react";
import { subMinutes, subHours } from "date-fns";

const auditLogs = [
  {
    id: 1,
    user: "王大明 醫師",
    role: "physician",
    action: "view",
    resource_type: "referral",
    resource_id: "REF-2024-000001",
    detail: "查看轉診單 REF-2024-000001 詳細資訊",
    ip: "192.168.1.100",
    created_at: subMinutes(new Date(), 5),
  },
  {
    id: 2,
    user: "陳小芳 個管師",
    role: "case_manager",
    action: "update",
    resource_type: "referral",
    resource_id: "REF-2024-000003",
    detail: "更新轉診狀態：待處理 → 已掛號",
    ip: "192.168.1.101",
    created_at: subMinutes(new Date(), 32),
  },
  {
    id: 3,
    user: "王大明 醫師",
    role: "physician",
    action: "create",
    resource_type: "referral",
    resource_id: "REF-2024-000005",
    detail: "建立新轉診單，個案：王○明，上轉至台大醫院",
    ip: "192.168.1.100",
    created_at: subHours(new Date(), 1),
  },
  {
    id: 4,
    user: "李文忠 護理師",
    role: "nurse",
    action: "upload",
    resource_type: "document",
    resource_id: "doc-001",
    detail: "上傳文件：檢驗報告 (lab_2024_0301.pdf)",
    ip: "192.168.1.102",
    created_at: subHours(new Date(), 2),
  },
  {
    id: 5,
    user: "陳小芳 個管師",
    role: "case_manager",
    action: "view",
    resource_type: "patient",
    resource_id: "pat-3",
    detail: "查看個案資料：陳○成",
    ip: "192.168.1.101",
    created_at: subHours(new Date(), 3),
  },
  {
    id: 6,
    user: "王大明 醫師",
    role: "physician",
    action: "export",
    resource_type: "report",
    resource_id: null,
    detail: "匯出月度轉診統計報表 (2024年3月)",
    ip: "192.168.1.100",
    created_at: subHours(new Date(), 5),
  },
];

const actionConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  view: { icon: Eye, label: "查看", color: "bg-slate-100 text-slate-600" },
  create: { icon: Edit, label: "建立", color: "bg-blue-100 text-blue-700" },
  update: { icon: Edit, label: "更新", color: "bg-yellow-100 text-yellow-700" },
  delete: { icon: Trash2, label: "刪除", color: "bg-red-100 text-red-700" },
  upload: { icon: Upload, label: "上傳", color: "bg-purple-100 text-purple-700" },
  export: { icon: Download, label: "匯出", color: "bg-teal-100 text-teal-700" },
};

export default function AuditPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="稽核軌跡" subtitle="所有操作記錄與存取日誌" />

      <div className="flex-1 p-6 space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">資安合規說明</p>
            <p className="text-xs text-blue-600 mt-0.5">
              系統記錄所有使用者對個案資料、轉診單及文件的存取與操作行為，符合醫療院所資安稽核要求。紀錄保存期限為 7 年。
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜尋使用者、資源ID…"
                className="pl-9 h-9 bg-slate-50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">時間</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">使用者</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">說明</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IP位址</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => {
                const action = actionConfig[log.action] || actionConfig.view;
                const ActionIcon = action.icon;
                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-700">
                        {log.created_at.toLocaleString("zh-TW")}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-slate-800">{log.user}</p>
                      <p className="text-xs text-slate-400">{log.role}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${action.color}`}
                      >
                        <ActionIcon className="w-3 h-3" />
                        {action.label}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{log.resource_type}</p>
                    </td>
                    <td className="px-5 py-3 max-w-sm">
                      <p className="text-sm text-slate-700 truncate">{log.detail}</p>
                      {log.resource_id && (
                        <p className="text-xs font-mono text-slate-400 mt-0.5">
                          {log.resource_id}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-mono text-slate-500">{log.ip}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              顯示最近 {auditLogs.length} 筆記錄 · 完整記錄請使用篩選功能查詢
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
