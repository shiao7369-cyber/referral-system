"use client";

import { Topbar } from "@/components/layout/topbar";
import { mockPatients, mockReferrals } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ChevronRight,
  Heart,
  AlertCircle,
  User,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PatientsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockPatients.filter(
    (p) =>
      !search ||
      p.name_masked.includes(search) ||
      (p.chart_no && p.chart_no.toLowerCase().includes(search.toLowerCase())) ||
      (p.primary_diagnosis &&
        p.primary_diagnosis.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="個案管理" subtitle="病人資料與健康紀錄追蹤" />

      <div className="flex-1 p-6 space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋個案姓名、病歷號…"
                className="pl-9 h-9 bg-slate-50 text-sm"
              />
            </div>
            <div className="ml-auto">
              <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                新增個案
              </button>
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((patient) => {
            const patientReferrals = mockReferrals.filter(
              (r) => r.patient_id === patient.id
            );
            const activeReferrals = patientReferrals.filter(
              (r) =>
                r.status !== "completed" &&
                r.status !== "cancelled" &&
                r.status !== "returned"
            );
            const hasOverdue = patientReferrals.some(
              (r) => r.status === "no_show"
            );

            return (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="block"
              >
                <div
                  className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-0.5 ${
                    hasOverdue
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-200"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {patient.name_masked}
                        </p>
                        <p className="text-xs text-slate-400">
                          {patient.chart_no} ·{" "}
                          {patient.gender === "M" ? "男" : "女"} ·{" "}
                          {patient.birth_year
                            ? `${new Date().getFullYear() - patient.birth_year} 歲`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {hasOverdue && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      {!patient.nhi_card_valid && (
                        <Badge className="bg-orange-100 text-orange-700 text-xs">
                          健保卡失效
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  {patient.chronic_conditions &&
                    patient.chronic_conditions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {patient.chronic_conditions.slice(0, 3).map((c) => (
                          <Badge
                            key={c}
                            className="bg-purple-50 text-purple-700 border-purple-100 text-xs"
                          >
                            {c}
                          </Badge>
                        ))}
                        {patient.chronic_conditions.length > 3 && (
                          <Badge className="bg-slate-100 text-slate-500 text-xs">
                            +{patient.chronic_conditions.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                  {/* Allergies */}
                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs text-orange-600">
                        藥物過敏：{patient.allergies.join("、")}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{patientReferrals.length} 次轉診</span>
                      </div>
                      {activeReferrals.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{activeReferrals.length} 件進行中</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>找不到符合條件的個案</p>
          </div>
        )}
      </div>
    </div>
  );
}
