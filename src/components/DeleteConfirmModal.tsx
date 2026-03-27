"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Delete Expense</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-default-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-default-900">
              &ldquo;{expenseName}&rdquo;
            </span>
            ? This cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" onPress={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
