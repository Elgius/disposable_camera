import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const imagesDir = path.join(process.cwd(), "public", "Images");

    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json([]);
    }

    const albums = fs
      .readdirSync(imagesDir)
      .filter((item) => {
        const itemPath = path.join(imagesDir, item);
        return fs.statSync(itemPath).isDirectory();
      })
      .map((albumName) => {
        const albumPath = path.join(imagesDir, albumName);
        const imageCount = fs
          .readdirSync(albumPath)
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).length;

        return {
          code: albumName,
          name: albumName,
          imageCount,
          lastModified: fs.statSync(albumPath).mtime.toISOString(),
        };
      });

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return new NextResponse("Error fetching albums", { status: 500 });
  }
}
