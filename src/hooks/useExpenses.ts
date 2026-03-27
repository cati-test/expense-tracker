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

  const thisMonthExpenses = expenses.filter((e) => {
    const now = new Date();
    const expDate = new Date(e.date);
    return (
      expDate.getFullYear() === now.getFullYear() &&
      expDate.getMonth() === now.getMonth()
    );
  });

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return {
    expenses,
    loaded,
    addExpense,
    deleteExpense,
    totalAmount,
    totalByCategory,
    thisMonthTotal,
    thisMonthExpenses,
  };
}
