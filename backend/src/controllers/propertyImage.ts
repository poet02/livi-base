import { NextFunction, Response } from 'express';
import { customRequest } from '../types/customDefinition';
import { ApiError } from '../util/ApiError';
import { generatePresignedUrls } from '../services/s3Service';
import {
  createPropertyImages,
  getPropertyImages,
} from '../services/propertyImageService';
import { getPropertyById } from '../services/propertyService';

export const getPresignedUrlsController = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const propertyId = parseInt(req.params.id, 10);
    if (isNaN(propertyId)) {
      throw new ApiError(400, 'Invalid property ID');
    }

    const { count } = req.body;

    // Verify property exists and user owns it
    const property = await getPropertyById(propertyId, parseInt(userId, 10));
    if (!property) {
      throw new ApiError(404, 'Property not found or you do not have permission');
    }

    // Generate presigned URLs
    const presignedUrls = await generatePresignedUrls(count, propertyId);

    return res.status(200).json({
      data: presignedUrls,
      msg: 'Presigned URLs generated successfully',
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const confirmImagesController = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const propertyId = parseInt(req.params.id, 10);
    if (isNaN(propertyId)) {
      throw new ApiError(400, 'Invalid property ID');
    }

    const { images } = req.body;

    // Verify property exists and user owns it
    const property = await getPropertyById(propertyId, parseInt(userId, 10));
    if (!property) {
      throw new ApiError(404, 'Property not found or you do not have permission');
    }

    // Create image records
    const imageRecords = await createPropertyImages(propertyId, images);

    return res.status(201).json({
      data: imageRecords,
      msg: 'Images confirmed successfully',
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const getPropertyImagesController = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const propertyId = parseInt(req.params.id, 10);
    if (isNaN(propertyId)) {
      throw new ApiError(400, 'Invalid property ID');
    }

    // Verify property exists and user owns it
    const property = await getPropertyById(propertyId, parseInt(userId, 10));
    if (!property) {
      throw new ApiError(404, 'Property not found or you do not have permission');
    }

    const images = await getPropertyImages(propertyId);

    return res.status(200).json({
      data: images,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

