import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../config/config';

// Initialize S3 client
const s3Client = new S3Client({
  region: s3Config.region,
  credentials: s3Config.accessKeyId && s3Config.secretAccessKey ? {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  } : undefined,
});

const PRESIGNED_URL_EXPIRATION = 15 * 60; // 15 minutes in seconds
const PRESIGNED_GET_URL_EXPIRATION = 3600; // 1 hour in seconds

/**
 * Generate a presigned URL for uploading an image to S3
 * @param key - S3 object key (path)
 * @param contentType - MIME type of the file (e.g., 'image/jpeg')
 * @returns Presigned URL string
 */
export const generatePresignedUploadUrl = async (
  key: string,
  contentType: string = 'image/jpeg'
): Promise<string> => {
  if (!s3Config.bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGNED_URL_EXPIRATION,
  });

  return url;
};

/**
 * Generate multiple presigned URLs for uploading images
 * @param count - Number of URLs to generate
 * @param propertyId - Property ID for organizing S3 keys
 * @returns Array of objects with url, key, and order
 */
export const generatePresignedUrls = async (
  count: number,
  propertyId: number
): Promise<Array<{ url: string; key: string; order: number }>> => {
  if (!s3Config.bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  const timestamp = Date.now();
  const baseUrl = `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com`;

  const promises = Array.from({ length: count }, async (_, index) => {
    const order = index + 1;
    const key = `properties/${propertyId}/images/${timestamp}-${order}.jpg`;
    const url = await generatePresignedUploadUrl(key, 'image/jpeg');
    const s3Url = `${baseUrl}/${key}`;

    return {
      url,
      key,
      s3Url,
      order,
    };
  });

  const results = await Promise.all(promises);
  return results;
};

/**
 * Generate a presigned URL for retrieving an image from S3
 * @param key - S3 object key (path)
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Presigned URL string
 */
export const generatePresignedGetUrl = async (
  key: string,
  expiresIn: number = PRESIGNED_GET_URL_EXPIRATION
): Promise<string> => {
  if (!s3Config.bucketName) {
    throw new Error('AWS S3 bucket name is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn,
  });

  return url;
};

