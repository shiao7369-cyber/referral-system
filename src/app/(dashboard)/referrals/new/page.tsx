"use client";

import { Topbar } from "@/components/layout/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { mockInstitutions } from "@/lib/mock-data";

const icd10Suggestions = [
  { code: "E11.9", name: "第二型糖尿病，未指明之併發症" },
  { code: "I10", name: "原發性（必要性）高血壓" },
  { code: "N18.3", name: "慢性腎臟病，第三期" },
  { code: "J18.9", name: "肺炎，未指明" },
  { code: "I25.9", name: "慢性缺血性心臟病，未指明" },
  { code: "K21.0", name: "胃食道逆流性疾病合併食道炎" },
  { code: "M79.3", name: "坐骨神經痛" },
  { code: "F32.9", name: "重鬱症，單次發作，未指明嚴重度" },
];

export default function NewReferralPage() {
  const [diagSearch, setDiagSearch] = useState("");
  const [selectedDiag, setSelectedDiag] = useState<{
    code: string;
    name: string;
  } | null>(null);

  const filteredDiag = icd10Suggestions.filter(
    (d) =>
      diagSearch &&
      (d.code.toLowerCase().includes(diagSearch.toLowerCase()) ||
        d.name.includes(diagSearch))
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("轉診單已成功建立！", {
      description: "系統將自動通知接收機構",
    });
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="新增轉診單" subtitle="填寫轉診資訊並送出" />

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Link
            href="/referrals"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回轉診列表
          </Link>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section: 個案資訊 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                個案資訊
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    搜尋個案（病歷號或姓名）
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="輸入病歷號或個案姓名…"
                      className="pl-9 bg-slate-50"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    個案姓名（遮蔽）
                  </Label>
                  <Input placeholder="如：王○明" className="bg-slate-50" />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    病歷號
                  </Label>
                  <Input placeholder="C2024001" className="bg-slate-50" />
                </div>
              </div>
            </div>

            {/* Section: 轉診資訊 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                轉診資訊
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    轉診方向 *
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="選擇方向" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upward">↑ 上轉（診所 → 醫院）</SelectItem>
                      <SelectItem value="downward">↓ 下轉（醫院 → 診所）</SelectItem>
                      <SelectItem value="lateral">↔ 平轉（同層級）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    緊急程度 *
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="選擇緊急度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">🔴 緊急</SelectItem>
                      <SelectItem value="urgent">🟠 急診</SelectItem>
                      <SelectItem value="routine">⚪ 一般</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    接收機構 *
                  </Label>
                  <Select required>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="選擇醫療機構" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInstitutions.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    預約就診日
                  </Label>
                  <Input type="date" className="bg-slate-50" />
                </div>
              </div>
            </div>

            {/* Section: 診斷資訊 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                診斷資訊
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    ICD-10 診斷碼搜尋 *
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={diagSearch}
                      onChange={(e) => setDiagSearch(e.target.value)}
                      placeholder="輸入診斷碼或疾病名稱搜尋（如：E11 或 糖尿病）"
                      className="pl-9 bg-slate-50"
                    />
                  </div>
                  {/* ICD-10 Suggestions */}
                  {filteredDiag.length > 0 && (
                    <div className="mt-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                      {filteredDiag.map((d) => (
                        <button
                          key={d.code}
                          type="button"
                          onClick={() => {
                            setSelectedDiag(d);
                            setDiagSearch(d.code + " - " + d.name);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
                        >
                          <span className="text-xs font-mono font-bold text-blue-600 w-16 shrink-0">
                            {d.code}
                          </span>
                          <span className="text-sm text-slate-700">{d.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedDiag && (
                    <div className="mt-2 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                      <span className="text-xs font-mono font-bold text-blue-700">
                        {selectedDiag.code}
                      </span>
                      <span className="text-xs text-blue-700">
                        {selectedDiag.name}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    轉診原因說明 *
                  </Label>
                  <Textarea
                    placeholder="請說明轉診原因、病情描述、目前用藥情況及特殊需求…"
                    className="bg-slate-50 min-h-[120px] resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: 健保資訊 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                健保資訊
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="nhi"
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <label htmlFor="nhi" className="text-sm text-slate-700">
                    已申請健保核准
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="copay"
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <label htmlFor="copay" className="text-sm text-slate-700">
                    免收部分負擔
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <Link
                href="/referrals"
                className="h-10 px-5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center"
              >
                取消
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 h-10 px-6 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                送出轉診單
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
