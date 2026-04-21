import type { SankeyNode, SankeyLink } from "@/components/charts/sankey-chart";

// === Color constants ===
const C = {
  emergency: { solid: "rgba(255,107,107,1)", link: "rgba(255,107,107,0.4)" },
  internal: { solid: "rgba(78,205,196,1)", link: "rgba(78,205,196,0.4)" },
  surgery: { solid: "rgba(69,183,209,1)", link: "rgba(69,183,209,0.4)" },
  obgyn: { solid: "rgba(150,206,180,1)", link: "rgba(150,206,180,0.4)" },
  pediatric: { solid: "rgba(255,210,100,1)", link: "rgba(255,210,100,0.5)" },
  doctor: { solid: "rgba(255,165,0,0.9)", link: "rgba(255,165,0,0.45)" },
  medCenter: { solid: "rgba(255,107,107,1)", link: "rgba(255,107,107,0.35)" },
  regional: { solid: "rgba(78,205,196,1)", link: "rgba(78,205,196,0.35)" },
  clinic: { solid: "rgba(150,206,180,1)", link: "rgba(150,206,180,0.35)" },
  methodClinic: "rgba(78,205,196,0.85)",
  methodEmergency: "rgba(255,107,107,0.85)",
  methodInpatient: "rgba(69,183,209,0.85)",
};

// ========== 轉入分析 ==========

export interface MonthlyTransferInData {
  month: string;
  total: number;
  nodes: SankeyNode[];
  links: SankeyLink[];
  topDoctors: { name: string; dept: string; count: number }[];
  summary: {
    emergency: number;
    internal: number;
    surgery: number;
    obgyn: number;
    pediatric: number;
  };
}

