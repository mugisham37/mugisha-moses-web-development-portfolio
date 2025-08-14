// Accessibility Components and Utilities
export { SkipNavigation } from "./skip-navigation";
export { FocusTrap, useFocusTrapContainer } from "./focus-trap";
export {
  ScreenReaderOnly,
  LiveRegion,
  Status,
  Alert,
} from "./screen-reader-only";
export {
  KeyboardNavigation,
  NavigationItem,
  useCustomKeyboardNavigation,
} from "./keyboard-navigation";
export {
  AccessibilityProvider,
  AccessibilitySettings,
  useAccessibility,
} from "./accessibility-provider";
export {
  AccessibilityToolbar,
  useAccessibilityToolbarShortcut,
} from "./accessibility-toolbar";

// Re-export accessibility utilities
export {
  ScreenReaderUtils,
  FocusManager,
  KeyboardNavigation as KeyboardNavigationUtils,
  ColorContrast,
  AccessibilityTesting,
  useAnnouncement,
  useFocusManagement,
  useFocusTrap,
  useKeyboardNavigation,
} from "@/lib/accessibility";

export {
  runAccessibilityAudit,
  logAccessibilityReport,
  AccessibilityAuditor,
  type AccessibilityIssue,
  type AccessibilityReport,
} from "@/lib/accessibility-testing";
