"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { SankeyChart } from "@/components/charts/sankey-chart";
import { transferInData, transferOutData } from "@/lib/sankey-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

type Direction = "in" | "out";

const IN_KPI_NODE: Record<string, number> = {
  emergency: 3,
  internal: 4,
  surgery: 5,
  obgyn: 6,
  pediatric: 7,
};

const OUT_KPI_NODE: Record<string, number> = {
  medCenter: 3,
  regional: 4,
  clinic: 5,
};

const IN_KPI_DEFS = [
  { key: "emergency", label: "急診", color: "bg-red-50 text-red-700", accent: "border-red-300 bg-red-50/60" },
  { key: "internal", label: "內科", color: "bg-teal-50 text-teal-700", accent: "border-teal-300 bg-teal-50/60" },
  { key: "surgery", label: "外科", color: "bg-sky-50 text-sky-700", accent: "border-sky-300 bg-sky-50/60" },
  { key: "obgyn", label: "婦科", color: "bg-green-50 text-green-700", accent: "border-green-300 bg-green-50/60" },
  { key: "pediatric", label: "兒科", color: "bg-amber-50 text-amber-700", accent: "border-amber-300 bg-amber-50/60" },
] as const;

const OUT_KPI_DEFS = [
  { key: "medCenter", label: "醫學中心", color: "bg-red-50 text-red-700", accent: "border-red-300 bg-red-50/60" },
  { key: "regional", label: "區域/地區醫院", color: "bg-teal-50 text-teal-700", accent: "border-teal-300 bg-teal-50/60" },
  { key: "clinic", label: "基層診所", color: "bg-green-50 text-green-700", accent: "border-green-300 bg-green-50/60" },
] as const;

function formatDelta(cur: number, prev: number | null) {
  if (prev === null) return { trend: "flat" as const, abs: "", pct: "" };
  const diff = cur - prev;
  const trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  const abs = diff > 0 ? `+${diff}` : `${diff}`;
  const pct = prev === 0 ? "" : ` (${diff >= 0 ? "+" : ""}${((diff / prev) * 100).toFixed(1)}%)`;
  return { trend, abs, pct };
}

