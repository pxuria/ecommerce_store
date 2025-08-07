import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function GET() {
  try {
    const command = new ListBucketsCommand({});
    const data = await s3.send(command);
    return Response.json({ buckets: data.Buckets });
  } catch (error) {
    console.log(error);
  }
}
