"use client";

import { Topbar } from "@/components/layout/topbar";
import { mockDashboardStats } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const institutionData = [
  { name: "台大醫院", sent: 42, received: 18, rate: 92 },
  { name: "台北榮總", sent: 28, received: 12, rate: 88 },
  { name: "新光醫院", sent: 19, received: 24, rate: 85 },
  { name: "長春診所", sent: 15, received: 38, rate: 78 },
  { name: "信義診所", sent: 23, received: 35, rate: 82 },
];

const completionTimeData = [
  { range: "1-3天", count: 28, percent: 22 },
  { range: "4-7天", count: 45, percent: 35 },
  { range: "8-14天", count: 32, percent: 25 },
  { range: "15-30天", count: 15, percent: 12 },
  { range: ">30天", count: 7, percent: 6 },
];

const directionData = [
  { name: "上轉", value: 68, fill: "#3B82F6" },
  { name: "下轉", value: 44, fill: "#14B8A6" },
  { name: "平轉", value: 15, fill: "#8B5CF6" },
];

function KPICard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                ? "text-red-600"
                : "text-slate-400"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            較上月
          </div>
        )}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="統計報表" subtitle="轉診成效分析與關鍵指標" />

      <div className="flex-1 p-6 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">統計區間</span>
            <Select defaultValue="this_month">
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_month">本月</SelectItem>
                <SelectItem value="last_month">上個月</SelectItem>
                <SelectItem value="q1">第一季</SelectItem>
                <SelectItem value="half_year">近半年</SelectItem>
                <SelectItem value="this_year">今年</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部機構</SelectItem>
                <SelectItem value="inst-1">台大醫院</SelectItem>
                <SelectItem value="inst-2">台北榮總</SelectItem>
                <SelectItem value="inst-4">長春診所</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                匯出 Excel
              </button>
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard label="轉診總數" value="127" sub="上月：113" trend="up" />
          <KPICard label="轉診成功率" value="87.4%" sub="目標：85%" trend="up" />
          <KPICard label="平均完成天數" value="6.2 天" sub="上月：7.1 天" trend="up" />
          <KPICard label="未就診率" value="4.7%" sub="上月：6.2%" trend="up" />
        </div>

        {/* Row 1 Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Monthly Trend */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">月度趨勢</h3>
              <Badge className="bg-green-50 text-green-700 text-xs">成長中</Badge>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockDashboardStats.monthlyTrend}>
                <defs>
                  <linearGradient id="colorUpward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="upward" name="上轉" stroke="#3B82F6" strokeWidth={2} fill="url(#colorUpward)" />
                <Area type="monotone" dataKey="completed" name="完成" stroke="#22C55E" strokeWidth={2} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Direction Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">轉診方向分布</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={directionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {directionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {directionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.value} 件</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Completion Time Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-1">完成天數分布</h3>
            <p className="text-xs text-slate-400 mb-4">個案從轉診到完成所需天數</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={completionTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="range" type="category" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" name="個案數" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Institution Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">各機構轉診績效</h3>
              <p className="text-xs text-slate-400 mt-0.5">發出 / 接收 / 成功率</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">機構名稱</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">發出</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">接收</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">成功率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {institutionData.map((inst) => (
                  <tr key={inst.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{inst.name}</td>
                    <td className="px-5 py-3 text-sm text-right text-slate-600">{inst.sent}</td>
                    <td className="px-5 py-3 text-sm text-right text-slate-600">{inst.received}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${inst.rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-8">
                          {inst.rate}%
                        </span>
                      </div>
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
