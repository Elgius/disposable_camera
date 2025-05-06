"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FolderIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Album {
  code: string;
  name: string;
  imageCount: number;
  lastModified: string;
}

export default function AlbumsPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/albums");
      if (!response.ok) throw new Error("Failed to fetch albums");
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlbumClick = (albumCode: string) => {
    router.push(`/photo-album/${albumCode}`);
  };

  return (
    <div className="container py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Photo Albums</h1>
        <p className="text-muted-foreground mb-8">
          Browse through your photo collections
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Card
              key={album.code}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleAlbumClick(album.code)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FolderIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{album.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {album.imageCount}{" "}
                      {album.imageCount === 1 ? "image" : "images"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last updated:{" "}
                      {format(new Date(album.lastModified), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-center">
          <p className="text-muted-foreground">No albums found</p>
        </div>
      )}
    </div>
  );
}
