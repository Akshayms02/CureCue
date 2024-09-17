import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as crypto from "crypto";

import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME as string;
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

  async getFile(fileName: string, folder: string): Promise<string> {
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

  async uploadFile(folderPath: string, file: any) {
    const uniqueName =
      crypto.randomBytes(16).toString("hex") + "-" + file.originalname;
    const params = {
      Bucket: this.bucketName,
      Key: `${folderPath}${uniqueName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3client.send(command);
      console.log(`File uploaded successfully at `);
      return uniqueName;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async deleteFile(key: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      const data = await this.s3client.send(command);
      console.log(`File deleted successfully from ${key}`);
      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}
