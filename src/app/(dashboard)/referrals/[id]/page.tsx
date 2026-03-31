"use client";

import { Topbar } from "@/components/layout/topbar";
import { mockReferrals } from "@/lib/mock-data";
import { STATUS_CONFIG, URGENCY_CONFIG, DIRECTION_CONFIG } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  Edit,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusTimeline = [
  { key: "pending", label: "轉診建立", icon: FileText },
  { key: "scheduled", label: "已掛號", icon: Calendar },
  { key: "arrived", label: "已報到", icon: CheckCircle2 },
  { key: "in_treatment", label: "治療中", icon: Activity },
  { key: "completed", label: "已完成", icon: CheckCircle2 },
];

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string | null;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={`text-sm ${highlight ? "font-semibold text-slate-900" : "text-slate-700"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ReferralDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const referral = mockReferrals.find((r) => r.id === id);

  if (!referral) {
    return (
      <div className="flex flex-col min-h-full">
        <Topbar title="轉診詳情" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">找不到此轉診單</p>
            <Link href="/referrals" className="text-blue-600 text-sm mt-2 inline-block">
              返回列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[referral.status];
  const urgencyCfg = URGENCY_CONFIG[referral.urgency];
  const directionCfg = DIRECTION_CONFIG[referral.direction];

  const currentStepIndex = statusTimeline.findIndex((s) => s.key === referral.status);

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title={referral.referral_no}
        subtitle="轉診詳細資訊"
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/referrals"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回轉診列表
          </Link>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              新增備註
            </button>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4" />
              更新狀態
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Main Info */}
          <div className="xl:col-span-2 space-y-4">
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold text-slate-900">
                      {referral.patient?.name_masked}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-500">
                      {referral.patient?.birth_year
                        ? `${new Date().getFullYear() - referral.patient.birth_year} 歲`
                        : ""}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-500">
                      {referral.patient?.gender === "M" ? "男" : "女"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    病歷號：{referral.patient?.chart_no}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusCfg.color}`}
                  >
                    {statusCfg.label}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyCfg.color}`}
                  >
                    {urgencyCfg.label}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              {referral.status !== "cancelled" &&
                referral.status !== "no_show" && (
                  <div className="mt-6">
                    <div className="flex items-center">
                      {statusTimeline.map((step, index) => {
                        const isDone = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        return (
                          <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  isDone
                                    ? isCurrent
                                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                      : "bg-green-500 text-white"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                <step.icon className="w-4 h-4" />
                              </div>
                              <span
                                className={`text-xs mt-1 ${
                                  isDone ? "text-slate-700 font-medium" : "text-slate-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {index < statusTimeline.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-1 ${
                                  index < currentStepIndex ? "bg-green-400" : "bg-slate-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>

            {/* Referral Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">轉診資訊</h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="轉診方向" value={`${directionCfg.icon} ${directionCfg.label}`} />
                <InfoRow label="診斷碼（ICD-10）" value={referral.diagnosis_code} />
                <div className="col-span-2">
                  <InfoRow
                    label="診斷名稱"
                    value={referral.diagnosis_name}
                    highlight
                  />
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400">轉診原因</span>
                  <p className="text-sm text-slate-700 mt-0.5 bg-slate-50 rounded-lg p-3 border border-slate-100">
                    {referral.referral_reason}
                  </p>
                </div>
                <InfoRow
                  label="轉診日期"
                  value={new Date(referral.referral_date).toLocaleDateString("zh-TW")}
                />
                <InfoRow
                  label="預約就診日"
                  value={
                    referral.appointment_date
                      ? new Date(referral.appointment_date).toLocaleDateString("zh-TW")
                      : "未掛號"
                  }
                />
                <InfoRow
                  label="實際就診日"
                  value={
                    referral.actual_visit_date
                      ? new Date(referral.actual_visit_date).toLocaleDateString("zh-TW")
                      : "尚未就診"
                  }
                />
                <InfoRow
                  label="健保核准"
                  value={
                    referral.nhi_approved
                      ? `已核准 (${referral.nhi_code})`
                      : "待核准"
                  }
                />
              </div>
            </div>

            {/* Treatment Summary */}
            {(referral.treatment_summary || referral.followup_instructions) && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-900 mb-4">治療回報</h3>
                <div className="space-y-4">
                  {referral.treatment_summary && (
                    <div>
                      <span className="text-xs text-slate-400">治療摘要</span>
                      <p className="text-sm text-slate-700 mt-1 bg-green-50 rounded-lg p-3 border border-green-100">
                        {referral.treatment_summary}
                      </p>
                    </div>
                  )}
                  {referral.followup_instructions && (
                    <div>
                      <span className="text-xs text-slate-400">追蹤建議</span>
                      <p className="text-sm text-slate-700 mt-1 bg-blue-50 rounded-lg p-3 border border-blue-100">
                        {referral.followup_instructions}
                      </p>
                    </div>
                  )}
                  {referral.return_date && (
                    <InfoRow
                      label="建議回診日"
                      value={new Date(referral.return_date).toLocaleDateString("zh-TW")}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">個案資訊</h3>
              </div>
              <div className="space-y-3">
                <InfoRow
                  label="慢性病史"
                  value={referral.patient?.chronic_conditions?.join("、") || "無"}
                />
                <InfoRow
                  label="藥物過敏"
                  value={
                    referral.patient?.allergies?.length
                      ? referral.patient.allergies.join("、")
                      : "無"
                  }
                />
                <InfoRow
                  label="血型"
                  value={referral.patient?.blood_type || "不明"}
                />
                <InfoRow
                  label="健保卡狀態"
                  value={referral.patient?.nhi_card_valid ? "有效" : "失效"}
                />
              </div>
              <Separator className="my-3" />
              <Link
                href={`/patients/${referral.patient_id}`}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                查看完整病歷
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* From Institution */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">轉診機構</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">發送機構</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {referral.from_institution?.name}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {referral.from_institution?.phone}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 mb-1">接收機構</p>
                  <p className="text-sm font-semibold text-blue-700">
                    {referral.to_institution?.name}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {referral.to_institution?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">時間紀錄</h3>
              </div>
              <div className="space-y-2">
                <InfoRow
                  label="建立時間"
                  value={new Date(referral.created_at).toLocaleString("zh-TW")}
                />
                <InfoRow
                  label="最後更新"
                  value={new Date(referral.updated_at).toLocaleString("zh-TW")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
