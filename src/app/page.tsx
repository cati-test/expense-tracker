"use client";

import { useState, useMemo } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useExpenses } from "@/hooks/useExpenses";
import ExpenseModal from "@/components/ExpenseModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ExpenseList from "@/components/ExpenseList";
import SummaryStats from "@/components/SummaryStats";
import CategoryFilter from "@/components/CategoryFilter";
import SpendingChart from "@/components/SpendingChart";
import type { Expense } from "@/types/expense";

function formatMonthLabel(ym: string) {
  const [year, month] = ym.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );
}

function exportToCsv(expenses: Expense[]) {
  const header = "Date,Description,Category,Amount";
  const rows = expenses
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (e) =>
        `${e.date},"${e.description.replace(/"/g, '""')}",${e.category},${e.amount.toFixed(2)}`
    );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const {
    expenses,
    loaded,
    addExpense,
    editExpense,
    deleteExpense,
    totalAmount,
    totalByCategory,
    thisMonthTotal,
    availableMonths,
  } = useExpenses();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const categoryMatch =
        selectedCategory === "All" || e.category === selectedCategory;
      const monthMatch =
        selectedMonth === "All" || e.date.startsWith(selectedMonth);
      return categoryMatch && monthMatch;
    });
  }, [expenses, selectedCategory, selectedMonth]);

  // Category counts (based on month-filtered only, for the filter bar)
  const categoryCounts = useMemo(() => {
    const base =
      selectedMonth === "All"
        ? expenses
        : expenses.filter((e) => e.date.startsWith(selectedMonth));
    return base.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [expenses, selectedMonth]);

  // Stats for the selected month (or all-time if "All")
  const statsExpenses =
    selectedMonth === "All"
      ? expenses
      : expenses.filter((e) => e.date.startsWith(selectedMonth));

  const statsTotal = statsExpenses.reduce((sum, e) => sum + e.amount, 0);
  const statsByCategory = statsExpenses.reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {}
  );

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Expense, "id">) => {
    if (editingExpense) {
      editExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
  };

  const handleDeleteRequest = (expense: Expense) => {
    setDeletingExpense(expense);
  };

  const handleDeleteConfirm = () => {
    if (deletingExpense) {
      deleteExpense(deletingExpense.id);
      setDeletingExpense(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-default-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="text-xl font-bold text-default-900">
              Expense Tracker
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {expenses.length > 0 && (
              <Button
                variant="flat"
                size="sm"
                className="font-medium"
                onPress={() => exportToCsv(filteredExpenses)}
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                }
              >
                Export CSV
              </Button>
            )}
            <Button
              color="primary"
              onPress={handleOpenAdd}
              size="sm"
              className="font-medium"
            >
              + Add Expense
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Summary Stats */}
        {loaded && (
          <SummaryStats
            totalAmount={selectedMonth === "All" ? totalAmount : statsTotal}
            thisMonthTotal={thisMonthTotal}
            totalByCategory={selectedMonth === "All" ? totalByCategory : statsByCategory}
            expenseCount={statsExpenses.length}
          />
        )}

        {/* Spending Chart */}
        {loaded && Object.keys(statsByCategory).length > 0 && (
          <SpendingChart
            totalByCategory={statsByCategory}
            total={statsTotal}
          />
        )}

        {/* Filters */}
        {expenses.length > 0 && (
          <div className="flex flex-col gap-4">
            {/* Month filter */}
            {availableMonths.length > 1 && (
              <div>
                <h2 className="text-sm font-semibold text-default-600 mb-3 uppercase tracking-wide">
                  Filter by Month
                </h2>
                <Select
                  size="sm"
                  variant="bordered"
                  selectedKeys={[selectedMonth]}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setSelectedMonth(val ?? "All");
                    setSelectedCategory("All");
                  }}
                  className="max-w-xs"
                  aria-label="Filter by month"
                >
                  <SelectItem key="All">All time</SelectItem>
                  {availableMonths.map((ym) => (
                    <SelectItem key={ym}>{formatMonthLabel(ym)}</SelectItem>
                  ))}
                </Select>
              </div>
            )}

            {/* Category filter */}
            <div>
              <h2 className="text-sm font-semibold text-default-600 mb-3 uppercase tracking-wide">
                Filter by Category
              </h2>
              <CategoryFilter
                selected={selectedCategory}
                onChange={setSelectedCategory}
                counts={categoryCounts}
              />
            </div>
          </div>
        )}

        {/* Expense List */}
        <div>
          {expenses.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-default-600 uppercase tracking-wide">
                {selectedCategory === "All" ? "All Expenses" : selectedCategory}
                {selectedMonth !== "All" && (
                  <span className="ml-1 font-normal normal-case">
                    — {formatMonthLabel(selectedMonth)}
                  </span>
                )}
              </h2>
              <span className="text-sm text-default-400">
                {filteredExpenses.length}{" "}
                {filteredExpenses.length === 1 ? "item" : "items"}
              </span>
            </div>
          )}
          {loaded && (
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          )}
        </div>
      </main>

      {/* Add / Edit modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingExpense={editingExpense}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
        expenseName={deletingExpense?.description ?? ""}
      />
    </div>
  );
}
