import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "teal";
  className?: string;
}

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-500 text-white",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "bg-green-500 text-white",
    text: "text-green-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "bg-yellow-500 text-white",
    text: "text-yellow-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-500 text-white",
    text: "text-red-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-500 text-white",
    text: "text-purple-600",
  },
  teal: {
    bg: "bg-teal-50",
    icon: "bg-teal-500 text-white",
    text: "text-teal-600",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  className,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive !== false ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.positive !== false ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            colors.icon
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
