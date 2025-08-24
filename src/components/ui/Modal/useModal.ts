"use client";

import { useState, useCallback, useRef } from "react";

export interface UseModalOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

/**
 * useModal - A hook for managing modal state
 *
 * Features:
 * - Simple modal state management
 * - Open, close, and toggle functions
 * - Optional callbacks for open/close events
 * - Pre-configured modal props
 */
export const useModal = (options: UseModalOptions = {}): UseModalReturn => {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const modalProps = {
    isOpen,
    onClose: close,
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    modalProps,
  };
};

/**
 * useConfirmModal - A hook for managing confirmation modals
 */
export interface UseConfirmModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export interface UseConfirmModalReturn {
  isOpen: boolean;
  confirm: (options?: UseConfirmModalOptions) => Promise<boolean>;
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isDestructive: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };
}

export const useConfirmModal = (): UseConfirmModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmModalOptions>({});
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((confirmOptions: UseConfirmModalOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setOptions({
        title: "Confirm Action",
        message: "Are you sure you want to continue?",
        confirmText: "Confirm",
        cancelText: "Cancel",
        isDestructive: false,
        ...confirmOptions,
      });
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const modalProps = {
    isOpen,
    onClose: handleCancel,
    title: options.title || "Confirm Action",
    message: options.message || "Are you sure you want to continue?",
    confirmText: options.confirmText || "Confirm",
    cancelText: options.cancelText || "Cancel",
    isDestructive: options.isDestructive || false,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  return {
    isOpen,
    confirm,
    modalProps,
  };
};

/**
 * useAlertModal - A hook for managing alert modals
 */
export interface UseAlertModalOptions {
  title?: string;
  message?: string;
  buttonText?: string;
  variant?: "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
}

export interface UseAlertModalReturn {
  isOpen: boolean;
  alert: (options: UseAlertModalOptions) => Promise<void>;
  modalProps: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText: string;
    variant: "info" | "success" | "warning" | "error";
    icon?: React.ReactNode;
  };
}

export const useAlertModal = (): UseAlertModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseAlertModalOptions>({});
  const resolveRef = useRef<(() => void) | null>(null);

  const alert = useCallback((alertOptions: UseAlertModalOptions) => {
    return new Promise<void>((resolve) => {
      setOptions({
        title: "Alert",
        message: "Something happened.",
        buttonText: "OK",
        variant: "info",
        ...alertOptions,
      });
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.();
    resolveRef.current = null;
  }, []);

  const modalProps = {
    isOpen,
    onClose: handleClose,
    title: options.title || "Alert",
    message: options.message || "Something happened.",
    buttonText: options.buttonText || "OK",
    variant: (options.variant || "info") as
      | "info"
      | "success"
      | "warning"
      | "error",
    icon: options.icon,
  };

  return {
    isOpen,
    alert,
    modalProps,
  };
};
