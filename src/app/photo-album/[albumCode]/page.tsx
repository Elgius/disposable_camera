"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import ImageCard from "@/components/shared/ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ImageData } from "@/lib/types";

export default function AlbumPage() {
  const router = useRouter();
  const params = useParams();
  const albumCode = params.albumCode as string;
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbumImages();
  }, [albumCode]);

  const fetchAlbumImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/albums/${albumCode}`);
      if (!response.ok) throw new Error("Failed to fetch album images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching album images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/photo-album")}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-2">Album: {albumCode}</h1>
          <p className="text-muted-foreground">
            {images.length} {images.length === 1 ? "image" : "images"} in this
            album
          </p>
        </motion.div>
      </div>

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
          <p className="text-muted-foreground">No images found in this album</p>
        </div>
      )}
    </div>
  );
}
