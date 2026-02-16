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

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export interface PropertySearchResult {
  id: number;
  title?: string | null;
  monthlyPrice: number;
  currency: 'ZAR' | 'USD';
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  sqmt: number | null;
  type: 'room' | 'apartment' | 'house' | 'condo';
  sharing: boolean;
  firstImageUrl: string | null;
  distance: number; // Distance in meters
}

export const searchPropertiesByLocation = async (
  latitude: number,
  longitude: number,
  radius: number = 200
): Promise<PropertySearchResult[]> => {
  // Fetch all properties with coordinates (not soft-deleted)
  const properties = await Property.findAll({
    where: {
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
      deletedAt: null,
    },
    limit: 1000, // Fetch more than needed, then filter by distance
  });

  // Calculate distances and filter by radius
  const propertiesWithDistance = properties
    .map((property) => {
      const propLat = parseFloat(property.latitude as any);
      const propLon = parseFloat(property.longitude as any);

      if (isNaN(propLat) || isNaN(propLon)) {
        return null;
      }

      const distance = calculateDistance(latitude, longitude, propLat, propLon);

      if (distance > radius) {
        return null;
      }

      return {
        property,
        distance,
      };
    })
    .filter((item): item is { property: Property; distance: number } => item !== null)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 50); // Limit to 50 results

  if (propertiesWithDistance.length === 0) {
    return [];
  }

  // Get property IDs for image lookup
  const propertyIds = propertiesWithDistance.map((item) => item.property.id);

  // Fetch first image for each property
  const firstImages = await PropertyImage.findAll({
    where: {
      propertyId: propertyIds,
    },
    order: [['order', 'ASC']],
    attributes: ['propertyId', 's3Key'],
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

  // Build results with presigned URLs
  const results = await Promise.all(
    propertiesWithDistance.map(async ({ property, distance }) => {
      const propertyJson = property.toJSON() as any;

      const firstImageS3Key = imageMap.get(property.id);
      let firstImageUrl: string | null = null;

      if (firstImageS3Key) {
        try {
          firstImageUrl = await generatePresignedGetUrl(firstImageS3Key);
        } catch (error) {
          console.error(`Error generating presigned URL for property ${property.id}:`, error);
        }
      }

      return {
        id: property.id,
        title: property.title,
        monthlyPrice: parseFloat(property.monthlyPrice as any),
        currency: property.currency,
        address: property.address,
        city: property.city,
        state: property.state,
        country: property.country,
        latitude: property.latitude ? parseFloat(property.latitude as any) : null,
        longitude: property.longitude ? parseFloat(property.longitude as any) : null,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqmt: property.sqmt ? parseInt(property.sqmt as any, 10) : null,
        type: property.type,
        sharing: property.sharing,
        firstImageUrl,
        distance, // Distance in meters
      };
    })
  );

  return results;
};

