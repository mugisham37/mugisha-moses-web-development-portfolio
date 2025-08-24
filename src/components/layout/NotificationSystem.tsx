"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  className?: string;
}

// Global notification state
let notificationQueue: Notification[] = [];
let notificationListeners: ((notifications: Notification[]) => void)[] = [];

// Global functions to manage notifications
export const addNotification = (notification: Omit<Notification, "id">) => {
  const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newNotification: Notification = {
    ...notification,
    id,
    duration: notification.duration || 5000,
  };

  notificationQueue = [...notificationQueue, newNotification];
  notificationListeners.forEach((listener) => listener(notificationQueue));

  // Auto-remove after duration
  if (newNotification.duration && newNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
  }
};

export const removeNotification = (id: string) => {
  notificationQueue = notificationQueue.filter((n) => n.id !== id);
  notificationListeners.forEach((listener) => listener(notificationQueue));
};

export const clearAllNotifications = () => {
  notificationQueue = [];
  notificationListeners.forEach((listener) => listener(notificationQueue));
};

// Notification component
const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
  theme: string;
  config: any;
}> = ({ notification, onRemove, theme, config }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case "success":
        return theme === "extreme-brutalist" ? "#00ff00" : "#10b981";
      case "error":
        return theme === "extreme-brutalist" ? "#ff0000" : "#ef4444";
      case "warning":
        return theme === "extreme-brutalist" ? "#ffff00" : "#f59e0b";
      case "info":
      default:
        return theme === "extreme-brutalist" ? "#00ffff" : "#3b82f6";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`notification notification--${theme} notification--${notification.type}`}
      style={
        {
          "--notification-bg": config.colors.secondary,
          "--notification-text": config.colors.primary,
          "--notification-accent": getTypeColor(),
          "--notification-border": `${config.borders.width} ${config.borders.style} ${getTypeColor()}`,
          "--notification-shadow":
            config.shadows.brutal || config.shadows.subtle,
          "--notification-radius": config.borders.radius || "0px",
        } as React.CSSProperties
      }
    >
      <div className="notification__container">
        <div className="notification__icon">{getIcon()}</div>

        <div className="notification__content">
          <h4 className="notification__title">{notification.title}</h4>
          <p className="notification__message">{notification.message}</p>

          {notification.action && (
            <button
              className="notification__action"
              onClick={notification.action.onClick}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          className="notification__close"
          onClick={() => onRemove(notification.id)}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>

      {/* Progress bar for timed notifications */}
      {notification.duration && notification.duration > 0 && (
        <motion.div
          className="notification__progress"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{
            duration: notification.duration / 1000,
            ease: "linear",
          }}
        />
      )}

      {/* Animated border effect */}
      <div className="notification__border-animation"></div>
    </motion.div>
  );
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  className = "",
}) => {
  const { currentTheme, config } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const listener = (newNotifications: Notification[]) => {
      setNotifications(newNotifications);
    };

    notificationListeners.push(listener);

    return () => {
      notificationListeners = notificationListeners.filter(
        (l) => l !== listener
      );
    };
  }, []);

  const handleRemove = useCallback((id: string) => {
    removeNotification(id);
  }, []);

  return (
    <div
      className={`notification-system notification-system--${currentTheme} ${className}`}
      style={{
        position: "fixed",
        top: "2rem",
        right: "2rem",
        zIndex: 10000,
        maxWidth: "400px",
        width: "100%",
      }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={handleRemove}
            theme={currentTheme}
            config={config}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Utility functions for common notification types
export const showSuccessNotification = (
  title: string,
  message: string,
  action?: Notification["action"]
) => {
  addNotification({ type: "success", title, message, action });
};

export const showErrorNotification = (
  title: string,
  message: string,
  action?: Notification["action"]
) => {
  addNotification({ type: "error", title, message, duration: 8000, action });
};

export const showWarningNotification = (
  title: string,
  message: string,
  action?: Notification["action"]
) => {
  addNotification({ type: "warning", title, message, duration: 6000, action });
};

export const showInfoNotification = (
  title: string,
  message: string,
  action?: Notification["action"]
) => {
  addNotification({ type: "info", title, message, action });
};

export default NotificationSystem;