export const transferInData: MonthlyTransferInData[] = [
  {
    month: "1月",
    total: 493,
    summary: { emergency: 171, internal: 126, surgery: 167, obgyn: 24, pediatric: 4 },
    topDoctors: [
      { name: "黃筱菁", dept: "外科", count: 19 },
      { name: "林佳賢", dept: "消化內科", count: 16 },
      { name: "吳青芳", dept: "婦產科", count: 16 },
      { name: "杜家齊", dept: "骨科", count: 14 },
      { name: "藍敏書", dept: "骨科", count: 11 },
    ],
    nodes: [
      // 0-2: 轉入方式
      { label: "轉入門診\n(314人)", color: C.methodClinic },
      { label: "轉入急診\n(171人)", color: C.methodEmergency },
      { label: "轉入住院\n(8人)", color: C.methodInpatient },
      // 3-7: 五大科
      { label: "急診\n(171人, 34.7%)", color: C.emergency.solid },
      { label: "內科\n(126人, 25.6%)", color: C.internal.solid },
      { label: "外科\n(167人, 33.9%)", color: C.surgery.solid },
      { label: "婦科\n(24人, 4.9%)", color: C.obgyn.solid },
      { label: "兒科\n(4人, 0.8%)", color: C.pediatric.solid },
      // 8-15: 內科細項
      { label: "消化內科\n(45人)", color: "rgba(78,205,196,0.75)" },
      { label: "心臟血管內\n(31人)", color: "rgba(78,205,196,0.75)" },
      { label: "胸腔內科\n(18人)", color: "rgba(78,205,196,0.75)" },
      { label: "內分泌科\n(11人)", color: "rgba(78,205,196,0.75)" },
      { label: "神經科\n(9人)", color: "rgba(78,205,196,0.75)" },
      { label: "腎臟內科\n(4人)", color: "rgba(78,205,196,0.75)" },
      { label: "感染科\n(4人)", color: "rgba(78,205,196,0.75)" },
      { label: "家庭醫學科\n(4人)", color: "rgba(78,205,196,0.75)" },
      // 16-26: 外科細項
      { label: "骨科\n(50人)", color: "rgba(69,183,209,0.75)" },
      { label: "外科\n(48人)", color: "rgba(69,183,209,0.75)" },
      { label: "泌尿科\n(27人)", color: "rgba(69,183,209,0.75)" },
      { label: "神經外科\n(13人)", color: "rgba(69,183,209,0.75)" },
      { label: "耳鼻喉科\n(9人)", color: "rgba(69,183,209,0.75)" },
      { label: "眼科\n(8人)", color: "rgba(69,183,209,0.75)" },
      { label: "疼痛中心\n(6人)", color: "rgba(69,183,209,0.75)" },
      { label: "放射腫瘤科\n(2人)", color: "rgba(69,183,209,0.75)" },
      { label: "整型外科\n(2人)", color: "rgba(69,183,209,0.75)" },
      { label: "復健科\n(1人)", color: "rgba(69,183,209,0.75)" },
      { label: "心臟血管外\n(1人)", color: "rgba(69,183,209,0.75)" },
      // 27-31: 前五名醫師
      { label: "黃筱菁\n(外科, 19人)", color: C.doctor.solid },
      { label: "林佳賢\n(消化內科, 16人)", color: C.doctor.solid },
      { label: "吳青芳\n(婦產科, 16人)", color: C.doctor.solid },
      { label: "杜家齊\n(骨科, 14人)", color: C.doctor.solid },
      { label: "藍敏書\n(骨科, 11人)", color: C.doctor.solid },
    ],
    links: [
      // 轉入方式 → 五大科
      { source: 1, target: 3, value: 171, color: C.emergency.link },
      { source: 0, target: 4, value: 119, color: C.internal.link },
      { source: 2, target: 4, value: 7, color: C.internal.link },
      { source: 0, target: 5, value: 166, color: C.surgery.link },
      { source: 2, target: 5, value: 1, color: C.surgery.link },
      { source: 0, target: 6, value: 24, color: C.obgyn.link },
      { source: 0, target: 7, value: 4, color: C.pediatric.link },
      // 內科 → 細項
      { source: 4, target: 8, value: 45, color: C.internal.link },
      { source: 4, target: 9, value: 31, color: C.internal.link },
      { source: 4, target: 10, value: 18, color: C.internal.link },
      { source: 4, target: 11, value: 11, color: C.internal.link },
      { source: 4, target: 12, value: 9, color: C.internal.link },
      { source: 4, target: 13, value: 4, color: C.internal.link },
      { source: 4, target: 14, value: 4, color: C.internal.link },
      { source: 4, target: 15, value: 4, color: C.internal.link },
      // 外科 → 細項
      { source: 5, target: 16, value: 50, color: C.surgery.link },
      { source: 5, target: 17, value: 48, color: C.surgery.link },
      { source: 5, target: 18, value: 27, color: C.surgery.link },
      { source: 5, target: 19, value: 13, color: C.surgery.link },
      { source: 5, target: 20, value: 9, color: C.surgery.link },
      { source: 5, target: 21, value: 8, color: C.surgery.link },
      { source: 5, target: 22, value: 6, color: C.surgery.link },
      { source: 5, target: 23, value: 2, color: C.surgery.link },
      { source: 5, target: 24, value: 2, color: C.surgery.link },
      { source: 5, target: 25, value: 1, color: C.surgery.link },
      { source: 5, target: 26, value: 1, color: C.surgery.link },
      // 細項/婦科 → 前五名醫師
      { source: 17, target: 27, value: 19, color: C.doctor.link },
      { source: 8, target: 28, value: 16, color: C.doctor.link },
      { source: 6, target: 29, value: 16, color: C.doctor.link },
      { source: 16, target: 30, value: 14, color: C.doctor.link },
      { source: 16, target: 31, value: 11, color: C.doctor.link },
    ],
  },
  {
    month: "2月",
    total: 369,
    summary: { emergency: 157, internal: 70, surgery: 120, obgyn: 17, pediatric: 3 },
    topDoctors: [
      { name: "黃筱菁", dept: "外科", count: 18 },
      { name: "吳青芳", dept: "婦產科", count: 13 },
      { name: "杜家齊", dept: "骨科", count: 12 },
      { name: "藍敏書", dept: "骨科", count: 10 },
      { name: "朱元中", dept: "泌尿科", count: 7 },
    ],
    nodes: [
      // 0-2: 轉入方式
      { label: "轉入門診\n(205人)", color: C.methodClinic },
      { label: "轉入急診\n(157人)", color: C.methodEmergency },
      { label: "轉入住院\n(7人)", color: C.methodInpatient },
      // 3-7: 五大科
      { label: "急診\n(157人, 42.5%)", color: C.emergency.solid },
      { label: "內科\n(70人, 19.0%)", color: C.internal.solid },
      { label: "外科\n(120人, 32.5%)", color: C.surgery.solid },
      { label: "婦科\n(17人, 4.6%)", color: C.obgyn.solid },
      { label: "兒科\n(3人, 0.8%)", color: C.pediatric.solid },
      // 8-13: 內科細項
      { label: "消化內科\n(22人)", color: "rgba(78,205,196,0.75)" },
      { label: "心臟血管內\n(15人)", color: "rgba(78,205,196,0.75)" },
      { label: "胸腔內科\n(12人)", color: "rgba(78,205,196,0.75)" },
      { label: "內分泌科\n(10人)", color: "rgba(78,205,196,0.75)" },
      { label: "神經科\n(7人)", color: "rgba(78,205,196,0.75)" },
      { label: "家庭醫學科\n(4人)", color: "rgba(78,205,196,0.75)" },
      // 14-20: 外科細項
      { label: "外科\n(35人)", color: "rgba(69,183,209,0.75)" },
      { label: "骨科\n(30人)", color: "rgba(69,183,209,0.75)" },
      { label: "泌尿科\n(22人)", color: "rgba(69,183,209,0.75)" },
      { label: "神經外科\n(10人)", color: "rgba(69,183,209,0.75)" },
      { label: "耳鼻喉科\n(10人)", color: "rgba(69,183,209,0.75)" },
      { label: "眼科\n(8人)", color: "rgba(69,183,209,0.75)" },
      { label: "疼痛中心\n(5人)", color: "rgba(69,183,209,0.75)" },
      // 21-25: 前五名醫師
      { label: "黃筱菁\n(外科, 18人)", color: C.doctor.solid },
      { label: "吳青芳\n(婦產科, 13人)", color: C.doctor.solid },
      { label: "杜家齊\n(骨科, 12人)", color: C.doctor.solid },
      { label: "藍敏書\n(骨科, 10人)", color: C.doctor.solid },
      { label: "朱元中\n(泌尿科, 7人)", color: C.doctor.solid },
    ],
    links: [
      // 轉入方式 → 五大科
      { source: 1, target: 3, value: 157, color: C.emergency.link },
      { source: 0, target: 4, value: 63, color: C.internal.link },
      { source: 2, target: 4, value: 7, color: C.internal.link },
      { source: 0, target: 5, value: 120, color: C.surgery.link },
      { source: 0, target: 6, value: 17, color: C.obgyn.link },
      { source: 0, target: 7, value: 3, color: C.pediatric.link },
      // 內科 → 細項
      { source: 4, target: 8, value: 22, color: C.internal.link },
      { source: 4, target: 9, value: 15, color: C.internal.link },
      { source: 4, target: 10, value: 12, color: C.internal.link },
      { source: 4, target: 11, value: 10, color: C.internal.link },
      { source: 4, target: 12, value: 7, color: C.internal.link },
      { source: 4, target: 13, value: 4, color: C.internal.link },
      // 外科 → 細項
      { source: 5, target: 14, value: 35, color: C.surgery.link },
      { source: 5, target: 15, value: 30, color: C.surgery.link },
      { source: 5, target: 16, value: 22, color: C.surgery.link },
      { source: 5, target: 17, value: 10, color: C.surgery.link },
      { source: 5, target: 18, value: 10, color: C.surgery.link },
      { source: 5, target: 19, value: 8, color: C.surgery.link },
      { source: 5, target: 20, value: 5, color: C.surgery.link },
      // 細項/婦科 → 前五名醫師
      { source: 14, target: 21, value: 18, color: C.doctor.link },
      { source: 6, target: 22, value: 13, color: C.doctor.link },
      { source: 15, target: 23, value: 12, color: C.doctor.link },
      { source: 15, target: 24, value: 10, color: C.doctor.link },
      { source: 16, target: 25, value: 7, color: C.doctor.link },
    ],
  },
  {
    month: "3月",
    total: 518,
    summary: { emergency: 164, internal: 159, surgery: 168, obgyn: 18, pediatric: 9 },
    topDoctors: [
      { name: "黃筱菁", dept: "外科", count: 21 },
      { name: "杜家齊", dept: "骨科", count: 16 },
      { name: "康家綾", dept: "消化內科", count: 14 },
      { name: "張峻源", dept: "神經科", count: 14 },
      { name: "林佳賢", dept: "消化內科", count: 12 },
    ],
    nodes: [
      // 0-2: 轉入方式
      { label: "轉入門診\n(347人)", color: C.methodClinic },
      { label: "轉入急診\n(164人)", color: C.methodEmergency },
      { label: "轉入住院\n(7人)", color: C.methodInpatient },
      // 3-7: 五大科
      { label: "急診\n(164人, 31.7%)", color: C.emergency.solid },
      { label: "內科\n(159人, 30.7%)", color: C.internal.solid },
      { label: "外科\n(168人, 32.4%)", color: C.surgery.solid },
      { label: "婦科\n(18人, 3.5%)", color: C.obgyn.solid },
      { label: "兒科\n(9人, 1.7%)", color: C.pediatric.solid },
      // 8-15: 內科細項
      { label: "消化內科\n(40人)", color: "rgba(78,205,196,0.75)" },
      { label: "心臟血管內\n(28人)", color: "rgba(78,205,196,0.75)" },
      { label: "胸腔內科\n(20人)", color: "rgba(78,205,196,0.75)" },
      { label: "內分泌科\n(15人)", color: "rgba(78,205,196,0.75)" },
      { label: "神經科\n(25人)", color: "rgba(78,205,196,0.75)" },
      { label: "腎臟內科\n(12人)", color: "rgba(78,205,196,0.75)" },
      { label: "感染科\n(10人)", color: "rgba(78,205,196,0.75)" },
      { label: "家庭醫學科\n(9人)", color: "rgba(78,205,196,0.75)" },
      // 16-23: 外科細項
      { label: "外科\n(55人)", color: "rgba(69,183,209,0.75)" },
      { label: "骨科\n(45人)", color: "rgba(69,183,209,0.75)" },
      { label: "泌尿科\n(28人)", color: "rgba(69,183,209,0.75)" },
      { label: "神經外科\n(12人)", color: "rgba(69,183,209,0.75)" },
      { label: "耳鼻喉科\n(10人)", color: "rgba(69,183,209,0.75)" },
      { label: "眼科\n(8人)", color: "rgba(69,183,209,0.75)" },
      { label: "疼痛中心\n(6人)", color: "rgba(69,183,209,0.75)" },
      { label: "復健科\n(4人)", color: "rgba(69,183,209,0.75)" },
      // 24-28: 前五名醫師
      { label: "黃筱菁\n(外科, 21人)", color: C.doctor.solid },
      { label: "杜家齊\n(骨科, 16人)", color: C.doctor.solid },
      { label: "康家綾\n(消化內科, 14人)", color: C.doctor.solid },
      { label: "張峻源\n(神經科, 14人)", color: C.doctor.solid },
      { label: "林佳賢\n(消化內科, 12人)", color: C.doctor.solid },
    ],
    links: [
      // 轉入方式 → 五大科
      { source: 1, target: 3, value: 164, color: C.emergency.link },
      { source: 0, target: 4, value: 152, color: C.internal.link },
      { source: 2, target: 4, value: 7, color: C.internal.link },
      { source: 0, target: 5, value: 168, color: C.surgery.link },
      { source: 0, target: 6, value: 18, color: C.obgyn.link },
      { source: 0, target: 7, value: 9, color: C.pediatric.link },
      // 內科 → 細項
      { source: 4, target: 8, value: 40, color: C.internal.link },
      { source: 4, target: 9, value: 28, color: C.internal.link },
      { source: 4, target: 10, value: 20, color: C.internal.link },
      { source: 4, target: 11, value: 15, color: C.internal.link },
      { source: 4, target: 12, value: 25, color: C.internal.link },
      { source: 4, target: 13, value: 12, color: C.internal.link },
      { source: 4, target: 14, value: 10, color: C.internal.link },
      { source: 4, target: 15, value: 9, color: C.internal.link },
      // 外科 → 細項
      { source: 5, target: 16, value: 55, color: C.surgery.link },
      { source: 5, target: 17, value: 45, color: C.surgery.link },
      { source: 5, target: 18, value: 28, color: C.surgery.link },
      { source: 5, target: 19, value: 12, color: C.surgery.link },
      { source: 5, target: 20, value: 10, color: C.surgery.link },
      { source: 5, target: 21, value: 8, color: C.surgery.link },
      { source: 5, target: 22, value: 6, color: C.surgery.link },
      { source: 5, target: 23, value: 4, color: C.surgery.link },
      // 細項 → 前五名醫師
      { source: 16, target: 24, value: 21, color: C.doctor.link },
      { source: 17, target: 25, value: 16, color: C.doctor.link },
      { source: 8, target: 26, value: 14, color: C.doctor.link },
      { source: 12, target: 27, value: 14, color: C.doctor.link },
      { source: 8, target: 28, value: 12, color: C.doctor.link },
    ],
  },
];

