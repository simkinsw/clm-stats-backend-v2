import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

export function saveToS3(body: string, bucket: string, key: string) {
    return s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(body)
    }))
}   

export async function readFromS3<T>(bucket: string, key: string) {
    try {
        const { Body } = await s3.send(new GetObjectCommand({
            Bucket: bucket,
            Key: key
        }))

        const text = await Body.transformToString();

        return JSON.parse(text) as T;
    } catch (err) {
        console.log(`Failed to get object ${bucket}/${key}.`);
        return undefined;
    }
}