"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  File,
  Loader2,
  Settings,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "./button";
import { Typography } from "./typography";
import { OptimizedImage } from "./optimized-image";
import { cn } from "@/lib/utils";

interface CompressionSettings {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  format: "webp" | "jpeg" | "png" | "auto";
}

interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  compressed: boolean;
  url?: string;
  compressedFile?: File;
  originalSize: number;
  compressedSize?: number;
  error?: string;
}

interface EnhancedMediaUploaderProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  enableCompression?: boolean;
  compressionSettings?: Partial<CompressionSettings>;
  generateThumbnails?: boolean;
  className?: string;
}

const defaultCompressionSettings: CompressionSettings = {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: "webp",
};

export function EnhancedMediaUploader({
  onUpload,
  maxFiles = 10,
  maxSize = 10,
  accept = "image/*",
  enableCompression = true,
  compressionSettings = {},
  className = "",
}: EnhancedMediaUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CompressionSettings>({
    ...defaultCompressionSettings,
    ...compressionSettings,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compressImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve) => {
        if (!enableCompression || !file.type.startsWith("image/")) {
          resolve(file);
          return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
          resolve(file);
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        const img = new window.Image();
        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          const maxWidth = settings.maxWidth;
          const maxHeight = settings.maxHeight;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Determine output format
          let outputFormat = "image/webp";
          if (settings.format === "jpeg") outputFormat = "image/jpeg";
          else if (settings.format === "png") outputFormat = "image/png";
          else if (settings.format === "auto") {
            outputFormat =
              file.type === "image/png" ? "image/png" : "image/webp";
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(
                    /\.[^/.]+$/,
                    `.${outputFormat.split("/")[1]}`
                  ),
                  { type: outputFormat }
                ) as File;
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            outputFormat,
            settings.quality
          );
        };

        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
      });
    },
    [enableCompression, settings]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles
        .slice(0, maxFiles - files.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          uploaded: false,
          compressed: false,
          originalSize: file.size,
        }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Compress images if enabled
      if (enableCompression) {
        for (let i = 0; i < newFiles.length; i++) {
          const fileIndex = files.length + i;
          try {
            const compressedFile = await compressImage(newFiles[i].file);
            setFiles((prev) =>
              prev.map((f, idx) =>
                idx === fileIndex
                  ? {
                      ...f,
                      compressed: true,
                      compressedFile,
                      compressedSize: compressedFile.size,
                    }
                  : f
              )
            );
          } catch (error) {
            console.error("Compression failed:", error);
          }
        }
      }
    },
    [files.length, maxFiles, compressImage, enableCompression]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(",").reduce(
      (acc, type) => {
        acc[type.trim()] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
    maxSize: maxSize * 1024 * 1024,
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      setFiles((prev) => prev.map((f) => ({ ...f, uploading: true })));

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.uploaded) continue;

        try {
          const formData = new FormData();
          const fileToUpload = file.compressedFile || file.file;
          formData.append("file", fileToUpload);
          formData.append("originalName", file.file.name);
          formData.append("compressed", String(!!file.compressedFile));

          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          uploadedUrls.push(data.url);

          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, uploading: false, uploaded: true, url: data.url }
                : f
            )
          );
        } catch (error) {
          console.error(`Failed to upload file ${file.file.name}:`, error);
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? {
                    ...f,
                    uploading: false,
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : f
            )
          );
        }
      }

      if (uploadedUrls.length > 0) {
        onUpload(uploadedUrls);
      }
    } finally {
      setUploading(false);
    }
  };

  const clearAll = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed?: number) => {
    if (!compressed) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <div className={cn("space-y-6", className)}>
      {/* Hidden canvas for image compression */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Settings Panel */}
      {enableCompression && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-white">
              COMPRESSION SETTINGS
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {showSettings && (
            <div className="space-y-4 border border-white bg-black p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-mono text-sm text-white">
                    QUALITY ({Math.round(settings.quality * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.quality}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        quality: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-sm text-white">
                    FORMAT
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        format: e.target.value as CompressionSettings["format"],
                      }))
                    }
                    className="w-full border border-white bg-gray-900 p-2 font-mono text-sm text-white"
                  >
                    <option value="auto">AUTO</option>
                    <option value="webp">WEBP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-mono text-sm text-white">
                    MAX WIDTH
                  </label>
                  <input
                    type="number"
                    value={settings.maxWidth}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maxWidth: parseInt(e.target.value),
                      }))
                    }
                    className="w-full border border-white bg-gray-900 p-2 font-mono text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-sm text-white">
                    MAX HEIGHT
                  </label>
                  <input
                    type="number"
                    value={settings.maxHeight}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maxHeight: parseInt(e.target.value),
                      }))
                    }
                    className="w-full border border-white bg-gray-900 p-2 font-mono text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-yellow-400 bg-yellow-400/10"
            : "border-white hover:border-yellow-400 hover:bg-yellow-400/5",
          uploading || files.length >= maxFiles
            ? "cursor-not-allowed opacity-50"
            : ""
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />

        {isDragActive ? (
          <Typography variant="h6" className="text-yellow-400">
            DROP FILES HERE...
          </Typography>
        ) : (
          <div className="space-y-2">
            <Typography variant="h6" className="text-white">
              DRAG & DROP FILES OR CLICK TO SELECT
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              MAX {maxFiles} FILES • MAX {maxSize}MB EACH
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              ACCEPTED: {accept.toUpperCase()}
            </Typography>
            {enableCompression && (
              <Typography variant="caption" className="text-accent">
                ⚡ AUTOMATIC COMPRESSION ENABLED
              </Typography>
            )}
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-white">
              FILES ({files.length}/{maxFiles})
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={uploading}
              >
                CLEAR ALL
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={uploading || files.every((f) => f.uploaded)}
                size="sm"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    UPLOADING...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    UPLOAD ALL
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <div key={index} className="border border-white bg-black p-4">
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {isImage(file.file) ? (
                      <OptimizedImage
                        src={file.preview}
                        alt={file.file.name}
                        width={64}
                        height={64}
                        className="object-cover"
                        containerClassName="w-16 h-16 border border-white"
                        showLoader={false}
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center border border-white bg-gray-900">
                        <File className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="min-w-0 flex-1">
                    <Typography
                      variant="caption"
                      className="block truncate text-white"
                    >
                      {file.file.name}
                    </Typography>

                    <div className="mt-1 flex items-center gap-2">
                      <Typography variant="caption" className="text-gray-400">
                        {formatFileSize(file.originalSize)}
                      </Typography>
                      {file.compressedSize && (
                        <>
                          <span className="text-gray-600">→</span>
                          <Typography variant="caption" className="text-accent">
                            {formatFileSize(file.compressedSize)}
                          </Typography>
                          <span className="font-mono text-xs text-green-400">
                            -
                            {getCompressionRatio(
                              file.originalSize,
                              file.compressedSize
                            )}
                            %
                          </span>
                        </>
                      )}
                    </div>

                    {/* Status */}
                    <div className="mt-2 flex items-center gap-2">
                      {file.compressed && (
                        <div className="flex items-center gap-1">
                          <Settings className="text-accent h-3 w-3" />
                          <Typography variant="caption" className="text-accent">
                            COMPRESSED
                          </Typography>
                        </div>
                      )}

                      {file.uploading && (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
                          <Typography
                            variant="caption"
                            className="text-yellow-400"
                          >
                            UPLOADING...
                          </Typography>
                        </div>
                      )}

                      {file.uploaded && (
                        <div className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-400" />
                          <Typography
                            variant="caption"
                            className="text-green-400"
                          >
                            UPLOADED
                          </Typography>
                        </div>
                      )}

                      {file.error && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-400" />
                          <Typography
                            variant="caption"
                            className="text-red-400"
                          >
                            {file.error}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={file.uploading}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
