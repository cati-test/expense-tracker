"use client";

import { Button, Chip } from "@nextui-org/react";
import type { Expense } from "@/types/expense";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/expense";
import { formatCurrency, formatDate } from "@/lib/format";

interface Props {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">💸</div>
        <p className="text-lg font-medium text-default-500">No expenses yet</p>
        <p className="text-sm text-default-400 mt-1">
          Click &ldquo;Add Expense&rdquo; to get started
        </p>
      </div>
    );
  }

  // Group expenses by date
  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, e) => {
    acc[e.date] = acc[e.date] ? [...acc[e.date], e] : [e];
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-default-500">
              {formatDate(date)}
            </h3>
            <span className="text-sm text-default-400">
              {formatCurrency(
                grouped[date].reduce((sum, e) => sum + e.amount, 0)
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {grouped[date].map((expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 shadow-sm border border-default-100 hover:border-default-200 transition-colors"
              >
                <div className="text-2xl w-10 h-10 flex items-center justify-center bg-default-50 rounded-lg flex-shrink-0">
                  {CATEGORY_ICONS[expense.category] ?? "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-default-900 truncate">
                    {expense.description}
                  </p>
                  <Chip
                    size="sm"
                    color={CATEGORY_COLORS[expense.category] ?? "default"}
                    variant="flat"
                    className="mt-1"
                  >
                    {expense.category}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-lg font-semibold text-default-900">
                    {formatCurrency(expense.amount)}
                  </span>
                  {/* Edit button */}
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="default"
                    aria-label="Edit expense"
                    onPress={() => onEdit(expense)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                  </Button>
                  {/* Delete button */}
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    aria-label="Delete expense"
                    onPress={() => onDelete(expense)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
