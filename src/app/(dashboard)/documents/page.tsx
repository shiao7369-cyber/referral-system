"use client";

import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image as ImageIcon,
  FlaskConical,
  Pill,
  Upload,
  Download,
  Trash2,
  Lock,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const docTypeConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  lab_report: {
    label: "檢驗報告",
    icon: FlaskConical,
    color: "bg-purple-100 text-purple-700",
  },
  imaging: {
    label: "影像資料",
    icon: ImageIcon,
    color: "bg-blue-100 text-blue-700",
  },
  referral_letter: {
    label: "轉診單",
    icon: FileText,
    color: "bg-teal-100 text-teal-700",
  },
  prescription: {
    label: "處方箋",
    icon: Pill,
    color: "bg-green-100 text-green-700",
  },
  discharge_summary: {
    label: "出院摘要",
    icon: FileText,
    color: "bg-orange-100 text-orange-700",
  },
};

const mockDocuments = [
  {
    id: "doc-1",
    referral_no: "REF-2024-000001",
    patient: "王○明",
    doc_type: "lab_report",
    file_name: "HbA1c_report_20240301.pdf",
    file_size: 245760,
    is_encrypted: true,
    created_at: new Date("2024-03-01"),
    uploaded_by: "李文忠 護理師",
  },
  {
    id: "doc-2",
    referral_no: "REF-2024-000001",
    patient: "王○明",
    doc_type: "imaging",
    file_name: "chest_xray_20240215.jpg",
    file_size: 1024000,
    is_encrypted: true,
    created_at: new Date("2024-02-15"),
    uploaded_by: "影像部門",
  },
  {
    id: "doc-3",
    referral_no: "REF-2024-000004",
    patient: "張○美",
    doc_type: "discharge_summary",
    file_name: "discharge_summary_20240325.pdf",
    file_size: 189440,
    is_encrypted: true,
    created_at: new Date("2024-03-25"),
    uploaded_by: "台大醫院",
  },
  {
    id: "doc-4",
    referral_no: "REF-2024-000002",
    patient: "林○芳",
    doc_type: "referral_letter",
    file_name: "referral_20240328.pdf",
    file_size: 102400,
    is_encrypted: true,
    created_at: new Date("2024-03-28"),
    uploaded_by: "王大明 醫師",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentsPage() {
  const [isDragging, setIsDragging] = useState(false);

  function handleUpload(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    toast.success("文件上傳中…", { description: "加密處理並安全儲存" });
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="文件管理" subtitle="加密文件上傳與安全共享" />

      <div className="flex-1 p-6 space-y-4">
        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleUpload}
          className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">
                拖曳文件到此處或
                <button className="text-blue-600 hover:underline ml-1">
                  點擊上傳
                </button>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                支援 PDF、JPG、PNG、DICOM · 最大 50MB · 全程加密儲存
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-600 font-medium">
                AES-256 加密 · 符合個資法及HIPAA規範
              </span>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">已上傳文件</h3>
            <Badge className="bg-slate-100 text-slate-600">
              {mockDocuments.length} 件
            </Badge>
          </div>
          <div className="divide-y divide-slate-100">
            {mockDocuments.map((doc) => {
              const typeConf = docTypeConfig[doc.doc_type] || docTypeConfig.referral_letter;
              const TypeIcon = typeConf.icon;
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeConf.color}`}
                  >
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {doc.file_name}
                      </p>
                      {doc.is_encrypted && (
                        <Lock className="w-3 h-3 text-green-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <Badge className={`${typeConf.color} text-xs`}>
                        {typeConf.label}
                      </Badge>
                      <span>{doc.patient}</span>
                      <span>·</span>
                      <span>{doc.referral_no}</span>
                      <span>·</span>
                      <span>{formatBytes(doc.file_size)}</span>
                      <span>·</span>
                      <span>
                        {doc.created_at.toLocaleDateString("zh-TW")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      上傳者：{doc.uploaded_by}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toast.info("正在解密並開啟文件…")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.info("正在下載文件…")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.error("確定要刪除此文件？")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
