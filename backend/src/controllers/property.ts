import { NextFunction, Response } from 'express';
import { customRequest } from '../types/customDefinition';
import { ApiError } from '../util/ApiError';
import {
  createProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  getUserProperties,
  searchPropertiesByLocation,
} from '../services/propertyService';

export const createPropertyController = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const property = await createProperty(req.body, parseInt(userId, 10));

    return res.status(201).json({
      data: property,
      msg: 'Property created successfully',
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const getPropertyController = async (
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

    const property = await getPropertyById(propertyId, parseInt(userId, 10));

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    return res.status(200).json({
      data: property,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePropertyController = async (
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

    const property = await updatePropertyById(
      propertyId,
      req.body,
      parseInt(userId, 10)
    );

    return res.status(200).json({
      data: property,
      msg: 'Property updated successfully',
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePropertyController = async (
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

    await deletePropertyById(propertyId, parseInt(userId, 10));

    return res.status(200).json({
      msg: 'Property deleted successfully',
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserPropertiesController = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'User not authenticated');
    }

    const properties = await getUserProperties(parseInt(userId, 10));

    return res.status(200).json({
      data: properties,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const searchPropertiesController = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);
    const radius = req.query.radius
      ? parseFloat(req.query.radius as string)
      : 200;

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new ApiError(400, 'Invalid latitude or longitude');
    }

    if (latitude < -90 || latitude > 90) {
      throw new ApiError(400, 'Latitude must be between -90 and 90');
    }

    if (longitude < -180 || longitude > 180) {
      throw new ApiError(400, 'Longitude must be between -180 and 180');
    }

    const properties = await searchPropertiesByLocation(latitude, longitude, radius);

    return res.status(200).json({
      data: properties,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

