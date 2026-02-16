import { api, ApiError } from './apiHelper';

export interface ImageUploadData {
  file: File;
  location?: {
    latitude: number;
    longitude: number;
  };
  order: number;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  s3Url: string;
  order: number;
}

export interface ImageMetadata {
  s3Key: string;
  s3Url: string;
  order: number;
  latitude?: number;
  longitude?: number;
}

/**
 * Upload a single image file to S3 using a presigned URL
 */
export const uploadImageToS3 = async (
  file: File,
  presignedUrl: string
): Promise<void> => {
  try {
    // Note: Content-Type must match what was used to sign the presigned URL
    // The presigned URL is signed with Content-Type: image/jpeg
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: file,
      // Don't include credentials for S3 uploads (presigned URLs handle auth)
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to upload image to S3: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to upload image to S3');
  }
};

/**
 * Request presigned URLs from backend for uploading images
 */
export const requestPresignedUrls = async (
  propertyId: number,
  count: number
): Promise<PresignedUrlResponse[]> => {
  try {
    const response = await api.post<{
      data: PresignedUrlResponse[];
      msg: string;
      error: boolean;
    }>(
      `/v1/properties/${propertyId}/images/upload-urls`,
      { count }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get presigned URLs');
    }

    // Backend returns: { data: [...], msg: "...", error: false }
    // API helper wraps it: { data: { data: [...], msg: "...", error: false }, ... }
    // So we need response.data.data to get the actual array
    const backendResponse = response.data;
    const presignedUrls = backendResponse.data || backendResponse;
    
    if (!Array.isArray(presignedUrls)) {
      throw new Error('Invalid response format: expected array of presigned URLs');
    }

    return presignedUrls;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Failed to request presigned URLs');
  }
};

/**
 * Confirm uploaded images with backend (save to database)
 */
export const confirmImages = async (
  propertyId: number,
  images: ImageMetadata[]
): Promise<void> => {
  try {
    const response = await api.post(
      `/v1/properties/${propertyId}/images/confirm`,
      { images }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to confirm images');
    }
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(apiError.message || 'Failed to confirm images');
  }
};

/**
 * Upload multiple images to S3 and confirm with backend
 * @param propertyId - Property ID
 * @param images - Array of image files with locations and order
 * @param onProgress - Optional progress callback (current, total)
 * @returns Array of image metadata for successfully uploaded images
 */
export const uploadImagesToS3 = async (
  propertyId: number,
  images: ImageUploadData[],
  onProgress?: (current: number, total: number) => void
): Promise<ImageMetadata[]> => {
  if (images.length === 0) {
    console.log('No images to upload');
    return [];
  }

  console.log(`Requesting ${images.length} presigned URLs for property ${propertyId}`);
  // Request presigned URLs
  const presignedUrls = await requestPresignedUrls(propertyId, images.length);
  console.log(`Received ${presignedUrls.length} presigned URLs:`, presignedUrls);
  
  if (presignedUrls.length !== images.length) {
    console.warn(`⚠️ Mismatch: requested ${images.length} URLs but got ${presignedUrls.length}`);
  }

  // Upload each image to S3
  const uploadResults: ImageMetadata[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const imageData = images[i];
    const presignedUrlData = presignedUrls[i];

    if (!presignedUrlData) {
      console.error(`No presigned URL for image ${i + 1}`);
      continue;
    }

    try {
      console.log(`Uploading image ${i + 1}/${images.length} to S3:`, {
        fileName: imageData.file.name,
        fileSize: imageData.file.size,
        presignedUrl: presignedUrlData.url.substring(0, 100) + '...',
      });
      
      // Upload to S3
      await uploadImageToS3(imageData.file, presignedUrlData.url);
      
      console.log(`✅ Successfully uploaded image ${i + 1}/${images.length}`);

      // Collect metadata for confirmation
      uploadResults.push({
        s3Key: presignedUrlData.key,
        s3Url: presignedUrlData.s3Url,
        order: imageData.order,
        latitude: imageData.location?.latitude,
        longitude: imageData.location?.longitude,
      });

      // Report progress
      if (onProgress) {
        onProgress(i + 1, images.length);
      }
    } catch (error) {
      console.error(`❌ Failed to upload image ${i + 1}:`, error);
      // Continue with other images even if one fails
      // The error will be thrown after all attempts
    }
  }

  // If no images were successfully uploaded, throw error
  if (uploadResults.length === 0) {
    console.error('No images were successfully uploaded');
    throw new Error('Failed to upload any images');
  }

  console.log(`Successfully uploaded ${uploadResults.length}/${images.length} images. Confirming with backend...`);
  
  // Confirm successfully uploaded images with backend
  await confirmImages(propertyId, uploadResults);
  
  console.log('✅ Images confirmed in database');

  return uploadResults;
};

