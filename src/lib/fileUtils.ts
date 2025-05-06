import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const IMAGES_DIR = path.join(process.cwd(), "public", "Images");

export async function saveImageToAlbum(
  file: File,
  albumCode: string
): Promise<string> {
  // Create album directory if it doesn't exist
  const albumDir = path.join(IMAGES_DIR, albumCode);
  if (!fs.existsSync(albumDir)) {
    fs.mkdirSync(albumDir, { recursive: true });
  }

  // Generate unique code for the image
  const uniqueCode = uuidv4();
  const fileExtension = path.extname(file.name);
  const fileName = `${uniqueCode}${fileExtension}`;
  const filePath = path.join(albumDir, fileName);

  // Convert File to Buffer and save
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);

  return uniqueCode;
}

export function getAlbumImages(albumCode: string): string[] {
  const albumDir = path.join(IMAGES_DIR, albumCode);

  if (!fs.existsSync(albumDir)) {
    return [];
  }

  return fs
    .readdirSync(albumDir)
    .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map((file) => path.join(albumDir, file));
}

export function getImageUrl(albumCode: string, fileName: string): string {
  return `/Images/${albumCode}/${fileName}`;
}
