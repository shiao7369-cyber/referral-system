"use client";

import { Topbar } from "@/components/layout/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/types";
import { Shield, Bell, User, Building2, Save } from "lucide-react";
import { toast } from "sonner";

const teamMembers = [
  { name: "王大明", role: "physician", specialty: "家醫科", is_active: true },
  { name: "陳小芳", role: "case_manager", specialty: "個案管理", is_active: true },
  { name: "李文忠", role: "nurse", specialty: "護理師", is_active: true },
  { name: "林系統", role: "admin", specialty: "系統管理", is_active: true },
  { name: "黃唯讀", role: "viewer", specialty: "行政人員", is_active: false },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="系統設定" subtitle="帳號資訊、通知與機構設定" />

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Personal Settings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">個人資訊</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">姓名</Label>
                <Input defaultValue="王大明" className="bg-slate-50" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">醫師執照號</Label>
                <Input defaultValue="MD123456" className="bg-slate-50" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">科別</Label>
                <Input defaultValue="家庭醫學科" className="bg-slate-50" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">聯絡電話</Label>
                <Input defaultValue="02-25018888" className="bg-slate-50" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => toast.success("個人資訊已更新")}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                儲存
              </button>
            </div>
          </div>

          {/* Institution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">機構資訊</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-xs text-slate-500 mb-1.5 block">機構名稱</Label>
                <Input defaultValue="長春診所" className="bg-slate-50" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">健保特約代號</Label>
                <Input defaultValue="CLN001" className="bg-slate-50" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">電話</Label>
                <Input defaultValue="02-25018888" className="bg-slate-50" />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">通知設定</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "新增轉診單時通知", key: "new_referral", enabled: true },
                { label: "轉診狀態更新通知", key: "status_changed", enabled: true },
                { label: "個案逾 7 天未就診警示", key: "overdue", enabled: true },
                { label: "回傳治療報告通知", key: "report_received", enabled: true },
                { label: "追蹤回診提醒", key: "followup", enabled: false },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <button
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      item.enabled ? "bg-blue-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        item.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members (RBAC) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 p-6 border-b border-slate-100">
              <Shield className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-900">團隊成員與權限管理</h3>
              <Badge className="bg-blue-50 text-blue-700 text-xs ml-auto">
                RBAC 角色控管
              </Badge>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">姓名</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">職稱/科別</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">系統角色</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamMembers.map((member) => (
                  <tr key={member.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {member.name[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{member.specialty}</td>
                    <td className="px-5 py-3">
                      <Badge className="bg-slate-100 text-slate-700 text-xs">
                        {ROLE_LABELS[member.role as keyof typeof ROLE_LABELS]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        className={
                          member.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-400"
                        }
                      >
                        {member.is_active ? "啟用" : "停用"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
