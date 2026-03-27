"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { useExpenses } from "@/hooks/useExpenses";
import AddExpenseModal from "@/components/AddExpenseModal";
import ExpenseList from "@/components/ExpenseList";
import SummaryStats from "@/components/SummaryStats";
import CategoryFilter from "@/components/CategoryFilter";

export default function Home() {
  const {
    expenses,
    loaded,
    addExpense,
    deleteExpense,
    totalAmount,
    totalByCategory,
    thisMonthTotal,
  } = useExpenses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  const categoryCounts = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});

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
          <Button
            color="primary"
            onPress={() => setIsModalOpen(true)}
            size="sm"
            className="font-medium"
          >
            + Add Expense
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Summary Stats */}
        {loaded && (
          <SummaryStats
            totalAmount={totalAmount}
            thisMonthTotal={thisMonthTotal}
            totalByCategory={totalByCategory}
            expenseCount={expenses.length}
          />
        )}

        {/* Category Filter */}
        {expenses.length > 0 && (
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
        )}

        {/* Expense List */}
        <div>
          {expenses.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-default-600 uppercase tracking-wide">
                {selectedCategory === "All" ? "All Expenses" : selectedCategory}
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
              onDelete={deleteExpense}
            />
          )}
        </div>
      </main>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addExpense}
      />
    </div>
  );
}
