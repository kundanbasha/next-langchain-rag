"use server";

import fs from "fs/promises";
import path from "path";

export async function readFileFromServer(pathname) {
  try {
    // This code ONLY runs on the server
    const filePath = path.join(process.cwd(), "public", pathname);
    const fileContent = await fs.readFile(filePath, "utf8");
    return { success: true, data: fileContent };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to read file." };
  }
}
