"use client";

import { Card, CardBody } from "@nextui-org/react";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "@/types/expense";
import { formatCurrency } from "@/lib/format";

interface Props {
  totalByCategory: Record<string, number>;
  total: number;
}

const COLOR_CLASSES: Record<string, string> = {
  warning: "bg-warning",
  primary: "bg-primary",
  secondary: "bg-secondary",
  danger: "bg-danger",
  success: "bg-success",
  default: "bg-default-400",
};

export default function SpendingChart({ totalByCategory, total }: Props) {
  const entries = Object.entries(totalByCategory)
    .sort(([, a], [, b]) => b - a)
    .filter(([, amount]) => amount > 0);

  if (entries.length === 0) return null;

  return (
    <Card className="border border-default-100 shadow-none" radius="lg">
      <CardBody className="px-5 py-4">
        <p className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-4">
          Spending Breakdown
        </p>
        <div className="flex flex-col gap-3">
          {entries.map(([category, amount]) => {
            const pct = total > 0 ? (amount / total) * 100 : 0;
            const colorKey = CATEGORY_COLORS[category] ?? "default";
            const barClass = COLOR_CLASSES[colorKey] ?? "bg-default-400";
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {CATEGORY_ICONS[category] ?? "📦"}
                    </span>
                    <span className="text-sm font-medium text-default-700">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-default-900">
                      {formatCurrency(amount)}
                    </span>
                    <span className="text-xs text-default-400 w-10 text-right">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-default-100 rounded-full h-2">
                  <div
                    className={`${barClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
