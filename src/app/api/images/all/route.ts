import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const imagesDir = path.join(process.cwd(), "public", "Images");

    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json([]);
    }

    const allImages: any[] = [];

    // Get all album directories
    const albums = fs.readdirSync(imagesDir).filter((item) => {
      const itemPath = path.join(imagesDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    // For each album, get all images
    for (const albumCode of albums) {
      const albumPath = path.join(imagesDir, albumCode);
      const files = fs
        .readdirSync(albumPath)
        .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

      // Add each image to the allImages array
      files.forEach((fileName) => {
        const uniqueCode = fileName.split(".")[0];
        allImages.push({
          id: uniqueCode,
          name: fileName,
          url: `/Images/${albumCode}/${fileName}`,
          albumCode,
          createdAt: fs
            .statSync(path.join(albumPath, fileName))
            .mtime.toISOString(),
          updatedAt: fs
            .statSync(path.join(albumPath, fileName))
            .mtime.toISOString(),
        });
      });
    }

    // Sort images by creation date (newest first)
    allImages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allImages);
  } catch (error) {
    console.error("Error fetching all images:", error);
    return new NextResponse("Error fetching images", { status: 500 });
  }
}
