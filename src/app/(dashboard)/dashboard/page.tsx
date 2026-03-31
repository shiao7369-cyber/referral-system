"use client";

import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Timer,
  Users,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { mockDashboardStats, mockReferrals } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG, URGENCY_CONFIG } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const recentReferrals = mockReferrals.slice(0, 5);

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="儀表板"
        subtitle={`${new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}`}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Alert Banner */}
        {stats.overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                有 {stats.overdueCount} 件轉診個案超過 7 天未就診
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                請個案管理師立即聯繫確認，避免個案流失。
              </p>
            </div>
            <Link
              href="/referrals?status=no_show"
              className="ml-auto text-xs font-medium text-red-700 hover:text-red-900 underline whitespace-nowrap"
            >
              立即查看
            </Link>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="本月轉診總數"
            value={stats.totalReferrals}
            subtitle="含上轉 & 下轉"
            icon={ArrowLeftRight}
            trend={{ value: 12.5, label: "較上月", positive: true }}
            color="blue"
          />
          <StatCard
            title="待處理轉診"
            value={stats.pendingReferrals}
            subtitle="需要跟進的個案"
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="本月完成轉診"
            value={stats.completedThisMonth}
            subtitle="已結案個案數"
            icon={CheckCircle2}
            trend={{ value: 8.3, label: "較上月", positive: true }}
            color="green"
          />
          <StatCard
            title="轉診成功率"
            value={`${stats.successRate}%`}
            subtitle={`平均 ${stats.avgCompletionDays} 天完成`}
            icon={TrendingUp}
            trend={{ value: 2.1, label: "較上月", positive: true }}
            color="teal"
          />
        </div>

        {/* Secondary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="逾期未就診"
            value={stats.overdueCount}
            subtitle="> 7天未就診個案"
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="活躍追蹤個案"
            value={45}
            subtitle="治療進行中"
            icon={Users}
            color="purple"
          />
          <StatCard
            title="合作醫療機構"
            value={12}
            subtitle="已串接機構數"
            icon={Building2}
            color="blue"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Trend Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">月度轉診趨勢</h3>
                <p className="text-xs text-slate-500 mt-0.5">近6個月上轉/下轉/完成數量</p>
              </div>
              <Badge className="bg-slate-100 text-slate-600 text-xs">近6個月</Badge>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.monthlyTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                />
                <Bar dataKey="upward" name="上轉" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downward" name="下轉" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="完成" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-1">狀態分佈</h3>
            <p className="text-xs text-slate-500 mb-4">目前所有轉診單狀態</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {stats.statusDistribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-slate-600">{item.status}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-900">最近轉診單</h3>
              <p className="text-xs text-slate-500 mt-0.5">最新 5 件轉診活動</p>
            </div>
            <Link
              href="/referrals"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">轉診單號</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">個案</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">方向</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">目標機構</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">緊急度</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">狀態</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">轉診日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReferrals.map((referral) => {
                  const statusCfg = STATUS_CONFIG[referral.status];
                  const urgencyCfg = URGENCY_CONFIG[referral.urgency];
                  return (
                    <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/referrals/${referral.id}`}
                          className="text-sm font-mono font-medium text-blue-600 hover:text-blue-700"
                        >
                          {referral.referral_no}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {referral.patient?.name_masked}
                        </p>
                        <p className="text-xs text-slate-400">
                          {referral.patient?.chart_no}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {referral.direction === "upward"
                            ? "↑ 上轉"
                            : referral.direction === "downward"
                            ? "↓ 下轉"
                            : "↔ 平轉"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {referral.direction === "upward"
                            ? referral.to_institution?.name
                            : referral.from_institution?.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${urgencyCfg.color}`}
                        >
                          {urgencyCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(referral.referral_date).toLocaleDateString("zh-TW")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
