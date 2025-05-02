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
  isUploading: boolean;
  uploadProgress: number;
}

export default function UploadDropzone({
  onFileSelect,
  onClearPreview,
  filePreview,
  isUploading,
  uploadProgress,
}: UploadDropzoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.error("File must be an image");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        console.error("File size must be less than 5MB");
        return;
      }

      onFileSelect(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
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
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/40"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the image here" : "Drag & drop an image"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF or WEBP (max 5MB)
              </p>
            </div>
            <Button variant="secondary" size="sm" type="button">
              Browse files
            </Button>
          </div>
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
