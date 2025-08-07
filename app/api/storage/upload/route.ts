import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { isAdmin } from "@/lib/auth";
import { s3 } from "@/lib/s3";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json("Access denied: Unauthorized", { status: 403 });
  }

  try {
    const formData = await req.formData();
    const uploadedUrls: string[] = [];

    let index = 1;
    while (true) {
      const file = formData.get(`file-${index}`) as File | null;
      console.log("FILE", file);
      if (!file) break;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileKey = `${Date.now()}-${uuidv4()}-${file.name.replace(
        /\s+/g,
        "-"
      )}`;

      const command = new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      });
      await s3.send(command);
      console.log("COMMANDS :: ", command);

      const url = `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${fileKey}`;
      uploadedUrls.push(url);
      index++;
    }
    console.log("UPLOADED URLS ::", uploadedUrls);

    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        urls: uploadedUrls,
        count: uploadedUrls.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
