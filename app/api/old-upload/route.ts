import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse the incoming form data
    const formData = await req.formData();
    const uploadedFiles: string[] = [];

    let index = 1;
    while (true) {
      const file = formData.get(`file-${index}`) as File | null;

      if (!file) break;

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate a unique filename
      const fileName = `${Date.now()}-${index}-${file.name.replace(
        /\s+/g,
        "-"
      )}`;

      // Save file to disk
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      uploadedFiles.push(`/uploads/${fileName}`);
      index++;
    }

    // Return uploaded file details
    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        urls: uploadedFiles,
        count: uploadedFiles.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
