"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onClearPreview: () => void;
  filePreview: File | null;
  isUploading?: boolean;
  uploadProgress: number;
}

export default function UploadDropzone({
  onFileSelect,
  onClearPreview,
  filePreview,
  isUploading = false,
  uploadProgress,
}: UploadDropzoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        onFileSelect(file);
      });
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    disabled: isUploading,
  });

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onClearPreview();
  };

  return (
    <div className="w-full">
      {!filePreview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select files"}
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border bg-background">
          {previewUrl ? (
            <div className="aspect-[4/3] relative">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              {!isUploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={clearPreview}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ) : (
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          <div className="p-3">
            <p
              className="text-sm font-medium truncate"
              title={filePreview.name}
            >
              {filePreview.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(filePreview.size / 1024).toFixed(2)} KB
            </p>

            {isUploading && (
              <div className="mt-3">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
