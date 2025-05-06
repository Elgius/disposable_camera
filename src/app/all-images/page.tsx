"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ImageIcon } from "lucide-react";
import ImageCard from "@/components/shared/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageData } from "@/lib/types";

export default function AllImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllImages();
  }, []);

  const fetchAllImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/images/all");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">All Images</h1>
        <p className="text-muted-foreground mb-8">
          Browse through all images across all albums
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} isPreview={true} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No images found</p>
        </div>
      )}
    </div>
  );
}
