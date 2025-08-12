"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MediaUploaderProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

export function MediaUploader({
  onUpload,
  maxFiles = 5,
  maxSize = 10,
  accept = "image/*",
  className = "",
}: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles
        .slice(0, maxFiles - files.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          uploading: false,
          uploaded: false,
        }));

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length, maxFiles]
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
      // Update files to show uploading state
      setFiles((prev) => prev.map((f) => ({ ...f, uploading: true })));

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.uploaded) continue;

        try {
          const formData = new FormData();
          formData.append("file", file.file);

          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          uploadedUrls.push(data.url);

          // Update specific file as uploaded
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, uploading: false, uploaded: true, url: data.url }
                : f
            )
          );
        } catch (error) {
          console.error(`Failed to upload file ${file.file.name}:`, error);

          // Update specific file with error
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

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-yellow-400 bg-yellow-400/10"
            : "border-white hover:border-yellow-400 hover:bg-yellow-400/5"
        } ${uploading || files.length >= maxFiles ? "cursor-not-allowed opacity-50" : ""} `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />

        {isDragActive ? (
          <p className="font-mono text-yellow-400 uppercase">
            DROP FILES HERE...
          </p>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-white uppercase">
              DRAG & DROP FILES OR CLICK TO SELECT
            </p>
            <p className="font-mono text-sm text-gray-400">
              MAX {maxFiles} FILES • MAX {maxSize}MB EACH
            </p>
            <p className="font-mono text-xs text-gray-500">
              ACCEPTED: {accept.toUpperCase()}
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-sm font-bold text-white uppercase">
              FILES ({files.length}/{maxFiles})
            </h4>
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
                    UPLOAD
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <div key={index} className="border-2 border-white bg-black p-3">
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {isImage(file.file) ? (
                      <Image
                        src={file.preview}
                        alt={file.file.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 border border-white object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center border border-white bg-gray-900">
                        <File className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm text-white">
                      {file.file.name}
                    </p>
                    <p className="font-mono text-xs text-gray-400">
                      {formatFileSize(file.file.size)}
                    </p>

                    {/* Status */}
                    <div className="mt-1">
                      {file.uploading && (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
                          <span className="font-mono text-xs text-yellow-400">
                            UPLOADING...
                          </span>
                        </div>
                      )}

                      {file.uploaded && (
                        <span className="font-mono text-xs text-green-400">
                          ✓ UPLOADED
                        </span>
                      )}

                      {file.error && (
                        <span className="font-mono text-xs text-red-400">
                          ✗ {file.error}
                        </span>
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
