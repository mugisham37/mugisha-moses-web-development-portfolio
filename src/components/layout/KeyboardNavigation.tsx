"use client";

import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";

interface KeyboardNavigationProps {
  sections?: Array<{
    id: string;
    label: string;
  }>;
  enableShortcuts?: boolean;
}

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  sections = [
    { id: "hero", label: "Home" },
    { id: "social-proof", label: "Social Proof" },
    { id: "results", label: "Results" },
    { id: "footer", label: "Contact" },
  ],
  enableShortcuts = true,
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { currentTheme } = useTheme();

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string, offset = 80) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsNavigating(true);

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Reset navigation state after scroll completes
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }
  }, []);

  // Navigate to next section
  const navigateNext = useCallback(() => {
    if (isNavigating) return;

    const nextIndex = (currentSectionIndex + 1) % sections.length;
    setCurrentSectionIndex(nextIndex);
    scrollToSection(sections[nextIndex].id);
  }, [currentSectionIndex, sections, scrollToSection, isNavigating]);

  // Navigate to previous section
  const navigatePrevious = useCallback(() => {
    if (isNavigating) return;

    const prevIndex =
      currentSectionIndex === 0 ? sections.length - 1 : currentSectionIndex - 1;
    setCurrentSectionIndex(prevIndex);
    scrollToSection(sections[prevIndex].id);
  }, [currentSectionIndex, sections, scrollToSection, isNavigating]);

  // Navigate to specific section by index
  const navigateToSection = useCallback(
    (index: number) => {
      if (isNavigating || index < 0 || index >= sections.length) return;

      setCurrentSectionIndex(index);
      scrollToSection(sections[index].id);
    },
    [sections, scrollToSection, isNavigating]
  );

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentSectionIndex(0);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
    setCurrentSectionIndex(sections.length - 1);
  }, [sections.length]);

  // Toggle shortcuts help
  const toggleShortcutsHelp = useCallback(() => {
    setShowShortcutsHelp((prev) => !prev);
  }, []);

  // Define keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = useMemo(
    () => [
      {
        key: "ArrowDown",
        action: navigateNext,
        description: "Navigate to next section",
      },
      {
        key: "ArrowUp",
        action: navigatePrevious,
        description: "Navigate to previous section",
      },
      {
        key: "j",
        action: navigateNext,
        description: "Navigate to next section (Vim-style)",
      },
      {
        key: "k",
        action: navigatePrevious,
        description: "Navigate to previous section (Vim-style)",
      },
      {
        key: "Home",
        action: scrollToTop,
        description: "Scroll to top",
      },
      {
        key: "End",
        action: scrollToBottom,
        description: "Scroll to bottom",
      },
      {
        key: "1",
        action: () => navigateToSection(0),
        description: "Go to Home section",
      },
      {
        key: "2",
        action: () => navigateToSection(1),
        description: "Go to Social Proof section",
      },
      {
        key: "3",
        action: () => navigateToSection(2),
        description: "Go to Results section",
      },
      {
        key: "4",
        action: () => navigateToSection(3),
        description: "Go to Contact section",
      },
      {
        key: "?",
        shiftKey: true,
        action: toggleShortcutsHelp,
        description: "Toggle keyboard shortcuts help",
      },
      {
        key: "Escape",
        action: () => setShowShortcutsHelp(false),
        description: "Close shortcuts help",
      },
    ],
    [
      navigateNext,
      navigatePrevious,
      scrollToTop,
      scrollToBottom,
      navigateToSection,
      toggleShortcutsHelp,
    ]
  );

  // Handle keyboard events
  useEffect(() => {
    if (!enableShortcuts) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with form inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === "true"
      ) {
        return;
      }

      const shortcut = shortcuts.find(
        (s) =>
          s.key === event.key &&
          !!s.ctrlKey === event.ctrlKey &&
          !!s.altKey === event.altKey &&
          !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcuts, shortcuts]);

  // Track current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isNavigating) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentSectionIndex(i);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, isNavigating]);

  if (!enableShortcuts) return null;

  return (
    <>
      {/* Keyboard shortcuts help overlay */}
      {showShortcutsHelp && (
        <div
          className={`keyboard-shortcuts-overlay keyboard-shortcuts-overlay--${currentTheme}`}
          role="dialog"
          aria-labelledby="shortcuts-title"
          aria-modal="true"
        >
          <div className="keyboard-shortcuts-modal">
            <div className="keyboard-shortcuts-header">
              <h2 id="shortcuts-title" className="keyboard-shortcuts-title">
                KEYBOARD SHORTCUTS
              </h2>
              <button
                className="keyboard-shortcuts-close"
                onClick={() => setShowShortcutsHelp(false)}
                aria-label="Close shortcuts help"
              >
                ×
              </button>
            </div>

            <div className="keyboard-shortcuts-content">
              <div className="keyboard-shortcuts-section">
                <h3 className="keyboard-shortcuts-section-title">Navigation</h3>
                <div className="keyboard-shortcuts-list">
                  {shortcuts
                    .filter((s) =>
                      [
                        "ArrowDown",
                        "ArrowUp",
                        "j",
                        "k",
                        "Home",
                        "End",
                      ].includes(s.key)
                    )
                    .map((shortcut, index) => (
                      <div key={index} className="keyboard-shortcut-item">
                        <kbd className="keyboard-shortcut-key">
                          {shortcut.shiftKey && "Shift + "}
                          {shortcut.ctrlKey && "Ctrl + "}
                          {shortcut.altKey && "Alt + "}
                          {shortcut.key}
                        </kbd>
                        <span className="keyboard-shortcut-description">
                          {shortcut.description}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="keyboard-shortcuts-section">
                <h3 className="keyboard-shortcuts-section-title">
                  Quick Access
                </h3>
                <div className="keyboard-shortcuts-list">
                  {shortcuts
                    .filter((s) => ["1", "2", "3", "4"].includes(s.key))
                    .map((shortcut, index) => (
                      <div key={index} className="keyboard-shortcut-item">
                        <kbd className="keyboard-shortcut-key">
                          {shortcut.key}
                        </kbd>
                        <span className="keyboard-shortcut-description">
                          {shortcut.description}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="keyboard-shortcuts-section">
                <h3 className="keyboard-shortcuts-section-title">Help</h3>
                <div className="keyboard-shortcuts-list">
                  <div className="keyboard-shortcut-item">
                    <kbd className="keyboard-shortcut-key">Shift + ?</kbd>
                    <span className="keyboard-shortcut-description">
                      Toggle this help
                    </span>
                  </div>
                  <div className="keyboard-shortcut-item">
                    <kbd className="keyboard-shortcut-key">Escape</kbd>
                    <span className="keyboard-shortcut-description">
                      Close help
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="keyboard-shortcuts-footer">
              <p className="keyboard-shortcuts-note">
                Press <kbd>Escape</kbd> to close this help
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current section indicator (screen reader only) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Current section: {sections[currentSectionIndex]?.label}
      </div>

      {/* Skip navigation link */}
      <a
        href="#main-content"
        className={`skip-navigation skip-navigation--${currentTheme}`}
        onFocus={(e) =>
          e.currentTarget.classList.add("skip-navigation--visible")
        }
        onBlur={(e) =>
          e.currentTarget.classList.remove("skip-navigation--visible")
        }
      >
        Skip to main content
      </a>
    </>
  );
};

// Hook for keyboard navigation state
export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return { isKeyboardUser };
};
