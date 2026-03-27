"use client";

import AppModal from "@/components/AppModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  expenseName,
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Expense"
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
          >
            Delete
          </button>
        </>
      }
    >
      <p className="text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-900">
          &ldquo;{expenseName}&rdquo;
        </span>
        ? This cannot be undone.
      </p>
    </AppModal>
  );
}
