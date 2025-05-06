import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: { albumCode: string } }
) {
  const { albumCode } = context.params;
  const albumPath = path.join(process.cwd(), "public", "Images", albumCode);

  try {
    if (!fs.existsSync(albumPath)) {
      return new NextResponse("Album not found", { status: 404 });
    }

    return new NextResponse("Album exists", { status: 200 });
  } catch (error) {
    console.error("Error validating album:", error);
    return new NextResponse("Error validating album", { status: 500 });
  }
}
