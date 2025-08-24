"use client";

import React from "react";
import { Modal, ModalProps } from "./Modal";
import { BrutalButton } from "../BrutalButton/BrutalButton";

export interface AlertModalProps extends Omit<ModalProps, "children"> {
  title: string;
  message: string;
  buttonText?: string;
  variant?: "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
}

/**
 * AlertModal - A specialized modal for alert/notification dialogs
 *
 * Features:
 * - Pre-built alert dialog layout
 * - Different variants for different message types
 * - Optional custom icons
 * - Single action button
 * - Theme-aware styling
 */
export const AlertModal: React.FC<AlertModalProps> = ({
  title,
  message,
  buttonText = "OK",
  variant = "info",
  icon,
  onClose,
  ...modalProps
}) => {
  const getVariantIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✕";
      case "info":
      default:
        return "ℹ";
    }
  };

  const getVariantClass = () => {
    return `alert-modal--${variant}`;
  };

  return (
    <Modal
      {...modalProps}
      title={title}
      onClose={onClose}
      size="sm"
      role="alertdialog"
      className={`alert-modal ${getVariantClass()}`}
    >
      <div className="alert-modal__content">
        <div className="alert-modal__icon-container">
          <span className={`alert-modal__icon alert-modal__icon--${variant}`}>
            {getVariantIcon()}
          </span>
        </div>

        <div className="alert-modal__message">
          <p>{message}</p>
        </div>

        <div className="alert-modal__actions">
          <BrutalButton
            variant="primary"
            onClick={onClose}
            fullWidth
            className="alert-modal__button"
          >
            {buttonText}
          </BrutalButton>
        </div>
      </div>
    </Modal>
  );
};
