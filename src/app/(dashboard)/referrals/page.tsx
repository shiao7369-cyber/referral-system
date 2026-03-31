"use client";

import { Topbar } from "@/components/layout/topbar";
import { mockReferrals } from "@/lib/mock-data";
import { STATUS_CONFIG, URGENCY_CONFIG, DIRECTION_CONFIG } from "@/types";
import type { ReferralStatus, ReferralDirection, ReferralUrgency } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  Download,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { differenceInDays } from "date-fns";

const statusOptions: { value: ReferralStatus | "all"; label: string }[] = [
  { value: "all", label: "全部狀態" },
  { value: "pending", label: "待處理" },
  { value: "scheduled", label: "已掛號" },
  { value: "arrived", label: "已報到" },
  { value: "in_treatment", label: "治療中" },
  { value: "completed", label: "已完成" },
  { value: "no_show", label: "未就診" },
  { value: "cancelled", label: "已取消" },
  { value: "returned", label: "已下轉" },
];

const directionOptions: { value: ReferralDirection | "all"; label: string }[] = [
  { value: "all", label: "全部方向" },
  { value: "upward", label: "↑ 上轉" },
  { value: "downward", label: "↓ 下轉" },
  { value: "lateral", label: "↔ 平轉" },
];

function DirectionIcon({ direction }: { direction: ReferralDirection }) {
  if (direction === "upward")
    return <ArrowUpCircle className="w-4 h-4 text-blue-500" />;
  if (direction === "downward")
    return <ArrowDownCircle className="w-4 h-4 text-teal-500" />;
  return <ArrowRightLeft className="w-4 h-4 text-slate-400" />;
}

export default function ReferralsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");

  const filtered = mockReferrals.filter((r) => {
    const matchSearch =
      !search ||
      r.referral_no.toLowerCase().includes(search.toLowerCase()) ||
      r.patient?.name_masked.includes(search) ||
      r.diagnosis_name.includes(search);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchDirection =
      directionFilter === "all" || r.direction === directionFilter;
    return matchSearch && matchStatus && matchDirection;
  });

  const pendingCount = mockReferrals.filter((r) => r.status === "pending").length;
  const overdueCount = mockReferrals.filter(
    (r) =>
      r.status === "no_show" ||
      (r.appointment_date &&
        !r.actual_visit_date &&
        differenceInDays(new Date(), new Date(r.appointment_date)) > 7)
  ).length;

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="轉診追蹤" subtitle="雙向轉診個案管理與狀態追蹤" />

      <div className="flex-1 p-6 space-y-4">
        {/* Summary Chips */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">全部</span>
            <Badge className="bg-slate-100 text-slate-700">{mockReferrals.length}</Badge>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 rounded-lg border border-yellow-200 px-4 py-2">
            <span className="text-sm text-yellow-700">待處理</span>
            <Badge className="bg-yellow-100 text-yellow-800">{pendingCount}</Badge>
          </div>
          <div className="flex items-center gap-2 bg-red-50 rounded-lg border border-red-200 px-4 py-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">逾期未就診</span>
            <Badge className="bg-red-100 text-red-800">{overdueCount}</Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋轉診單號、個案姓名、診斷…"
                className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <Filter className="w-3.5 h-3.5 mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={(v) => setDirectionFilter(v ?? "all")}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {directionOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                匯出
              </button>
              <Link
                href="/referrals/new"
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                新增轉診單
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    轉診單號
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    個案資訊
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    方向
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    診斷
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    發送 → 接收
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    緊急度
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    轉診日期
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-400">
                      沒有符合條件的轉診記錄
                    </td>
                  </tr>
                ) : (
                  filtered.map((referral) => {
                    const statusCfg = STATUS_CONFIG[referral.status];
                    const urgencyCfg = URGENCY_CONFIG[referral.urgency];
                    const isOverdue =
                      referral.status === "no_show" ||
                      (referral.appointment_date &&
                        !referral.actual_visit_date &&
                        differenceInDays(
                          new Date(),
                          new Date(referral.appointment_date)
                        ) > 7);

                    return (
                      <tr
                        key={referral.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isOverdue ? "bg-red-50/30" : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {isOverdue && (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                            <span className="text-sm font-mono font-semibold text-blue-600">
                              {referral.referral_no}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {referral.patient?.name_masked}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {referral.patient?.chart_no} · {referral.patient?.birth_year ? `${new Date().getFullYear() - referral.patient.birth_year}歲` : ""}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <DirectionIcon direction={referral.direction} />
                            <span className="text-sm text-slate-600">
                              {DIRECTION_CONFIG[referral.direction].label}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700 max-w-40 truncate">
                            {referral.diagnosis_name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {referral.diagnosis_code}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-500">
                            {referral.from_institution?.name}
                          </p>
                          <p className="text-xs text-slate-400">↓</p>
                          <p className="text-xs font-medium text-slate-700">
                            {referral.to_institution?.name}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${urgencyCfg.color}`}
                          >
                            {urgencyCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}
                          >
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                          {new Date(referral.referral_date).toLocaleDateString("zh-TW")}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/referrals/${referral.id}`}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              顯示 {filtered.length} / {mockReferrals.length} 筆記錄
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
