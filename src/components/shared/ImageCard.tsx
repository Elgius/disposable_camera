"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageData } from "@/lib/types";
import { format } from "date-fns";

interface ImageCardProps {
  image: ImageData;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
}

export default function ImageCard({
  image,
  onDelete,
  isPreview = false,
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const formattedDate = image.createdAt
    ? format(new Date(image.createdAt), "MMM d, yyyy")
    : "";

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <motion.div
        className={cn(
          "group relative overflow-hidden rounded-lg bg-background shadow-md transition-all duration-300 h-full",
          isPreview ? "opacity-80" : ""
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          <Image
            src={image.url}
            alt={image.name}
            className={cn(
              "object-cover transition-all duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              isHovered ? "scale-105" : "scale-100"
            )}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={handleImageLoad}
            onClick={() => setShowLightbox(true)}
          />

          {/* Hover overlay with actions */}
          <div
            className={cn(
              "absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            {/* 
              This code conditionally renders the album code information when hovering over an image.
              - It checks if image.albumCode exists (using the && operator as a conditional)
              - If it exists, it displays a paragraph element showing the album code
              - The paragraph has white text, small font size, medium font weight, and bottom margin
              - This appears in the overlay that shows when a user hovers over the image
            */}
            {image.albumCode && (
              <p className="text-white text-sm font-medium mb-4">
                Album: {image.albumCode}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowLightbox(true)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>

              {onDelete && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium truncate" title={image.name}>
            {image.name}
          </h3>
          {formattedDate && (
            <p className="text-xs text-muted-foreground mt-1">
              {formattedDate}
            </p>
          )}
        </div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(image.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={image.url}
              alt={image.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              width={1200}
              height={800}
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              className="absolute top-2 right-2"
              variant="secondary"
              size="sm"
              onClick={() => setShowLightbox(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
