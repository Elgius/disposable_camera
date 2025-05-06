import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { albumCode: string; fileName: string } }
) {
  const { albumCode, fileName } = params;
  const filePath = path.join(process.cwd(), "Images", albumCode, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();

    let contentType = "image/jpeg";
    switch (fileExtension) {
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
