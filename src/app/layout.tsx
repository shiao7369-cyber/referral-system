import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "轉診追蹤平台 | 全民健保轉診個案管理系統",
  description: "專業的健保轉診個案追蹤與管理平台，協助醫療機構實現雙向轉診閉環管理",
  keywords: "轉診, 健保, 個案管理, 雙向轉診, 醫療資訊",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${notoSansTc.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-slate-50">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
