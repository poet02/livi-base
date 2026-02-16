import Joi from 'joi';

export const createPropertySchema = Joi.object({
  title: Joi.string().allow('', null).optional(),
  dailyPrice: Joi.number().positive().optional().allow(null),
  weeklyPrice: Joi.number().positive().optional().allow(null),
  monthlyPrice: Joi.number().positive().required(),
  currency: Joi.string().valid('ZAR', 'USD').required(),
  address: Joi.string().required(),
  streetNumber: Joi.string().allow('', null).optional(),
  blockNumber: Joi.string().allow('', null).optional(),
  unitNumber: Joi.string().allow('', null).optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  zipCode: Joi.string().allow('', null).optional(),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
  bedrooms: Joi.number().integer().min(0).required(),
  bathrooms: Joi.number().min(0).optional().allow(null), // Allow decimals (0, 0.5, 1, 1.5, etc.) - optional
  sqmt: Joi.number().integer().positive().optional().allow(null),
  type: Joi.string().valid('room', 'apartment', 'house', 'condo').required(),
  parking: Joi.number().integer().min(0).optional().allow(null),
  description: Joi.string().allow('', null).optional(),
  petFriendly: Joi.boolean().default(false),
  sharing: Joi.boolean().default(false),
  status: Joi.string().valid('available', 'unavailable', 'flagged').default('available'),
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().allow('', null).optional(),
  dailyPrice: Joi.number().positive().optional().allow(null),
  weeklyPrice: Joi.number().positive().optional().allow(null),
  monthlyPrice: Joi.number().positive().optional(),
  currency: Joi.string().valid('ZAR', 'USD').optional(),
  address: Joi.string().optional(),
  streetNumber: Joi.string().allow('', null).optional(),
  blockNumber: Joi.string().allow('', null).optional(),
  unitNumber: Joi.string().allow('', null).optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  zipCode: Joi.string().allow('', null).optional(),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().min(0).optional(), // Allow decimals (0, 0.5, 1, 1.5, etc.)
  sqmt: Joi.number().integer().positive().optional().allow(null),
  type: Joi.string().valid('room', 'apartment', 'house', 'condo').optional(),
  parking: Joi.number().integer().min(0).optional().allow(null),
  description: Joi.string().allow('', null).optional(),
  petFriendly: Joi.boolean().optional(),
  sharing: Joi.boolean().optional(),
  status: Joi.string().valid('available', 'unavailable', 'flagged').optional(),
});

export const confirmImagesSchema = Joi.object({
  images: Joi.array()
    .items(
      Joi.object({
        s3Key: Joi.string().required(),
        s3Url: Joi.string().uri().required(),
        order: Joi.number().integer().min(1).required(),
        latitude: Joi.number().min(-90).max(90).optional().allow(null),
        longitude: Joi.number().min(-180).max(180).optional().allow(null),
      })
    )
    .min(1)
    .required(),
});

export const getPresignedUrlsSchema = Joi.object({
  count: Joi.number().integer().min(1).max(20).required(),
});

export const searchPropertiesSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(50).max(50000).optional().default(200),
});