export default function FlowAnalysisPage() {
  const months = ["115年1月", "115年2月", "115年3月"];
  const [monthIdx, setMonthIdx] = useState(0);
  const [direction, setDirection] = useState<Direction>("in");
  const [highlightKey, setHighlightKey] = useState<string | null>(null);

  const selectedMonth = months[monthIdx];
  const inData = transferInData[monthIdx];
  const outData = transferOutData[monthIdx];
  const currentData = direction === "in" ? inData : outData;
  const prevIdx = monthIdx > 0 ? monthIdx - 1 : null;

  const kpiDefs = direction === "in" ? IN_KPI_DEFS : OUT_KPI_DEFS;
  const kpiNodeMap = direction === "in" ? IN_KPI_NODE : OUT_KPI_NODE;
  const highlightNodeIndex = highlightKey ? kpiNodeMap[highlightKey] : null;

  const handleDirectionChange = (d: Direction) => {
    setDirection(d);
    setHighlightKey(null);
  };

  const handleMonthChange = (idx: number) => {
    setMonthIdx(idx);
    setHighlightKey(null);
  };

  const toggleHighlight = (key: string) => {
    setHighlightKey((cur) => (cur === key ? null : key));
  };

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="流向分析" subtitle="轉入轉出個案桑基圖與科別分析" />

      <div className="flex-1 p-6 space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">月份</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => monthIdx > 0 && handleMonthChange(monthIdx - 1)}
                disabled={monthIdx === 0}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="上個月"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <Select
                value={selectedMonth}
                onValueChange={(v) => v && handleMonthChange(months.indexOf(v))}
              >
                <SelectTrigger className="w-32 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => monthIdx < months.length - 1 && handleMonthChange(monthIdx + 1)}
                disabled={monthIdx === months.length - 1}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="下個月"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => handleDirectionChange("in")}
                className={`flex items-center gap-1.5 px-4 h-9 text-sm font-medium transition-colors ${
                  direction === "in"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ArrowDownToLine className="w-4 h-4" />
                轉入分析
              </button>
              <button
                onClick={() => handleDirectionChange("out")}
                className={`flex items-center gap-1.5 px-4 h-9 text-sm font-medium transition-colors ${
                  direction === "out"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ArrowUpFromLine className="w-4 h-4" />
                轉出分析
              </button>
            </div>

            <Badge className="ml-2 bg-slate-100 text-slate-700 text-sm">
              共 {currentData.total} 人
            </Badge>

            {highlightKey && (
              <button
                onClick={() => setHighlightKey(null)}
                className="ml-auto flex items-center gap-1 px-3 h-9 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                清除高亮
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            💡 點擊下方 KPI 卡可在桑基圖中高亮該類別的流向
          </p>
        </div>

        {/* KPI Cards */}
        <div
          className={`grid gap-4 ${
            direction === "in" ? "grid-cols-2 xl:grid-cols-5" : "grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {kpiDefs.map((def) => {
            const summary = direction === "in" ? inData.summary : outData.summary;
            const prevSummary =
              prevIdx !== null
                ? direction === "in"
                  ? transferInData[prevIdx].summary
                  : transferOutData[prevIdx].summary
                : null;
            const value = (summary as Record<string, number>)[def.key];
            const prev = prevSummary ? (prevSummary as Record<string, number>)[def.key] : null;
            const { trend, abs, pct } = formatDelta(value, prev);
            const percentOfTotal = ((value / currentData.total) * 100).toFixed(1);
            const isActive = highlightKey === def.key;

            return (
              <button
                key={def.key}
                onClick={() => toggleHighlight(def.key)}
                className={`text-left bg-white rounded-xl border shadow-sm p-4 transition-all ${
                  isActive
                    ? `${def.accent} ring-2 ring-offset-1 ring-blue-400 shadow-md`
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge className={`${def.color} text-xs`}>{def.label}</Badge>
                  {prev !== null && (
                    <span
                      className={`flex items-center gap-0.5 text-xs ${
                        trend === "up"
                          ? "text-green-600"
                          : trend === "down"
                            ? "text-red-600"
                            : "text-slate-400"
                      }`}
                    >
                      {trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : trend === "down" ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                      {abs}
                      {pct}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {value}
                  <span className="text-sm font-normal text-slate-400 ml-1">人</span>
                </p>
                <p className="text-xs text-slate-400">佔 {percentOfTotal}%</p>
              </button>
            );
          })}
        </div>

        {/* Sankey Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <SankeyChart
            title={
              direction === "in"
                ? `115年${inData.month} 轉入個案流向分析`
                : `115年${outData.month} 轉出個案流向分析`
            }
            subtitle={
              direction === "in"
                ? `轉入方式 → 五大科 → 內科/外科細項 → 門診前五名醫師 ｜ 總計 ${inData.total} 人`
                : `轉出方式 → 轉出目的地 → 基層診所前五名醫師 ｜ 總計 ${outData.total} 人`
            }
            nodes={currentData.nodes}
            links={currentData.links}
            height={580}
            highlightNodeIndex={highlightNodeIndex}
          />
        </div>

        {/* Top Doctors Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">
              {direction === "in" ? "門診轉入前五名醫師" : "轉基層診所前五名醫師"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">115年{currentData.month}</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">排名</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">醫師</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500">科別</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">人數</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500">占比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(direction === "in" ? inData.topDoctors : outData.topClinicDoctors).map(
                (doc, i) => {
                  const base = direction === "in" ? inData.total : outData.summary.clinic;
                  const pct = ((doc.count / base) * 100).toFixed(1);
                  return (
                    <tr key={doc.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-sm">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            i === 0
                              ? "bg-amber-100 text-amber-700"
                              : i === 1
                                ? "bg-slate-100 text-slate-600"
                                : i === 2
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-800">{doc.name}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{doc.dept}</td>
                      <td className="px-5 py-3 text-sm text-right font-semibold text-slate-800">
                        {doc.count} 人
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full"
                              style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 w-12 text-right">
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
