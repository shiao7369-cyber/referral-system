"use client";

import { Topbar } from "@/components/layout/topbar";
import { mockPatients, mockReferrals } from "@/lib/mock-data";
import { STATUS_CONFIG } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertCircle,
  Heart,
  Activity,
  Pill,
  Calendar,
  ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Mock health data
const mockHealthData = [
  { date: "1月", hba1c: 9.2, systolic: 145, diastolic: 92 },
  { date: "2月", hba1c: 8.8, systolic: 138, diastolic: 88 },
  { date: "3月", hba1c: 8.5, systolic: 135, diastolic: 86 },
  { date: "4月", hba1c: 8.1, systolic: 130, diastolic: 84 },
  { date: "5月", hba1c: 7.9, systolic: 128, diastolic: 82 },
  { date: "6月", hba1c: 7.8, systolic: 126, diastolic: 80 },
];

export default function PatientDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const patient = mockPatients.find((p) => p.id === id);
  const patientReferrals = mockReferrals.filter((r) => r.patient_id === id);

  if (!patient) {
    return (
      <div className="flex flex-col min-h-full">
        <Topbar title="個案詳情" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">找不到此個案</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title={patient.name_masked} subtitle="個案健康紀錄" />

      <div className="flex-1 p-6 space-y-4">
        <Link
          href="/patients"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回個案列表
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left: Info Cards */}
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {patient.name_masked[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {patient.name_masked}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {patient.gender === "M" ? "男性" : "女性"} ·{" "}
                    {patient.birth_year
                      ? `${new Date().getFullYear() - patient.birth_year} 歲（${patient.birth_year} 年次）`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">病歷號</span>
                  <span className="font-mono font-medium text-slate-700">
                    {patient.chart_no}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">血型</span>
                  <span className="text-slate-700">{patient.blood_type || "不明"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">健保身分</span>
                  <span className="text-slate-700">{patient.insurance_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">健保卡</span>
                  <Badge
                    className={
                      patient.nhi_card_valid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {patient.nhi_card_valid ? "有效" : "失效"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">聯絡電話</span>
                  <span className="text-slate-700">{patient.phone_masked}</span>
                </div>
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-red-400" />
                <h3 className="font-semibold text-slate-900">慢性病史</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.chronic_conditions?.length ? (
                  patient.chronic_conditions.map((c) => (
                    <Badge
                      key={c}
                      className="bg-purple-50 text-purple-700 border-purple-100"
                    >
                      {c}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">無慢性病史記錄</p>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <h3 className="font-semibold text-slate-900">藥物過敏</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies?.length ? (
                  patient.allergies.map((a) => (
                    <Badge key={a} className="bg-orange-50 text-orange-700 border-orange-100">
                      {a}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">無藥物過敏記錄</p>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-slate-900">轉診統計</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {patientReferrals.length}
                  </p>
                  <p className="text-xs text-blue-500 mt-0.5">總轉診次數</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {patientReferrals.filter((r) => r.status === "completed" || r.status === "returned").length}
                  </p>
                  <p className="text-xs text-green-500 mt-0.5">已完成</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Charts + Referral History */}
          <div className="xl:col-span-2 space-y-4">
            {/* Health Trend Chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-slate-900">健康指標趨勢</h3>
                <Badge className="bg-slate-100 text-slate-500 text-xs ml-auto">
                  近6個月
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={mockHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[6, 12]}
                    label={{ value: "HbA1c (%)", angle: -90, position: "insideLeft", style: { fontSize: 10 } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[60, 180]}
                    label={{ value: "血壓 (mmHg)", angle: 90, position: "insideRight", style: { fontSize: 10 } }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="hba1c"
                    name="HbA1c (%)"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="systolic"
                    name="收縮壓"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="diastolic"
                    name="舒張壓"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Referral History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 p-5 border-b border-slate-100">
                <ArrowLeftRight className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-slate-900">轉診紀錄</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {patientReferrals.length === 0 ? (
                  <p className="text-sm text-slate-400 p-5">尚無轉診記錄</p>
                ) : (
                  patientReferrals.map((referral) => {
                    const statusCfg = STATUS_CONFIG[referral.status];
                    return (
                      <div key={referral.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-mono font-semibold text-blue-600">
                                {referral.referral_no}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}
                              >
                                {statusCfg.label}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700">
                              {referral.diagnosis_name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Calendar className="w-3 h-3" />
                                {new Date(referral.referral_date).toLocaleDateString("zh-TW")}
                              </div>
                              <span className="text-xs text-slate-400">
                                {referral.direction === "upward" ? "↑ 上轉至" : "↓ 下轉至"}{" "}
                                {referral.direction === "upward"
                                  ? referral.to_institution?.name
                                  : referral.from_institution?.name}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/referrals/${referral.id}`}
                            className="text-xs text-blue-600 hover:text-blue-700 ml-4"
                          >
                            查看詳情
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
