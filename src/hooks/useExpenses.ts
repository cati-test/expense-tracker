"use client";

import { useState, useEffect } from "react";
import type { Expense } from "@/types/expense";

const STORAGE_KEY = "expense-tracker-data";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses, loaded]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const editExpense = (id: string, updates: Omit<Expense, "id">) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...updates, id } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalByCategory = expenses.reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {}
  );

  const now = new Date();
  const thisMonthExpenses = expenses.filter((e) => {
    const expDate = new Date(e.date + "T00:00:00");
    return (
      expDate.getFullYear() === now.getFullYear() &&
      expDate.getMonth() === now.getMonth()
    );
  });

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // Derive all unique year-month strings from expenses, sorted descending
  const availableMonths = Array.from(
    new Set(expenses.map((e) => e.date.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  return {
    expenses,
    loaded,
    addExpense,
    editExpense,
    deleteExpense,
    totalAmount,
    totalByCategory,
    thisMonthTotal,
    thisMonthExpenses,
    availableMonths,
  };
}
