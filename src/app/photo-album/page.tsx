"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Loader2, Search, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCard from "@/components/shared/ImageCard";
import { ImageData } from "@/lib/types";
import { getAllImages } from "@/lib/api";

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadImages = async (page: number) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await getAllImages(page, 6);

      if (response.success) {
        if (page === 1) {
          setImages(response.data);
        } else {
          setImages((prev) => [...prev, ...response.data]);
        }

        // Check if we have more images to load
        setHasMore(response.data.length > 0);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadImages(1);
  }, []);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setCurrentPage((prev) => prev + 1);
          loadImages(currentPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isLoadingMore, currentPage]
  );

  // Filter images based on search term
  const filteredImages = images.filter((image) =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Global Album</h1>
        <p className="text-muted-foreground mb-8">
          Browse a collection of community images
        </p>
      </motion.div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search images..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              ref={index === filteredImages.length - 1 ? lastElementRef : null}
            >
              <ImageCard image={image} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg text-center">
          <Globe className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">No images found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? `No images matching "${searchTerm}"`
              : "The gallery is empty right now"}
          </p>
        </div>
      )}

      {isLoadingMore && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Loading more images...</span>
          </div>
        </div>
      )}

      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
}
