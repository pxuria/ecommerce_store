import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deleteFromS3 = async (fileUrl: string) => {
    try {
        const bucketName = process.env.LIARA_BUCKET_NAME!;
        const key = fileUrl.split(`${bucketName}/`)[1];
        if (!key) return;

        await s3.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        );

        console.log("Deleted from S3:", key);
    } catch (err) {
        console.error("Failed to delete from S3:", err);
    }
};