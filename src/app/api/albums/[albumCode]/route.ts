import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  request: NextRequest,
  context: { params: { albumCode: string } }
) {
  const { albumCode } = context.params;

  // Build path to the album folder in public directory
  const albumPath = path.join(process.cwd(), "public", "Images", albumCode);

  try {
    // Read files in the album directory
    const files = await fs.readdir(albumPath);

    // Filter image files (optional: jpg, png, etc.)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Construct image metadata
    const images = imageFiles.map((fileName) => {
      const uniqueCode = fileName.split(".")[0];
      return {
        id: uniqueCode,
        name: fileName,
        url: `/Images/${albumCode}/${fileName}`, // Updated path for public directory
        albumCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Error reading album folder:", error.message);
    return new NextResponse("Album not found or unreadable", { status: 500 });
  }
}
