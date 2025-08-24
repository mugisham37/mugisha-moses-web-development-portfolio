"use client";

import React from "react";
import { Modal, ModalProps } from "./Modal";
import { BrutalButton } from "../BrutalButton/BrutalButton";

export interface ConfirmModalProps extends Omit<ModalProps, "children"> {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "secondary" | "ghost";
  cancelVariant?: "primary" | "secondary" | "ghost";
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
  loading?: boolean;
}

/**
 * ConfirmModal - A specialized modal for confirmation dialogs
 *
 * Features:
 * - Pre-built confirmation dialog layout
 * - Customizable confirm and cancel buttons
 * - Support for destructive actions
 * - Loading states for async operations
 * - Theme-aware styling
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  cancelVariant = "secondary",
  onConfirm,
  onCancel,
  onClose,
  isDestructive = false,
  loading = false,
  ...modalProps
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      {...modalProps}
      title={title}
      onClose={onClose}
      size="sm"
      role="alertdialog"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="confirm-modal">
        <div className="confirm-modal__message">
          <p>{message}</p>
        </div>

        <div className="confirm-modal__actions">
          <BrutalButton
            variant={cancelVariant}
            onClick={handleCancel}
            disabled={loading}
            className="confirm-modal__cancel"
          >
            {cancelText}
          </BrutalButton>

          <BrutalButton
            variant={isDestructive ? "secondary" : confirmVariant}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            className={`confirm-modal__confirm ${
              isDestructive ? "confirm-modal__confirm--destructive" : ""
            }`}
          >
            {confirmText}
          </BrutalButton>
        </div>
      </div>
    </Modal>
  );
};
