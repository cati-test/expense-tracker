"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
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

  // Populate fields when editing
  useEffect(() => {
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
  }, [editingExpense, isOpen]);

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
    handleClose();
  };

  const handleClose = () => {
    setDescription("");
    setAmount("");
    setCategory("");
    setDate(todayStr());
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-xl font-semibold">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </span>
        </ModalHeader>
        <ModalBody className="gap-4">
          <Input
            label="Description"
            placeholder="e.g. Lunch at café"
            value={description}
            onValueChange={setDescription}
            isInvalid={!!errors.description}
            errorMessage={errors.description}
            variant="bordered"
          />
          <Input
            label="Amount"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onValueChange={setAmount}
            isInvalid={!!errors.amount}
            errorMessage={errors.amount}
            variant="bordered"
            startContent={
              <span className="text-default-400 text-sm">$</span>
            }
          />
          <Select
            label="Category"
            placeholder="Select a category"
            selectedKeys={category ? [category] : []}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string;
              setCategory(val ?? "");
            }}
            isInvalid={!!errors.category}
            errorMessage={errors.category}
            variant="bordered"
          >
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat}>{cat}</SelectItem>
            ))}
          </Select>
          <Input
            label="Date"
            type="date"
            value={date}
            onValueChange={setDate}
            isInvalid={!!errors.date}
            errorMessage={errors.date}
            variant="bordered"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Expense"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
