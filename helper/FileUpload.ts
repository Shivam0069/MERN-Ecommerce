import { promises as fs } from "fs";
import path, { join, extname } from "path"; // Import extname for getting file extension

export async function handleFileUpload(
  file: File,
  folder: string
): Promise<string> {
  // Convert the file to a buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const publicPath = join(process.cwd(), "public");

  // Check if the public directory exists, create if not
  try {
    await fs.access(publicPath);
  } catch (error) {
    await fs.mkdir(publicPath, { recursive: true });
  }

  // Generate a unique file name using the original file's extension
  const originalFileName = file.name; // Get the original file name
  const fileExtension = extname(originalFileName); // Get the file extension
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const newFileName = `${uniqueSuffix}${fileExtension}`; // Use original file extension
  const newFilePath = join(publicPath, folder, newFileName);

  // Write the file to the uploads directory
  await fs.writeFile(newFilePath, buffer);

  // Return the new file name
  return newFileName;
}
