import Property from '../models/Property';
import { Op } from 'sequelize';

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
  return properties;
};