// ========== 轉出分析 ==========

export interface MonthlyTransferOutData {
  month: string;
  total: number;
  nodes: SankeyNode[];
  links: SankeyLink[];
  topClinicDoctors: { name: string; dept: string; count: number }[];
  summary: {
    medCenter: number;
    regional: number;
    clinic: number;
  };
}

export const transferOutData: MonthlyTransferOutData[] = [
  {
    month: "1月",
    total: 129,
    summary: { medCenter: 88, regional: 26, clinic: 15 },
    topClinicDoctors: [
      { name: "何樹仁", dept: "消化內科", count: 7 },
      { name: "林佳賢", dept: "消化內科", count: 4 },
      { name: "黃柏堅", dept: "泌尿科", count: 2 },
      { name: "劉彥廷", dept: "心臟血管內", count: 1 },
      { name: "蕭輝哲", dept: "消化內科", count: 1 },
    ],
    nodes: [
      { label: "轉出-急診\n(51人)", color: C.methodEmergency },
      { label: "轉出-門診\n(61人)", color: C.methodClinic },
      { label: "轉出-住院\n(17人)", color: C.methodInpatient },
      { label: "醫學中心\n(88人, 68.2%)", color: C.medCenter.solid },
      { label: "區域/地區醫院\n(26人, 20.2%)", color: C.regional.solid },
      { label: "基層診所\n(15人, 11.6%)", color: C.clinic.solid },
      { label: "何樹仁\n(消化內科, 7人)", color: C.doctor.solid },
      { label: "林佳賢\n(消化內科, 4人)", color: C.doctor.solid },
      { label: "黃柏堅\n(泌尿科, 2人)", color: C.doctor.solid },
      { label: "劉彥廷\n(心臟血管內, 1人)", color: C.doctor.solid },
      { label: "蕭輝哲\n(消化內科, 1人)", color: C.doctor.solid },
    ],
    links: [
      { source: 0, target: 3, value: 42, color: C.medCenter.link },
      { source: 0, target: 4, value: 9, color: C.regional.link },
      { source: 1, target: 3, value: 35, color: C.medCenter.link },
      { source: 1, target: 4, value: 11, color: C.regional.link },
      { source: 1, target: 5, value: 15, color: C.clinic.link },
      { source: 2, target: 3, value: 11, color: C.medCenter.link },
      { source: 2, target: 4, value: 6, color: C.regional.link },
      { source: 5, target: 6, value: 7, color: C.doctor.link },
      { source: 5, target: 7, value: 4, color: C.doctor.link },
      { source: 5, target: 8, value: 2, color: C.doctor.link },
      { source: 5, target: 9, value: 1, color: C.doctor.link },
      { source: 5, target: 10, value: 1, color: C.doctor.link },
    ],
  },
  {
    month: "2月",
    total: 112,
    summary: { medCenter: 78, regional: 18, clinic: 16 },
    topClinicDoctors: [
      { name: "林佳賢", dept: "消化內科", count: 6 },
      { name: "何樹仁", dept: "消化內科", count: 5 },
      { name: "劉彥廷", dept: "心臟血管內", count: 1 },
      { name: "黃柏堅", dept: "泌尿科", count: 1 },
      { name: "劉承昆", dept: "消化內科", count: 1 },
    ],
    nodes: [
      { label: "轉出-急診\n(53人)", color: C.methodEmergency },
      { label: "轉出-門診\n(45人)", color: C.methodClinic },
      { label: "轉出-住院\n(14人)", color: C.methodInpatient },
      { label: "醫學中心\n(78人, 69.6%)", color: C.medCenter.solid },
      { label: "區域/地區醫院\n(18人, 16.1%)", color: C.regional.solid },
      { label: "基層診所\n(16人, 14.3%)", color: C.clinic.solid },
      { label: "林佳賢\n(消化內科, 6人)", color: C.doctor.solid },
      { label: "何樹仁\n(消化內科, 5人)", color: C.doctor.solid },
      { label: "劉彥廷\n(心臟血管內, 1人)", color: C.doctor.solid },
      { label: "黃柏堅\n(泌尿科, 1人)", color: C.doctor.solid },
      { label: "劉承昆\n(消化內科, 1人)", color: C.doctor.solid },
    ],
    links: [
      { source: 0, target: 3, value: 45, color: C.medCenter.link },
      { source: 0, target: 4, value: 8, color: C.regional.link },
      { source: 1, target: 3, value: 22, color: C.medCenter.link },
      { source: 1, target: 4, value: 7, color: C.regional.link },
      { source: 1, target: 5, value: 16, color: C.clinic.link },
      { source: 2, target: 3, value: 11, color: C.medCenter.link },
      { source: 2, target: 4, value: 3, color: C.regional.link },
      { source: 5, target: 6, value: 6, color: C.doctor.link },
      { source: 5, target: 7, value: 5, color: C.doctor.link },
      { source: 5, target: 8, value: 1, color: C.doctor.link },
      { source: 5, target: 9, value: 1, color: C.doctor.link },
      { source: 5, target: 10, value: 1, color: C.doctor.link },
    ],
  },
  {
    month: "3月",
    total: 101,
    summary: { medCenter: 81, regional: 17, clinic: 3 },
    topClinicDoctors: [
      { name: "林佳賢", dept: "消化內科", count: 1 },
      { name: "劉承昆", dept: "消化內科", count: 1 },
      { name: "劉彥廷", dept: "心臟血管內", count: 1 },
    ],
    nodes: [
      { label: "轉出-急診\n(48人)", color: C.methodEmergency },
      { label: "轉出-門診\n(43人)", color: C.methodClinic },
      { label: "轉出-住院\n(10人)", color: C.methodInpatient },
      { label: "醫學中心\n(81人, 80.2%)", color: C.medCenter.solid },
      { label: "區域/地區醫院\n(17人, 16.8%)", color: C.regional.solid },
      { label: "基層診所\n(3人, 3.0%)", color: C.clinic.solid },
      { label: "林佳賢\n(消化內科, 1人)", color: C.doctor.solid },
      { label: "劉承昆\n(消化內科, 1人)", color: C.doctor.solid },
      { label: "劉彥廷\n(心臟血管內, 1人)", color: C.doctor.solid },
    ],
    links: [
      { source: 0, target: 3, value: 40, color: C.medCenter.link },
      { source: 0, target: 4, value: 8, color: C.regional.link },
      { source: 1, target: 3, value: 30, color: C.medCenter.link },
      { source: 1, target: 4, value: 10, color: C.regional.link },
      { source: 1, target: 5, value: 3, color: C.clinic.link },
      { source: 2, target: 3, value: 11, color: C.medCenter.link },
      { source: 5, target: 6, value: 1, color: C.doctor.link },
      { source: 5, target: 7, value: 1, color: C.doctor.link },
      { source: 5, target: 8, value: 1, color: C.doctor.link },
    ],
  },
];
