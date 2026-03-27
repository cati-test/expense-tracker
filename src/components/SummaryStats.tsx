"use client";

import { Card, CardBody } from "@nextui-org/react";

interface Props {
  totalAmount: number;
  thisMonthTotal: number;
  totalByCategory: Record<string, number>;
  expenseCount: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function SummaryStats({
  totalAmount,
  thisMonthTotal,
  totalByCategory,
  expenseCount,
}: Props) {
  const topCategory =
    Object.entries(totalByCategory).sort(([, a], [, b]) => b - a)[0]?.[0] ??
    "—";

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalAmount),
      sub: `${expenseCount} expense${expenseCount !== 1 ? "s" : ""}`,
      color: "bg-primary-50 border-primary-200",
      valueColor: "text-primary-600",
    },
    {
      label: "This Month",
      value: formatCurrency(thisMonthTotal),
      sub: new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      color: "bg-success-50 border-success-200",
      valueColor: "text-success-600",
    },
    {
      label: "Top Category",
      value: topCategory,
      sub: topCategory !== "—" ? formatCurrency(totalByCategory[topCategory]) : "No data yet",
      color: "bg-warning-50 border-warning-200",
      valueColor: "text-warning-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={`border ${stat.color} shadow-none`}
          radius="lg"
        >
          <CardBody className="py-4 px-5">
            <p className="text-xs font-medium text-default-500 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.valueColor} truncate`}>
              {stat.value}
            </p>
            <p className="text-xs text-default-400 mt-1">{stat.sub}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
