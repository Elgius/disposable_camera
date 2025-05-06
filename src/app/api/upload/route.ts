import { NextRequest, NextResponse } from "next/server";
import { saveImageToAlbum } from "@/lib/fileUtils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const albumCode = formData.get("albumCode") as string;

    if (!file || !albumCode) {
      return new NextResponse("Missing file or album code", { status: 400 });
    }

    // Validate file size (35MB)
    if (file.size > 35 * 1024 * 1024) {
      return new NextResponse("File size must be less than 35MB", {
        status: 400,
      });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return new NextResponse("File must be an image", { status: 400 });
    }

    const uniqueCode = await saveImageToAlbum(file, albumCode);
    const fileName = `${uniqueCode}${file.name.substring(
      file.name.lastIndexOf(".")
    )}`;

    return NextResponse.json({
      success: true,
      data: {
        id: uniqueCode,
        name: file.name,
        url: `/api/images/${albumCode}/${fileName}`,
        albumCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Error uploading file", { status: 500 });
  }
}
