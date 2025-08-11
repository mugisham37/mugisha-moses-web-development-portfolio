"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import { Typography } from "./typography";

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  state?: "loading" | "error" | "empty";
  message?: string;
  className?: string;
  showIcon?: boolean;
  animated?: boolean;
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

export function ImagePlaceholder({
  width,
  height,
  aspectRatio,
  state = "empty",
  message,
  className,
  showIcon = true,
  animated = true,
}: ImagePlaceholderProps) {
  const getIcon = () => {
    switch (state) {
      case "loading":
        return <Loader2 className="h-8 w-8 animate-spin text-gray-400" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-400" />;
      default:
        return <ImageIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getMessage = () => {
    if (message) return message;

    switch (state) {
      case "loading":
        return "LOADING...";
      case "error":
        return "FAILED TO LOAD";
      default:
        return "NO IMAGE";
    }
  };

  const getBackgroundClass = () => {
    switch (state) {
      case "loading":
        return animated ? "bg-gray-900 animate-pulse" : "bg-gray-900";
      case "error":
        return "bg-red-900/20";
      default:
        return "bg-gray-900";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center border border-gray-700",
        aspectRatio && aspectRatioClasses[aspectRatio],
        getBackgroundClass(),
        className
      )}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      <div className="text-center">
        {showIcon && <div className="mb-2">{getIcon()}</div>}
        <Typography variant="caption" className="font-mono text-gray-400">
          {getMessage()}
        </Typography>
      </div>
    </div>
  );
}

// Skeleton component for image loading states
export function ImageSkeleton({
  aspectRatio = "video",
  className,
}: {
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-800",
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
      )}
    />
  );
}
