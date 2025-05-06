import { ImageData, ApiResponse } from "./types";

// Mock API calls since we don't have a real backend
// In a real application, you would make actual fetch/axios calls here

// Mock data store
let myUploads: ImageData[] = [
  {
    id: "1",
    name: "mountain-lake.jpg",
    url: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
    albumCode: "nature",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "2",
    name: "beach-sunset.jpg",
    url: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg",
    albumCode: "nature",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

let galleryImages: ImageData[] = [
  ...myUploads,
  {
    id: "3",
    name: "beautiful-landscape.jpg",
    url: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
    albumCode: "landscapes",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "4",
    name: "mountain-peak.jpg",
    url: "https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg",
    albumCode: "mountains",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "5",
    name: "aurora-borealis.jpg",
    url: "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg",
    albumCode: "nature",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "6",
    name: "night-city.jpg",
    url: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg",
    albumCode: "cities",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
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

export async function uploadImage(
  file: File,
  albumCode: string
): Promise<ApiResponse<ImageData>> {
  await delay(1200);

  const newImage: ImageData = {
    id: Math.random().toString(36).substring(2, 9),
    name: file.name,
    url: URL.createObjectURL(file),
    albumCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
