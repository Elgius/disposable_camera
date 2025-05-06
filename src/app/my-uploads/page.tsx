"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCard from "@/components/shared/ImageCard";
import UploadDialog from "@/components/dropzone/UploadDialog";
import { ImageData } from "@/lib/types";
import { getMyUploads, deleteImage } from "@/lib/api";

export default function MyUploadsPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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

  const handleUpload = async (files: File[], albumCode: string) => {
    setIsUploading(true);
    console.log("Uploading to album:", albumCode);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("albumCode", albumCode);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((result) => result.success);

      if (successfulUploads.length > 0) {
        setImages((prev) => [...successfulUploads.map((r) => r.data), ...prev]);
        toast.success(
          `Successfully uploaded ${successfulUploads.length} images`
        );
      }

      if (successfulUploads.length < files.length) {
        toast.error(
          `Failed to upload ${files.length - successfulUploads.length} images`
        );
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Something went wrong during upload");
    } finally {
      setIsUploading(false);
      setUploadDialogOpen(false);
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
          Upload your images to the directories here. Since we are in Beta, no
          images you upload will be stored in this page after you exit. All
          images will be accessible at the albums you upload the images to.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Upload Images</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add images to your collection
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Start Upload
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF
                  <br />
                  Max file size: 35MB
                </p>
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

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
