import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME as string ;
const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY as string;
const secretAccessKey = process.env.AWS_SECRET_KEY as string;

export class AwsConfig {
  bucketName: string;
  region: string;
  s3client: S3Client;

  constructor() {
    this.bucketName = bucketName!;
    this.region = region!;
    this.s3client = new S3Client({
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
      region: this.region,
    });
  }

  async getfile(fileName: string, folder: string): Promise<string> {
    try {
      const options = {
        Bucket: this.bucketName,
        Key: `${folder}/${fileName}`,
      };
      const getCommand = new GetObjectCommand(options);
      const url = await getSignedUrl(this.s3client, getCommand, {
        expiresIn: 60 * 60,
      });
      return url;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
    }
  }
}
