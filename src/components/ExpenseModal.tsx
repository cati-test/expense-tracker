"use client";

import { useState, useEffect } from "react";
import AppModal from "@/components/AppModal";
import { CATEGORIES } from "@/types/expense";
import type { Expense } from "@/types/expense";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, "id">) => void;
  editingExpense?: Expense | null;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function ExpenseModal({
  isOpen,
  onClose,
  onSave,
  editingExpense,
}: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(todayStr());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingExpense;

  useEffect(() => {
    if (!isOpen) return;
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(String(editingExpense.amount));
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    } else {
      setDescription("");
      setAmount("");
      setCategory("");
      setDate(todayStr());
    }
    setErrors({});
  }, [isOpen, editingExpense]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = "Description is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid positive amount";
    if (!category) newErrors.category = "Select a category";
    if (!date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      description: description.trim(),
      amount: parseFloat(Number(amount).toFixed(2)),
      category,
      date,
    });
    onClose();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Expense" : "Add Expense"}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            {isEditing ? "Save Changes" : "Add Expense"}
          </button>
        </>
      }
    >
      <Field label="Description" error={errors.description}>
        <input
          className={inputClass}
          placeholder="e.g. Lunch at café"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field label="Amount" error={errors.amount}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <input
            className={`${inputClass} pl-7`}
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </Field>

      <Field label="Category" error={errors.category}>
        <select
          className={inputClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </Field>

      <Field label="Date" error={errors.date}>
        <input
          className={inputClass}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>
    </AppModal>
  );
}
