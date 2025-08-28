"use client";

import React from "react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-current text-current">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-mono">{message}</p>
      </div>
    </div>
  );
};
