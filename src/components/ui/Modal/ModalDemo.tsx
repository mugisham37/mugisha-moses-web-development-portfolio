"use client";

import React, { useState } from "react";
import {
  Modal,
  ConfirmModal,
  AlertModal,
  useModal,
  useConfirmModal,
  useAlertModal,
} from "./index";
import { BrutalButton } from "../BrutalButton/BrutalButton";
import { BrutalCard } from "../BrutalCard/BrutalCard";
import { BrutalInput } from "../BrutalInput/BrutalInput";

/**
 * ModalDemo - Demonstration component for Modal functionality
 *
 * Features:
 * - Basic modal examples
 * - Confirm modal examples
 * - Alert modal examples
 * - Different sizes and variants
 * - Hook usage examples
 */
export const ModalDemo: React.FC = () => {
  const basicModal = useModal();
  const confirmModal = useConfirmModal();
  const alertModal = useAlertModal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = await confirmModal.confirm({
      title: "Submit Form",
      message: "Are you sure you want to submit this form?",
      confirmText: "Submit",
      cancelText: "Cancel",
    });

    if (confirmed) {
      // Simulate form submission
      setTimeout(async () => {
        await alertModal.alert({
          title: "Success!",
          message: "Your form has been submitted successfully.",
          variant: "success",
          buttonText: "Great!",
        });

        // Reset form
        setFormData({ name: "", email: "", message: "" });
        basicModal.close();
      }, 1000);
    }
  };

  const handleDeleteAction = async () => {
    const confirmed = await confirmModal.confirm({
      title: "Delete Item",
      message:
        "This action cannot be undone. Are you sure you want to delete this item?",
      confirmText: "Delete",
      cancelText: "Keep",
      isDestructive: true,
    });

    if (confirmed) {
      await alertModal.alert({
        title: "Deleted",
        message: "The item has been deleted successfully.",
        variant: "success",
      });
    }
  };

  const showInfoAlert = () => {
    alertModal.alert({
      title: "Information",
      message:
        "This is an informational message with some details about the current state.",
      variant: "info",
    });
  };

  const showWarningAlert = () => {
    alertModal.alert({
      title: "Warning",
      message:
        "Please be careful! This action might have unintended consequences.",
      variant: "warning",
    });
  };

  const showErrorAlert = () => {
    alertModal.alert({
      title: "Error",
      message:
        "Something went wrong. Please try again later or contact support.",
      variant: "error",
    });
  };

  return (
    <div className="modal-demo">
      <div className="container">
        <h2 className="modal-demo__title">Modal Component Demo</h2>

        <div className="modal-demo__grid">
          {/* Basic Modal Examples */}
          <BrutalCard variant="default" padding="lg">
            <h3>Basic Modals</h3>
            <div className="modal-demo__buttons">
              <BrutalButton variant="primary" onClick={basicModal.open}>
                Open Form Modal
              </BrutalButton>
            </div>
          </BrutalCard>

          {/* Confirm Modal Examples */}
          <BrutalCard variant="default" padding="lg">
            <h3>Confirm Modals</h3>
            <div className="modal-demo__buttons">
              <BrutalButton variant="secondary" onClick={handleDeleteAction}>
                Delete Item
              </BrutalButton>
            </div>
          </BrutalCard>

          {/* Alert Modal Examples */}
          <BrutalCard variant="default" padding="lg">
            <h3>Alert Modals</h3>
            <div className="modal-demo__buttons">
              <BrutalButton variant="ghost" size="sm" onClick={showInfoAlert}>
                Info Alert
              </BrutalButton>
              <BrutalButton
                variant="ghost"
                size="sm"
                onClick={showWarningAlert}
              >
                Warning Alert
              </BrutalButton>
              <BrutalButton variant="ghost" size="sm" onClick={showErrorAlert}>
                Error Alert
              </BrutalButton>
            </div>
          </BrutalCard>
        </div>

        {/* Basic Modal */}
        <Modal
          {...basicModal.modalProps}
          title="Contact Form"
          description="Fill out the form below to get in touch with us."
          size="md"
          variant="default"
        >
          <form onSubmit={handleFormSubmit} className="modal-demo__form">
            <div className="modal-demo__form-group">
              <label htmlFor="name">Name</label>
              <BrutalInput
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="modal-demo__form-group">
              <label htmlFor="email">Email</label>
              <BrutalInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="modal-demo__form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Enter your message"
                rows={4}
                className="brutal-input"
                required
              />
            </div>

            <div className="modal-demo__form-actions">
              <BrutalButton
                type="button"
                variant="secondary"
                onClick={basicModal.close}
              >
                Cancel
              </BrutalButton>
              <BrutalButton type="submit" variant="primary">
                Submit
              </BrutalButton>
            </div>
          </form>
        </Modal>

        {/* Confirm Modal */}
        <ConfirmModal {...confirmModal.modalProps} />

        {/* Alert Modal */}
        <AlertModal {...alertModal.modalProps} />
      </div>
    </div>
  );
};
