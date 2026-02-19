'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  // MUST call hooks at the top level, before any returns
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder during SSR/initial mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="framer-1te8jbc-container" style={{ opacity: 1 }}>
        <div
          className="framer-96WSQ framer-o51aiz framer-v-o51aiz"
          style={{ 
            height: '100%', 
            width: '100%', 
            opacity: 1,
            background: 'transparent',
            border: 'none',
            padding: 0
          }}
        >
          <div className="framer-16f30ka-container" style={{ opacity: 1 }}>
            <div
              className="framer-IEW64 framer-1kf91e0 framer-v-1kf91e0"
              style={{ height: '100%', width: '100%', opacity: 1 }}
            >
              <div className="framer-15pp94k-container" style={{ opacity: 1 }}>
                <div style={{ display: 'contents' }}>
                  {/* Placeholder sun icon during SSR (default light mode) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    focusable="false"
                    color="var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)"
                    style={{
                      userSelect: 'none',
                      width: '100%',
                      height: '100%',
                      display: 'inline-block',
                      fill: 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)',
                      color: 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)',
                      flexShrink: 0
                    }}
                  >
                    <g color="var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)" data-weight="bold">
                      <path d="M116,32V16a12,12,0,0,1,24,0V32a12,12,0,0,1-24,0Zm80,96a68,68,0,1,1-68-68A68.07,68.07,0,0,1,196,128Zm-24,0a44,44,0,1,0-44,44A44.05,44.05,0,0,0,172,128ZM51.51,68.49a12,12,0,1,0,17-17l-12-12a12,12,0,0,0-17,17Zm0,119-12,12a12,12,0,0,0,17,17l12-12a12,12,0,1,0-17-17ZM128,204a12,12,0,0,0-12,12v16a12,12,0,0,0,24,0V216A12,12,0,0,0,128,204Zm80-128a12,12,0,0,0,8.49-3.51l12-12a12,12,0,0,0-17-17l-12,12A12,12,0,0,0,208,76Zm3.51,112a12,12,0,1,0-17,17l12,12a12,12,0,0,0,17-17ZM44,128a12,12,0,0,0-12-12H16a12,12,0,0,0,0,24H32A12,12,0,0,0,44,128Zm196,0a12,12,0,0,1-12,12H212a12,12,0,0,1,0-24h16A12,12,0,0,1,240,128Z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="framer-1te8jbc-container" style={{ opacity: 1 }}>
      <button
        onClick={toggleTheme}
        className="framer-96WSQ framer-o51aiz framer-v-o51aiz"
        data-framer-name="Theme Toggle"
        data-highlight="true"
        tabIndex={0}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ 
          height: '100%', 
          width: '100%', 
          opacity: 1,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}
      >
        <div className="framer-16f30ka-container" style={{ opacity: 1 }}>
          <div
            className="framer-IEW64 framer-1kf91e0 framer-v-1kf91e0"
            data-framer-name={theme === 'dark' ? 'Dark' : 'Light'}
            style={{ height: '100%', width: '100%', opacity: 1 }}
          >
            <div className="framer-15pp94k-container" style={{ opacity: 1 }}>
              <div style={{ display: 'contents' }}>
                {theme === 'light' ? (
                  // Sun icon for light mode (shows current state)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    focusable="false"
                    color="var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)"
                    style={{
                      userSelect: 'none',
                      width: '100%',
                      height: '100%',
                      display: 'inline-block',
                      fill: 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)',
                      color: 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)',
                      flexShrink: 0,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <g color="var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)" data-weight="bold">
                      <path d="M116,32V16a12,12,0,0,1,24,0V32a12,12,0,0,1-24,0Zm80,96a68,68,0,1,1-68-68A68.07,68.07,0,0,1,196,128Zm-24,0a44,44,0,1,0-44,44A44.05,44.05,0,0,0,172,128ZM51.51,68.49a12,12,0,1,0,17-17l-12-12a12,12,0,0,0-17,17Zm0,119-12,12a12,12,0,0,0,17,17l12-12a12,12,0,1,0-17-17ZM128,204a12,12,0,0,0-12,12v16a12,12,0,0,0,24,0V216A12,12,0,0,0,128,204Zm80-128a12,12,0,0,0,8.49-3.51l12-12a12,12,0,0,0-17-17l-12,12A12,12,0,0,0,208,76Zm3.51,112a12,12,0,1,0-17,17l12,12a12,12,0,0,0,17-17ZM44,128a12,12,0,0,0-12-12H16a12,12,0,0,0,0,24H32A12,12,0,0,0,44,128Zm196,0a12,12,0,0,1-12,12H212a12,12,0,0,1,0-24h16A12,12,0,0,1,240,128Z"></path>
                    </g>
                  </svg>
                ) : (
                  // Moon icon for dark mode (shows current state)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    focusable="false"
                    color="var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)"
                    style={{
                      userSelect: 'none',
                      width: '100%',
                      height: '100%',
                      display: 'inline-block',
                      fill: 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)',
                      color: 'var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)',
                      flexShrink: 0,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <g color="var(--token-4769c37a-e483-4cd7-ac6b-55da2c10d7ad)" data-weight="bold">
                      <path d="M236.37,139.4a12,12,0,0,0-12-3A84.07,84.07,0,0,1,119.6,31.59a12,12,0,0,0-15-15A108.86,108.86,0,0,0,49.69,55.07,108,108,0,0,0,136,228a107.09,107.09,0,0,0,64.93-21.69,108.86,108.86,0,0,0,38.44-54.94A12,12,0,0,0,236.37,139.4Zm-49.88,47.74A84,84,0,0,1,68.86,69.51,84.93,84.93,0,0,1,92.27,48.29Q92,52.13,92,56A108.12,108.12,0,0,0,200,164q3.87,0,7.71-.27A84.79,84.79,0,0,1,186.49,187.14Z"></path>
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
