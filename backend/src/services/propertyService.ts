import Property from '../models/Property';
import PropertyImage from '../models/PropertyImage';
import { Op } from 'sequelize';
import { generatePresignedGetUrl } from './s3Service';

export interface PropertyCreatePayload {
  title?: string;
  dailyPrice?: number;
  weeklyPrice?: number;
  monthlyPrice: number;
  currency: 'ZAR' | 'USD';
  address: string;
  streetNumber?: string;
  blockNumber?: string;
  unitNumber?: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  sqmt?: number | null;
  type: 'room' | 'apartment' | 'house' | 'condo';
  parking?: number;
  description?: string;
  petFriendly: boolean;
  sharing: boolean;
  status?: 'available' | 'unavailable' | 'flagged';
}

export const createProperty = async (
  payload: PropertyCreatePayload,
  userId: number
): Promise<Property> => {
  const property = await Property.create({
    ...payload,
    userId,
  });
  return property;
};

export const getPropertyById = async (
  id: number,
  userId?: number
): Promise<Property | null> => {
  const where: any = { id };
  
  // If userId is provided, verify ownership
  if (userId !== undefined) {
    where.userId = userId;
  }

  const property = await Property.findOne({ where });
  return property;
};

export const updatePropertyById = async (
  id: number,
  payload: Partial<PropertyCreatePayload>,
  userId: number
): Promise<Property> => {
  const property = await getPropertyById(id, userId);
  
  if (!property) {
    throw new Error('Property not found or you do not have permission to update it');
  }

  await property.update(payload);
  return property.reload();
};

export const deletePropertyById = async (
  id: number,
  userId: number
): Promise<boolean> => {
  const property = await getPropertyById(id, userId);
  
  if (!property) {
    throw new Error('Property not found or you do not have permission to delete it');
  }

  // Cascade delete will handle propertyImages automatically
  await property.destroy();
  return true;
};

export const getUserProperties = async (
  userId: number
): Promise<Property[]> => {
  const properties = await Property.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  // If no properties, return empty array
  if (properties.length === 0) {
    return [];
  }

  // Get property IDs
  const propertyIds = properties.map(p => p.id);

  // Fetch first image for each property in one query
  const firstImages = await PropertyImage.findAll({
    where: {
      propertyId: propertyIds,
    },
    order: [['order', 'ASC']],
    attributes: ['propertyId', 's3Key'],
    // Group by propertyId to get only the first image per property
    // Using raw query approach since Sequelize doesn't support DISTINCT ON easily
  });

  // Create a map of propertyId -> first image s3Key
  const imageMap = new Map<number, string>();
  const seenProperties = new Set<number>();
  
  firstImages.forEach((image) => {
    if (!seenProperties.has(image.propertyId)) {
      imageMap.set(image.propertyId, image.s3Key);
      seenProperties.add(image.propertyId);
    }
  });

  // Add presigned URL for the first image if it exists
  const propertiesWithImages = await Promise.all(
    properties.map(async (property) => {
      const propertyJson = property.toJSON() as any;
      
      const firstImageS3Key = imageMap.get(property.id);
      if (firstImageS3Key) {
        try {
          const presignedUrl = await generatePresignedGetUrl(firstImageS3Key);
          propertyJson.firstImageUrl = presignedUrl;
        } catch (error) {
          console.error(`Error generating presigned URL for property ${property.id}:`, error);
          propertyJson.firstImageUrl = null;
        }
      } else {
        propertyJson.firstImageUrl = null;
      }
      
      return propertyJson;
    })
  );

  return propertiesWithImages as any;
};

