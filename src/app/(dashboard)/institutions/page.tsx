"use client";

import { Topbar } from "@/components/layout/topbar";
import { mockInstitutions } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { INSTITUTION_TYPE_LABELS } from "@/types";
import { Building2, Phone, MapPin, Plus, ExternalLink } from "lucide-react";

const typeColors: Record<string, string> = {
  medical_center: "bg-red-100 text-red-700",
  hospital: "bg-blue-100 text-blue-700",
  clinic: "bg-green-100 text-green-700",
};

export default function InstitutionsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="機構管理" subtitle="合作醫療機構清單" />

      <div className="flex-1 p-6 space-y-4">
        <div className="flex justify-end">
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            新增機構
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockInstitutions.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{inst.name}</p>
                    <p className="text-xs font-mono text-slate-400">{inst.code}</p>
                  </div>
                </div>
                <Badge className={typeColors[inst.type]}>
                  {INSTITUTION_TYPE_LABELS[inst.type]}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2 mt-3">
                {inst.address && (
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{inst.address}</span>
                  </div>
                )}
                {inst.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{inst.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-3.5 h-3.5" />
                  詳細資訊
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return <div className="border-t border-slate-100 my-3" />;
}
