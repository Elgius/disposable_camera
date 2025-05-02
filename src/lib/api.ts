import { ImageData, ApiResponse } from "./types";

// Mock API calls since we don't have a real backend
// In a real application, you would make actual fetch/axios calls here

// Mock data store
let myUploads: ImageData[] = [
  {
    id: "1",
    url: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    filename: "mountain-lake.jpg",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    url: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg",
    filename: "beach-sunset.jpg",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

let galleryImages: ImageData[] = [
  ...myUploads,
  {
    id: "3",
    url: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    filename: "beautiful-landscape.jpg",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    userId: "user2",
  },
  {
    id: "4",
    url: "https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg",
    filename: "mountain-peak.jpg",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    userId: "user3",
  },
  {
    id: "5",
    url: "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg",
    filename: "aurora-borealis.jpg",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    userId: "user4",
  },
  {
    id: "6",
    url: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
    filename: "night-city.jpg",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    userId: "user5",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export async function getMyUploads(): Promise<ApiResponse<ImageData[]>> {
  await delay(800);
  return {
    success: true,
    data: [...myUploads],
  };
}

export async function getAllImages(
  page: number = 1,
  size: number = 10
): Promise<ApiResponse<ImageData[]>> {
  await delay(800);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedData = galleryImages.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedData,
  };
}

export async function uploadImage(file: File): Promise<ApiResponse<ImageData>> {
  await delay(1200);

  // In a real app, you would upload to a server
  // Here we create a local URL and add to our mock data
  const newImage: ImageData = {
    id: Math.random().toString(36).substring(2, 9),
    url: URL.createObjectURL(file),
    filename: file.name,
    createdAt: new Date().toISOString(),
  };

  myUploads = [newImage, ...myUploads];
  galleryImages = [newImage, ...galleryImages];

  return {
    success: true,
    data: newImage,
  };
}

export async function deleteImage(id: string): Promise<ApiResponse<boolean>> {
  await delay(600);

  myUploads = myUploads.filter((img) => img.id !== id);
  galleryImages = galleryImages.filter((img) => img.id !== id);

  return {
    success: true,
    data: true,
  };
}
