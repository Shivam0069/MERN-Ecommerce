"use client";
import React, { useState, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { v4 } from "uuid";

export default function Upload() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [downloadURL, setDownloadURL] = useState<string>("");

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
    }
  };
  const uploadHandler = async () => {
    if (!imgFile) {
      alert("Please select an image to upload.");
      return;
    }

    const storageRef = ref(storage, `images/${v4()}`);

    try {
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, imgFile);

      // Get the download URL
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadHandler}>Upload</button>
      {downloadURL && (
        <div>
          <p>File available at:</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
        </div>
      )}
    </div>
  );
}
