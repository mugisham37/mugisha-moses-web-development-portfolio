"use client";

import { useState, useCallback, useRef } from "react";
import {
  compressImage,
  extractImageMetadata,
  ImageMetadata,
} from "@/lib/image-optimization";

interface UseImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: "webp" | "jpeg" | "png" | "auto";
  enableCompression?: boolean;
}

interface OptimizedFile {
  original: File;
  compressed?: File;
  metadata: ImageMetadata;
  compressionRatio: number;
  error?: string;
}

export function useImageOptimization(
  options: UseImageOptimizationOptions = {}
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<OptimizedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    format = "webp",
    enableCompression = true,
  } = options;

  const processFiles = useCallback(
    async (files: File[]): Promise<OptimizedFile[]> => {
      if (files.length === 0) return [];

      setIsProcessing(true);
      setProgress(0);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const results: OptimizedFile[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Check if operation was aborted
          if (abortControllerRef.current?.signal.aborted) {
            break;
          }

          try {
            // Extract metadata
            const metadata = await extractImageMetadata(file);

            const optimizedFile: OptimizedFile = {
              original: file,
              metadata,
              compressionRatio: 0,
            };

            // Compress if enabled and it's an image
            if (enableCompression && file.type.startsWith("image/")) {
              const compressionOptions = {
                quality,
                maxWidth,
                maxHeight,
                format:
                  format === "auto"
                    ? undefined
                    : (format as "webp" | "jpeg" | "png"),
              };

              const compressed = await compressImage(file, compressionOptions);

              optimizedFile.compressed = compressed;
              optimizedFile.compressionRatio = Math.round(
                ((file.size - compressed.size) / file.size) * 100
              );
            }

            results.push(optimizedFile);
          } catch (error) {
            // Add file with error
            results.push({
              original: file,
              metadata: {
                width: 0,
                height: 0,
                format: file.type.split("/")[1] || "unknown",
                size: file.size,
                aspectRatio: 0,
                hasAlpha: false,
              },
              compressionRatio: 0,
              error:
                error instanceof Error ? error.message : "Processing failed",
            });
          }

          // Update progress
          setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        setProcessedFiles(results);
        return results;
      } catch (error) {
        console.error("File processing error:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(0);
        abortControllerRef.current = null;
      }
    },
    [quality, maxWidth, maxHeight, format, enableCompression]
  );

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearProcessedFiles = useCallback(() => {
    setProcessedFiles([]);
    setProgress(0);
  }, []);

  const getOptimizedFile = useCallback(
    (index: number): File | null => {
      const processed = processedFiles[index];
      if (!processed) return null;

      return processed.compressed || processed.original;
    },
    [processedFiles]
  );

  const getTotalSavings = useCallback(() => {
    return processedFiles.reduce((total, file) => {
      if (file.compressed) {
        return total + (file.original.size - file.compressed.size);
      }
      return total;
    }, 0);
  }, [processedFiles]);

  const getAverageCompressionRatio = useCallback(() => {
    const filesWithCompression = processedFiles.filter((f) => f.compressed);
    if (filesWithCompression.length === 0) return 0;

    const totalRatio = filesWithCompression.reduce(
      (sum, file) => sum + file.compressionRatio,
      0
    );

    return Math.round(totalRatio / filesWithCompression.length);
  }, [processedFiles]);

  return {
    // State
    isProcessing,
    progress,
    processedFiles,

    // Actions
    processFiles,
    cancelProcessing,
    clearProcessedFiles,

    // Utilities
    getOptimizedFile,
    getTotalSavings,
    getAverageCompressionRatio,
  };
}
