"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCard from "@/components/shared/ImageCard";
import UploadDropzone from "@/components/dropzone/UploadDropzone";
import { ImageData } from "@/lib/types";
import { getMyUploads, uploadImage, deleteImage } from "@/lib/api";

export default function MyUploadsPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await getMyUploads();
      if (response.success) {
        setImages(response.data);
      } else {
        toast.error("Failed to load images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Something went wrong while loading your images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setFilePreview(file);
  };

  const handleUpload = async () => {
    if (!filePreview) return;

    setIsUploading(true);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const increment = Math.floor(Math.random() * 10) + 5;
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 300);

    try {
      const response = await uploadImage(filePreview);

      if (response.success) {
        setUploadProgress(100);
        setTimeout(() => {
          setImages((prev) => [response.data, ...prev]);
          toast.success("Image uploaded successfully");
          setFilePreview(null);
          setUploadProgress(0);
          setIsUploading(false);
        }, 500);
      } else {
        toast.error("Failed to upload image");
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Something went wrong during upload");
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteImage(id);
      if (response.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success("Image deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Something went wrong while deleting the image");
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">My Uploads</h1>
        <p className="text-muted-foreground mb-8">
          Upload and manage your personal image collection
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <UploadDropzone
                onFileSelect={handleFileSelect}
                filePreview={filePreview}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                onClearPreview={() => setFilePreview(null)}
              />

              <div className="mt-4">
                <Button
                  className="w-full"
                  disabled={!filePreview || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">My Images</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No images yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by uploading your first image
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
