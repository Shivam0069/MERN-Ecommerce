import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (
  file: File,
  folder: string
): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const storageRef = ref(storage, `${folder}/${uuidv4()}`);

  try {
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};
